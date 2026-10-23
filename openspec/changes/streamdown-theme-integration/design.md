## Context

`@memor/ui` uses custom `--color-*` tokens. Streamdown components expect shadcn-style `--background`, `--muted`, etc. Tailwind v4 only emits utilities for classes referenced in scanned sources; Streamdown's prebuilt components live under `node_modules/streamdown/dist/*.js`.

## Goals / Non-Goals

**Goals:**

- Correct Shiki highlighting and Mermaid rendering in `Markdown` (static mode).
- Light sidebar in light theme for admin (and any `bg-sidebar` usage).
- Single source of truth: map shadcn variables from existing `--color-*` in `:root` and `.dark`.

**Non-Goals:**

- Redesign entire admin chrome.
- Change BlockNote editor internals (unless trivial CSS variable pass-through).

## Decisions

1. **Variable bridge in `globals.css`** — Define `--background`, `--foreground`, `--card`, `--muted`, `--border`, `--primary`, `--radius` on `:root` and `.dark` using Memor palette values.
2. **`@source` in app `index.css`** — Three lines for streamdown + code + mermaid dist (hoisted root `node_modules`).
3. **`Markdown.tsx`** — `useTheme().resolved` drives `shikiTheme: ['github-light', 'github-dark']` and `mermaid.config.theme` (`default` vs `dark`).
4. **Remove overly broad `pre` override** if it fights Shiki backgrounds.

## Risks / Trade-offs

- **[Risk] Wrong relative `@source` path** → Mitigation: build web/admin and visually verify.
- **[Risk] Mermaid still click-to-render** → Mitigation: rely on plugin default static behavior; document if button required.

## Migration Plan

Deploy CSS/TS only; no data migration. Rollback by reverting CSS and Markdown props.

## Open Questions

- Whether web needs a sidebar token change (web has no dark sidebar bar today).
