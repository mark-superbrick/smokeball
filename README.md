# Smokeball — Webflow Scripts

Plain-JS scripts and CSS for the Smokeball Webflow site, served straight from GitHub via the [jsDelivr](https://www.jsdelivr.com/) CDN. No build step.

## Stack

| Layer | Detail |
|---|---|
| Repo | `mark-superbrick/smokeball` |
| Scripts | `scripts/<name>/index.js` — plain JS |
| Styles | `styles/<name>.css` |
| Local server | `browser-sync` via `npm run dev` → `localhost:3003` |
| Local injection | Requestly redirect: jsDelivr URL → `localhost:3003` |
| Staging CDN | `cdn.jsdelivr.net/gh/mark-superbrick/smokeball@staging/...` |
| Production CDN | `cdn.jsdelivr.net/gh/mark-superbrick/smokeball@main/...` |
| Cache purge | GitHub Actions purges jsDelivr on every push to `staging` or `main` |

## CDN URLs

```
Staging JS:  https://cdn.jsdelivr.net/gh/mark-superbrick/smokeball@staging/scripts/<name>/index.js
Prod JS:     https://cdn.jsdelivr.net/gh/mark-superbrick/smokeball@main/scripts/<name>/index.js
Staging CSS: https://cdn.jsdelivr.net/gh/mark-superbrick/smokeball@staging/styles/<name>.css
Prod CSS:    https://cdn.jsdelivr.net/gh/mark-superbrick/smokeball@main/styles/<name>.css
```

## Local Dev

```bash
npm install      # first time only
npm run dev      # browser-sync on localhost:3003 (loopback only), watches scripts/**/*.js + styles/**/*.css
```

The server binds to `127.0.0.1` by default so it isn't exposed to the LAN. For on-device testing over the network:

```bash
DEV_SHARE=1 npm run dev   # binds 0.0.0.0 so phones/tablets on the same network can reach it
```

**Requestly redirect rule** (one wildcard rule covers every script and style):

| Field | Value |
|---|---|
| Source — Type | Wildcard |
| Source — URL | `https://cdn.jsdelivr.net/gh/mark-superbrick/smokeball@staging/*` |
| Redirect To | `http://localhost:3003/$1` |

The `*` captures the asset path (`scripts/<name>/index.js`, `styles/<name>.css`, etc.) into `$1`, and browser-sync serves the repo root, so it resolves locally. One rule, no per-asset setup.

Enable the rule → open the `.webflow.io` staging site → edit the file → browser auto-reloads. Disable to revert to the CDN.

## Adding a New Script

1. Create `scripts/<name>/index.js` (and/or `styles/<name>.css`).
2. Add a static `<script src=...@staging...>` (and `<link ...@staging...>`) tag to Webflow staging custom code for preview.
3. Add a Requestly redirect rule for local dev.
4. Push to `staging` to test → open a PR `staging → main` and merge to ship.

## Production

Production does **not** use the CDN, Requestly, or the dynamic loader. Once a script/style is final, its contents are pasted directly into Webflow **custom embed components** on the page. The jsDelivr `@staging` pipeline exists only for local dev and staging preview.

So the lifecycle is: edit locally (Requestly → localhost) → push `staging` and preview on `.webflow.io` via the `@staging` CDN tag → when approved, copy the final code from the repo into the production custom embed.

## Dynamic Loading Snippet

> Optional / not used in this project — production embeds code directly (see above). Kept here as a reference for CDN-on-production setups.

Drop this in Webflow custom code. On `.webflow.io` it loads `@staging`; on the production domain it loads `@main`.

```html
<script>
  (function () {
    var DEBUG = window.location.host.split('.')[1] === 'webflow';
    var branch = DEBUG ? 'staging' : 'main';
    var base = 'https://cdn.jsdelivr.net/gh/mark-superbrick/smokeball@' + branch;

    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = base + '/styles/<name>.css';
    document.head.appendChild(l);

    var s = document.createElement('script');
    s.src = base + '/scripts/<name>/index.js';
    document.head.appendChild(s);
  })();
</script>
```

## Workflows

- **Staging:** `git push origin staging` → `staging-deploy.yml` purges the `@staging` jsDelivr cache for changed files. Live in ~30s on the `.webflow.io` domain.
- **Production:** PR `staging → main`, merge → `production-deploy.yml` purges `@main` (keeps `@main` as the canonical final copy). To go live, paste the final code from the repo into the page's Webflow custom embed component and publish — production does not pull from the CDN.

## jsDelivr Cache Notes

- Branch-pinned URLs are cached aggressively.
- Actions purge `https://purge.jsdelivr.net/gh/mark-superbrick/smokeball@<branch>/<file>` per changed file on push.
- If a purge fails silently, hit the purge URL in a browser or wait up to 24h.
