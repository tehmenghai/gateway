# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.4.0] - 2026-04-23

### Added
- Protected `/apps/` proxy route for the HTML Apps admin service
- HTML Apps dashboard card and shared navigation link
- Configurable `APPS_TARGET` environment variable

## [1.3.2] - 2026-03-03

### Fixed
- Redesigned favicon with dark background for visibility in browser tabs
- Added `apple-touch-icon.png` (180x180) for iOS home screen / web app icon
- Public route for `/apple-touch-icon.png` (served before auth wall)

## [1.3.1] - 2026-03-03

### Added
- Rocket ship favicon (SVG + ICO) for browser tabs
- Public routes for `/favicon.ico` and `/favicon.svg` (served before auth wall)
- `<link rel="icon">` tags in `login.html` and `index.html`

## [1.3.0] - 2026-03-01

### Added
- Session-cookie authentication (login wall) at gateway level
- Login page (`/login`) with username/password form
- Logout button in navigation bar
- `/health` endpoint for ALB health checks (bypasses auth)
- WebSocket upgrade handler with session auth check
- New dependencies: `express-session`, `bcryptjs`, `cookie`

### Changed
- Server now uses `http.createServer()` for WebSocket upgrade interception
- All routes (except `/health`, `/login`, `/logout`) require authentication
- Static files served behind auth wall

## [1.2.0] - 2026-02-27

### Added
- Dockerfile for containerized deployment
- Environment variable configuration for proxy targets (`FILES_TARGET`, `COLLAB_TARGET`, `COLLAB_WS_TARGET`, `COLLAB_FRONTEND_TARGET`)
- Configurable `PORT` via environment variable

## [1.1.0] - 2026-02-26

### Added
- Proxy `/api/*` routes to collab server REST API on port 4444

### Changed
- Reordered proxy middleware so `/api` and `/ws` are matched before `/collab`

## [1.0.0] - 2026-02-26

### Added
- Express gateway with reverse proxy for platform services
- Dashboard home page with card-based navigation
- Shared navigation bar (`nav.js`) injected into all apps
- Proxy for s3-file-manager (`/files/*` → port 8080)
- Proxy for collab-space frontend (`/collab/*` → port 5173)
- Proxy for collab-space WebSocket (`/ws/*` → port 4444)
