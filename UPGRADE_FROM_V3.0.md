# Upgrade notes → V3.6.0

- Export backup before replacing files.
- Existing skillEvidence, sessionHistory, mistakes, stars and cloud payload stay intact.
- V3.6 adds live mid-session difficulty adaptation, Path mixed practice and Parent copy-summary.
- No database migration required.
- After deploy, hard-refresh so the new service-worker cache is used.
