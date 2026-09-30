Real ESPN responses captured Sept. 29, 2026 through TinyFish fetch_content (this container cannot reach ESPN), then trimmed by automation/scoreboard_import.py:
- schedule.json: teams/57/schedule?season=2026&seasontype=2
- standings.json: apis/v2/.../standings?group=8&season=2026 (SEC)
- summary-401856699.json: summary?event=401856699 (Florida 52, Ole Miss 28)
- summary-401856708.json: summary?event=401856708 (Florida at Missouri, Oct. 3, pregame), saved Sept. 30, 2026 by deploy/dept-ideas/research/scout.mjs and trimmed with scoreboard_import.clean_summary; its header carries the opponent's record (Missouri 3-1) for next.opponentRecord.
No live-game payload was captured; the live tests derive a synthetic one from these files.
