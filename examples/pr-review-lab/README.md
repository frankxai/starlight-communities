# Human + Agent PR Review Lab — open practice v0

Three explicitly synthetic snippets help a small group practise evidence-bound review. They are a **training exercise**, not a benchmark or leaderboard: reference answers are public, there is no private holdout, and no participant run has been recorded. The snippets do not execute and are not real pull requests. The wider Starlight evaluation methodology remains owned by the SIS Proving Ground and Arena; this pilot does not replace it.

## Run as a creation cell

1. One human or team reviews each labelled snippet independently, with or without an agent. Do not run the snippets or connect live repositories, production credentials, or customer data.
2. For each case record `block` or `no_block`, the exact cited line, and a concise rationale. Complete a receipt using `receipt.example.json` as a shape. Hash the exact bytes of `cases.json`: `sha256sum cases.json`.
3. Run `python3 validate_receipt.py cases.json receipt.json`. Exit 0 means the submitted structure and references are valid; it does **not** establish correctness or provenance. The command makes no network, model, or external system calls.
4. Separately compare the review with `reference` in each case, discuss uncertainty with a peer, and record what the human changed. A human facilitator decides correctness; do not publish names or material without consent.

## Receipt boundary

Receipts identify the task file by SHA-256, and each cited file and line must appear in the case. A citation proves only that the line exists; it does not establish that a reported review happened or that a rationale is true. The example is synthetic and does not claim a completed run. Model, harness, time, cost and human work are self-reported and may be unknown; never submit secrets, private prompts, contact details or real source code.

For a future public competition, first add a separate versioned ruleset, actual licensed or synthetic PR revisions, a hidden holdout, an independently reviewed rubric and baseline, consent, correction/appeal rights, clear identity and duplicate-entry policy, and a publication review. No ranking or verification claim follows from this exercise.

## Validate the exercise itself

Run `python3 -m unittest -v test_validate_receipt.py` in this directory. The test uses in-memory receipts and covers valid input, stale task digest, duplicate/missing cases, bad citations and invalid costs. No dependency or account is required.
