/* Original GatorBait solo interaction trial. ClassQuiz engine evaluation is separate. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const next = $('next');
  let deck = [], index = -1, score = 0, answered = false, duration = 5;
  let deadline = 0, expiry = 0, advance = 0, frame = 0, results = [];
  function clearClock() { clearTimeout(expiry); clearTimeout(advance); cancelAnimationFrame(frame); }
  function paintClock() {
    const left = Math.max(0, deadline - performance.now());
    $('seconds').textContent = Math.ceil(left / 1000);
    $('clock-fill').style.width = `${left / (duration * 1000) * 100}%`;
    if (left <= 0) answer(null);
    else frame = requestAnimationFrame(paintClock);
  }
  function review() {
    $('review-list').replaceChildren();
    results.forEach((r, i) => {
      const q = deck[i], row = document.createElement('li');
      const title = document.createElement('strong'); title.textContent = q.question;
      const result = document.createElement('p'); result.textContent = `${r === null ? 'Time ran out' : r === q.answer ? 'Correct' : 'Your answer: ' + q.options[r]} · Answer: ${q.options[q.answer]}`;
      const explanation = document.createElement('p'); explanation.textContent = q.explanation;
      const link = document.createElement('a'); link.textContent = 'Florida Gators source'; link.href = q.source; link.target = '_blank'; link.rel = 'noopener noreferrer';
      row.append(title, result, explanation, link); $('review-list').append(row);
    });
    $('review').hidden = false;
  }
  function deal() {
    clearClock();
    index++; answered = false;
    $('options').replaceChildren(); $('reveal').hidden = true;
    $('progress').style.width = `${index / deck.length * 100}%`;
    if (index === deck.length) {
      $('countdown').hidden = true; $('pace-controls').hidden = false; $('pace').disabled = false;
      $('round').textContent = 'HAND COMPLETE';
      $('question').textContent = `${score} out of ${deck.length}. That’s your first hand.`;
      $('dealer').textContent = score === deck.length ? 'A clean sweep. Nicely played.' : 'Good hand. The explanations are part of the fun—try again whenever you like.';
      next.hidden = false; next.textContent = 'Play another hand'; review(); return;
    }
    const q = deck[index];
    $('round').textContent = `QUESTION ${index + 1} OF ${deck.length} · GATOR HISTORY`;
    $('question').textContent = q.question;
    $('dealer').textContent = 'Your question is on the table. Pick one answer.';
    next.hidden = true;
    q.options.forEach((text, choice) => {
      const button = document.createElement('button'); button.className = 'option'; button.type = 'button';
      const letter = document.createElement('b'); letter.textContent = String.fromCharCode(65 + choice); letter.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span'); label.textContent = text;
      button.append(letter, label); button.addEventListener('click', () => answer(choice)); $('options').append(button);
    });
    $('question').focus({ preventScroll: true });
    if (duration) {
      $('countdown').hidden = false;
      deadline = performance.now() + duration * 1000;
      expiry = setTimeout(() => answer(null), duration * 1000);
      paintClock();
    }
  }
  function answer(choice) {
    if (answered || index < 0 || index >= deck.length) return;
    if (duration && performance.now() >= deadline) choice = null;
    answered = true;
    clearClock();
    results.push(choice);
    const q = deck[index], correct = choice === q.answer;
    if (correct) score++;
    [...$('options').children].forEach((b, i) => { b.disabled = true; if (i === q.answer) b.classList.add('correct'); else if (i === choice) b.classList.add('wrong'); });
    $('score').textContent = score;
    $('verdict').textContent = choice === null ? `Time’s up · ${q.options[q.answer]}` : correct ? 'Correct · 1 point' : `The answer: ${q.options[q.answer]}`;
    $('explanation').textContent = q.explanation;
    $('source').href = q.source; $('reveal').hidden = false;
    $('dealer').textContent = correct ? 'That one’s yours. Ready for the next?' : 'The quizmaster checks the record. Here’s the story behind that one.';
    next.textContent = index === deck.length - 1 ? 'See my result' : 'Deal the next question'; next.hidden = false;
    if (duration) {
      $('countdown').hidden = true;
      $('dealer').textContent = 'Next question in 2 seconds. All explanations stay available at the end.';
      next.hidden = true;
      advance = setTimeout(deal, 2000);
    }
  }
  next.addEventListener('click', () => {
    if (index >= deck.length || index === -1) {
      clearClock(); index = -1; score = 0; results = []; $('score').textContent = 0;
      duration = Number($('pace').value); $('pace').disabled = true; $('pace-controls').hidden = true; $('review').hidden = true;
      document.querySelector('.play-area').scrollIntoView({ block: 'start' });
    }
    deal();
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && duration && !answered && index >= 0 && index < deck.length && performance.now() >= deadline) answer(null);
  });
  fetch('questions.json').then(r => { if (!r.ok) throw new Error('Deck unavailable'); return r.json(); }).then(data => {
    if (!Array.isArray(data.questions) || !data.questions.length || data.questions.some(q => !Array.isArray(q.options) || !Number.isInteger(q.answer) || !q.options[q.answer] || !q.source.startsWith('https://floridagators.com/'))) throw new Error('Invalid deck');
    deck = data.questions; next.disabled = false; next.textContent = 'Deal me in';
  }).catch(() => { $('error').hidden = false; next.hidden = true; });
})();
