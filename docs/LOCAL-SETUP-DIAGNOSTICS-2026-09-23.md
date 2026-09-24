# Local setup and diagnostics — 2026-09-23

Scope: ChatGPT cloud Linux workspace, not Brenden's Mac.
Canonical remote: Presidente49/gatorbait-media-redesign.

GitHub latest checked runs passed: production health35893846438, publication refresh35894396170, OpsHub35895187710, Pages35895206187. Production run includes controller/learning/router tests and public-route/brand checks.

Local controller diagnostic:0failures,15warnings. Controller4tests, learning4tests and router14tests passed. Public health passed. Warnings are unavailable CLI/services (Claude/Codex/FCC/Docker/n8n), queue directories, Mac launchd and untested authentication.

Existing checkout inventory:
- gatorbait-media-redesign: older Gazette c5c5149,3modified files preserved.
- gatorbait-next: older0bcc953 plus uncommitted sports/design work preserved.
- gatorbait-buddy: active working checkout; previous verified changes preserved in local commit then merged current origin/main. No destructive reset, folder deletion or duplicate project creation.

Installed pinned shared-agent-memory29e96c663a43da557c25132c4d569bce9d9e6b12 through existing bootstrap. Project store created; Codex MCP configuration and secret guard installed; advisory coordination enabled. Doctor passed empty store/secret scan/claim-board validation. Current chat does not automatically gain a new MCP tool; client restart required. Claude CLI absent. No agent/model calls or new hosted services activated.

Found actual .gitignore defect: literal backslash-n after .shared-memory/ prevented matching. Corrected newline and verified git check-ignore. Added bootstrap guard refusing unignored/already-tracked memory before initialization. Private memory contents never committed. Installer instruction blocks appended to AGENTS/CLAUDE retain existing current production authority.

Mac Messages/iPhone/WDA/launchd installer is Darwin-only; not run on Linux. These remain uninstalled/unverified on user's Mac. FCC/provider login and n8n services remain inactive; installing unused daemons in temporary cloud environment would not connect user's Mac.
