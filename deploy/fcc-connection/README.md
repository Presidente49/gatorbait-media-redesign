# FCC connection check — September 29, 2026

FCC is installed and its local authenticated gateway passed the smoke check in this Linux workspace. **An upstream model is not connected.** The configured OpenRouter provider reports `missing_key` for `OPENROUTER_API_KEY`. No real model completion has run and no token-cost reduction has been measured.

## What was done

- Used the existing approved FCC pin, commit `b9aa5a637e106a7bf0cee8ac34f849ae8a98d4ac` (6.2.31), from `Alishahryar1/free-claude-code`.
- Downloaded and inspected the pinned archive and installed Python 3.14.0 plus FCC in an isolated uv tool environment. Did not run the repo's `--force` installer or change its pin.
- Created new local configuration because none existed. Bound to `127.0.0.1:8082`, required proxy authentication, disabled automatic browser opening and messaging, and generated a unique local bearer token.
- Kept the token outside Git at `~/.fcc/.env` (0600), inside `~/.fcc` (0700). No provider credential was created, copied, rotated, or printed.
- Verified `/health` returned 200; `/v1/models` without authentication returned 401; the authenticated model catalog returned 200.
- Verified the selected provider reports the missing key. An advertised model ID is only configuration evidence; it is not proof of an available upstream model.
- Confirmed the existing public/code routing dry run selects `fcc_codex`, with production writes disabled. Native Codex and Claude CLIs are absent here; FCC launchers do not substitute for those harness installations.

See `verification.json` for the machine-readable evidence and `verify_local.py` for the repeatable check. The check sends no task content to a model.

## Runtime limit

This is the cloud Linux workspace, not the always-on Mac named in the router runbook. No connection to that Mac was established. A server started in one command invocation was not reachable through loopback from a separate invocation, although its startup completed. Starting the server and probing it within the same invocation succeeded. The temporary test gateway was stopped after verification; do not describe it as a persistent running connection.

The workspace's `~/.local/bin` is not on PATH. The installed executable can be addressed directly as `~/.local/bin/fcc-server`. Installation and local private configuration may not survive replacement of this cloud workspace.

## Finish the connection on the intended host

1. On the host intended to run FCC, inspect existing configuration before installing or changing anything. Use the approved pinned installation and keep `HOST=127.0.0.1` and `PROXY_AUTH_ENABLED=true`.
2. Start `fcc-server` and open its local Admin UI at `http://127.0.0.1:8082/admin` on that same host.
3. Configure an authorized provider in that local UI, such as the OpenRouter key for the existing free-model route, or an already-authorized connected account. Keep credentials out of chat and Git. Do not buy a subscription or enable paid models implicitly.
4. Repeat the authentication check, then run one minimal public-content completion and record the actual returned upstream provider/model. Only a successful completion establishes model availability.
5. If using the FCC Claude/Codex harnesses, install and verify their underlying native CLI on that same host. For a permanent Mac service, follow the existing model-router runbook after the smoke check succeeds.

This setup does not switch the model serving the current ChatGPT conversation or reduce that conversation's token usage. Savings would come from future eligible tasks explicitly dispatched to a verified FCC provider.

## Repeat the local verification

```bash
python3 deploy/fcc-connection/verify_local.py
```

The script refuses an unexpected version, unsafe binding, missing proxy authentication, unsafe config permissions, or an already-running gateway. It starts and stops only its own temporary process. Its output contains status and provider configuration names, never credential values.

## Provenance and rollback

Archive: `https://github.com/Alishahryar1/free-claude-code/archive/b9aa5a637e106a7bf0cee8ac34f849ae8a98d4ac.zip`

Downloaded archive SHA-256: `9b73ff7b91846fc4292b42c739de8a3b232f385ed75280eb40559a2b41bfd713`.

FCC source is pinned; transitive dependencies were resolved at installation and are not asserted to be identical to the earlier audit environment. No floating FCC upgrade was performed.

No Wix or production site changes were made for this setup. Temporary gateway processes were stopped. If the local FCC installation is no longer wanted, use `uv tool uninstall free-claude-code`; retain private configuration until the owner decides whether to remove it. Python 3.14.0 may be shared by other future tools, so do not remove it blindly.
