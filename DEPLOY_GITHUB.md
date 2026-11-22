# GitHub Pages deployment — V3.2.2 Flat

1. Back up learner progress from Settings → Export learning data.
2. Unzip this package.
3. Select every file inside the extracted folder.
4. Upload directly to the repository root. Do not upload a containing folder and do not create `css/`, `js/` or `assets/`.
5. Commit, wait for GitHub Pages, then open the HTTPS site and reload.
6. Verify the V3.2 title, open Smart Tutor on a practice question, inspect Parent Report, and test installation. The install action is available in Settings and the fixed bottom toolbar; the browser controls its own address-bar install icon.

The new service worker cache is `math-genius-v3.2.2-flat-shell-1`. Existing localStorage keys and Supabase payload shape are retained. Do not clear site data during the upgrade.

Note: static checks pass, but browser installation/offline and live Supabase must be verified on the deployed site.
