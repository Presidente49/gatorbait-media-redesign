// Tests for send-governor.js against canned Wix responses.
// Run: node --test automation/newsletter/send-governor.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./send-governor.js', import.meta.url), 'utf8');
const HOUR = 60 * 60 * 1000;
const ago = hours => new Date(Date.now() - hours * HOUR).toISOString();

function campaign(hoursAgo, stats = {}, state = 'DISTRIBUTED') {
  return {
    campaignId: `c${hoursAgo}`,
    emailSubject: `Send ${hoursAgo}h ago`,
    distributionStatus: state,
    publishingData: {
      datePublished: ago(hoursAgo),
      statistics: { emailCampaign: { delivered: 1700, bounced: 10, complained: 0, ...stats } },
    },
  };
}

// Builds the governor with a fake `wix` global that answers by URL.
async function run({ status = 'ACTIVE', rank = 'GOOD', campaigns = [], automations = [], countFrom = null } = {}) {
  const calls = [];
  const wix = {
    request: async ({ method, url }) => {
      calls.push(`${method} ${url}`);
      if (url.includes('/account-details')) {
        return { data: { accountDetails: { status, rank, quotaPeriod: {} } } };
      }
      if (url.includes('/automations/query')) return { data: { automations } };
      if (url.includes('/campaigns?')) return { data: { campaigns } };
      throw new Error(`unexpected ${url}`);
    },
  };
  const code = countFrom
    ? source.replace('const COUNT_FROM = null;', `const COUNT_FROM = ${JSON.stringify(countFrom)};`)
    : source;
  const governor = new Function('wix', `return (${code});`)(wix);
  return { result: await governor(), calls };
}

test('blocks on a WARNED account without calling the campaign API', async () => {
  const { result, calls } = await run({ status: 'WARNED' });
  assert.equal(result.ok, false);
  assert.match(result.reasons[0], /WARNED/);
  assert.equal(calls.length, 1);
});

test('passes a healthy account with one send six days ago', async () => {
  const { result } = await run({ campaigns: [campaign(6 * 24)] });
  assert.equal(result.ok, true, result.reasons.join('; '));
  assert.equal(result.lastWeek.length, 1);
});

test('enforces the 24-hour and 7-day caps, counting scheduled sends', async () => {
  const day = await run({ campaigns: [campaign(3)] });
  assert.equal(day.result.ok, false);
  assert.match(day.result.reasons.join(' '), /last 24 hours/);

  const sixInWeek = await run({ campaigns: [30, 40, 50, 60, 70, 80].map(h => campaign(h)) });
  assert.equal(sixInWeek.result.ok, true, sixInWeek.result.reasons.join('; '));

  const week = await run({ campaigns: [30, 40, 50, 60, 70, 80, 90].map(h => campaign(h)) });
  assert.match(week.result.reasons.join(' '), /7 list send\(s\) in the last 7 days; the cap is 7/);
  assert.doesNotMatch(week.result.reasons.join(' '), /24 hours/);

  const scheduled = await run({ campaigns: [campaign(-5, {}, 'SCHEDULED')] });
  assert.match(scheduled.result.reasons.join(' '), /last 24 hours/);
});

test('COUNT_FROM drops earlier sends from the caps but not from the rates', async () => {
  const heavyWeek = [3, 10, 30, 40, 50, 60, 70].map(h => campaign(h, { delivered: 1000, bounced: 30 }));
  const policyStart = ago(2);
  const { result } = await run({ campaigns: heavyWeek, countFrom: policyStart });
  const reasons = result.reasons.join(' ');
  assert.doesNotMatch(reasons, /24 hours|7 days/);
  assert.match(reasons, /bounce rate 2\.91%/);

  const after = await run({ campaigns: [campaign(1), ...heavyWeek], countFrom: policyStart });
  assert.match(after.result.reasons.join(' '), /1 list send\(s\) in the last 24 hours counted since/);
});

test('ignores drafts, rejected sends and sends older than a week', async () => {
  const { result } = await run({
    campaigns: [campaign(2, {}, 'NOT_STARTED'), campaign(5, {}, 'REJECTED'), campaign(8 * 24)],
  });
  assert.equal(result.ok, true, result.reasons.join('; '));
});

test('blocks when a blog story-alert automation is active', async () => {
  const { result } = await run({
    automations: [{ id: '824714d4', name: 'Story alert', configuration: { status: 'ACTIVE' } }],
  });
  assert.equal(result.ok, false);
  assert.match(result.reasons[0], /story-alert/);
});

test('blocks on bounce or complaint rates above the playbook limits', async () => {
  const bounces = await run({ campaigns: [campaign(50, { delivered: 1000, bounced: 30 })] });
  assert.match(bounces.result.reasons.join(' '), /bounce rate 2\.91%/);

  const complaints = await run({ campaigns: [campaign(50, { delivered: 1000, complained: 2 })] });
  assert.match(complaints.result.reasons.join(' '), /complaint rate 0\.20%/);
});

test('probation: a BAD sender rank lowers the week cap to 3', async () => {
  const two = await run({ rank: 'BAD', campaigns: [30, 60].map(h => campaign(h)) });
  assert.equal(two.result.ok, true, two.result.reasons.join('; '));
  assert.equal(two.result.probation, true);

  const three = await run({ rank: 'BAD', campaigns: [30, 60, 90].map(h => campaign(h)) });
  assert.equal(three.result.ok, false);
  assert.match(three.result.reasons.join(' '), /3 list send\(s\) in the last 7 days; the cap is 3 while the sender rank is BAD \(probation\)/);

  const good = await run({ rank: 'GOOD', campaigns: [30, 60, 90].map(h => campaign(h)) });
  assert.equal(good.result.ok, true, good.result.reasons.join('; '));
  assert.equal(good.result.probation, false);
});
