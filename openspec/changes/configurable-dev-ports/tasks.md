## 1. Environment

- [x] 1.1 Add `WEB_DEV_PORT` and `ADMIN_DEV_PORT` to `.env.example`
- [x] 1.2 Document ports in README

## 2. Vite

- [x] 2.1 Wire `apps/web` and `apps/admin` vite config to root env with defaults 5273/5274
- [x] 2.2 Remove hardcoded `--port` from package.json dev scripts

## 3. Specs

- [x] 3.1 Update `openspec/specs/developer-tooling/spec.md`
- [x] 3.2 Verify `pnpm --filter @memor/web build` still passes
