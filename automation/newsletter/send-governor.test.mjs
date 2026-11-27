import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

// Execute the actual pasteable functions. All provider responses are synthetic;
// unexpected URLs/methods fail the test, and the VM has no network API.
const NOW = Date.parse('2026-11-27T15:00:00Z');
const DAY = 86_400_000;
const POST_URL = 'https://www.gatorbaitmedia.com/post/fixture-story';
const LABEL = 'custom.fixture-opt-in';
const HOLD = 'custom.gatorbait-re-opt-in-candidates';
const source = {
  governor: await readFile(new URL('./send-governor.js', import.meta.url), 'utf8'),
  presend: await readFile(new URL('./story-alert-presend.wix.js', import.meta.url), 'utf8'),
};

class FixedDate extends Date {
  constructor(...args) { super(...(args.length ? args : [NOW])); }
  static now() { return NOW; }
}

function campaigns(count = 20, { age = 60_000, delivered = 1000, bounced = 0, complained = 0 } = {}) {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(NOW - age - i * 1000).toISOString();
    return {
      campaignId: `fixture-campaign-${i + 1}`,
      title: `Distinct unrelated story ${i + 1}`,
      emailSubject: `Distinct unrelated story ${i + 1}`,
      visibilityStatus: 'PUBLISHED',
      distributionStatus: 'DISTRIBUTED',
      dateCreated: date,
      dateUpdated: date,
      publishingData: {
        datePublished: date,
        statistics: { emailCampaign: { delivered, bounced, complained } },
      },
    };
  });
}

async function run(which, options = {}) {
  const history = options.campaigns ?? campaigns();
  const calls = [];
  const contacts = Array.from({ length: 3 }, (_, i) => ({
    id: `fixture-contact-${i + 1}`,
    primaryInfo: { email: `fixture${i + 1}@example.invalid` },
    info: { labelKeys: { items: [LABEL, ...(options.hold && i === 0 ? [HOLD] : [])] } },
  }));
  const request = async input => {
    const url = new URL(input.url);
    const method = input.method;
    calls.push({ method, path: url.pathname, query: url.search, body: input.body });
    assert.equal(url.origin, 'https://www.wixapis.com');
    const allowReadPost = ['/automations-service/v2/automations/query', '/contacts/v4/contacts/query',
      '/email-marketing/v1/email-subscriptions/query'];
    assert.ok(method === 'GET' || method === 'POST' && allowReadPost.includes(url.pathname),
      `Unexpected mutation: ${method} ${url.pathname}`);
    let data;
    if (url.pathname === '/email-marketing/v1/account-details') {
      data = { accountDetails: { status: options.accountStatus ?? 'ACTIVE', rank: 'GOOD',
        quotaPeriod: { quotaUsage: { emails: 100 } } } };
    } else if (url.pathname === '/automations-service/v2/automations/query') {
      data = { automations: options.activeAlert ? [{ id: 'fixture-alert', name: 'Fixture alert',
        configuration: { status: 'ACTIVE' } }] : [] };
    } else if (url.pathname.startsWith('/automations-service/v2/automations/')) {
      data = { automation: { revision: '1', configuration: { status: options.activeAlert ? 'ACTIVE' : 'INACTIVE' } } };
    } else if (url.pathname === '/contacts/v4/labels') {
      data = { labels: [{ key: LABEL, legacyId: 'fixture-label-id' }] };
    } else if (url.pathname === '/contacts/v4/contacts/query') {
      const { filter, paging } = input.body.query;
      const all = filter['info.labelKeys']?.$hasAll;
      const rows = all ? contacts.filter(c => all.every(k => c.info.labelKeys.items.includes(k))) : contacts;
      const offset = paging.offset ?? 0;
      data = { contacts: rows.slice(offset, offset + paging.limit), pagingMetadata: { total: rows.length } };
    } else if (url.pathname === '/email-marketing/v1/email-subscriptions/query') {
      const emails = input.body.filter.email.$in;
      assert.ok(emails.length <= 30, 'Consent lookup batch exceeds documented size');
      data = { subscriptions: emails.filter((_, i) => !(options.missingSubscription && i === 0)).map((email, i) => ({
        email,
        subscriptionStatus: i === 0 ? options.subscriptionStatus ?? 'SUBSCRIBED' : 'SUBSCRIBED',
        deliverabilityStatus: i === 0 ? options.deliverabilityStatus ?? 'VALID' : 'VALID',
      })) };
    } else if (url.pathname === '/email-marketing/v1/campaigns') {
      data = { campaigns: history };
    } else if (url.pathname === '/email-marketing/v1/campaigns/statistics') {
      const ids = url.searchParams.getAll('campaignIds');
      data = { statistics: history.filter(c => ids.includes(c.campaignId)).map(c => ({
        campaignId: c.campaignId, email: c.publishingData.statistics.emailCampaign,
      })) };
    } else if (/^\/email-marketing\/v1\/campaigns\/fixture-campaign-\d+\/composer$/.test(url.pathname)) {
      const duplicate = options.duplicate && url.pathname.includes('/fixture-campaign-1/');
      data = { composer: { composerDataJson: duplicate ? JSON.stringify({ url: POST_URL,
        token: 'story_alert_fixture_story' }) : JSON.stringify({ title: `Unrelated ${url.pathname}` }) } };
    } else {
      assert.fail(`Unexpected mocked provider call: ${method} ${url.pathname}`);
    }
    return { data };
  };
  let code = source[which];
  if (which === 'presend') {
    code = code.replaceAll('custom.REPLACE-DAILY-NEWS-LABEL-KEY', LABEL)
      .replaceAll('REPLACE-SLUG', 'fixture-story');
    if (options.governorOk !== false) {
      assert.match(code, /governorOk:\s*false/);
      code = code.replace(/governorOk:\s*false/, 'governorOk: true');
    }
    // This config substitution exercises the full fixture label, without
    // changing any policy branch or expectation in the function under test.
    assert.match(code, /sampleSize:\s*90/);
    code = code.replace(/sampleSize:\s*90/, 'sampleSize: 0');
  }
  const fn = vm.runInNewContext(`(${code})`, { wix: { request }, Date: FixedDate },
    { filename: `${which}-under-test.js`, timeout: 1000 });
  const result = await fn();
  return { result, calls };
}

