# Nextcloud Verification Checklist

Use this checklist in order:

1. Verify the Nextcloud server and credentials directly.
2. Verify the Docker container is loading the expected environment variables.
3. Verify the nginx WebDAV proxy at `/api/webdav/` is forwarding correctly.
4. Verify the browser upload flow from the CNC page.

## 1. Verify Nextcloud itself

Required `.env` values:

```env
NEXTCLOUD_WEBDAV_SERVER=https://cloud.example.com
CNC_APP_USER=your-service-user
CNC_APP_PASSWORD=your-app-password
```

Load the values into your shell:

```bash
set -a
. ./.env
set +a
```

Checklist:

- Confirm the base URL is correct and reachable in a browser:

```bash
curl -I "$NEXTCLOUD_WEBDAV_SERVER"
```

Expected result: an HTTP response from your Nextcloud host. If this fails, the proxy cannot work.

- Confirm the credentials can access the user's WebDAV root:

```bash
curl -i \
  -u "$CNC_APP_USER:$CNC_APP_PASSWORD" \
  -X PROPFIND \
  -H 'Depth: 0' \
  "$NEXTCLOUD_WEBDAV_SERVER/remote.php/dav/files/$CNC_APP_USER/"
```

Expected result: `207 Multi-Status`.

- Create a test folder directly in Nextcloud:

```bash
curl -i \
  -u "$CNC_APP_USER:$CNC_APP_PASSWORD" \
  -X MKCOL \
  "$NEXTCLOUD_WEBDAV_SERVER/remote.php/dav/files/$CNC_APP_USER/oakpine-direct-test"
```

Expected result: `201 Created` or `405 Method Not Allowed` if it already exists.

If you get `Sabre\\DAV\\Exception\\Conflict` with `Parent node does not exist`, the parent path

```text
/remote.php/dav/files/<CNC_APP_USER>/
```

is not resolving to a real WebDAV folder. In practice, this usually means one of these is wrong:

- `NEXTCLOUD_WEBDAV_SERVER` does not match the real Nextcloud base URL
- `CNC_APP_USER` is not the real Nextcloud internal user ID
- Nextcloud is hosted under a subpath and the base URL is missing it
- A reverse proxy is rewriting the DAV path incorrectly

Run these checks before trying `MKCOL` again:

- Inspect the DAV root with verbose output:

```bash
curl -v \
  -u "$CNC_APP_USER:$CNC_APP_PASSWORD" \
  -X PROPFIND \
  -H 'Depth: 0' \
  "$NEXTCLOUD_WEBDAV_SERVER/remote.php/dav/files/$CNC_APP_USER/"
```

Expected result: `207 Multi-Status`. If this does not return `207`, do not continue to `MKCOL` yet.

- If your Nextcloud is installed under a subpath, make sure the subpath is part of `NEXTCLOUD_WEBDAV_SERVER`:

```env
NEXTCLOUD_WEBDAV_SERVER=https://example.com/nextcloud
```

not:

```env
NEXTCLOUD_WEBDAV_SERVER=https://example.com
```

- If you are unsure about the correct user path, test the legacy endpoint that resolves to the authenticated user's root automatically:

```bash
curl -v \
  -u "$CNC_APP_USER:$CNC_APP_PASSWORD" \
  -X PROPFIND \
  -H 'Depth: 0' \
  "$NEXTCLOUD_WEBDAV_SERVER/remote.php/webdav/"
```

If `remote.php/webdav/` works but `remote.php/dav/files/$CNC_APP_USER/` does not, the credentials are valid and `CNC_APP_USER` is likely not the correct internal Nextcloud user ID for the DAV path.

- Confirm you are using the Nextcloud login name or internal user ID, not the display name. If you log in with an email address, the DAV folder name may still be a different account ID.

- If the user name contains special characters, URL-encode it before testing the direct DAV path.

Only after the root path returns `207 Multi-Status` should you retry:

```bash
curl -i \
  -u "$CNC_APP_USER:$CNC_APP_PASSWORD" \
  -X MKCOL \
  "$NEXTCLOUD_WEBDAV_SERVER/remote.php/dav/files/$CNC_APP_USER/oakpine-direct-test"
```

- Upload a test file directly to Nextcloud:

```bash
printf 'oakpine direct test\n' | curl -i \
  -u "$CNC_APP_USER:$CNC_APP_PASSWORD" \
  -X PUT \
  -H 'Content-Type: text/plain' \
  --data-binary @- \
  "$NEXTCLOUD_WEBDAV_SERVER/remote.php/dav/files/$CNC_APP_USER/oakpine-direct-test/healthcheck.txt"
```

Expected result: `201 Created` or `204 No Content`.

- Confirm the file exists:

```bash
curl -i \
  -u "$CNC_APP_USER:$CNC_APP_PASSWORD" \
  "$NEXTCLOUD_WEBDAV_SERVER/remote.php/dav/files/$CNC_APP_USER/oakpine-direct-test/healthcheck.txt"
```

Expected result: `200 OK` and the file body.

