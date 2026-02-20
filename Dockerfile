# ── Build stage ────────────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

# Install dependencies first (layer-cached when package files don't change)
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund --prefer-offline

# Copy source and build the static site
COPY . .
RUN npm run build

# ── Serve stage ─────────────────────────────────────────────────────────────────
FROM nginx:stable-alpine AS runner

# Configurable port (default 8080 so the container can run without root)
ARG PORT=8080
ENV PORT=${PORT}

# Replace the default nginx config with a minimal one that honours $PORT
RUN printf 'server {\n\
    listen       %s;\n\
    server_name  _;\n\
    root         /usr/share/nginx/html;\n\
    index        index.html;\n\
    # SPA-style fallback so client-side routes resolve\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    # Serve pre-compressed assets when available\n\
    gzip_static  on;\n\
    gzip         on;\n\
    gzip_types   text/plain text/css application/javascript application/json image/svg+xml;\n\
}\n' "${PORT}" > /etc/nginx/conf.d/default.conf

# Copy the compiled site from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE ${PORT}

CMD ["nginx", "-g", "daemon off;"]
