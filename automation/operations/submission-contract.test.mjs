import test from 'node:test';
import assert from 'node:assert/strict';
import { DryRunDesk } from './submission-contract.mjs';

const writer = { trusted: true, id: 'synthetic-writer', byline: 'Fixture Writer' };
const event = { sourceKey: 'fixture-message/part-1', storyKey: 'fixture-story', title: 'Fixture title', body: 'Original submitted copy.', expectedRevision: 0 };
const checks = { completeCopy: true, factsVerified: true, rightsVerified: true, mediaPermanent: true, editorialPassed: true, highImpact: false, ambiguousFacts: false };
const gates = { publicationAuthorized: true, blogAlertsInactive: true, targetRevisionVerified: true };
const complete = (desk, storyId, claim, result) => desk.recordPublication(storyId, claim.operationKey, { ...result, attemptKey: claim.attemptKey });
const published = { outcome: 'published', providerVerified: true, publicVerified: true, id: 'fixture-wix-id', url: 'https://www.gatorbaitmedia.com/post/fixture-story' };

test('message replay and repeated copy deduplicate without losing revisions or bylines', () => {
  const desk = new DryRunDesk();
  const first = desk.receive(event, writer);
  assert.equal(desk.receive(event, writer).outcome, 'duplicate');
  assert.equal(desk.receive({ ...event, sourceKey: 'fixture-repeated-message', expectedRevision: 1 }, writer).outcome, 'duplicate');
  assert.equal(desk.receive({ ...event, sourceKey: 'fixture-revision', expectedRevision: 1, body: 'Revised submitted copy.' }, writer).revision, 2);
  const story = desk.inspect(first.storyId);
  assert.deepEqual(story.revisions.map((r) => r.body), ['Original submitted copy.', 'Revised submitted copy.']);
  assert.ok(story.revisions.every((r) => r.byline === writer.byline));
  story.revisions[0].body = 'Caller mutation';
  assert.equal(desk.inspect(first.storyId).revisions[0].body, event.body);
  assert.throws(() => desk.qc(first.storyId, 1, checks), /Stale/);
});

test('untrusted sender, conflicting delivery identity, stale revision and byline changes fail closed', () => {
  const desk = new DryRunDesk();
  assert.throws(() => desk.receive(event, { ...writer, trusted: false }), /Untrusted/);
  desk.receive(event, writer);
  assert.throws(() => desk.receive({ ...event, body: 'Changed' }, writer), /Source identity conflict/);
  assert.throws(() => desk.receive({ ...event, sourceKey: 'new', body: 'Changed' }, writer), /Revision conflict/);
  assert.throws(() => desk.receive({ ...event, sourceKey: 'new' }, { ...writer, byline: 'Wrong writer' }), /Byline/);
});

test('equivalent asset metadata deduplicates regardless of object key order', () => {
  const desk = new DryRunDesk();
  desk.receive({ ...event, assets: [{ id: 'fixture-photo', credit: 'Fixture credit' }] }, writer);
  assert.equal(desk.receive({ ...event, sourceKey: 'another-delivery', expectedRevision: 1, assets: [{ credit: 'Fixture credit', id: 'fixture-photo' }] }, writer).outcome, 'duplicate');
});

test('rights, factual ambiguity, high-impact and incomplete evidence block publication', () => {
  for (const override of [{ rightsVerified: false }, { factsVerified: false }, { mediaPermanent: false }, { highImpact: true }, { ambiguousFacts: true }, { editorialPassed: undefined }, { highImpact: undefined }]) {
    const desk = new DryRunDesk(), { storyId } = desk.receive(event, writer);
    assert.equal(desk.qc(storyId, 1, { ...checks, ...override }).status, 'held');
    assert.throws(() => desk.beginPublication(storyId, 1, gates), /QC-ready/);
  }
  for (const gate of Object.keys(gates)) {
    const desk = new DryRunDesk(), { storyId } = desk.receive(event, writer);
    desk.qc(storyId, 1, checks);
    assert.throws(() => desk.beginPublication(storyId, 1, { ...gates, [gate]: false }), /gate held/);
  }
});

test('proven failed publication retries once with the same key and never marks social ready', () => {
  const desk = new DryRunDesk(), { storyId } = desk.receive(event, writer);
  desk.qc(storyId, 1, checks);
  const first = desk.beginPublication(storyId, 1, gates);
  const receipt = complete(desk, storyId, first, { outcome: 'failed', confirmedNoWrite: true });
  assert.deepEqual(receipt, { status: 'failed', canonical: null, socialOwner: null });
  desk.qc(storyId, 1, checks);
  const second = desk.beginPublication(storyId, 1, gates);
  assert.equal(second.operationKey, first.operationKey);
  complete(desk, storyId, second, { outcome: 'failed', confirmedNoWrite: true });
  desk.qc(storyId, 1, checks);
  assert.throws(() => desk.beginPublication(storyId, 1, gates), /budget/);
});

