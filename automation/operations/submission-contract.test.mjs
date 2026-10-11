import test from 'node:test';
import assert from 'node:assert/strict';
import { DryRunDesk } from './submission-contract.mjs';

const writer = { trusted: true, id: 'synthetic-writer', byline: 'Fixture Writer' };
const event = { sourceKey: 'fixture-message/part-1', storyKey: 'fixture-story', title: 'Fixture title', body: 'Original submitted copy.', expectedRevision: 0 };
const checks = { completeCopy: true, factsVerified: true, rightsVerified: true, mediaPermanent: true, editorialPassed: true, highImpact: false, ambiguousFacts: false };
const gates = { publicationAuthorized: true, blogAlertsInactive: true, targetRevisionVerified: true };
const published = { outcome: 'published', providerVerified: true, publicVerified: true, id: 'fixture-wix-id', url: 'https://www.gatorbaitmedia.com/post/fixture-story' };

test('message replay and repeated copy deduplicate without losing revisions or bylines', () => {
  const desk = new DryRunDesk();
  const first = desk.receive(event, writer);
  assert.equal(desk.receive(event, writer).outcome, 'duplicate');
  assert.equal(desk.receive({ ...event, sourceKey: 'fixture-repeated-message' }, writer).outcome, 'duplicate');
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
  assert.equal(desk.receive({ ...event, sourceKey: 'another-delivery', assets: [{ credit: 'Fixture credit', id: 'fixture-photo' }] }, writer).outcome, 'duplicate');
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
  const receipt = desk.recordPublication(storyId, first.operationKey, { outcome: 'failed', confirmedNoWrite: true });
  assert.deepEqual(receipt, { status: 'failed', canonical: null, socialOwner: null });
  desk.qc(storyId, 1, checks);
  const second = desk.beginPublication(storyId, 1, gates);
  assert.equal(second.operationKey, first.operationKey);
  desk.recordPublication(storyId, second.operationKey, { outcome: 'failed', confirmedNoWrite: true });
  desk.qc(storyId, 1, checks);
  assert.throws(() => desk.beginPublication(storyId, 1, gates), /budget/);
});

test('unknown/accepted writes require reconciliation; verified revision updates one canonical story', () => {
  const desk = new DryRunDesk(), { storyId } = desk.receive(event, writer);
  desk.qc(storyId, 1, checks);
  const first = desk.beginPublication(storyId, 1, gates);
  assert.throws(() => desk.beginPublication(storyId, 1, gates), /QC-ready/);
  assert.equal(desk.recordPublication(storyId, first.operationKey, { outcome: 'accepted' }).status, 'unknown');
  assert.throws(() => desk.qc(storyId, 1, checks), /reopen/);
  assert.throws(() => desk.receive({ ...event, sourceKey: 'revision', body: 'Update', expectedRevision: 1 }, writer), /Reconcile/);
  assert.equal(desk.recordPublication(storyId, first.operationKey, published).socialOwner, 'Muse');
  desk.receive({ ...event, sourceKey: 'revision', body: 'Update', expectedRevision: 1 }, writer);
  desk.qc(storyId, 2, checks);
  const update = desk.beginPublication(storyId, 2, gates);
  assert.equal(update.action, 'update');
  assert.equal(update.canonical.id, published.id);
  assert.throws(() => desk.recordPublication(storyId, update.operationKey, { ...published, id: 'duplicate-id' }), /identity conflict/);
  assert.equal(desk.recordPublication(storyId, update.operationKey, published).status, 'published');
});
