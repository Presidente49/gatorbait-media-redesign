import test from 'node:test';
import assert from 'node:assert/strict';
import { hasStandardWixConsentCopy, selectPrivacyPreservingConsentControl } from './live-qc-consent.mjs';

test('selects only an exact Decline All consent control', () => {
  const control = selectPrivacyPreservingConsentControl([
    { label: 'Accept All' },
    { label: ' Settings ' },
    { label: 'Decline   All' }
  ]);
  assert.deepEqual(control, { index: 2, label: 'Decline All' });
});

test('does not choose another control when Decline All is unavailable', () => {
  assert.equal(selectPrivacyPreservingConsentControl([{ label: 'Accept All' }, { label: 'Settings' }]), null);
});

test('recognizes the standard Wix consent copy without treating arbitrary text as a panel', () => {
  assert.equal(hasStandardWixConsentCopy('We use cookies. Accept All · Decline All · Settings'), true);
  assert.equal(hasStandardWixConsentCopy('Accept All the football settings'), false);
});
