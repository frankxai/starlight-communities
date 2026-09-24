import { z } from "zod";

// Planning only: no network, storage, payment, calendar, or member-data imports.
const id = z.string().regex(/^[a-z0-9][a-z0-9_-]{0,79}$/);
const money = z.number().int().min(0).max(100_000_000); // minor units; bounded arithmetic
const count = z.number().int().min(0).max(1_000);
const evidence = id.nullable().default(null);
const ContentPlanSchema = z.strictObject({
  id,
  kind: z.enum(["facilitator_demo", "participant_media", "private_reflection"]),
  captureConsentRef: evidence,
  editConsentRef: evidence,
  publicationConsentRef: evidence,
  rightsReviewRef: evidence,
  withdrawn: z.boolean().default(false),
});

export const HostProgrammeSchema = z.strictObject({
  schemaVersion: z.literal("host-programme.v1"),
  programmeId: id,
  evidenceStatus: z.enum(["synthetic", "operator_supplied"]),
  venue: z.strictObject({
    id,
    countryCode: z.string().regex(/^[A-Z]{2}$/),
    use: z.enum(["day_space", "residential"]),
    attendeeCapacity: count,
    privateBedrooms: count,
    controlBasis: z.enum(["ownership", "lease", "operating_agreement", "unknown"]),
    controlEvidenceRef: evidence,
    permittedUseReviewRef: evidence,
    readinessReviewRef: evidence,
  }),
  attendance: z.strictObject({
    payingParticipants: count,
    complimentaryParticipants: count,
    staff: count,
    nights: count,
    // This conservative model requires one bedroom per overnight person.
    // Couples/shared rooms require a reviewed rooming plan outside v1.
  }),
  responsibilities: z.strictObject({
    propertyOwnerRef: evidence,
    programmeOperatorRef: evidence,
    producerRef: evidence,
    facilitatorRef: evidence,
  }),
  agreements: z.strictObject({
    propertyTermsReviewRef: evidence,
    programmeTermsReviewRef: evidence,
    cancellationReviewRef: evidence,
    insuranceReviewRef: evidence,
  }),
  economics: z.strictObject({
    currency: z.enum(["EUR", "GBP", "USD"]),
    basis: z.literal("net_of_tax"),
    perspective: z.literal("programme_operator"),
    feePerPayingParticipantMinor: money,
    propertyFeeMinor: money,
    fixedDeliveryCostMinor: money,
    costPerAttendeeMinor: money,
    operatorMinutes: z.number().int().min(0).max(600_000),
    operatorHourlyCostMinor: money,
    contingencyMinor: money,
    cashCollectedMinor: money,
    refundReserveMinor: money,
    paymentsDueBeforeNextCollectionMinor: money,
  }),
  content: z.array(ContentPlanSchema).max(100).default([]),
}).superRefine((value, ctx) => {
  const seen = new Set<string>();
  value.content.forEach((asset, index) => {
    if (seen.has(asset.id)) ctx.addIssue({code: "custom", path: ["content", index, "id"], message: "Duplicate content ID"});
    seen.add(asset.id);
  });
  if (value.economics.refundReserveMinor > value.economics.cashCollectedMinor) {
    ctx.addIssue({code: "custom", path: ["economics", "refundReserveMinor"], message: "Refund reserve exceeds collected cash"});
  }
  if (value.venue.use === "day_space" && value.attendance.nights !== 0) {
    ctx.addIssue({code: "custom", path: ["attendance", "nights"], message: "Day spaces cannot provide overnight accommodation"});
  }
});

export type HostProgrammeInput = z.input<typeof HostProgrammeSchema>;

