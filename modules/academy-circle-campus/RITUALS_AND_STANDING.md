# Campus Rituals, Arrival Path & Builder Standing

> **Scope:** Operational rituals for the 6-space Circle campus adapter (`starlight.academy_circle_campus.v1`).
> **Safety contract:** Draft-staged only (`starlight-intelligence-academy#86`); respects the 30-space Circle plan cap and three-tier access isolation (`starlight-communities#23`).

---

## 1. Six-Space Circle Campus Architecture

Circle community `621143` operates within a 30-space budget. Rather than minting sprawling topic channels that split attention, the Academy campus maps to **six focused spaces** reusing existing space slots:

| Space | Access Tier | Paired SIA & AAA Surfaces | Weekly Job |
|---|---|---|---|
| **Start Here / Orientation** | Member | SIA `/academy`, `/academy/curriculum-atlas` · AAA `02-learning-paths/12-week-production-architect.md` | 48-hour Arrival Path (`#23`), ICP track routing, and Week 1 Field Notes |
| **Architecture Critique Arena** | Operator & Cohort | SIA `/academy/studio` · AAA `01-design-patterns`, `15-workflows/peer-review.md` | Thursday 20-minute Async Peer Review on ADRs, constitutions, and boundary contracts |
| **Weekly Red-Gate Lab Clinic** | Operator & Cohort | SIA `/academy/evaluation` · AAA `labs/01-rag-pipeline` .. `labs/05-eval-admission-gate` | Monday 15-minute `UnaidedAttempt` + Wednesday offline test diagnosis |
| **Worked-Run Trace Exchange** | Operator & Cohort | SIA `/academy/evaluation` · AAA `site/app/worked-run/page.tsx`, `07-evaluation` | Dissecting real failure modes (`contract-rag`, `support-triage`, `personal-ai-coe`) |
| **GenCreator Studio Showcase** | Member | SIA `/academy/studio` · AAA `assets/diagrams` | Friday showcase of shipped SVG plates, Remotion explainers, and multimodal specs |
| **Alumni Builders & Office Hours** | Operator & Cohort | SIA `/academy` · AAA `08-governance` | Day-7 Changed-Context Transfer verification and Creation Cell steward clinics |

**Access & readiness rules (`#23`):**
- Private governance spaces remain hidden and isolated from Member and Operator access groups.
- Internal tracking labels never appear as member-facing space or badge titles.
- Specialist tracks that are still staged in development are labeled honestly as upcoming or preview—never presented as live courses until verified.

---

## 2. The 48-Hour Arrival Path Checklist (`starlight-communities#23`)

Every arriving builder has one clear 48-hour goal: **orient without overwhelm, test one real boundary unaided, and contribute one structured artifact.**

### Window A — Hours 0 to 1: Land & Choose Your Lens
- [ ] Land in **Start Here / Orientation** and read the pinned Welcome guide and Visual System Map.
- [ ] Pick your primary entry lens:
  - **Enterprise Systems Architect** — governance boundaries, ADRs, VPC/residency controls, multi-provider resilience.
  - **Production AI Builder** — offline Python/TypeScript labs, hybrid retrieval, MCP meshes, golden eval suites.
  - **Technical GenCreator** — `design.md` visual systems, SVG architecture plates, Remotion video manifests, anti-slop copy gates.
  - **Structured Workflow Operator** — workflow triage (`automate` / `assist-only` / `do-not-automate`), human review queues, recovery SOPs.
- [ ] Confirm privacy and consent flags (`private` by default; `allowCellMatching` is opt-in).
- **Recovery check:** If an invite popup, email link, or mobile embed fails to load, jump directly to `https://starlightintelligence.academy/academy/curriculum-atlas` and reply to the Start Here thread so a steward can verify access.

### Window B — Hours 1 to 24: Unaided First Signal
- [ ] Complete the two reviewed Start Here orientation lessons (*What Starlight is — and where you fit* and *Your first signal: turn an observation into a structured note*).
- [ ] Spend **15 minutes unaided** (`assistance = "none"`) framing one recurring workflow or diagnosing a broken lab baseline before opening Socratic `/hint` prompts or reference patterns.
- **Recovery check:** No local Python or Node setup on your current device? Complete the browser triage packet in SIA Mission Studio (`/academy/studio`) first and attach your local lab run later.

