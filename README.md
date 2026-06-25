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

**Requestly redirect rule** (set once per asset):

| Field | Value |
|---|---|
| Source — Contains | `cdn.jsdelivr.net/gh/mark-superbrick/smokeball` |
| Redirect To | `http://localhost:3003/scripts/<name>/index.js` |

Enable the rule → open the `.webflow.io` staging site → edit the file → browser auto-reloads. Disable to revert to the CDN.

## Adding a New Script

1. Create `scripts/<name>/index.js` (and/or `styles/<name>.css`).
2. Add the loader to Webflow custom code (see Dynamic Loading below).
3. Add a Requestly redirect rule for local dev.
4. Push to `staging` to test → open a PR `staging → main` and merge to ship.

## Dynamic Loading Snippet

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
- **Production:** PR `staging → main`, merge → `production-deploy.yml` purges `@main`. No Webflow publish required for script-only changes.

## jsDelivr Cache Notes

- Branch-pinned URLs are cached aggressively.
- Actions purge `https://purge.jsdelivr.net/gh/mark-superbrick/smokeball@<branch>/<file>` per changed file on push.
- If a purge fails silently, hit the purge URL in a browser or wait up to 24h.
