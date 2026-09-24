#!/usr/bin/env bash
set -euo pipefail

# One-command local Master Control bootstrap for Brenden's Mac.
# 1) shared Claude/Codex memory + edit coordination
# 2) Messages read-only MCP + optional iPhone UI control

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

chmod +x automation/ops-hub/install-shared-agent-memory.sh
chmod +x automation/ops-hub/install-master-control-mobile.sh

./automation/ops-hub/install-shared-agent-memory.sh
./automation/ops-hub/install-master-control-mobile.sh
