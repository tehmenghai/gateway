const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const FILES_TARGET = process.env.FILES_TARGET || "http://localhost:8080";
const COLLAB_TARGET = process.env.COLLAB_TARGET || "http://localhost:4444";
const COLLAB_WS_TARGET = process.env.COLLAB_WS_TARGET || "ws://localhost:4444";
const COLLAB_FRONTEND_TARGET = process.env.COLLAB_FRONTEND_TARGET || "http://localhost:5173";

// Serve static files (dashboard + nav.js)
app.use(express.static(path.join(__dirname, "public")));

// Proxy /files/* → s3-file-manager on port 8080 (strip /files prefix)
app.use(
  "/files",
  createProxyMiddleware({
    target: FILES_TARGET,
    pathRewrite: { "^/files": "" },
    changeOrigin: true,
  })
);

// Proxy /api/* → Collab server REST API on port 4444
app.use(
  createProxyMiddleware({
    target: COLLAB_TARGET,
    changeOrigin: true,
    pathFilter: (path) => path.startsWith("/api"),
  })
);

// Proxy /ws/* → Yjs WebSocket server on port 4444 (MUST be before /collab to catch WS upgrades first)
app.use(
  createProxyMiddleware({
    target: COLLAB_WS_TARGET,
    pathRewrite: { "^/ws": "" },
    changeOrigin: true,
    ws: true,
    pathFilter: (path) => path.startsWith("/ws"),
  })
);

// Proxy /collab/* → collab-space server (keep /collab prefix)
app.use(
  createProxyMiddleware({
    target: COLLAB_FRONTEND_TARGET,
    changeOrigin: true,
    ws: true,
    pathFilter: (path) => path.startsWith("/collab"),
  })
);

app.listen(PORT, () => {
  console.log(`Gateway running at http://localhost:${PORT}`);
});
