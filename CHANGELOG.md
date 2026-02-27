# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

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
