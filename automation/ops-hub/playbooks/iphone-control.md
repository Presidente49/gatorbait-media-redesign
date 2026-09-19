# Master Control iPhone Device-Control Playbook

## Purpose

Provide Master Control with a bounded, optional way to interact with Brenden's own iPhone from the Mac when a direct connector/API or read-only local source cannot complete the task.

This is a **device-control surface**, not the default path for mobile data.

Preferred tool:

`leeguooooo/iphone-use`

## Why this repo

Compared with older/simple iPhone MCP projects, `iphone-use` is the preferred candidate because it is actively maintained and provides:

- direct WebDriverAgent/XCUITest control over USB
- screenshots/live screen
- accessibility-tree inspection
- tap/swipe/type/launch-app actions
- MCP tools plus an HTTP agent API
- explicit human/agent handoff
- bearer authentication
- fail-closed behavior when WDA is unavailable
- no jailbreak requirement

Do not use the archived Facebook WebDriverAgent repo directly; use maintained WDA/Appium tooling through the selected controller layer.

## Requirements

Local Mac requirements:

- macOS 15+
- full Xcode.app, not only command-line tools
- an Apple development team configured in Xcode
- iPhone trusted by the Mac over USB
- Developer Mode enabled on the iPhone
- iPhone unlocked and awake during setup/control
- `iproxy` from `libimobiledevice`

The phone cannot be automated past Face ID/passcode.

## Setup

Use the upstream installer only after reviewing the current upstream release and install script.

Current upstream quick-start pattern:

```bash
curl -fsSL https://raw.githubusercontent.com/leeguooooo/iphone-use/main/install.sh | sh
~/.iphone-use/setup-wda.sh doctor
~/.iphone-use/setup-wda.sh
~/.iphone-use/setup-wda.sh status
```

For a machine with multiple paired iPhones, pin the intended device UDID explicitly.

Do not commit UDIDs, passwords, bearer tokens, development-team IDs, or local credentials to the GatorBait repository.

## Master Control routing rule

Use the least-privileged path that can do the job:

### Prefer a provider/API connector
Examples: Wix, Gmail, Google Drive, social APIs.

### Prefer read-only local data
Example: `mac_messages_mcp` for Chris Spears image attachments.

### Use `iphone-use`
Only when the task requires operating an app/UI on the physical phone.

Examples:

- opening a mobile-only app that has no usable connector
- collecting a screenshot from a specific app screen
- navigating a mobile-only workflow
- verifying how a GatorBait link/page renders in a real iPhone browser
- performing an explicitly authorized repetitive UI task that cannot be done through an API

## Read-before-write rule

For every iPhone action:

1. inspect current screen/app state
2. identify the exact intended UI element/action
3. confirm the task is within the active user request
4. make the smallest action
5. take a new screenshot/state read
6. stop on unexpected navigation, account prompt, payment screen, credential prompt, or security warning

Do not blindly replay coordinates after the UI changes.

## Human handoff

When Brenden begins using the phone manually, or when a task reaches a sensitive/manual step, hand the device back to human mode.

The upstream tool supports a human-handoff state that prevents the agent from silently restarting control underneath the user.

Use it.

Master Control must never fight a human for the device.

## High-risk surfaces

Do not automate without explicit, task-specific authorization:

- Wallet / Apple Pay
- banking or brokerage
- authentication/2FA
- password managers
- Find My / device lock state
- account recovery
- purchases/subscriptions
- deleting photos/messages/files
- security/privacy settings
- App Store purchases
- payment or transfer confirmation
- destructive device-management actions

If the selected tool supports app blocking/allowlists, block sensitive apps by default.

## Game-day newsroom use

The device-control layer can complement, but not replace, the read-only photo pipeline.

Preferred Chris Spears workflow:

`Messages database attachment ingest → originals preserved → newsroom processing → gallery/article/social`

Use iPhone UI control only when, for example:

- a photo exists only inside a mobile app and cannot be fetched by a cleaner source
- a mobile-only share/export step is required
- the user wants live real-device rendering verification

## Verification

Before declaring an iPhone task complete:

- verify resulting device screen/state
- verify no unexpected app/account was touched
- verify no irreversible side effect occurred outside the requested task
- verify any transferred file exists at the intended destination
- verify any published content through the authoritative destination system, not only the phone UI

## Learning

If a repeated iPhone workflow becomes useful:

- capture it as a bounded skill/playbook
- preserve semantic element checks rather than raw coordinate-only replay
- keep credentials and device identifiers out of Git
- prefer deterministic replay after a workflow is proven
- revalidate after iOS/app updates

Do not turn one successful phone interaction into broad autonomous-device permission.
