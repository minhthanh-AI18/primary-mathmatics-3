# GitHub Pages deployment — flat package

All files required at runtime are at the same directory level. Do not create `css/`, `js/`, or `assets/` folders.

## Upload
1. Open this folder on your computer.
2. Select all files, including `index.html`, `app.css`, JavaScript files, `manifest.webmanifest`, `service-worker.js`, and the three icon files.
3. Upload them directly to the repository root (`/`).
4. Commit the changes and wait for GitHub Pages to publish.
5. Open the HTTPS Pages URL and reload once. The service worker will install the new flat cache.

## Important
- Keep the file names unchanged; paths in HTML, manifest, and service worker refer to these root-level names.
- Do not delete browser site data; V3.1 uses the existing localStorage keys and retains legacy progress.
- If an older service worker keeps showing the old app, close installed app tabs, open the site in the browser, reload, then reopen it.
- GitHub Pages must serve the site over HTTPS for service worker and PWA installation.
