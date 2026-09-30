// One tokenizer shared by build-index.mjs (index time) and worker.mjs (query time) so scores line up.
const STOP = new Set('a an and are as at be by for from has have how in is it of on or that the this to was what when where which who why will with did does do gators florida uf'.split(' '));
export function tokens(s) {
  return String(s || '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').split(' ')
    .filter((w) => w && !STOP.has(w)).map((w) => (w.length > 4 && w.endsWith('s') ? w.slice(0, -1) : w));
}
