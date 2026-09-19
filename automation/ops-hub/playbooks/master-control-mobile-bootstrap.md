# Master Control Mobile Bootstrap

This is the local bootstrap for GatorBait's two mobile capability lanes:

1. **Mac Messages MCP** — least-privilege/read-only newsroom ingestion, especially Chris Spears game photos.
2. **iphone-use** — optional real-iPhone UI control when an API/connector or read-only source cannot complete the job.

## Run on Brenden's Mac

From the current GatorBait repo checkout:

```bash
git pull
chmod +x automation/ops-hub/install-master-control-mobile.sh
./automation/ops-hub/install-master-control-mobile.sh
```

The script:

- requires macOS and the logged-in user
- uses Homebrew only for missing `uv` and `libimobiledevice`
- registers `mac-messages` with Claude/Codex if those CLIs are installed
- installs `iphone-use` from a commit-pinned upstream installer URL
- creates a local secret-safe wrapper for `iphone-use-mcp`
- keeps the phone bearer token in the local LaunchAgent instead of copying it into Git, prompts, or MCP config
- registers `iphone-use` with Claude/Codex
- checks full Xcode
- runs the upstream WDA doctor
- attempts WDA setup only when diagnostics are ready
- verifies the local iphone-use agent API when possible

## Apple permissions that cannot be automated

macOS/iOS require the owner to approve:

- Full Disk Access for the launcher reading Messages
- USB device trust
- iPhone Developer Mode
- Xcode development-team signing prompts
- passcode/Face ID unlock

Master Control must stop at those gates rather than attempting workarounds.

## Security model

For game-day photo ingestion, use `mac-messages` only:

- scope to Chris Spears
- current game-day time window
- image attachments
- fetch selected attachments
- no message sending

Use `iphone-use` only when actual on-device UI interaction is necessary.

Never commit:

- phone UDID
- bearer token
- Messages data
- private contact handles
- Apple credentials
- development signing secrets

The wrapper installed at `~/.local/bin/gatorbait-iphone-use-mcp` reads the current local token from:

`~/Library/LaunchAgents/com.leeguoo.iphone-use.plist`

at runtime.