/** All evidence references are assertions supplied by the operator, never verified here. */
export function assessHostProgramme(raw: unknown) {
  const p = HostProgrammeSchema.parse(raw);
  const e = p.economics;
  const a = p.attendance;
  const attendeeCount = a.payingParticipants + a.complimentaryParticipants + a.staff;
  const overnight = a.nights > 0;
  const physicalCapacity = overnight
    ? Math.min(p.venue.attendeeCapacity, p.venue.privateBedrooms)
    : p.venue.attendeeCapacity;
  const payingCapacity = Math.max(0, physicalCapacity - a.staff - a.complimentaryParticipants);
  const operatorTimeCostMinor = Math.ceil(e.operatorMinutes * e.operatorHourlyCostMinor / 60);
  const fixedCostMinor = e.propertyFeeMinor + e.fixedDeliveryCostMinor + operatorTimeCostMinor + e.contingencyMinor
    + (a.staff + a.complimentaryParticipants) * e.costPerAttendeeMinor;
  const contributionPerPayingParticipantMinor = e.feePerPayingParticipantMinor - e.costPerAttendeeMinor;
  const breakEvenPayingParticipants = contributionPerPayingParticipantMinor > 0
    ? Math.ceil(fixedCostMinor / contributionPerPayingParticipantMinor)
    : (contributionPerPayingParticipantMinor === 0 && fixedCostMinor === 0 ? 0 : null);
  const revenueMinor = a.payingParticipants * e.feePerPayingParticipantMinor;
  const totalCostMinor = fixedCostMinor + a.payingParticipants * e.costPerAttendeeMinor;
  const contributionMinor = revenueMinor - totalCostMinor;
  const cashAvailableMinor = e.cashCollectedMinor - e.refundReserveMinor;
  const cashShortfallMinor = Math.max(0, e.paymentsDueBeforeNextCollectionMinor - cashAvailableMinor);
  const issues: string[] = [];
  if (p.evidenceStatus === "synthetic") issues.push("synthetic_evidence");
  if (a.payingParticipants === 0) issues.push("no_paying_participants");
  if (attendeeCount > physicalCapacity) issues.push("capacity_exceeded");
  if (p.venue.controlBasis === "unknown" || !p.venue.controlEvidenceRef) issues.push("commercial_control_unresolved");
  if (!p.venue.permittedUseReviewRef) issues.push("permitted_use_unreviewed");
  if (!p.venue.readinessReviewRef) issues.push("venue_readiness_unreviewed");
  for (const [role, ref] of Object.entries(p.responsibilities)) {
    if (!ref) issues.push(`missing_${role}`);
  }
  for (const [agreement, ref] of Object.entries(p.agreements)) {
    if (!ref) issues.push(`missing_${agreement}`);
  }
  if (contributionMinor < 0) issues.push("negative_programme_contribution");
  if (breakEvenPayingParticipants === null || breakEvenPayingParticipants > payingCapacity) issues.push("break_even_unreachable");
  if (cashShortfallMinor > 0) issues.push("cash_shortfall");
  const content = p.content.map(asset => ({
    id: asset.id,
    eligibleForHumanPublicationReview: asset.kind !== "private_reflection" && !asset.withdrawn
      && !!asset.captureConsentRef && !!asset.editConsentRef && !!asset.publicationConsentRef && !!asset.rightsReviewRef,
    publicationAuthorized: false as const,
  }));
  return {
    schemaVersion: "host-assessment.v1" as const,
    programmeId: p.programmeId,
    status: "draft" as const,
    bookable: false as const,
    evidenceVerified: false as const,
    externalActions: [] as never[],
    issues,
    capacity: {attendeeCount, physicalCapacity, payingCapacity, singleOccupancyAssumption: overnight},
    economics: {
      currency: e.currency, basis: e.basis, perspective: e.perspective,
      revenueMinor, totalCostMinor, operatorTimeCostMinor, contributionMinor,
      contributionMargin: revenueMinor > 0 ? contributionMinor / revenueMinor : null,
      breakEvenPayingParticipants,
      cashAvailableMinor, cashShortfallMinor,
    },
    content,
  };
}

export type HostProgrammeAssessment = ReturnType<typeof assessHostProgramme>;
