# GatorBait Agent and Automation Stack

## Decision

Use the existing Codex/Wix/GitHub operator as the production supervisor. Add external frameworks only when a recurring workflow justifies their maintenance.

### Agent layer

Preferred repository: [openai/openai-agents-python](https://github.com/openai/openai-agents-python)

Why:

- MIT licensed.
- Lightweight multi-agent handoffs and agents-as-tools.
- Native tool, MCP, guardrail, human-review and tracing concepts.
- Fits the existing OpenAI and Codex environment without introducing a second orchestration model.

CrewAI remains a valid alternative for a larger role-based editorial crew. Do not install both.

### Automation layer

Preferred fully MIT repository: [activepieces/activepieces](https://github.com/activepieces/activepieces)

Preferred mature internal-use alternative: [n8n-io/n8n](https://github.com/n8n-io/n8n), subject to its Sustainable Use License.

Start with Activepieces when permissive licensing and MCP integrations matter most. Choose n8n when its larger integration and template ecosystem materially reduces implementation time.

## Initial automation candidates

1. New Wix article triggers metadata and image validation.
2. Approved article produces Facebook, YouTube, Instagram and newsletter drafts.
3. New Buddy Martin Show video produces a website link and channel-specific draft copy.
4. GatorBait Weekly assembles from verified current articles.
5. Scheduled checks monitor homepage availability, SSL, DNS, forms, feeds, broken links and layout regressions.
6. Failed checks create an internal alert and stop downstream publishing.

## Cost and safety controls

- Deterministic validation runs before an LLM call.
- Cache article data and reuse one approved summary across channels.
- Use smaller models for classification and formatting; reserve stronger models for final editorial judgment.
- One supervisor approves production Wix writes.
- Automations do not change DNS, payments, refunds, memberships or customer records.
- Do not store credentials in GitHub. Use the automation platform's encrypted secret store.
- Log the source URL, model, prompt version, output and publication status.
- Stop the workflow when required metadata, attribution or image rights are uncertain.

## Adoption gate

Do not vendor external agent repositories or add them as Git submodules. When implementation begins, pin released package/container versions and build one workflow first: **new Wix article → validation → social drafts → approval**. Expand only after it runs reliably and demonstrates lower cost.
