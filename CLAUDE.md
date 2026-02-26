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
server.js       — Express gateway (reverse proxy for all platform services)
public/
  index.html    — Dashboard home page
  nav.js        — Shared navigation bar (injected into all apps)
package.json    — Dependencies + version (source of truth)
CHANGELOG.md    — Release notes
CLAUDE.md       — This file
```

## Proxy Routes
| Path | Target | Notes |
|------|--------|-------|
| `/files/*` | `http://localhost:8080` | Strips `/files` prefix |
| `/api/*` | `http://localhost:4444` | Collab server REST API |
| `/ws/*` | `ws://localhost:4444` | Yjs WebSocket, strips `/ws` prefix |
| `/collab/*` | `http://localhost:5173` | Vite dev server (keeps prefix) |