- Clean up the direct test artifacts:

```bash
curl -i \
  -u "$CNC_APP_USER:$CNC_APP_PASSWORD" \
  -X DELETE \
  "$NEXTCLOUD_WEBDAV_SERVER/remote.php/dav/files/$CNC_APP_USER/oakpine-direct-test/healthcheck.txt"

curl -i \
  -u "$CNC_APP_USER:$CNC_APP_PASSWORD" \
  -X DELETE \
  "$NEXTCLOUD_WEBDAV_SERVER/remote.php/dav/files/$CNC_APP_USER/oakpine-direct-test"
```

If this section fails, fix Nextcloud URL, credentials, WebDAV availability, reverse proxy, or permissions before testing the app proxy.

## 2. Verify the Docker container is loading the env file

Build and run:

```bash
docker build -t oakpine-tech .
docker run --rm -d --name oakpine-tech-test -p 8080:8080 --env-file .env oakpine-tech
```

Checklist:

- Confirm the container is running:

```bash
docker ps --filter name=oakpine-tech-test
```

- Confirm nginx generated the WebDAV proxy block:

```bash
docker exec oakpine-tech-test sh -lc "cat /etc/nginx/conf.d/default.conf"
```

Expected result: a `location /api/webdav/` block with a `proxy_pass` pointing to:

```text
<NEXTCLOUD_WEBDAV_SERVER>/remote.php/dav/files/<CNC_APP_USER>/
```

- Confirm the proxy is not disabled:

```bash
docker exec oakpine-tech-test sh -lc "grep -n '/api/webdav' /etc/nginx/conf.d/default.conf"
```

Expected result: it should not contain `return 503;`.

If you do see `return 503;`, check for:

- Missing `NEXTCLOUD_WEBDAV_SERVER`
- Missing `CNC_APP_USER`
- Invalid characters in `CNC_APP_USER`

## 3. Verify the nginx Nextcloud proxy

These checks go through the local container endpoint, not directly to Nextcloud.

Checklist:

- Confirm the proxy can list the user root:

```bash
curl -i \
  -X PROPFIND \
  -H 'Depth: 0' \
  http://localhost:8080/api/webdav/
```

Expected result: `207 Multi-Status`.

- Create the app root folder through the proxy:

```bash
curl -i -X MKCOL http://localhost:8080/api/webdav/CNC-Projects
```

Expected result: `201 Created` or `405 Method Not Allowed`.

- Create a test folder through the proxy:

```bash
curl -i -X MKCOL http://localhost:8080/api/webdav/oakpine-proxy-test
```

Expected result: `201 Created` or `405 Method Not Allowed`.

- Upload a file through the proxy:

```bash
printf 'oakpine proxy test\n' | curl -i \
  -X PUT \
  -H 'Content-Type: text/plain' \
  --data-binary @- \
  http://localhost:8080/api/webdav/oakpine-proxy-test/healthcheck.txt
```

Expected result: `201 Created` or `204 No Content`.

- Download the file through the proxy:

```bash
curl -i http://localhost:8080/api/webdav/oakpine-proxy-test/healthcheck.txt
```

Expected result: `200 OK` and the file body.

- Clean up the proxy test artifacts:

```bash
curl -i -X DELETE http://localhost:8080/api/webdav/oakpine-proxy-test/healthcheck.txt
curl -i -X DELETE http://localhost:8080/api/webdav/oakpine-proxy-test
```

Common failure meanings:

- `503 Service Unavailable`: proxy block disabled because required env vars were not loaded.
- `401 Unauthorized`: the server-side Nextcloud credentials are wrong.
- `403 Forbidden`: the Nextcloud account exists but lacks permission.
- `404 Not Found`: wrong `NEXTCLOUD_WEBDAV_SERVER` or incorrect Nextcloud DAV path upstream.
- `502` or `504`: upstream host unreachable, DNS issue, TLS issue, or reverse proxy/network problem.

## 4. Verify the browser upload flow

The CNC UI uploads through `/api/webdav` from [src/components/CncScene.svelte](src/components/CncScene.svelte#L10).

Checklist:

- Open `http://localhost:8080/cnc`.
- Open DevTools and keep the Network tab visible.
- Click `Manufacture`.
- Confirm you see these request types in order:
  - `MKCOL /api/webdav/CNC-Projects`
  - `MKCOL /api/webdav/CNC-Projects/<userId>`
  - `MKCOL /api/webdav/CNC-Projects/<userId>/<projectId>`
  - `PUT /api/webdav/.../model.stl`
  - `PUT /api/webdav/.../metadata.json`
  - `PUT /api/webdav/.../preview.png` if preview capture succeeds
- Confirm the page shows a success message instead of an error banner.
- Confirm the generated files appear in Nextcloud under:

```text
/CNC-Projects/<userId>/<projectId>/
```

Expected files:

- `model.stl`
- `metadata.json`
- `preview.png` when canvas capture succeeds

## 5. Tear down the local test container

```bash
docker stop oakpine-tech-test
```