# Portable Business Operations skill

One reusable method, an intact upstream specialist library, and one thin adapter per business. This is not a competing controller or a new business application.

## Included

- `SKILL.md`: portable operating method.
- `references/`: workflow and learning contracts plus a blank business profile.
- `scripts/gate.py` and `tests/`: dependency-free structural handoff/closure checks.
- `sources.lock.json`: exact upstream repository, commit, MIT license and review scope.
- `.agents/marketingskills`: the complete original upstream repository as a pinned Git submodule, not rewritten fragments.

The small `.agents/skills/business-operations`, `.claude/skills/business-operations` and `.codex/skills/business-operations` entrypoints route to the same core. They do not duplicate the method. Only the selected task's specialist instructions are read. Installing a catalog does not activate its tools, advertising, data access or schedulers.

## Initialize in an approved checkout

After the existing controller has accepted this exact integration revision in the normal workflow, an authorized local worker verifies remote, branch, HEAD and dirty state without resetting anything. Initialize only this dependency:

```sh
git -c core.hooksPath=/dev/null submodule update --init -- .agents/marketingskills
git -C .agents/marketingskills rev-parse HEAD
python3 -m unittest discover -s skills/business-operations/tests -v
```

The submodule HEAD must equal the commit in `sources.lock.json` and the superproject gitlink. Stop on a mismatch, modified submodule, existing path collision or failed download; never overwrite or silently update to latest. Do not run `npx`, upstream install/validation scripts, or recursive unrelated submodule updates. No new paid service is needed for these Markdown files; model/API usage is still subject to the host's existing costs and permissions.

Local initialization is NOT proven by a remote gitlink. Start a fresh supported agent session in that checkout and ask it to identify the loaded core, chosen adapter, pinned upstream commit and current controller authority. It must read those files rather than echo a remembered claim. Record that result in the existing work item. Cloud ChatGPT may explicitly read the versioned files through a connected GitHub tool, but this package does not install a global personal ChatGPT plugin or modify another machine.

## Apply to another business

Copy the generic `skills/business-operations` directory and use the same pinned upstream dependency in the destination project's existing repo. Fill the blank profile from that business's authorized sources. Its entrypoint loads that profile, not the source company's adapter. Keep credentials and private evidence out of the portable package. Do not copy the source project's authority files or client facts. On an agent that uses a different discovery folder, point its existing skill mechanism at the same `SKILL.md`; do not invent universal host support.

## Updates and rollback

No auto-update. Review upstream diffs and changed permissions/dependencies, test the affected workflows, then update the gitlink and lock file together in one reviewed change. Test generic rules in more than one business context before generalizing a project result. Keep local lessons in the adapter until review supports promotion.

Before adoption, rollback is simply leaving the review branch unmerged. After adoption, revert this integration as a unit through the existing controller, preserving unrelated changes and local data. Removing a tracked gitlink does not authorize deleting a locally modified checkout. Never use broad recursive deletion as rollback.

## Verification limits

Unit tests prove gate behavior on supplied fixtures, not real receiver identity, production repair, article delivery, revenue impact or physical-machine installation. An independently read acknowledgment and actual host discovery are separate acceptance gates. This package intentionally does not repair a missing notification transport or create another executor.
