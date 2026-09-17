# GatorBait Controller Playbooks

These playbooks are implementation contracts for the single GatorBait controller. They are not independent agents and do not create a second source of truth.

- `digital-magazine-and-print.md` — web-first magazine packaging and premium print-on-demand pilot.
- `subscriber-winback.md` — lapsed-customer recovery with consent, cohort and retention gates.
- `social-and-show-clips.md` — Restream show clips to platform-native social, article and newsletter reuse.

`../policy.json` remains authoritative for automatic vs approval-required actions. `../controller-rules.json` selects the deterministic gates and bounded reasoning scope before any model is used.
