# Mobile headline sizing and whitespace — October 4, 2026

Owner follow-up: titles are too big on mobile and create white space.

Live DOM showed an older `gbm-mobile-rhythm-v1` stylesheet forcing matching-height two-column cards, 12px inset padding and important headline rules. Correct these rules in the maintained front-page stylesheet: single-column supporting rows with 104px article photos, natural content height, 17px/600-weight headlines, compact bylines and 12px spacing. Entire titles remain visible. Main headline scales 24–28px and secondary feature is 22px. Retain all fourteen supporting photos, editorial order, writer links and desktop rules.

Build, syntax and whitespace checks pass. Production phone screenshots follow deployment.

Rollback: restore pointer and HOME_CODE fallback to `4971ff53e55c66527541697350410c69656e04b4`, build `a8afbb94`. Current HOME_CODE expected revision40; use a fresh revision before any patch.

## Verified release

Release `3417925bb3e10ab0be484b642f02dc3bdd7360ef`, pointer update `8bfae661a026b8a22f78cf5576a1aec86577ffee`, HOME_CODE revision41, build `0b290e67`. Public browser confirms build, Loren lead and all fourteen supporting images.

Production workflow `37246555117` succeeded. At widths320/390/430/1366: correct build, no page errors, no horizontal overflow. All six supporting headings measure17px at phone widths and retain21px on desktop. Supporting list at390px decreased from1262px to629px in height. Visually checked the saved390px image: full titles, loaded photography and naturally sized compact rows.
