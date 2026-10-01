# Host and programme review worksheet

This is a commercial brief for owner, operator, producer and local professional
review. It is not a rental contract, legal opinion, booking or commitment.

| Decision | Required input / accountable role |
|---|---|
| Commercial control | Owner: title, lease or operating agreement reference; permitted subletting/programme use; property and jurisdiction |
| Inventory | Owner: exact houses/rooms/common space; access and departure window; owner-use blackout dates; temporary hold expiry and release owner |
| Programme responsibility | Operator: programme scope, participant contract, delivery lead, complaints and escalation owner |
| Physical production | Producer: food, transport, setup, cleaning handover, accessibility, emergency contacts, insurance and vendor terms |
| Economics | Operator + owner: property fee and included services, occupancy rules, taxes, deposits, damage security, payment schedule and cancellation exposure |
| Readiness | Owner + producer: permitted use and capacity, building readiness, fire/accessibility review, internet test, noise/neighbours, parking and weather fallback |
| Cancellation | Both counterparties: supplier exposure versus participant refunds, date-release authority, substitution, force majeure, rescheduling and dispute route |
| Content | Rights holder: capture/edit/publication purposes and channels, expiry and withdrawal, review owner; no private reflection or employee records |
| Aftercare | Operator: maintenance window for delivered digital workflow, named client owner, offboarding and data deletion/return |

One producer is the property owner's operational contact. Price owner labour into
costs and measure unplanned owner interventions; a fixed property fee alone does
not make hosting low-effort. Keep residential letting, programme participation,
clinical care (if separately provided), and software/service terms distinct and
review their interaction locally, including any bundled-travel obligations.

## Planning arithmetic

All money is one currency in integer minor units, net of tax. Cost fields are totals
for the entire programme: nights do not automatically multiply them. Include full
preparation, delivery and follow-up labour as integer `operatorMinutes`. The hourly
rate is in minor units; labour cost rounds up to the next minor unit. Fixed delivery costs
must include other facilitator/producer labour; avoid duplicating that labour in
operator minutes. Venue fees remain a cost even for related parties in the operator
view. A group consolidation requires a separate model with intercompany elimination.

Per-attendee cost includes staff and complimentary guests. Overnight v1 assumes
one private bedroom per person, including staff; a couple/cofounder sharing a room
needs a separately reviewed rooming plan, not inflated capacity in this model.
Break-even uses the specified fixed costs and capacity and is not a demand forecast.

`cashCollectedMinor` is the operator's declared cash on hand for this programme.
Set aside refundable exposure before comparing available cash with payments due
before the next collection. The tool does not inspect bank accounts or validate
contract enforceability, taxes, future refund exposure or supplier liabilities.
