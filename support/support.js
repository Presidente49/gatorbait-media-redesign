/* Isolated design preview. No network calls, storage, payment submission or member mutation. */
(() => {
  'use strict';
  const root = document.querySelector('.gb-support-preview');
  if (!root) return;
  const menuToggle = root.querySelector('.gb-menu-toggle');
  const menu = root.querySelector('#gb-mobile-nav');
  function closeMenu(returnFocus = false) {
    menu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    if (returnFocus) menuToggle.focus();
  }
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menu.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  menu.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) closeMenu(true);
  });
  const desktop = window.matchMedia('(min-width:981px)');
  desktop.addEventListener('change', event => { if (event.matches) closeMenu(); });

  const amounts = Array.from(root.querySelectorAll('.gb-amount'));
  const custom = root.querySelector('#gb-custom-amount');
  const input = root.querySelector('#gb-amount-input');
  const feedback = root.querySelector('#gb-amount-feedback');
  const total = root.querySelector('#gb-support-total');
  const benefit = root.querySelector('#gb-benefit');
  const benefitTitle = root.querySelector('#gb-benefit-title');
  const benefitCopy = root.querySelector('#gb-benefit-copy');
  const currentMember = root.querySelector('#gb-current-member');
  const memberNote = root.querySelector('#gb-member-note');
  let selectedAmount = 25;

  function updateSummary() {
    const otherSelected = amounts.some(button => button.dataset.amount === 'other' && button.getAttribute('aria-pressed') === 'true');
    const valid = Number.isFinite(selectedAmount) && selectedAmount >= 1 && selectedAmount <= 10000 && (!otherSelected || input.validity.valid);
    const eligible = valid && selectedAmount >= 100;
    total.replaceChildren();
    total.dataset.empty = String(!valid);
    if (valid) {
      const [dollars, cents] = selectedAmount.toFixed(2).split('.');
      total.append(document.createTextNode('$' + Number(dollars).toLocaleString('en-US')));
      const fraction = document.createElement('span');
      fraction.textContent = '.' + cents;
      total.append(fraction);
    } else {
      total.textContent = 'Choose amount';
    }
    benefit.classList.toggle('gb-benefit-active', eligible);
    benefitTitle.textContent = eligible ? 'A year of GatorBait, included.' : 'Give $100+. Get a year of GatorBait.';
    benefitCopy.textContent = currentMember.checked
      ? 'Existing memberships would be reviewed before payment. No automatic extension.'
      : '12 months of All Access membership included. No automatic renewal.';
    memberNote.hidden = !currentMember.checked;
    if (otherSelected) {
      input.setAttribute('aria-invalid', String(!valid && input.value !== ''));
      feedback.textContent = valid || input.value === ''
        ? 'Preview only. No payment will be taken.'
        : 'Enter a whole-dollar or cent amount from $1 to $10,000.';
    }
  }

  amounts.forEach(button => {
    button.addEventListener('click', () => {
      amounts.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      const otherSelected = button.dataset.amount === 'other';
      custom.hidden = !otherSelected;
      selectedAmount = otherSelected ? input.valueAsNumber : Number(button.dataset.amount);
      updateSummary();
      if (otherSelected) input.focus();
    });
  });
  input.addEventListener('input', () => { selectedAmount = input.valueAsNumber; updateSummary(); });
  currentMember.addEventListener('change', updateSummary);
})();
