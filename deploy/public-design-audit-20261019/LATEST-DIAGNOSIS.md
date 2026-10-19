# Latest Feed bounded diagnosis — Oct. 19, 2026

**No production timing/layout patch is supported by these container traces. Preserve the working fallback.**

Two desktop navigations were instrumented before page scripts; only scratch evidence was written. At1366 the bundle and RSS both returned HTTP503 alongside84 failed responses across10 unrelated hosts. At1920 the document itself returned503, so the loader never ran. These runs are affected by the environment/network and do not establish a public-site regression.

## Observed1366 sequence

| Event | After loader boot |
| --- | ---: |
| Loader boot / RSS fetch / async bundle requested | 0–2ms |
| Native feed root with12 posts present | 194ms |
| Latest bundle request completes HTTP503 | 197ms |
| Script `onerror` calls loader `off()`, sets `__GBM_LF_FAIL__` | 221ms |
| Native view restored (sampled) | 264ms |
| RSS503 is caught and resolves empty string | 569ms |
|2.5s failsafe calls `off()` again |2502ms |

`__GBM_LF__` and `__GBM_LF_OK__` were never set: the bundle did not execute. The first failure stack points to `HTMLScriptElement.off`, not the timeout callback. No bundle-level fallback warning appears because its runtime never started. Therefore lengthening the2500ms timeout would not fix this observed failure.

## Source findings and smallest next step

- Loader `off()` serves both script `onerror` and the2500ms deadline, and latches `__GBM_LF_FAIL__`. Bundle entry and its async continuation both honor that latch. This explains why a failed load stays on fallback.
- Source can theoretically exhaust the budget: async CDN loading plus `Promise.all(fonts, waitNative2000ms, RSS)` must finish inside the loader's2500ms deadline; fonts are bounded900ms, RSS has no explicit timeout. That is a possible race, not a reproduction here. Do not weaken/extend the native-content failsafe on that hypothesis.
- **Minimal recommendation now: no production behavior change.** Use an independent read-only probe outside the failing container tunnel if the owner reproduces fallback. If diagnostics are later needed, the smallest code addition is a reason field (`bundle-error` vs `deadline`) plus elapsed boot time inside `off(reason)`, retaining the2500ms deadline and existing native fallback. That would distinguish the two failure paths without changing rendering behavior; it was not implemented or shipped here.

Evidence: `latest-trace.json`, `trace-latest.py`, `latest-trace-1366.png`, `latest-trace-1920.png` in this folder. The script records flag-setter stacks, DOM transitions, RSS result and resource timings; it makes no server writes.

This diagnosis limits the earlier design audit's inconsistent-mount observation: the older narrow layout was observed, but a production initialization defect is unproven. Do not patch the legacy940px layout solely from these container results.
