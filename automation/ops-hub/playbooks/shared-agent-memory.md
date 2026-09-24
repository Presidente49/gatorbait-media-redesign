# Shared Agent Memory — GatorBait Master Control

## Purpose

Use `dan-calin/shared-agent-memory` as the local AI-to-AI operational memory layer for GatorBait.

It gives Claude Code and Codex one project-local knowledge graph and a lightweight edit-coordination board.

## Authority boundary

Shared memory is **not** the production source of truth.

Authority remains:

1. live provider/API/runtime
2. current object/revision
3. canonical GitHub Master Control docs
4. owned GitHub incident/work item
5. shared-agent-memory operational notes
6. historical chat/model assumptions

Memory can accelerate handoffs. It cannot authorize spending, publishing, payment changes, credential use, or production mutations.

## Install

From the repository root on Brenden's Mac:

```bash
git pull
chmod +x automation/ops-hub/install-shared-agent-memory.sh
./automation/ops-hub/install-shared-agent-memory.sh
```

The installer is pinned to upstream commit:

`29e96c663a43da557c25132c4d569bce9d9e6b12`

It:

- configures the guarded memory MCP
- initializes project-local `.shared-memory/`
- adds project-scoped Claude/Codex instructions using the upstream marker-safe mechanism
- enables advisory edit coordination
- runs the upstream doctor/status checks

## Memory discipline

Save short operational facts such as:

- current verified object/revision
- completed fix and verification result
- active blocker and owner
- useful recovery pattern
- file currently claimed for editing

Do not save:

- passwords
- OAuth/access tokens
- cookies
- private keys
- phone-control bearer tokens
- payment data
- private customer/member data
- full email/message bodies unless strictly needed and approved

Use project-qualified entity names so searches stay bounded.

## Coordination

Coordination defaults to **warn**, not block.

The single-controller rule still applies. A file claim is a coordination hint, not permission to race another writer or bypass Master Control.

## Git hygiene

`.shared-memory/` is intentionally ignored by Git. The local memory store is operational state, not repository content.

Promote repeated or durable lessons into the canonical playbooks only after review.
