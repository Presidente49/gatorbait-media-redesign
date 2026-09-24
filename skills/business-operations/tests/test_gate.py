"""Synthetic cross-project fixtures: not real execution/acceptance evidence."""
import copy
import importlib.util
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("gate", ROOT / "scripts/gate.py")
gate = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(gate)


def fixture(project="publisher-test"):
    r = dict(project_id=project, work_item_id="existing-item", stage="prepare",
             artifact="draft", revision="r1", scope="read-only review", sender="producer-session", receiver="review-session",
             qc={"passed": True, "evidence": "fixture-checks"})
    r["acknowledgment"] = {k:r[k] for k in gate.IDENTITY}
    r["acknowledgment"].update(verified=True, independent=True, reference="fixture-event",
                              source="receiver-record", checked_at="2026-09-24T00:00:00Z",
                              accepted=True, receiver="review-session", author_session="review-session",
                              scope="read-only review", next_action="review draft", verification_plan="compare source")
    return r


class GateTests(unittest.TestCase):
    def test_portable_across_businesses(self):
        for p in ("publisher-test", "retail-test", "services-test"):
            with self.subTest(project=p): self.assertEqual([], gate.validate(fixture(p)))

    def test_missing_ack(self):
        r=fixture(); del r["acknowledgment"]; self.assertTrue(gate.validate(r))

    def test_wrong_identity(self):
        for k in gate.IDENTITY:
            with self.subTest(field=k):
                r=fixture(); r["acknowledgment"][k]="wrong"; self.assertTrue(gate.validate(r))

    def test_sender_cannot_accept(self):
        r=fixture(); r["acknowledgment"]["author_session"]=r["sender"]; self.assertTrue(gate.validate(r))

    def test_qc_fail(self):
        r=fixture(); r["qc"]["passed"]=False; self.assertTrue(gate.validate(r))

    def test_dispatch_receipt_not_acceptance(self):
        r=fixture(); r["acknowledgment"]={"receipt":"ok"}; self.assertTrue(gate.validate(r))

    def test_ack_requires_readback(self):
        r=fixture(); r["acknowledgment"]["verified"]=False; self.assertTrue(gate.validate(r))

    def test_qc_evidence_required(self):
        r=fixture(); r["qc"]["evidence"]=""; self.assertTrue(gate.validate(r))

    def test_unaccepted(self):
        r=fixture(); r["acknowledgment"]["accepted"]=False; self.assertTrue(gate.validate(r))

    def test_complete_scope_required(self):
        for k in ("scope", "next_action", "verification_plan"):
            with self.subTest(field=k):
                r=fixture(); del r["acknowledgment"][k]; self.assertTrue(gate.validate(r))

    def test_terminal_requires_objective(self):
        r=fixture(); r.update(terminal=True, disposition="verified"); self.assertTrue(gate.validate(r))

    def test_verified_terminal(self):
        r=fixture(); r.update(terminal=True, disposition="verified", objective_met=True, success_measure="fixture target")
        r["primary"]=copy.deepcopy(r["acknowledgment"]); r["primary"].update(source="provider",reference="provider-event")
        r["independent"]=copy.deepcopy(r["acknowledgment"]); r["independent"].update(source="public-runtime",reference="public-evidence")
        self.assertEqual([],gate.validate(r))
        r["independent"]["source"]="provider"; self.assertTrue(gate.validate(r))

    def test_terminal_same_reference_fails(self):
        r=fixture(); r.update(terminal=True, disposition="verified", objective_met=True, success_measure="target")
        r["primary"]=copy.deepcopy(r["acknowledgment"]); r["primary"]["source"]="provider"
        r["independent"]=copy.deepcopy(r["acknowledgment"]); r["independent"]["source"]="public"
        self.assertTrue(gate.validate(r))

    def test_receiver_mismatch_fails(self):
        r=fixture(); r["acknowledgment"]["receiver"]="other-session"; self.assertTrue(gate.validate(r))

    def test_scope_mismatch_fails(self):
        r=fixture(); r["acknowledgment"]["scope"]="publish and spend"; self.assertTrue(gate.validate(r))

    def test_reviewed_rejection(self):
        r=fixture(); r.update(terminal=True, disposition="rejected")
        r["review"]=copy.deepcopy(r["acknowledgment"]); r["review"].update(reviewer="owner",decision="rejected")
        self.assertEqual([],gate.validate(r))

    def test_invalid_records(self):
        for r in (None, [], "ok", {}, {"terminal":"true"}):
            with self.subTest(record=r): self.assertTrue(gate.validate(r))

    def test_no_client_details_in_portable_documents(self):
        for path in [ROOT/"SKILL.md", *list((ROOT/"references").glob("*"))]:
            text=path.read_text().lower()
            for forbidden in ("gatorbait", "buddy martin", "18fb3a4e", "presidente49", "buddymartinshow"):
                with self.subTest(file=path.name,term=forbidden): self.assertNotIn(forbidden,text)


if __name__ == "__main__": unittest.main()
