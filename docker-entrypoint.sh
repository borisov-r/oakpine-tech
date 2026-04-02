#!/bin/sh
# Generates /usr/share/nginx/html/env-config.js from environment variables at
# container startup, then hands off to nginx.
#
# Usage (docker run):
#   docker run --rm -p 8080:8080 \
#     -e NEXTCLOUD_WEBDAV_SERVER=https://cloud.example.com \
#     -e CNC_APP_USER=cnc_user \
#     -e CNC_APP_PASSWORD=cnc_password \
#     oakpine-tech
#
# Usage (docker run with --env-file):
#   docker run --rm -p 8080:8080 --env-file .env oakpine-tech

# Escape a value for safe embedding inside a JS double-quoted string.
js_escape() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

NEXTCLOUD_WEBDAV_SERVER_ESC=$(js_escape "${NEXTCLOUD_WEBDAV_SERVER:-}")
CNC_APP_USER_ESC=$(js_escape "${CNC_APP_USER:-}")
CNC_APP_PASSWORD_ESC=$(js_escape "${CNC_APP_PASSWORD:-}")

cat > /usr/share/nginx/html/env-config.js << EOF
// Generated at container startup — do not edit manually.
window._env = {
  NEXTCLOUD_WEBDAV_SERVER: "${NEXTCLOUD_WEBDAV_SERVER_ESC}",
  CNC_APP_USER: "${CNC_APP_USER_ESC}",
  CNC_APP_PASSWORD: "${CNC_APP_PASSWORD_ESC}"
};
EOF

exec nginx -g "daemon off;"
