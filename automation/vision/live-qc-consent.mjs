function normalized(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

// A visual audit must never accept tracking merely to clear a consent panel.
// Select only the exact, privacy-preserving decline action exposed by Wix.
export function selectPrivacyPreservingConsentControl(controls) {
  const index = controls.findIndex(control => normalized(control?.label) === 'decline all');
  return index === -1 ? null : { index, label: 'Decline All' };
}

export function hasStandardWixConsentCopy(text) {
  const copy = normalized(text);
  return copy.includes('accept all') && copy.includes('decline all') && copy.includes('settings');
}
