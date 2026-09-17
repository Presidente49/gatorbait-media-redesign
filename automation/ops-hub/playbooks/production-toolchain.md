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

## Other production capabilities

The controller may use other already-authorized tools when they clearly fit a bounded job, including image/thumbnail generation, Wix Media Manager, social publishing, analytics and local command-line media utilities when present. Their presence does not override the tool ladder or one-writer rule.

## Selection policy

Choose the primary lane with this order:

1. **Can Restream's waiting clip ship after metadata verification?** -> use Restream.
2. **Would a stronger social cut materially improve a top moment?** -> vidIQ PREMIUM lane.
3. **Does the edit depend on transcript/spoken-word precision?** -> Descript.
4. **Does it require high-touch manual professional finishing?** -> Final Cut Pro.
5. **Is there a proven Adobe-specific gap?** -> propose Premiere; do not install/buy automatically.

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

Track which lane produced each published asset (`RESTREAM`, `VIDIQ`, `DESCRIPT`, `FINAL_CUT`, `OTHER`) and compare performance only across reasonably similar content. Promote a tool preference after repeated evidence, not one viral result.
