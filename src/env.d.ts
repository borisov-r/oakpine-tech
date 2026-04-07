// Runtime environment configuration injected by env-config.js at server/container
// startup. Values are populated before any application scripts run.
// Note: Nextcloud credentials are handled server-side by the nginx proxy and
// are never exposed to the browser.
interface Window {
  _env?: Record<string, string>;
}
