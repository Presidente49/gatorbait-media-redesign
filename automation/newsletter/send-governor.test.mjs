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
async function run({ status = 'ACTIVE', campaigns = [], automations = [] } = {}) {
  const calls = [];
  const wix = {
    request: async ({ method, url }) => {
      calls.push(`${method} ${url}`);
      if (url.includes('/account-details')) {
        return { data: { accountDetails: { status, rank: 'BAD', quotaPeriod: {} } } };
      }
      if (url.includes('/automations/query')) return { data: { automations } };
      if (url.includes('/campaigns?')) return { data: { campaigns } };
      throw new Error(`unexpected ${url}`);
    },
  };
  const governor = new Function('wix', `return (${source});`)(wix);
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

  const week = await run({ campaigns: [campaign(30), campaign(100)] });
  assert.match(week.result.reasons.join(' '), /last 7 days/);
  assert.doesNotMatch(week.result.reasons.join(' '), /24 hours/);

  const scheduled = await run({ campaigns: [campaign(-5, {}, 'SCHEDULED')] });
  assert.match(scheduled.result.reasons.join(' '), /last 24 hours/);
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
