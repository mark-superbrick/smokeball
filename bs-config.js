// browser-sync config for local Webflow script dev
// Serves the repo root so jsDelivr URLs (redirected via Requestly) resolve to
// http://localhost:3003/scripts/<name>/index.js and /styles/<name>.css
// Bind to loopback by default so the dev server isn't exposed to the LAN.
// For on-device testing over the network, run: DEV_SHARE=1 npm run dev
const share = process.env.DEV_SHARE === '1';

module.exports = {
  port: 3003,
  host: share ? '0.0.0.0' : '127.0.0.1',
  server: {
    baseDir: './',
    directory: true,
  },
  files: ['scripts/**/*.js', 'styles/**/*.css'],
  cors: true,
  open: false,
  notify: false,
  ghostMode: false,
};
