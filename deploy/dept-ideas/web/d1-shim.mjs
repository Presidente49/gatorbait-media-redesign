// In-memory D1 shim over Node's built-in SQLite (node:sqlite, Node 22+). Implements the D1Database surface the
// Worker uses: prepare().bind().first()/all()/run(), batch(), exec(). Same SQLite engine family as D1, so the
// ON CONFLICT ... RETURNING and CHECK constraints in schema.sql run as written.
import { DatabaseSync } from 'node:sqlite';

class Stmt {
  constructor(db, sql, params = []) { this.db = db; this.sql = sql; this.params = params; }
  bind(...params) { return new Stmt(this.db, this.sql, params); }
  #rows() { return this.db.prepare(this.sql).all(...this.params).map((r) => Object.assign({}, r)); }
  async first(col) { const r = this.#rows()[0]; if (!r) return null; return col === undefined ? r : r[col]; }
  async all() { const results = this.#rows(); return { results, success: true, meta: { rows_read: results.length } }; }
  async run() { const info = this.db.prepare(this.sql).run(...this.params); return { success: true, meta: { changes: Number(info.changes), last_row_id: Number(info.lastInsertRowid) } }; }
  async raw() { return this.#rows().map((r) => Object.values(r)); }
}

export function createD1(schemaSql) {
  const db = new DatabaseSync(':memory:');
  if (schemaSql) db.exec(schemaSql);
  return {
    prepare: (sql) => new Stmt(db, sql),
    async batch(stmts) { db.exec('BEGIN'); try { const out = []; for (const s of stmts) out.push(await s.all()); db.exec('COMMIT'); return out; } catch (e) { db.exec('ROLLBACK'); throw e; } },
    async exec(sql) { db.exec(sql); return { count: sql.split(';').filter((s) => s.trim()).length, duration: 0 }; },
    _raw: db,
  };
}
