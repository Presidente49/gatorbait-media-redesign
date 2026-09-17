# GatorBait Production Toolchain

## Objective

Give the single GatorBait controller access to the full production toolbox while keeping one decision-maker. Tools are selected by job, not by habit. No editor, model or automation becomes an independent production owner.

## Core rule

`one controller -> choose one primary tool -> smallest necessary edit -> verify -> publish/record`

Do not send the same asset through every available editor. Use the lightest tool that can produce the required result at the required quality.

## Tool ladder

### 1. Restream Clips — default post-show engine

Use for the normal prior-night workflow when Restream has already generated clips.

Best for:

- automatic highlight discovery;
- vertical reframing;
- captions;
- quick social-ready clips;
- direct Clips-menu publishing to connected social destinations;
- fast morning distribution.

Controller responsibilities remain: verify title, guest name, context, owning show identity, destination, duplicate state and publication result.

### 2. vidIQ — premium social cut

Use selectively for the strongest moments when a second-stage social edit can materially improve performance.

Best for:

- tighter social-first cuts;
- premium vertical presentation;
- stronger hook timing;
- polished burned-in captions;
- Shorts/Reels-specific treatment;
- custom clip extraction when Restream missed a key moment.

Normal target: 0–2 premium clips per show, not the full show.

### 3. Descript — transcript-driven spoken-word editor

Use when language and edit precision matter more than graphics polish.

Best for:

- transcript-based trimming;
- removing filler/false starts;
- precise interview cleanup;
- caption/transcript correction;
- preparing a clean spoken-word master;
- Restream <-> Descript handoff when available.

### 4. Final Cut Pro — high-touch local finishing

Final Cut Pro is the preferred local professional editor when a clip, feature, promo or package needs manual broadcast-level finishing beyond the automated tools.

Best for:

- multicam or complex timeline edits;
- custom sound mix;
- advanced pacing;
- manual crop/keyframe work;
- color correction;
- bespoke intros/outros/lower thirds;
- longer feature packages;
- export masters for premium campaigns or archival use.

Because Final Cut Pro runs on the local Mac, use it only when the controller is operating in an environment that can actually hand off to or automate the local editor. A cloud/chat controller should create the edit brief, timestamps, asset manifest and output specification rather than pretending the local edit has happened.

### 5. Adobe Premiere Pro — optional gap-filler, not a default dependency

Do not add or pay for Premiere merely because it is another professional editor. Consider it only when there is a concrete job Final Cut Pro, Descript and the existing stack cannot handle efficiently, such as:

- required Adobe project interchange/collaboration;
- a specific Premiere/After Effects workflow;
- a contractor/editor requires an Adobe-native project;
- a verified production capability gap.

Any new paid subscription or software installation requires owner approval.

## Open-source/local automation candidates

### Preferred pilot: `DareDev256/fcp-mcp-server`

This is the best-fit candidate discovered for connecting the controller to Final Cut Pro without turning Final Cut into another autonomous agent.

Why it fits:

- exposes Final Cut timeline work through MCP/FCPXML;
- reads, edits and generates structured timelines;
- supports markers, roles, transcript-driven work, pacing/QC and rough-cut generation;
- can push FCPXML into a running Final Cut Pro through Apple-supported document import behavior;
- uses non-destructive XML round-trips rather than patching the Final Cut binary;
- MIT licensed;
- explicitly separates structured/batch editing from creative visual judgment.

Important limitation: Apple does not provide a fully programmatic Final Cut timeline export path, so a true round-trip still has a manual/export boundary unless another approved local bridge safely solves it.

#### Pilot gate

Do **not** connect this repo to a real GatorBait production library first.

Pilot sequence:

1. inspect/pin a specific release or commit;
2. review dependencies and permissions;
3. install only on the local Mac with owner approval;
4. create a throwaway Final Cut library/project;
5. test read-only FCPXML analysis first;
6. generate one harmless duplicate/rough-cut timeline;
7. push/import only into the throwaway library;
8. verify the timeline manually in Final Cut;
9. test rollback/removal and local logs;
10. only then consider allowing the controller to use it on copies of real projects.

The controller must never treat an XML write or Apple event as proof the edit is correct; rendered/timeline verification remains separate.

### Secondary utility: `WyattBlue/auto-editor`

