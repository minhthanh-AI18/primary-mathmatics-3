# Math Genius 3A + 3B — V3.1 Balanced Intelligence — Flat GitHub Upload

## Retained from V3.0
- Original 3A + 3B bilingual lessons, vocabulary and generated question bank.
- Guided/independent practice, hints, read-aloud, adaptive/manual modes, speed round, rewards, mistakes, topic review and Supabase flow.
- Existing localStorage keys, student account keying and Supabase payload shape are preserved.

## V3.1 upgrades
- Additive `skillEvidence` ledger keyed by existing topic IDs; no destructive migration.
- Evidence-based topic mastery estimates using recent attempts, accuracy, hint use and streak.
- Skill/topic review scheduling with 1, 3, 7, 14 and 30-day intervals.
- Smart Mode uses the evidence engine with fallback to the V3.0 heuristic.
- Skill Map dashboard, daily question goal, progress meter and recommended next topic.
- Historical data remains readable. Old data receives empty defaults; evidence accumulates from V3.1 onward.
- AI tutor deliberately deferred to V3.2, as requested.

## Compatibility and data safety
- `m3a2`, `m3a2_user_<id>`, Supabase auth/config keys and remote `payload` structure remain unchanged.
- New fields are additive: `skillEvidence`, `dailyLearning`, `dailyGoal`.
- No automatic reset, deletion, or overwrite of legacy progress.
- Export a backup from Settings before deployment. The backup tool includes learner fields and excludes credentials/tokens.
- Supabase sync carries new fields inside the existing payload. No remote table schema change is required.

## Run locally
Serve this directory over HTTP/HTTPS (service workers do not work from `file://`): `python -m http.server 8000` then open `http://localhost:8000`.

## GitHub Pages
This is a FLAT deployment package: every runtime file is in this same folder. Open this folder, select all files, and upload them directly to the GitHub repository root (do not upload a parent folder). Enable Pages from branch/root and open the HTTPS URL once online. The service worker caches the V3.1 shell and mastery engine.

## Tests
Run `node tests/smoke-test.mjs`. Static tests do not replace manual browser, device, offline, and live Supabase QA.
