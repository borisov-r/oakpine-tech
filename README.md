# oakpine-tech
Official website of oakpine.tech domain

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
```

## Docker – build & run locally

The `Dockerfile` compiles the site and serves it with nginx.  
The port defaults to **8080** and can be changed at build time.

```bash
# Build (default port 8080)
docker build -t oakpine-tech .

# Run – visit http://localhost:8080
docker run --rm -p 8080:8080 oakpine-tech

# Use a different port (e.g. 3000)
docker build --build-arg PORT=3000 -t oakpine-tech .
docker run --rm -p 3000:3000 oakpine-tech
```
