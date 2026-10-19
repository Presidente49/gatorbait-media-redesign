/* Original GatorBait solo interaction trial. ClassQuiz engine evaluation is separate. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const next = $('next');
  let deck = [], index = -1, score = 0, answered = false;
  function deal() {
    index++; answered = false;
    $('options').replaceChildren(); $('reveal').hidden = true;
    $('progress').style.width = `${index / deck.length * 100}%`;
    if (index === deck.length) {
      $('round').textContent = 'HAND COMPLETE';
      $('question').textContent = `${score} out of ${deck.length}. That’s your first hand.`;
      $('dealer').textContent = score === deck.length ? 'A clean sweep. Nicely played.' : 'Good hand. The explanations are part of the fun—try again whenever you like.';
      next.hidden = false; next.textContent = 'Play another hand'; return;
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
  }
  function answer(choice) {
    if (answered || index < 0 || index >= deck.length) return;
    answered = true;
    const q = deck[index], correct = choice === q.answer;
    if (correct) score++;
    [...$('options').children].forEach((b, i) => { b.disabled = true; if (i === q.answer) b.classList.add('correct'); else if (i === choice) b.classList.add('wrong'); });
    $('score').textContent = score;
    $('verdict').textContent = correct ? 'Correct · 1 point' : `The answer: ${q.options[q.answer]}`;
    $('explanation').textContent = q.explanation;
    $('source').href = q.source; $('reveal').hidden = false;
    $('dealer').textContent = correct ? 'That one’s yours. Ready for the next?' : 'The quizmaster checks the record. Here’s the story behind that one.';
    next.textContent = index === deck.length - 1 ? 'See my result' : 'Deal the next question'; next.hidden = false;
  }
  next.addEventListener('click', () => { if (index >= deck.length) { index = -1; score = 0; $('score').textContent = 0; } deal(); });
  fetch('questions.json').then(r => { if (!r.ok) throw new Error('Deck unavailable'); return r.json(); }).then(data => {
    if (!Array.isArray(data.questions) || !data.questions.length || data.questions.some(q => !Array.isArray(q.options) || !Number.isInteger(q.answer) || !q.options[q.answer] || !q.source.startsWith('https://floridagators.com/'))) throw new Error('Invalid deck');
    deck = data.questions; next.disabled = false; next.textContent = 'Deal me in';
  }).catch(() => { $('error').hidden = false; next.hidden = true; });
})();
