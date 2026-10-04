# GatorBait house voice: read like a person wrote it

Every story Jarvis or an agent writes runs through this before it publishes:

```
python3 tools/voice/gb_voice.py story.txt
```

The script runs two checks:
- the vendored MIT checker (`check.py`, `markers.json`, from [humzakt/ai-writing-markers](https://github.com/humzakt/ai-writing-markers), which distills Wikipedia's "Signs of AI writing" guide);
- the GatorBait house rules below.

## Text
- **Quotes:** use straight quotes and apostrophes (`"` and `'`). Writers type them that way into Wix, and curly quotes on every line read as machine-typeset.
- **Rhythm:** mix sentence lengths. A two-word sentence next to a 30-word one. Aim for burstiness of 0.65 or higher on the checker.
- **No rule of three:** don't stack three parallel items unless there really are three.
- **No stock lines.** Never write:
  - "It's not X, it's Y."
  - "Here's the thing" or "Here's how."
  - "The lessons are plain."
  - "That's the blueprint in one sentence."
  - "In the end."
  - Any closer that sums the story back up for the reader.
- **Em-dashes:** at most one per story. Use commas or periods.
- **No signposting:** no "Let's," "Ultimately," or "Notably."
- **Specifics over abstractions:** name the play, the quarter and the yard line, not "momentum" or "the narrative."
- **Opinion:** only in columns and labeled grades, in the writer's voice. Beat stories stay straight.

## Rich formatting (Wix rich content)
Use the editor's real formatting, the way a desk editor would.
- **Headings:**
  - None in news stories under 700 words.
  - Grade and list pieces may use short, plain-word headings.
  - Never number them like "Step one:".
- **Pull quote:** one per story, the best quote, as a `BLOCKQUOTE` node. Don't repeat it word for word in the body.
- **Bold run-ins:** list formats only, e.g. **Quarterback: C-.** with the text following in the same paragraph.
- **Links:** link to related GatorBait stories with a LINK decoration on a few words. No "Read more" lines.
- **Inline photo:** one per story, with a credit caption, when we have a real one.
- **Sourcing:** one italic line at the end instead of an "Editor's note" heading. For example: *Statistics from ESPN and UF. Quotes from the Gainesville Sun and Orlando Sentinel.*

## What this is not
This doesn't fake authorship. Bylines stay honest: the writer's name, or Brenden Martin for staff work. The rules exist so our copy reads like good sports writing instead of a template.
