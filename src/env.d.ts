// Runtime environment configuration injected by env-config.js at server/container
// startup. Values are populated before any application scripts run.
interface Window {
  _env?: {
    NEXTCLOUD_WEBDAV_SERVER?: string;
    CNC_APP_USER?: string;
    CNC_APP_PASSWORD?: string;
  };
}
