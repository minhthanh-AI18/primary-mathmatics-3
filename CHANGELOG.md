# Changelog

## V3.1.0 — Balanced Intelligence
- Added topic-level mastery evidence without replacing V3.0 progress fields.
- Added daily learning goal and a recommended next practice topic.
- Added Skill Map dashboard with recent accuracy, attempt count, mastery status and review timing.
- Smart Mode now uses new evidence when available and falls back to V3.0 aggregate topic history for existing learners.
- Added new mastery engine to the PWA offline cache and versioned the cache to force an update.
- AI tutor remains intentionally deferred to V3.2.

## Data migration
No destructive migration is performed. Existing localStorage keys and Supabase payload format remain unchanged. New evidence begins accumulating after the learner starts using V3.1.
