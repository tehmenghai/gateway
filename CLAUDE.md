# Gateway — Project Guide

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/). Every commit message must use this format:

```
<type>: <short description>

<optional body with more detail>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### Commit Types

| Type | When to use | Version bump |
|------|-------------|--------------|
| `feat` | New feature or capability | **MINOR** (x.Y.0) |
| `fix` | Bug fix | **PATCH** (x.y.Z) |
| `refactor` | Code restructure, no behavior change | **PATCH** (x.y.Z) |
| `style` | UI/CSS changes only | **PATCH** (x.y.Z) |
| `docs` | Documentation only | No bump |
| `chore` | Build, config, dependencies | No bump |
| `perf` | Performance improvement | **PATCH** (x.y.Z) |
| `test` | Adding or fixing tests | No bump |

**Breaking changes:** Add `BREAKING CHANGE:` in the commit body or `!` after type (e.g., `feat!:`). This triggers a **MAJOR** bump (X.0.0).

## Versioning (Semantic Versioning)

Format: `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)

### Version Bump Checklist (must do ALL of these)

1. Update `version` in `package.json`
2. Add new section to `CHANGELOG.md` with date and changes
3. Commit with appropriate type prefix
4. Tag the commit: `git tag vX.Y.Z`
5. Push with tags: `git push && git push origin vX.Y.Z`

## Changelog Format

Follow [Keep a Changelog](https://keepachangelog.com/). New entries go at the top.

## Project Structure
```
server.js       — Express gateway (reverse proxy + auth enforcement)
auth.js         — Auth middleware (session, requireAuth, password verify, WS auth)
public/
  index.html    — Dashboard home page
  login.html    — Login page (self-contained, no nav bar)
  nav.js        — Shared navigation bar with logout button
  favicon.svg   — Rocket ship favicon (SVG, modern browsers)
  favicon.ico   — Rocket ship favicon (ICO, legacy fallback)
package.json    — Dependencies + version (source of truth)
Dockerfile      — Container build (node:20-slim, port 3000)
CHANGELOG.md    — Release notes
CLAUDE.md       — This file
```

## Authentication

Session-cookie auth at the gateway level. All routes require login except public routes.

**Middleware order in server.js (critical — order matters):**
1. `express.urlencoded()` — parse login form body
2. `sessionMiddleware` — attach session to every request
3. Public routes: `GET /health`, `GET /login`, `POST /login`, `POST /logout`
4. `requireAuth` — auth wall, everything below is protected
5. `express.static("public")` — dashboard + nav.js
6. Proxy routes

**Environment variables:**
| Variable | Purpose | Required |
|----------|---------|:---:|
| `AUTH_USER` | Login username (default: `admin`) | No |
| `AUTH_PASSWORD_HASH` | bcrypt hash of login password | Yes |
| `SESSION_SECRET` | Cookie signing secret (default: `dev-secret-change-me`) | Yes (prod) |

**Production secrets** are in SSM Parameter Store (`/my-work-space/AUTH_PASSWORD_HASH`, `/my-work-space/SESSION_SECRET`) — ECS injects them at startup.

**Cookie settings:** `sid`, httpOnly, sameSite: lax, secure: false (ALB terminates TLS), 24h maxAge.

**WebSocket auth:** `server.on("upgrade")` checks session cookie before proxying to backend.

## Routes

### Public (no auth)
| Path | Method | Purpose |
|------|--------|---------|
| `/health` | GET | ALB health check |
| `/favicon.ico` | GET | Favicon (ICO) |
| `/favicon.svg` | GET | Favicon (SVG) |
| `/login` | GET | Login page |
| `/login` | POST | Verify credentials, create session |
| `/logout` | POST | Destroy session, redirect to login |

### Protected (require login)
| Path | Target | Notes |
|------|--------|-------|
| `/` | Gateway static | Dashboard home page |
| `/files/*` | `http://localhost:8080` | Strips `/files` prefix |
| `/api/*` | `http://localhost:4444` | Collab server REST API |
| `/ws/*` | `ws://localhost:4444` | Yjs WebSocket, strips `/ws` prefix |
| `/collab/*` | `http://localhost:5173` | Vite dev server (keeps prefix) |
