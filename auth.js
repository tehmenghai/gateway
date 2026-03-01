const session = require("express-session");
const bcrypt = require("bcryptjs");
const cookie = require("cookie");

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "dev-secret-change-me",
  name: "sid",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // ALB terminates TLS, gateway sees HTTP
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
});

function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  // Return 401 JSON for API/fetch requests
  if (
    req.headers.accept?.includes("application/json") ||
    req.xhr ||
    req.path.startsWith("/api")
  ) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.redirect("/login");
}

async function verifyPassword(password) {
  const hash = process.env.AUTH_PASSWORD_HASH;
  if (!hash) {
    console.error("AUTH_PASSWORD_HASH not set");
    return false;
  }
  return bcrypt.compare(password, hash);
}

function isWsAuthenticated(req) {
  return new Promise((resolve) => {
    // Parse the session cookie from the raw upgrade request
    sessionMiddleware(req, {}, () => {
      resolve(!!(req.session && req.session.user));
    });
  });
}

module.exports = {
  sessionMiddleware,
  requireAuth,
  verifyPassword,
  isWsAuthenticated,
};