Useful for deterministic mechanical editing and NLE interchange rather than editorial judgment.

Useful capabilities include:

- automatic silence/audio/motion-based cutting;
- timeline generation;
- export to Final Cut Pro;
- export to Adobe Premiere Pro;
- export to DaVinci Resolve and other NLEs;
- clip-sequence output;
- transcript/Whisper-related command-line workflows.

Potential jobs for GatorBait:

- mechanically clean long recordings before a manual feature edit;
- create a rough FCP timeline from deterministic audio rules;
- create Premiere/FCP interchange when needed;
- batch utility work that should not consume model reasoning.

Do not let auto-editor decide what is editorially important. It is a deterministic media utility behind the controller.

Licensing note: repository source is public-domain/Unlicense, while packaged/current product behavior can include separate licensing or rendering limits. Confirm the exact installation/build path and current terms before adopting it operationally.

### Useful references, not primary installs

- **CommandPost** — mature Final Cut workflow automation and accessibility/Lua tooling; potentially useful as a reference or later bridge, but it introduces macOS Accessibility/UI-control permissions and a larger automation surface.
- **PySceneDetect** — strong deterministic scene/cut detection library for batch analysis; useful if we later need local visual cut detection outside an NLE.
- **Remotion** — powerful programmatic branded video generation, especially for reusable graphics/templates, but it is a separate rendering framework and has its own license considerations. Add only if we have a real repeatable graphics/video-template job that current tools do not cover.
- **Final Cut Pro AutoCaption** — interesting FCPXML caption workflow reference; lower priority because Restream, vidIQ and Descript already cover captions well for our main social workflow.

Avoid production approaches that patch or modify the Final Cut Pro application binary merely to gain deeper control. Stability across Final Cut updates is more important than maximum automation depth.

## Other production capabilities

The controller may use other already-authorized tools when they clearly fit a bounded job, including image/thumbnail generation, Wix Media Manager, social publishing, analytics and local command-line media utilities when present. Their presence does not override the tool ladder or one-writer rule.

## Selection policy

Choose the primary lane with this order:

1. **Can Restream's waiting clip ship after metadata verification?** -> use Restream.
2. **Would a stronger social cut materially improve a top moment?** -> vidIQ PREMIUM lane.
3. **Does the edit depend on transcript/spoken-word precision?** -> Descript.
4. **Does it require structured timeline automation or repeatable Final Cut batch work?** -> consider the pinned `fcp-mcp-server` local pilot once approved/installed.
5. **Does it require high-touch manual professional finishing?** -> Final Cut Pro.
6. **Is there a deterministic mechanical cut/interchange job?** -> consider `auto-editor` once approved/installed.
7. **Is there a proven Adobe-specific gap?** -> propose Premiere; do not install/buy automatically.

Prefer one tool. A chain of tools is justified only when each step has a distinct job.

## Local handoff contract

When a local Mac editor is required, the controller should produce a deterministic handoff packet:

- source show/recording ID;
- exact source asset/path when available locally;
- in/out timestamps;
- guest/speaker names;
- verified title;
- objective and hook;
- target aspect ratio/resolution/frame rate;
- caption requirement;
- audio requirement;
- branding/lower-third requirement;
- destination platform/page;
- output filename;
- verification checklist.

The controller records the job as `LOCAL_EDIT_REQUIRED` until an output file is observed and verified. It must not mark the edit complete merely because instructions were generated.

## Output standards

### Social vertical

- 9:16;
- readable safe-zone captions;
- strong first seconds;
- guest identity correct;
- no misleading context loss;
- destination-specific title/caption.

### Broadcast / website horizontal

- normally 16:9;
- preserve source quality where practical;
- clean audio;
- correct show branding;
- no unnecessary re-encode generations;
- canonical show/recap destination recorded.

## Cost discipline

Use tools already paid for or connected before adding a new subscription. The controller should treat additional software cost as a business decision, not an implementation shortcut.

## Learning loop

Track which lane produced each published asset (`RESTREAM`, `VIDIQ`, `DESCRIPT`, `FCP_MCP`, `FINAL_CUT`, `AUTO_EDITOR`, `OTHER`) and compare performance only across reasonably similar content. Promote a tool preference after repeated evidence, not one viral result.
