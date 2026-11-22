# Upgrade V3.0 → V3.1

1. Before deployment, open V3.0 → Settings → Export learning data.
2. Keep the existing repository/project and replace the deployed runtime files with the flat files in this package. Upload each file directly to the repository root; do not create or upload nested folders.
3. Do not clear browser site data or uninstall the PWA before first V3.1 launch.
4. Open the HTTPS app online once. The new service worker uses a new cache name (`math-genius-v3.1-shell-1`).
5. Check the learner's stars, topic scores, mistakes, sessions and account state. Open Skill Map; previous topic totals are displayed as legacy evidence until V3.1 collects detailed attempts.
6. If progress is missing, use Settings → Import backup and choose the backup created in step 1.

The Supabase integration continues to store the learner object in the existing `student_progress.payload` column. No SQL migration is needed for the additive JSON fields. Keep using only the Supabase anon/publishable key in the browser.
