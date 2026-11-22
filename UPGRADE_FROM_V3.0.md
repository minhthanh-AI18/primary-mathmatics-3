# Upgrade notes: V3.0 / V3.1 → V3.2

- Export a backup before replacing files.
- Upload all flat package files into the GitHub repository root.
- Do not clear localStorage or uninstall the existing app as part of the upgrade.
- Existing learner keys, topic IDs, mistakes, stars, sessions and account payload are retained.
- V3.2 adds `errorLog`; existing `skillEvidence`, `dailyLearning` and `dailyGoal` remain intact.
- No Supabase schema migration is needed because new learner fields are stored in the existing JSON payload.
- After deployment, reopen the HTTPS site and reload to activate the V3.2 service-worker cache.
