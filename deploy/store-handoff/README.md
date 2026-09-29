# Store handoff repair

Staged from fresh Wix reads after the first customer-audit repair. Root controller is the only production writer. Each existing renderer changes exactly one merchandise link to `target="_blank" rel="noopener" aria-label="Store (opens in a new tab)"`. This preserves the news page while the reader shops with Baker's/ItemOrder. It does not add controls inside the partner's cross-origin store.

| Embed | Before revision | Surface |
|---|---:|---|
| `622d8ece-df55-44fc-9e4a-3f580804743b` | 16 | Homepage navigation |
| `7fee4de6-1886-475e-a3f3-b9c68161c242` | 29 | Inner-page navigation |
| `1dd74333-ee02-40da-9c93-cf8fd787c129` | 42 | Magazine store card |
| `f8b950c9-47ce-4390-976f-85a0f040f0c6` | 26 | Footer |
| `fdc2127a-845a-4d02-b711-438f1a4a86ce` | 84 | Mobile drawer |

Before/after JSON files preserve exact HTML. Whitespace-only indentation and blank-line reduction keeps the inline payloads under 15,000 characters; all executable JavaScript blocks pass Node syntax validation. Largest payload: shared header 14,993 characters. Do not append more code without a cap check.

Apply only after comparing current provider revision AND HTML to the corresponding before object. Preserve enabled state, category, placement, scope and load behavior. PATCH existing IDs; do not activate the disabled legacy Store owner. Rollback by reading the newest revision and restoring this directory's before HTML only when the live HTML still equals its corresponding after HTML. Stop on drift rather than overwrite subsequent work. No full-site publish is required by this change set.

Public browser verification must confirm a new tab opens to the established ItemOrder destination while the original page remains available. Accessible new-tab labels are included. Physical mobile-device verification is separate.

The repository's magazine builder contains no released issue assets. No fabricated issue archive, download or historical issue was added.
