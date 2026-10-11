// Pure dry-run reference. No I/O, credentials, network, timers, publication or sends.
// A real adapter must implement the private atomic store described in README.md.
import { createHash } from 'node:crypto';

const copy = (value) => structuredClone(value);
const canonical = (value) => Array.isArray(value) ? value.map(canonical)
  : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])])) : value;
const hash = (value) => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
const required = (value, name) => {
  if (typeof value !== 'string' || !value.trim()) throw Error(`Missing ${name}`);
  return value;
};

export class DryRunDesk {
  #stories = new Map();
  #deliveries = new Map();

  receive(event, writer) {
    if (writer?.trusted !== true) throw Error('Untrusted writer');
    const writerId = required(writer.id, 'writer id');
    const byline = required(writer.byline, 'verified byline');
    const sourceKey = required(event.sourceKey, 'stable provider message/part key');
    const storyKey = required(event.storyKey, 'resolved logical story key');
    const title = required(event.title, 'title');
    const body = required(event.body, 'complete original body');
    const assets = copy(event.assets ?? []);
    if (!Array.isArray(assets)) throw Error('Invalid assets');
    const digest = hash({ title, body, assets, byline });
    const storyId = hash([writerId, storyKey]);
    const delivery = this.#deliveries.get(sourceKey);
    if (delivery) {
      if (delivery.digest !== digest || delivery.storyId !== storyId) throw Error('Source identity conflict');
      return { outcome: 'duplicate', ...copy(delivery) };
    }
    let story = this.#stories.get(storyId);
    if (story && story.byline !== byline) throw Error('Byline change requires review');
    const duplicate = story?.revisions.find((r) => r.digest === digest);
    if (duplicate) {
      const receipt = { storyId, revision: duplicate.revision, digest };
      this.#deliveries.set(sourceKey, receipt);
      return { outcome: 'duplicate', ...receipt };
    }
    if (event.expectedRevision !== (story?.revisions.length ?? 0)) throw Error('Revision conflict');
    if (story && ['publishing', 'unknown'].includes(story.status)) throw Error('Reconcile publication before revision');
    if (!story) story = { storyId, writerId, byline, revisions: [], canonical: null, status: 'received', attempts: 0 };
    const revision = story.revisions.length + 1;
    story.revisions.push({ revision, sourceKey, digest, title, body, assets, byline });
    story.status = 'received';
    story.qc = null;
    story.attempts = 0;
    this.#stories.set(storyId, story);
    const receipt = { storyId, revision, digest };
    this.#deliveries.set(sourceKey, receipt);
    return { outcome: revision === 1 ? 'received' : 'revision', ...receipt };
  }

  inspect(storyId) { return copy(this.#story(storyId)); }

  #story(storyId) {
    const story = this.#stories.get(storyId);
    if (!story) throw Error('Unknown story');
    return story;
  }

  qc(storyId, revision, checks) {
    const story = this.#story(storyId);
    if (revision !== story.revisions.length) throw Error('Stale QC revision');
    if (!['received', 'held', 'failed', 'ready'].includes(story.status)) throw Error('QC cannot reopen publication');
    const reasons = ['completeCopy', 'factsVerified', 'rightsVerified', 'mediaPermanent', 'editorialPassed']
      .filter((key) => checks[key] !== true);
    // Missing exception classification fails closed as well as a positive exception.
    if (checks.highImpact !== false) reasons.push('highImpact');
    if (checks.ambiguousFacts !== false) reasons.push('ambiguousFacts');
    story.qc = { revision, digest: story.revisions.at(-1).digest, reasons };
    story.status = reasons.length ? 'held' : 'ready';
    return { status: story.status, reasons: copy(reasons) };
  }

  beginPublication(storyId, revision, gates) {
    const story = this.#story(storyId);
    if (story.status !== 'ready' || revision !== story.revisions.length || story.qc?.revision !== revision) throw Error('Publication is not QC-ready');
    if (gates.publicationAuthorized !== true || gates.blogAlertsInactive !== true || gates.targetRevisionVerified !== true) throw Error('Publication gate held');
    if (story.attempts >= 2) throw Error('Retry budget exhausted');
    const operationKey = hash([storyId, revision, story.qc.digest]);
    story.status = 'publishing';
    story.operationKey = operationKey;
    story.attempts++;
    return { operationKey, action: story.canonical ? 'update' : 'create', canonical: copy(story.canonical), revision, byline: story.byline };
  }

  recordPublication(storyId, operationKey, result) {
    const story = this.#story(storyId);
    if (!['publishing', 'unknown'].includes(story.status) || story.operationKey !== operationKey) throw Error('No matching publication claim');
    if (result.outcome === 'published' && result.providerVerified === true && result.publicVerified === true) {
      const id = required(result.id, 'Wix post id');
      const url = required(result.url, 'canonical URL');
      if (!/^https:\/\/(www\.)?gatorbaitmedia\.com\/post\/[^?#]+$/.test(url)) throw Error('Invalid canonical URL');
      if (story.canonical && (story.canonical.id !== id || story.canonical.url !== url)) throw Error('Canonical identity conflict');
      story.canonical = { id, url };
      story.status = 'published';
    } else if (result.outcome === 'failed' && result.confirmedNoWrite === true) {
      story.status = 'failed';
    } else {
      // Timeout/accepted/unverified is NOT a retryable failure. Read the provider first.
      story.status = 'unknown';
    }
    return { status: story.status, canonical: copy(story.canonical), socialOwner: story.status === 'published' ? 'Muse' : null };
  }
}
