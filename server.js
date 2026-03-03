const express = require("express");
const http = require("http");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");
const {
  sessionMiddleware,
  requireAuth,
  verifyPassword,
  isWsAuthenticated,
} = require("./auth");

const app = express();
const PORT = process.env.PORT || 3000;

const FILES_TARGET = process.env.FILES_TARGET || "http://localhost:8080";
const COLLAB_TARGET = process.env.COLLAB_TARGET || "http://localhost:4444";
const COLLAB_WS_TARGET = process.env.COLLAB_WS_TARGET || "ws://localhost:4444";
const COLLAB_FRONTEND_TARGET = process.env.COLLAB_FRONTEND_TARGET || "http://localhost:5173";

const AUTH_USER = process.env.AUTH_USER || "admin";

// --- Middleware ---
app.use(express.urlencoded({ extended: false }));
app.use(sessionMiddleware);

// --- Public routes (no auth) ---
app.get("/health", (_req, res) => res.send("OK"));

app.get("/login", (_req, res) => {
  if (_req.session && _req.session.user) {
    return res.redirect("/");
  }
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (username === AUTH_USER && (await verifyPassword(password))) {
    req.session.user = username;
    return res.redirect("/");
  }
  return res.redirect("/login?error=1");
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("sid");
    res.redirect("/login");
  });
});

// Serve favicon publicly (before auth wall)
app.get("/favicon.ico", (req, res) => res.sendFile(path.join(__dirname, "public", "favicon.ico")));
app.get("/favicon.svg", (req, res) => res.sendFile(path.join(__dirname, "public", "favicon.svg")));
app.get("/apple-touch-icon.png", (req, res) => res.sendFile(path.join(__dirname, "public", "apple-touch-icon.png")));

// --- Auth wall — everything below requires login ---
app.use(requireAuth);

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

// Proxy /ws/* → Yjs WebSocket server on port 4444
const wsProxy = createProxyMiddleware({
  target: COLLAB_WS_TARGET,
  pathRewrite: { "^/ws": "" },
  changeOrigin: true,
  ws: true,
  pathFilter: (path) => path.startsWith("/ws"),
});
app.use(wsProxy);

// Proxy /collab/* → collab-space server (keep /collab prefix)
app.use(
  createProxyMiddleware({
    target: COLLAB_FRONTEND_TARGET,
    changeOrigin: true,
    ws: true,
    pathFilter: (path) => path.startsWith("/collab"),
  })
);

// --- HTTP server + WebSocket upgrade handler ---
const server = http.createServer(app);

server.on("upgrade", async (req, socket, head) => {
  const authenticated = await isWsAuthenticated(req);
  if (!authenticated) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }
  wsProxy.upgrade(req, socket, head);
});

server.listen(PORT, () => {
  console.log(`Gateway running at http://localhost:${PORT}`);
});
