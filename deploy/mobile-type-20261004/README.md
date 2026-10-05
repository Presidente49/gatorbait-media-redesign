# Mobile headline sizing and whitespace — October 4, 2026

Owner follow-up: titles are too big on mobile and create white space.

Live DOM showed an older `gbm-mobile-rhythm-v1` stylesheet forcing matching-height two-column cards, 12px inset padding and important headline rules. Correct these rules in the maintained front-page stylesheet: single-column supporting rows with 104px article photos, natural content height, 17px/600-weight headlines, compact bylines and 12px spacing. Entire titles remain visible. Main headline scales 24–28px and secondary feature is 22px. Retain all fourteen supporting photos, editorial order, writer links and desktop rules.

Build, syntax and whitespace checks pass. Production phone screenshots follow deployment.

Rollback: restore pointer and HOME_CODE fallback to `4971ff53e55c66527541697350410c69656e04b4`, build `a8afbb94`. Current HOME_CODE expected revision40; use a fresh revision before any patch.