### Window C — Hours 24 to 48: First Field Note & Cell Readiness
- [ ] Post your 5-line **Week 1 Field Note** in **Start Here / Orientation** (using synthetic or public-safe scope only—never confidential employer data).
- [ ] Choose either **Creation Cell matching** (3–5 builders sharing weekly proof) or the **solo async verification lane** (zero social penalty).

---

## 3. Weekly 20-Minute Async Peer Review Protocol

Passive "looks great!" comments create noise without improving engineering judgment. Every Thursday in **Architecture Critique Arena**, paired builders or 3–5 person Creation Cells run a strict **20-minute async rubric review**:

1. **Minutes 00–05 — Plain-Language Restatement:** Restate your partner's workflow boundary, accountable human owner, and numeric `killCriterion` in two sentences. If you cannot restate it plainly, flag ambiguity right away.
2. **Minutes 05–12 — Non-Compensable Red-Gate Probe:** Stress-test one high-consequence boundary:
   - Could untrusted retrieved text (`T3`) cross into the instruction channel (`T0/T1`)?
   - What happens when retrieval returns zero relevant clauses?
   - Can any tool execute spend, pricing edits, or external sends without a named human gate?
3. **Minutes 12–17 — Concrete Evidence Check:** Inspect the actual test log, `cases.jsonl` fixture, ADR diff, or SVG plate—never evaluate prose descriptions alone.
4. **Minutes 17–20 — Helpful Recognition & Bounded Next Move:** Name one strong engineering choice, suggest one concrete edge-case test, and confirm one clear next commitment.

**Anti-shame rule:** Reviews critique system boundaries, failure modes, and test coverage—never personal speed, post frequency, or rank.

---

## 4. Day-7 Changed-Context Transfer Verification Ritual

Passing a lab immediately after reading hints proves short-term execution, not durable architectural judgment. Seven days after Friday sign-off, builders enter **Alumni Builders & Office Hours** for a **25-minute Changed-Context Transfer check**:

1. **Perturbed Constraint Prompt (15 minutes, unaided first):** Solve a bounded constraint shift on last week's artifact before consulting an coding agent—for example:
   - *Week 1 perturbation:* Legal mandates zero customer PII leaves regional VPC boundaries.
   - *Week 3 perturbation:* Indirect prompt injection arrives inside a trusted vendor contract addendum.
   - *Week 8 perturbation:* Aggregate benchmark rises to `94%`, while one citation safety red gate fails.
2. **Deterministic Verification (10 minutes):** Re-run the offline verification suite (`unittest` / `vitest` / SIA kernel check), commit the minimal diff, and attach the output to revalidate `starlight.capability_receipt.v1`.

---

## 5. Five-Tier Builder Standing Model (Zero Vanity Points)

Standing in the campus reflects **verifiable engineering proof and helpful stewardship**—never login streaks, chat XP, or public shame leaderboards.

| Order | Standing Tier | Verifiable Repo & Ritual Evidence Required | Unlocked Campus Responsibilities |
|---|---|---|---|
| **1** | **Observer** (`observer`) | Completed 48-hour Arrival Path (`#23`), selected ICP lens, posted first public-safe Field Note | Join orientation threads; submit `UnaidedAttempt` hypotheses |
| **2** | **Scoped Builder** (`scoped_builder`) | `>= 1` shipped repo artifact + `>= 1` passed non-compensable red gate | Match into 3–5 person Creation Cells; enter Thursday 20-min Peer Review |
| **3** | **Red-Gate Verifier** (`red_gate_verifier`) | `>= 3` shipped repo artifacts + `>= 3` passed red gates + `>= 2` rubric peer reviews | Co-sign boundary critiques in Architecture Critique Arena; publish forensic traces |
| **4** | **Verified Systems Architect** (`verified_architect`) | `>= 6` shipped repo artifacts + `>= 6` passed red gates + `>= 4` peer reviews + `>= 2` verified Day-7 transfers | Hold digest-bound `starlight.capability_receipt.v1`; join Alumni architecture clinics |
| **5** | **Cell Steward & Pattern Maintainer** (`cell_steward`) | `>= 8` shipped repo artifacts + `>= 8` passed red gates + `>= 6` peer reviews + `>= 3` Day-7 transfers + `>= 1` Cell facilitated or reviewed open-source PR | Steward a 3–5 person Creation Cell under human gate; propose upstream labs, diagrams, or golden eval cases |