test('governor permits 20 healthy distinct same-day sends without a frequency exception', async () => {
  const { result } = await run('governor');
  assert.equal(result.ok, true, JSON.stringify(result.reasons));
  assert.equal(result.lastWeek.length, 20);
  assert.equal(result.reasons.length, 0);
  assert.equal(result.volume.perDayCap, null);
  assert.equal(result.volume.perWeekCap, null);
  assert.equal(result.volume.last24h, 20);
  assert.equal(result.volume.last7d, 20);
});

test('governor retains the non-ACTIVE account block before campaign reads', async () => {
  const { result, calls } = await run('governor', { accountStatus: 'WARNED' });
  assert.equal(result.ok, false);
  assert.match(result.reasons.join(' '), /WARNED/);
  assert.equal(calls.length, 1);
});

test('governor retains the active blog-alert block', async () => {
  const { result } = await run('governor', { activeAlert: true });
  assert.equal(result.ok, false);
  assert.match(result.reasons.join(' '), /Blog story-alert automation is ACTIVE/);
});

for (const [name, counts, reason] of [
  ['bounce', { delivered: 970, bounced: 30 }, /bounce rate/],
  ['complaint', { delivered: 1000, complained: 2 }, /complaint rate/],
]) {
  test(`governor still blocks an unhealthy seven-day ${name} rate`, async () => {
    const { result } = await run('governor', { campaigns: campaigns(20, counts) });
    assert.equal(result.ok, false);
    assert.match(result.reasons.join(' '), reason);
  });
}

test('governor excludes older-than-seven-day unhealthy sends from current health', async () => {
  const recent = campaigns();
  const old = campaigns(1, { age: 8 * DAY, delivered: 1, bounced: 999, complained: 1 })[0];
  old.campaignId = 'fixture-aged-campaign';
  const { result } = await run('governor', { campaigns: [...recent, old] });
  assert.equal(result.ok, true, JSON.stringify(result.reasons));
  assert.equal(result.lastWeek.length, 20);
  assert.equal(result.rates.bounce, 0);
  assert.equal(result.rates.complaint, 0);
});

test('story pre-send permits the same 20 sends while checking audience and every composer', async () => {
  const { result, calls } = await run('presend');
  assert.equal(result.pass, true, JSON.stringify(result.failed));
  assert.equal(result.volume.perDayCap, null);
  assert.equal(result.volume.perWeekCap, null);
  assert.equal(result.volume.last24h, 20);
  assert.equal(result.volume.last7d, 20);
  assert.equal(calls.filter(c => c.path.endsWith('/composer')).length, 20);
  const consent = calls.filter(c => c.path.endsWith('/email-subscriptions/query'));
  assert.equal(consent.reduce((n, c) => n + c.body.filter.email.$in.length, 0), 3);
  assert.doesNotMatch(JSON.stringify(result), /fixture\d+@example\.invalid|fixture-contact-/);
});

for (const [name, options, reason] of [
  ['failing governor verdict', { governorOk: false }, /send-governor returned ok:true/],
  ['unsubscribed fresh consent', { subscriptionStatus: 'UNSUBSCRIBED' }, /consent re-check/],
  ['inactive fresh deliverability', { deliverabilityStatus: 'INACTIVE' }, /consent re-check/],
  ['unknown subscription record', { missingSubscription: true }, /consent re-check/],
  ['HOLD label overlap', { hold: true }, /no member carries a hold/],
  ['already-sent matching story', { duplicate: true }, /duplicate check/],
  ['non-ACTIVE account', { accountStatus: 'WARNED' }, /email account ACTIVE/],
  ['active blog automation', { activeAlert: true }, /blog alert automations INACTIVE/],
]) {
  test(`story pre-send still blocks ${name}`, async () => {
    const { result } = await run('presend', options);
    assert.equal(result.pass, false);
    assert.match(result.failed.join(' '), reason);
  });
}

for (const [name, counts] of [
  ['bounce', { delivered: 970, bounced: 30 }],
  ['complaint', { delivered: 1000, complained: 2 }],
]) {
  test(`story pre-send retains the seven-day ${name} health failure without a volume cap`, async () => {
    const { result } = await run('presend', { campaigns: campaigns(20, counts) });
    assert.equal(result.pass, false);
    assert.match(result.failed.join(' '), /7-day bounce and complaint rates within limits/);
  });
}
