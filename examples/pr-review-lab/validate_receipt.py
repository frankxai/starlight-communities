#!/usr/bin/env python3
"""Validate a synthetic practice receipt; no score or live execution is performed."""
import hashlib
import json
import math
import pathlib
import sys


def validate(dataset_bytes, receipt):
    data = json.loads(dataset_bytes)
    errors = []
    if not isinstance(receipt, dict):
        return ["receipt must be an object"]
    if receipt.get("dataset_sha256") != hashlib.sha256(dataset_bytes).hexdigest():
        errors.append("dataset_sha256 does not match exact task bytes")
    if receipt.get("dataset_id") != data["id"]:
        errors.append("dataset_id mismatch")
    if receipt.get("track") not in ("human", "human_plus_agent", "agent_plus_human_review"):
        errors.append("unsupported track")
    for key in ("harness", "model"):
        if key not in receipt or (receipt[key] is not None and (not isinstance(receipt[key], str) or not receipt[key].strip())):
            errors.append(f"{key} must be a nonempty string or null")
    for key in ("elapsed_seconds", "human_minutes", "cost_eur"):
        value = receipt.get(key)
        if key not in receipt or (value is not None and (isinstance(value, bool) or not isinstance(value, (int, float)) or (isinstance(value, float) and not math.isfinite(value)) or not 0 <= value <= 1_000_000_000_000)):
            errors.append(f"{key} must be a finite number between 0 and 1e12 or null")
    reviews = receipt.get("reviews")
    if not isinstance(reviews, list):
        return errors + ["reviews must be a list"]
    by_id = {case["id"]: case for case in data["cases"]}
    seen = set()
    for review in reviews:
        if not isinstance(review, dict):
            errors.append("each review must be an object")
            continue
        case_id = review.get("case_id")
        if not isinstance(case_id, str) or case_id not in by_id:
            errors.append("unknown case_id")
            continue
        if case_id in seen:
            errors.append(f"duplicate case: {case_id}")
        seen.add(case_id)
        case = by_id[case_id]
        if review.get("decision") not in ("block", "no_block"):
            errors.append(f"{case_id}: invalid decision")
        if review.get("file") != case["file"] or type(review.get("line")) is not int or str(review["line"]) not in case["lines"]:
            errors.append(f"{case_id}: citation not in case")
        if not isinstance(review.get("rationale"), str) or not review["rationale"].strip():
            errors.append(f"{case_id}: rationale required")
    if seen != set(by_id):
        errors.append("receipt must cover each case exactly once")
    return errors


def main(argv):
    if len(argv) != 3:
        print("usage: python3 validate_receipt.py cases.json receipt.json", file=sys.stderr)
        return 2
    try:
        dataset = pathlib.Path(argv[1]).read_bytes()
        receipt = json.loads(pathlib.Path(argv[2]).read_text(encoding="utf-8"))
        errors = validate(dataset, receipt)
    except (OSError, ValueError, KeyError, TypeError) as exc:
        print(f"invalid input: {exc}", file=sys.stderr)
        return 2
    if errors:
        print("INVALID: " + "; ".join(errors), file=sys.stderr)
        return 1
    print("VALID STRUCTURE ONLY — no correctness or authenticity claim")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
