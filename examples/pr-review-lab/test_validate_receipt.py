import copy
import hashlib
import json
import pathlib
import unittest

from validate_receipt import validate


class ReceiptTests(unittest.TestCase):
    def setUp(self):
        self.raw = pathlib.Path(__file__).with_name("cases.json").read_bytes()
        self.data = json.loads(self.raw)
        self.receipt = {"dataset_id": self.data["id"], "dataset_sha256": hashlib.sha256(self.raw).hexdigest(), "track": "human_plus_agent", "harness": None, "model": None, "elapsed_seconds": 0, "human_minutes": None, "cost_eur": None, "reviews": [{"case_id": c["id"], "decision": c["reference"]["decision"], "file": c["file"], "line": c["reference"]["anchor"], "rationale": "synthetic fixture"} for c in self.data["cases"]]}

    def test_valid(self):
        self.assertEqual(validate(self.raw, self.receipt), [])

    def test_stale_dataset(self):
        self.receipt["dataset_sha256"] = "0" * 64
        self.assertTrue(validate(self.raw, self.receipt))

    def test_duplicate_and_missing_cases(self):
        self.receipt["reviews"][1] = copy.deepcopy(self.receipt["reviews"][0])
        errors = validate(self.raw, self.receipt)
        self.assertTrue(any("duplicate" in e for e in errors))
        self.assertTrue(any("cover" in e for e in errors))

    def test_invalid_citation(self):
        self.receipt["reviews"][0]["line"] = 999
        self.assertTrue(any("citation" in e for e in validate(self.raw, self.receipt)))

    def test_invalid_cost_and_boolean_duration(self):
        self.receipt["cost_eur"] = -1
        self.receipt["elapsed_seconds"] = True
        self.assertEqual(len(validate(self.raw, self.receipt)), 2)


if __name__ == "__main__":
    unittest.main()
