const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files (dashboard + nav.js)
app.use(express.static(path.join(__dirname, "public")));

// Proxy /files/* → s3-file-manager on port 8080 (strip /files prefix)
app.use(
  "/files",
  createProxyMiddleware({
    target: "http://localhost:8080",
    pathRewrite: { "^/files": "" },
    changeOrigin: true,
  })
);

// Proxy /api/* → Collab server REST API on port 4444
app.use(
  createProxyMiddleware({
    target: "http://localhost:4444",
    changeOrigin: true,
    pathFilter: (path) => path.startsWith("/api"),
  })
);

// Proxy /ws/* → Yjs WebSocket server on port 4444 (MUST be before /collab to catch WS upgrades first)
app.use(
  createProxyMiddleware({
    target: "ws://localhost:4444",
    pathRewrite: { "^/ws": "" },
    changeOrigin: true,
    ws: true,
    pathFilter: (path) => path.startsWith("/ws"),
  })
);

// Proxy /collab/* → Vite dev server on port 5173 (keep /collab prefix, Vite expects it)
app.use(
  createProxyMiddleware({
    target: "http://localhost:5173",
    changeOrigin: true,
    ws: true,
    pathFilter: (path) => path.startsWith("/collab"),
  })
);

app.listen(PORT, () => {
  console.log(`Gateway running at http://localhost:${PORT}`);
});
