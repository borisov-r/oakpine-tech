#!/bin/sh
# Generates the nginx config and /usr/share/nginx/html/env-config.js at
# container startup, then hands off to nginx.
#
# WebDAV requests from the browser are proxied through nginx at /api/webdav/
# so that credentials never reach the browser and no CORS issues arise.
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

# ── nginx config ────────────────────────────────────────────────────────────────
{
  printf 'server {\n'
  printf '    listen       %s;\n' "${PORT}"
  printf '    server_name  _;\n'
  printf '    root         /usr/share/nginx/html;\n'
  printf '    index        index.html;\n'
  printf '\n'

  if [ -n "${NEXTCLOUD_WEBDAV_SERVER}" ] && [ -n "${CNC_APP_USER}" ]; then
    # Validate that CNC_APP_USER contains only safe characters to prevent nginx
    # config injection (alphanumeric, dot, hyphen, underscore).
    if ! printf '%s' "${CNC_APP_USER}" | grep -qE '^[A-Za-z0-9._-]+$'; then
      echo "ERROR: CNC_APP_USER contains invalid characters; WebDAV proxy disabled." >&2
      printf '    # WebDAV proxy is disabled – CNC_APP_USER contains invalid characters\n'
      printf '    location /api/webdav/ {\n'
      printf '        return 503;\n'
      printf '    }\n'
    else
    # Compute Basic auth credentials server-side so they are never sent to the browser
    CNC_APP_AUTH=$(printf '%s:%s' "${CNC_APP_USER}" "${CNC_APP_PASSWORD:-}" | base64 | tr -d '\n')
    printf '    # WebDAV reverse proxy – forwards to Nextcloud with server-side credentials\n'
    printf '    location /api/webdav/ {\n'
    printf '        proxy_pass %s/remote.php/dav/files/%s/;\n' "${NEXTCLOUD_WEBDAV_SERVER%/}" "${CNC_APP_USER}"
    printf '        proxy_set_header Authorization "Basic %s";\n' "${CNC_APP_AUTH}"
    printf '        proxy_request_buffering off;\n'
    printf '        client_max_body_size 0;\n'
    printf '    }\n'
    fi
  else
    printf '    # WebDAV proxy is disabled – NEXTCLOUD_WEBDAV_SERVER or CNC_APP_USER not set\n'
    printf '    location /api/webdav/ {\n'
    printf '        return 503;\n'
    printf '    }\n'
  fi

  printf '\n'
  printf '    # SPA-style fallback so client-side routes resolve\n'
  printf '    location / {\n'
  printf '        try_files $uri $uri/ /index.html;\n'
  printf '    }\n'
  printf '    # Serve pre-compressed assets when available\n'
  printf '    gzip_static  on;\n'
  printf '    gzip         on;\n'
  printf '    gzip_types   text/plain text/css application/javascript application/json image/svg+xml;\n'
  printf '}\n'
} > /etc/nginx/conf.d/default.conf

# ── env-config.js ────────────────────────────────────────────────────────────────
# Credentials are no longer browser-exposed; the nginx proxy handles auth.
cat > /usr/share/nginx/html/env-config.js << 'EOF'
// Generated at container startup — do not edit manually.
window._env = {};
EOF

exec nginx -g "daemon off;"
