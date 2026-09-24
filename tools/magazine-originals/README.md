# Original magazine tools — native intake, not adapters

Owner direction and acceptance: issue #3 comment 5821906293. This isolated library keeps complete, commit-pinned upstream repositories and their original licenses. Each `upstream/` entry is a Git submodule, not a rewritten skill summary. This branch does not deploy a site, send email, or change the accepted magazine.

## Obtain originals

From a checkout of this branch, `git submodule update --init --recursive -- tools/magazine-originals/upstream` materializes all original source trees. Alternatively run `python3 tools/magazine-originals/run.py ingest --workspace /a/new/local/folder`; that clones every upstream repo and its submodules, checks the pinned HEAD and preserves the original tree. No existing directory is reset.

## Install and run native examples

Prerequisites: Git, Python 3.11+, Node 22.12+, Cargo/Rust and Chrome. The independent PDF checker uses pypdf. These prerequisites are not silently installed system-wide. Run `python3 tools/magazine-originals/run.py run --workspace /a/new/local/folder`. This downloads originals, makes separate build copies, runs native commands and records source revisions, real command exits, output hashes and failures.

- Colorlib: original npm dependencies, original build script, all template outputs; actual templates 4/24 viewed in Chromium.
- Zine: native Cargo installation from unchanged source, `zine new`, then `zine build`.
- Baoyu Design: the author's recommended Vercel skills installer, full leaf skill and sibling resources, original directory integrity and actual CLI discovery. No paid/native Claude model execution is implied by installation.
- Paged.js: original npm build and browser polyfill pagination. Its original CLI is a separate companion checkout and native PDF test. HEAD engine is beta; CLI's dependency may be a different version. Do not conceal this distinction.
- Vivliostyle: the documented npm CLI installation, version pinned to 11.3.3, native PDF export. AGPL-3.0, not MIT. Keep the source/license available; no proprietary/network integration is approved by a local trial.

All npm dependencies/lockfiles stay in work copies. `reports/intake.json` and numbered logs report real outcomes; failures are not auto-patched. Browser sandbox is not disabled. Library sources, sample outputs and native-host activation are separate stages. A test runner is ephemeral and does not install anything on Brenden's Mac.

## Use after installation

Open `.lab/work/colorlib/index.html` for the original template gallery, or run its documented `npm run dev -- --no-open` in that work directory. Use the Zine executable under `runtime/zine/bin` with its generated `work/zine-demo` project. Load the full Baoyu skill from `work/design-host/.claude/skills/baoyu-design/SKILL.md` in the actual authorized host agent and follow its original entry, methodology and appropriate built-in skills. Use Paged.js/its CLI and Vivliostyle independently; compare results before choosing an export engine.

This is not a substitute UI for the originals. A native host must recheck tool paths and record its own installation/first-use results. No global harness configuration, live Wix integration, member-access change or campaign send is performed.

## Boundaries

Do not expose a full paid issue as a public development fixture. Do not pass publisher account secrets into vendor builds. Do not upload node_modules, font binaries or credentials. Do not promote demo stock imagery or placeholder copy into GatorBait journalism. Library acquisition is not security or inbox certification. LaravelMail's unlicensed candidate stays on hold. Preserve issue #30 and all existing task schedules.
