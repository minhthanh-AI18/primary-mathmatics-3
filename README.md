# Math Genius 3A + 3B — V3.2 Smart Tutor — Flat GitHub Upload

## Features retained
- Original bilingual Math 3A + 3B lessons, vocabulary, question generators and practice.
- Guided/independent practice, hints, read-aloud, Smart/Manual modes, rewards, mistakes, spaced review and Supabase sync.
- V3.1 evidence-based mastery, daily goal and Skill Map.

## V3.2 improvements
- Step-by-step offline Smart Tutor built from the app's existing lesson/explanation content. It is deterministic, not an external generative AI.
- Optional learner error reflection after an incorrect answer.
- Parent Report with recent activity, accuracy, daily progress, skills to support and learner-selected error patterns. Daily answers are counted by the V3.1 mastery engine.
- Repeated recent difficulty reflections can lower the next Smart Mode recommendation by one level.
- Error data is local to the learner profile and syncs through the existing additive Supabase payload. Reflection is optional; skipping it is not logged as a learner self-report.
- PWA install action is always available in Settings and the fixed bottom toolbar until the app is installed. Browser address-bar install affordances are controlled by Chrome/Edge; iPhone/iPad installation uses Safari Share → Add to Home Screen.

## Flat GitHub deployment
Every file is at this directory level. Upload all files directly into the GitHub repository root; do not create or upload nested folders.

Runtime files: `index.html`, `app.css`, `app.js`, `mastery.js`, `data-tools.js`, `pwa.js`, `manifest.webmanifest`, `service-worker.js`, `icon.svg`, `icon-192.png`, `icon-512.png`.

## Upgrade safely
1. Export a backup from Settings in the current app.
2. Upload all V3.2 files to the repository root and commit.
3. Open the GitHub Pages HTTPS site and reload.
4. Confirm the new version and test one question, Smart Tutor, Parent Report and install/offline behavior.
5. Do not clear browser storage. Existing keys and progress are preserved.

## Tests
Run `node smoke-test.mjs`. Static tests do not replace browser, device, offline or live Supabase QA.
