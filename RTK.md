# RTK

Prefix shell commands with `rtk` when compact output will help: `rtk git status`,
`rtk npm run build`, `rtk ls src/`. Keep the prefix inside command chains:
`rtk git add . && rtk git commit -m "msg"`. Commands RTK has no filter for run
as-is, so the prefix is safe.

## Command Output

RTK condenses command output to save tokens while preserving exit codes and the
main signal. Treat condensed output as the complete result unless it is clearly
unusable: empty when output was expected, contradictory to the exit code, or
garbled.

Use these fallbacks when detail matters:

- `rtk proxy <cmd>` runs the command unfiltered while still tracking usage.
- `RTK_DISABLED=1 <cmd>` skips RTK for one command.
- `rtk recall <hash>` recovers output that a filter elided when available.

Useful checks:

- `rtk gain` or `rtk gain --history` shows token savings.
- `rtk discover` finds past commands RTK could have condensed.
