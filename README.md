# KubeDock Product Website

A responsive product showcase and download centre for [KubeDock](https://github.com/HareeshGT/KubeDock), built with HTML5, CSS3 and vanilla JavaScript.

## Local preview

From the repository root, start a static file server:

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>. The download centre is at <http://localhost:8000/downloads/>.

Opening the HTML files directly with `file://` may prevent the browser from calling the GitHub Releases API. Use a local HTTP server for release integration testing.

## Features

- Responsive landing page with accessible mobile navigation.
- Product capability sections based on the repository README and security guidance.
- Dedicated walkthroughs for Ops Mind, configurable AI providers and the mobile-friendly Web companion.
- Dedicated Videos page (`/videos/`) with a playlist for the full application tour and the AI Workspace walkthrough, deep links (`/videos/#app-tour`, `/videos/#ai-workspace`), download and copy-link actions, and a homepage teaser.
- Animated scroll reveals that respect `prefers-reduced-motion`.
- Keyboard-operable showcase tabs and FAQ accordions.
- Downloads page backed by the public GitHub Releases REST API.
- Version-specific direct links to each release asset's `browser_download_url`.
- Release search, stable/prerelease filter, load-more pagination and session cache.
- Loading, empty, rate-limit, API-error and cached-data states.
- Safe text rendering for release notes; no remote release Markdown is injected as HTML.
- No frontend frameworks, build step, API token or custom backend.

## Product walkthrough videos

Videos live on their own page at `videos/`. The homepage shows only a lightweight teaser (poster images, no video downloads) that links there. Poster frames are in `assets/img/`; the videos are plain MP4 files:

- `assets/video/kubedock-explainer-web.mp4` — full application tour
- `assets/video/kubedock-ai-workspace.mp4` — AI Workspace walkthrough

To add a video, drop the MP4 and a poster image into `assets/`, then add an entry to the `library` array in `assets/js/videos.js` and a matching playlist button in `videos/index.html`. Old homepage anchors (`/#video`, `/#full-app-tour`) redirect to the new page.

## Release integration

The website queries:

`https://api.github.com/repos/HareeshGT/KubeDock/releases?per_page=100&page=N`

Draft releases are excluded from the public listing. Release assets are taken from the API response and linked to their actual `browser_download_url`. If GitHub is unavailable, the page uses fresh session-cached data when available and links to the canonical releases page. The platform cards are inferred from actual asset names and only shown when matching assets exist.

GitHub's anonymous API rate limits apply. The refresh button bypasses the short session cache; if the API rate limit is reached, use the linked GitHub Releases page.

## Deploy

The repository root is the static site root and can be deployed to GitHub Pages, Cloudflare Pages, Netlify, or another static host. Configure the host to publish the repository root. No secret keys should be added to frontend files.

For GitHub Pages, select the repository root (`/`) as the publishing folder on the deployment branch using your preferred deployment workflow. The included paths assume the site is served from the repository root; if deploying under a repository subpath, configure the hosting path accordingly.

## Content accuracy

Product capabilities are based on the current repository README and security policy. The dashboard illustrations are explicitly marked as illustrative UI concepts rather than actual product screenshots. Confirm screenshots and platform packages against the live repository before making release claims.
