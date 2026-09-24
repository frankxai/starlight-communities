import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { assessHostProgramme } from "../src/host-programme.js";

const fixture = () => JSON.parse(readFileSync(new URL("../examples/host-programme.json", import.meta.url), "utf8"));

describe("host programme planning", () => {
  it("includes venue, staff costs, contingency and operator time exactly once", () => {
    const result = assessHostProgramme(fixture());
    expect(result.capacity).toMatchObject({attendeeCount: 12, payingCapacity: 12});
    expect(result.economics).toMatchObject({
      revenueMinor: 1_000_000, totalCostMinor: 580_000, contributionMinor: 420_000,
      operatorTimeCostMinor: 200_000, breakEvenPayingParticipants: 6,
      cashAvailableMinor: 150_000, cashShortfallMinor: 100_000,
    });
    expect(result.issues).toContain("cash_shortfall");
  });
  it("calculates labour from integer minutes and rounds only fractional minor units", () => {
    const p = fixture();
    p.economics.operatorHourlyCostMinor = 100;
    p.economics.operatorMinutes = 3;
    expect(assessHostProgramme(p).economics.operatorTimeCostMinor).toBe(5);
    p.economics.operatorMinutes = 1;
    expect(assessHostProgramme(p).economics.operatorTimeCostMinor).toBe(2);
    p.economics.operatorMinutes = 4.2;
    expect(() => assessHostProgramme(p)).toThrow();
  });
  it("counts staff and complimentary places against bedrooms for residential stays", () => {
    const p = fixture();
    Object.assign(p.venue, {use: "residential", attendeeCapacity: 16, privateBedrooms: 11});
    p.attendance.nights = 4;
    p.attendance.complimentaryParticipants = 1;
    const result = assessHostProgramme(p);
    expect(result.capacity).toMatchObject({attendeeCount: 13, physicalCapacity: 11, payingCapacity: 8});
    expect(result.issues).toContain("capacity_exceeded");
  });
  it("treats own property as a valid possible control basis without requiring a lease", () => {
    const p = fixture();
    p.venue.controlBasis = "ownership";
    p.venue.controlEvidenceRef = "title-review-ref";
    expect(assessHostProgramme(p).issues).not.toContain("commercial_control_unresolved");
    delete p.venue.controlEvidenceRef;
    expect(assessHostProgramme(p).issues).toContain("commercial_control_unresolved");
  });
  it("reports missing delivery roles and contract reviews", () => {
    const p = fixture();
    p.responsibilities = {};
    const issues = assessHostProgramme(p).issues;
    expect(issues).toContain("missing_producerRef");
    expect(issues).toContain("missing_propertyTermsReviewRef");
  });
  it("identifies impossible economics at maximum venue capacity", () => {
    const p = fixture();
    p.economics.fixedDeliveryCostMinor = 2_000_000;
    expect(assessHostProgramme(p).issues).toContain("break_even_unreachable");
    p.economics.feePerPayingParticipantMinor = p.economics.costPerAttendeeMinor;
    expect(assessHostProgramme(p).economics.breakEvenPayingParticipants).toBeNull();
  });
  it("supports zero-valued cost inputs without division errors or NaN", () => {
    const p = fixture();
    for (const key of Object.keys(p.economics)) if (typeof p.economics[key] === "number") p.economics[key] = 0;
    const result = assessHostProgramme(p);
    expect(result.economics.breakEvenPayingParticipants).toBe(0);
    expect(result.economics.contributionMargin).toBeNull();
    expect(result.bookable).toBe(false);
  });
  it.each([-1, 1.5, Number.MAX_SAFE_INTEGER, Infinity])("rejects invalid money %s", invalid => {
    const p = fixture(); p.economics.propertyFeeMinor = invalid;
    expect(() => assessHostProgramme(p)).toThrow();
  });
  it("rejects unknown fields including per-line currency and personal notes", () => {
    for (const mutate of [
      (p: any) => { p.economics.propertyFeeCurrency = "USD"; },
      (p: any) => { p.participantNotes = "private material"; },
      (p: any) => { p.venue.address = "not accepted"; },
    ]) {
      const p = fixture(); mutate(p); expect(() => assessHostProgramme(p)).toThrow();
    }
  });
  it("rejects overnight day-space plans and impossible refund reserves", () => {
    const p = fixture(); p.attendance.nights = 1;
    expect(() => assessHostProgramme(p)).toThrow();
    p.attendance.nights = 0; p.economics.refundReserveMinor = 300_000;
    expect(() => assessHostProgramme(p)).toThrow();
  });
  it("requires distinct permission references and excludes private reflection and withdrawn media", () => {
    const p = fixture();
    const permitted = {id: "demo", kind: "facilitator_demo", captureConsentRef: "capture-ref", editConsentRef: "edit-ref", publicationConsentRef: "publication-ref", rightsReviewRef: "rights-ref"};
    p.content = [permitted, {...permitted, id: "private", kind: "private_reflection"}, {...permitted, id: "withdrawn", withdrawn: true}, {...permitted, id: "missing", publicationConsentRef: null}];
    const result = assessHostProgramme(p);
    expect(result.content.map(c => c.eligibleForHumanPublicationReview)).toEqual([true, false, false, false]);
    expect(result.content.every(c => c.publicationAuthorized === false)).toBe(true);
  });
  it("rejects duplicate asset IDs", () => {
    const p = fixture(); p.content.push({...p.content[0]});
    expect(() => assessHostProgramme(p)).toThrow();
  });
  it("remains draft-only even when every supplied evidence reference is present", () => {
    const p = fixture();
    p.evidenceStatus = "operator_supplied";
    Object.assign(p.venue, {controlBasis: "ownership", controlEvidenceRef: "control", permittedUseReviewRef: "use", readinessReviewRef: "ready"});
    p.agreements = {propertyTermsReviewRef: "property", programmeTermsReviewRef: "programme", cancellationReviewRef: "cancel", insuranceReviewRef: "insurance"};
    p.economics.paymentsDueBeforeNextCollectionMinor = 0;
    const result = assessHostProgramme(p);
    expect(result.issues).toEqual([]);
    expect(result).toMatchObject({status: "draft", bookable: false, evidenceVerified: false, externalActions: []});
    expect(assessHostProgramme(p)).toEqual(result);
  });
  it("executes the CLI against the synthetic file and matches the pure function", () => {
    const output = execFileSync(process.execPath, ["--import", "tsx", "src/cli.ts", "assess-programme", "examples/host-programme.json"], {encoding: "utf8"});
    expect(JSON.parse(output)).toEqual(assessHostProgramme(fixture()));
  });
});
