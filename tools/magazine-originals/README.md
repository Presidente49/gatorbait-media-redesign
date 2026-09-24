# Magazine Original Tools — native download and setup package

This package downloads the COMPLETE original repositories at recorded commits.
It does not substitute rewritten prompts, imitation renderers, or summaries.
It is the installer/test harness, not a ZIP of the vendor repositories.

Repository branch: Presidente49/gatorbait-media-redesign
  tools/magazine-originals-20260924
Tool folder: tools/magazine-originals
Coordination: issue #3, original-source scope 5821906293.

## What is preserved

Colorlib email-templates (MIT); Zine (Apache-2.0); Baoyu Design (MIT);
Paged.js engine and Paged.js CLI (MIT); Vivliostyle CLI (AGPL-3.0).
Full original source, documentation, licenses and submodules are cloned into
sources/. Separate work copies hold installed dependencies and generated output.
Originals are not reset, patched or overwritten. Existing workspaces are refused.

The code on GitHub uses commit-pinned Git submodules. GitHub's ordinary Download
ZIP does not populate those submodules. Use this downloader or native Git:

    git -c url.https://github.com/.insteadOf=git@github.com: submodule update --init --recursive -- tools/magazine-originals/upstream

The HTTPS configuration is per-command for public GitHub submodules. It does not
change account credentials or the original repositories' tracked configuration.

## Native host requirements

Git, Python 3, Node.js 22.12 or newer, npm, Cargo/Rust and Google Chrome.
The independent PDF checker requires pypdf. No system-level dependency installer
is run by this package. On a Mac, the existing Chrome application is detected.
A real authenticated coding-agent session is still needed to EXECUTE the Baoyu
skill. Installing/discovering the skill alone is not a model-generated design.

## Get all original sources (no package execution)

    python3 run.py ingest --workspace "$HOME/Magazine-Originals-Sources"

## Install and run isolated native examples

    python3 run.py run --workspace "$HOME/Magazine-Originals-Lab"

Use a new folder for each evidence run. This test installs packages and executes
vendor tools in that folder. A folder is not a security sandbox. Because the
Paged.js dependency trees have known audit findings, run the full validation only
in a disposable, non-sensitive test runtime. Review RESULTS.md before use on a
persistent host; source-only ingestion does not execute npm/Cargo vendor builds.
Do not feed personal data, credentials, customer lists or paid articles into the
technical fixtures. Native success does not certify dependency security.

## Native commands and outputs

Colorlib: npm ci; npm run build; its own npm run dev and generated gallery.
All original MJML sources, image assets, scripts and sample templates are retained.

Zine: cargo install --path [full source work copy] --root [private runtime];
zine new zine-demo; zine build. Its native zine serve remains the preview command.

Baoyu: original author's Vercel skills install path, skills@1.7.0, project-scoped
target claude-code. All leaf skill files are hash-compared to the upstream original.
Its original SKILL.md, methodology and task-specific files remain authoritative.

Paged.js: original npm build with Rollup's documented --bundleConfigAsCjs option
so its unchanged legacy JSON-import configuration works on modern Node.
Browser test uses the original compiled paged.polyfill.js, not an imitation.
Paged.js CLI is kept separately; its own runtime uses its separately resolved
Paged.js dependency. Native CLI PDF and original-engine PDF are tested separately.

Vivliostyle: documented @vivliostyle/cli@11.3.3 installation into a private prefix;
native vivliostyle build on the same two-page fixture. Its source and AGPL license
are preserved, not misrepresented as MIT or replaced by another PDF generator.

Reports: reports/intake.json; numbered logs; native PDFs and screenshots in output/.

## Boundaries

No Wix changes, publications, sends, new recurring schedule, spending, account
access, membership changes or production deployments. Keep a security hold on
flagged packages. Do not use npm audit fix blindly or alter vendor code to turn a
failure green. Sources and test artifacts are not a permanent installation on a
separate computer. The GitHub runner is temporary; your Mac has its own setup gate.

No fonts, vendor binaries, node_modules, credentials or private stories are shipped
in this setup package. Each upstream license stays with the original downloads.
