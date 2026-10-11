import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const contract = JSON.parse(readFileSync(new URL('./contract.json', import.meta.url), 'utf8'));

test('one accountable stage owner, Muse-only social and retained specialist roles', () => {
  assert.equal(contract.controller, 'Chris');
  assert.equal(contract.productionBuild, 'sports-live/build-front-page.mjs');
  assert.equal(contract.socialOwner, 'Muse');
  assert.equal(contract.roles.social.owner, 'Muse');
  assert.equal(contract.roles.wix.owner, 'Flaco');
  for (const role of ['intake', 'editorial', 'wix', 'creative', 'broadcast', 'magazine', 'newsletter', 'social', 'marketing', 'revenue', 'community', 'verification']) {
    assert.ok(contract.roles[role]?.owner, role);
  }
  const identities = Object.values(contract.roles).flatMap(role => [role.owner, ...role.aliases]);
  assert.equal(new Set(identities).size, identities.length);
  assert.equal(Object.values(contract.roles).filter(role => role.mode === 'sole-social-owner').length, 1);
  assert.equal(new Set(contract.stages.map(stage => stage.name)).size, contract.stages.length);
  for (const stage of contract.stages) assert.ok(contract.roles[stage.ownerRole]);
  assert.equal(contract.stages.find(stage => stage.name === 'social-handoff').ownerRole, 'social');
});

test('deterministic routine stages, bounded judgment and explicit approval boundaries', () => {
  assert.equal(contract.businessBaseline, 'Wix Dashboard');
  assert.equal(contract.idleOutcome, 'NOOP');
  assert.equal(contract.retryLimit, 1);
  for (const stage of contract.stages) assert.equal(stage.maxModelCalls, stage.name === 'qc' ? 1 : 0);
  assert.equal(contract.permissions.subscriberSend, 'campaign-specific-owner-approval');
  assert.equal(contract.permissions.schedulerChanges, 'owner-approval');
  for (const key of ['highImpact', 'missingRights', 'ambiguousFacts']) assert.equal(contract.permissions[key], 'fail-closed');
  assert.equal(contract.runtimeStorage, 'private-outside-public-repository');
  assert.equal(contract.status, 'source-only-contract');
});

test('distinct magazine, newsletter, roundup and blog release checks', () => {
  for (const template of Object.values(contract.templates)) {
    assert.ok(contract.roles[template.ownerRole]);
    assert.ok(template.checks.length >= 5);
  }
  assert.notDeepEqual(contract.templates.magazine.checks, contract.templates.roundup.checks);
  assert.ok(contract.templates.roundup.checks.includes('current-date-window'));
  assert.ok(contract.templates.newsletter.checks.includes('campaign-specific-owner-approval'));
  assert.ok(contract.templates['daily-news-blog'].checks.includes('inactive-blog-alerts'));
});
