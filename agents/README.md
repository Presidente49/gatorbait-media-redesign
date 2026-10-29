# GatorBait project agents

These are reusable bounded worker definitions under the existing controller. They replace reliance on a hosted Symphony workflow; they do not recreate its accounts, hidden prompts, connections, services or scheduled jobs.

| Agent | Job | Canonical instructions |
| --- | --- | --- |
| gatorbait-intake | Complete portal/Gmail sources, actual account identity and canonical dedupe | [Intake](gatorbait-intake.md) |
| gatorbait-copy-desk | Supported edits, trusted-writer quick checks and house voice | [Copy desk](gatorbait-copy-desk.md) |
| gatorbait-publication-qc | Independent public/native byline, image and full-copy verification | [Publication QC](gatorbait-publication-qc.md) |
| gatorbait-muse-handoff | ChatGPT art briefs, exact-item handoff and honest acceptance states | [Muse handoff](gatorbait-muse-handoff.md) |

Project Codex definitions live in `.codex/agents/*.toml` and Claude definitions in `.claude/agents/*.md`. Both load these portable briefs and canonical skills. Models, reasoning effort, provider permissions and connections inherit from the parent; definitions grant no additional access. Hosts must load/discover the updated project before use. This commit does not prove any running agent or automated intake.

Load only the worker needed for a separable task. One controller serializes live publication and corrections; the QC reviewer independently verifies outcomes. No extra scheduler, publisher, social claim registry or paid capacity is created. Existing explicit send/account/money boundaries stay in force.

Codex format reference: https://developers.openai.com/codex/multi-agent/ (project-scoped standalone custom-agent files, name/description/developer_instructions; verified October 29, 2026).
