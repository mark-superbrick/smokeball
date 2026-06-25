// browser-sync config for local Webflow script dev
// Serves the repo root so jsDelivr URLs (redirected via Requestly) resolve to
// http://localhost:3003/scripts/<name>/index.js and /styles/<name>.css
module.exports = {
  port: 3003,
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
