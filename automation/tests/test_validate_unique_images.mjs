import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { spawnSync } from 'node:child_process';

const script = path.resolve('automation/newsletter/validate-unique-images.mjs');
const sameBytesOneLine = 'data:image/png;base64,aGVsbG8=';
const sameBytesWrappedUrlSafe = 'data:image/jpeg;base64,aG Vs\nbG8';
const differentBytes = 'data:image/png;base64,d29ybGQ=';

async function runFixture(images) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'gatorbait-newsletter-qc-'));
  const fixture = path.join(directory, 'issue.mjml');
  const markup = `<mjml><mj-body>${images.map((src) => `<mj-image src="${src}" />`).join('')}</mj-body></mjml>`;
  try {
    await writeFile(fixture, markup, 'utf8');
    return spawnSync(process.execPath, [script, fixture], {
      encoding: 'utf8'
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test('rejects byte-identical inline image payloads with different data-URI metadata', async () => {
  const result = await runFixture([sameBytesOneLine, sameBytesWrappedUrlSafe]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Duplicate newsletter image/);
  assert.match(result.stderr, /inline:sha256:/);
});

test('accepts distinct inline image payloads', async () => {
  const result = await runFixture([sameBytesOneLine, differentBytes]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /2 image slots \/ 2 unique images/);
});
