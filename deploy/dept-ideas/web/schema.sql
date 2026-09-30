-- Make the Call: score picks with a live crowd distribution.
-- D1 (SQLite). Applied to gatorbait-dev-make-the-call (9d7f90bc-8b98-4182-a4b0-69ab0e9ddc7b) on Sept. 30, 2026.
-- Times are ISO-8601 UTC strings; the Worker compares them as strings against Date.now().

CREATE TABLE IF NOT EXISTS games (
  id          TEXT PRIMARY KEY,                 -- ESPN event id from sports-live/scoreboard.json (401856708 = Florida at Missouri)
  away        TEXT NOT NULL,
  home        TEXT NOT NULL,
  fla_home    INTEGER NOT NULL DEFAULT 0,       -- 1 when Florida is the home team
  kickoff     TEXT NOT NULL,                    -- picks lock at this instant
  final_fla   INTEGER,                          -- filled after the final from the ESPN feed (draft feature, not built here)
  final_opp   INTEGER,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);

CREATE TABLE IF NOT EXISTS picks (
  game_id     TEXT NOT NULL REFERENCES games(id),
  voter       TEXT NOT NULL,                    -- sha-256 of the browser token; the token itself is never stored
  fla         INTEGER NOT NULL CHECK (fla BETWEEN 0 AND 99),
  opp         INTEGER NOT NULL CHECK (opp BETWEEN 0 AND 99),
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL,
  PRIMARY KEY (game_id, voter)
);
CREATE INDEX IF NOT EXISTS picks_by_game ON picks (game_id);

-- Fixed-window rate limits: one row per hashed IP prefix + route + minute. Expired rows are swept opportunistically.
CREATE TABLE IF NOT EXISTS rate_limits (
  bucket      TEXT PRIMARY KEY,
  n           INTEGER NOT NULL,
  expires     INTEGER NOT NULL                  -- epoch ms
);

INSERT OR IGNORE INTO games (id, away, home, fla_home, kickoff)
VALUES ('401856708', 'Florida', 'Missouri', 0, '2026-10-03T19:30:00Z');
