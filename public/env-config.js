// This file is overwritten at container startup by docker-entrypoint.sh.
// It exposes runtime configuration to the browser via window._env.
// Values here are empty placeholders — set real values via environment variables.
window._env = {
  NEXTCLOUD_WEBDAV_SERVER: "",
  CNC_APP_USER: "",
  CNC_APP_PASSWORD: "",
};