test('unknown/accepted writes require reconciliation; verified revision updates one canonical story', () => {
  const desk = new DryRunDesk(), { storyId } = desk.receive(event, writer);
  desk.qc(storyId, 1, checks);
  const first = desk.beginPublication(storyId, 1, gates);
  assert.throws(() => desk.beginPublication(storyId, 1, gates), /QC-ready/);
  assert.equal(complete(desk, storyId, first, { outcome: 'accepted' }).status, 'unknown');
  assert.throws(() => desk.qc(storyId, 1, checks), /reopen/);
  assert.throws(() => desk.receive({ ...event, sourceKey: 'revision', body: 'Update', expectedRevision: 1 }, writer), /Reconcile/);
  assert.equal(complete(desk, storyId, first, published).socialOwner, 'Muse');
  desk.receive({ ...event, sourceKey: 'revision', body: 'Update', expectedRevision: 1 }, writer);
  desk.qc(storyId, 2, checks);
  const update = desk.beginPublication(storyId, 2, gates);
  assert.equal(update.action, 'update');
  assert.equal(update.canonical.id, published.id);
  assert.throws(() => complete(desk, storyId, update, { ...published, id: 'duplicate-id' }), /identity conflict/);
  assert.equal(complete(desk, storyId, update, published).status, 'published');
});


test('late attempt-one completions cannot end attempt two or unlock a new revision', () => {
  const desk = new DryRunDesk(), { storyId } = desk.receive(event, writer);
  const noWrite = { outcome: 'failed', confirmedNoWrite: true };
  desk.qc(storyId, 1, checks);
  const first = desk.beginPublication(storyId, 1, gates);
  complete(desk, storyId, first, noWrite);
  desk.qc(storyId, 1, checks);
  const second = desk.beginPublication(storyId, 1, gates);
  const active = desk.inspect(storyId);
  for (const result of [noWrite, published, { outcome: 'accepted' }]) {
    assert.throws(() => complete(desk, storyId, first, result), /Stale publication attempt/);
    assert.deepEqual(desk.inspect(storyId), active);
  }
  assert.equal(second.operationKey, first.operationKey, 'retry keeps its stable idempotency key');
  assert.equal(typeof second.attemptKey, 'string');
  assert.notEqual(second.attemptKey, first.attemptKey, 'retry has a different completion fence');
  assert.throws(() => desk.recordPublication(storyId, second.operationKey, noWrite), /Stale publication attempt/);
  assert.throws(() => desk.receive({ ...event, sourceKey: 'blocked-revision', expectedRevision: 1, body: 'New copy' }, writer), /Reconcile/);
  assert.throws(() => desk.qc(storyId, 1, checks), /reopen/);
  assert.equal(complete(desk, storyId, second, { outcome: 'accepted' }).status, 'unknown');
  const unknown = desk.inspect(storyId);
  assert.throws(() => complete(desk, storyId, first, noWrite), /Stale publication attempt/);
  assert.deepEqual(desk.inspect(storyId), unknown);
  assert.equal(complete(desk, storyId, second, published).status, 'published');
});

test('distinct deliveries can intentionally revert A to B to A without losing history or bylines', () => {
  const desk = new DryRunDesk(), first = desk.receive(event, writer);
  desk.qc(first.storyId, 1, checks);
  complete(desk, first.storyId, desk.beginPublication(first.storyId, 1, gates), published);
  const change = { ...event, sourceKey: 'fixture-copy-b', expectedRevision: 1, body: 'Changed copy B.' };
  const second = desk.receive(change, writer);
  desk.qc(first.storyId, 2, checks);
  const revert = { ...event, sourceKey: 'fixture-intentional-revert', expectedRevision: 2 };
  const third = desk.receive(revert, writer);
  assert.equal(third.outcome, 'revision');
  assert.equal(third.revision, 3);
  assert.equal(third.digest, first.digest);
  const story = desk.inspect(first.storyId);
  assert.deepEqual(story.revisions.map(row => row.body), [event.body, change.body, event.body]);
  assert.ok(story.revisions.every(row => row.byline === writer.byline));
  assert.equal(story.qc, null, 'revert needs new QC');
  assert.equal(story.canonical.id, published.id);
  assert.throws(() => desk.qc(first.storyId, 2, checks), /Stale/);
  for (const [delivery, receipt] of [[event, first], [change, second], [revert, third]]) {
    assert.deepEqual(desk.receive(delivery, writer), { outcome: 'duplicate', storyId: receipt.storyId, revision: receipt.revision, digest: receipt.digest });
  }
  assert.equal(desk.inspect(first.storyId).revisions.length, 3, 'old delivery replays do not change current copy');
  desk.qc(first.storyId, 3, checks);
  const current = desk.inspect(first.storyId);
  assert.equal(desk.receive({ ...revert, sourceKey: 'fixture-current-copy', expectedRevision: 3 }, writer).revision, 3);
  assert.deepEqual(desk.inspect(first.storyId), current, 'repeated current copy does not reopen QC');
  const claim = desk.beginPublication(first.storyId, 3, gates);
  assert.equal(claim.action, 'update');
  assert.equal(claim.canonical.id, published.id);
  assert.equal(complete(desk, first.storyId, claim, published).status, 'published');
});

test('a new delivery must match current revision before copy dedup; registered replays stay idempotent', () => {
  const desk = new DryRunDesk(), first = desk.receive(event, writer);
  const fresh = { ...event, sourceKey: 'fixture-new-current-copy' };
  assert.throws(() => desk.receive(fresh, writer), /Revision conflict/);
  const receipt = desk.receive({ ...fresh, expectedRevision: 1 }, writer);
  assert.equal(receipt.outcome, 'duplicate');
  assert.equal(receipt.revision, 1);
  desk.receive({ ...event, sourceKey: 'fixture-next-revision', expectedRevision: 1, body: 'Next copy.' }, writer);
  assert.throws(() => desk.receive({ ...event, sourceKey: 'fixture-stale-history', expectedRevision: 1 }, writer), /Revision conflict/);
  assert.equal(desk.receive(fresh, writer).revision, first.revision);
  assert.equal(desk.inspect(first.storyId).revisions.at(-1).body, 'Next copy.');
});
