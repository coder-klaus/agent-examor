## Context

Cards store `question` and `referenceAnswer` as Markdown strings. Admin bulk import uses a single Markdown document with `##` topics and `### Q` / `### A` sections. `@memor/ui` currently uses `@mdxeditor/editor` for admin import and `react-markdown` + remark/rehype for read paths in web.

## Goals / Non-Goals

**Goals:**

- Notion-like block editing in admin import via BlockNote; on save/export, emit Markdown via `blocksToMarkdownLossy()`.
- Unified read rendering via Streamdown `mode="static"` with code, math, and mermaid plugins (Shiki-based code).
- Register `@blocknote/math-block` (and diagram block if bundle acceptable) in the editor schema.
- Document Memor MD profile in-repo for authors and implementers.

**Non-Goals:**

- Storing Block JSON in the database.
- BlockNote read-only on every review card (too heavy).
- Streaming grade API changes (Streamdown streaming props reserved only).
- Per-card dual BlockNote fields (future); this change keeps single bulk import editor.

## Decisions

1. **Storage remains Markdown strings** — API and import parser unchanged; BlockNote is an editing codec only.
2. **BlockNote UI shell: `@blocknote/mantine`** — Matches BlockNote docs; theme aligned with existing `dark` class via MantineProvider or BlockNote CSS overrides in `globals.css`.
3. **Read path: Streamdown static** — Replace `Markdown.tsx` implementation; export name stays `Markdown` for app compatibility or alias `RichMarkdown` exporting as `Markdown`.
4. **Lossy round-trip** — On editor mount: `tryParseMarkdownToBlocks(value)`; on change debounced: `blocksToMarkdownLossy()` → `onChange(md)`. Accept that nested/custom blocks may flatten; profile documents supported features.
5. **`==highlight==`** — Preprocess with a small remark pass before Streamdown if the library lacks mark syntax; otherwise document as import-only via raw MD paste through HTML path later.
6. **Vite** — Add BlockNote and Streamdown to `optimizeDeps.include` in web and admin; lazy-load mermaid plugin where possible.

## Risks / Trade-offs

- **[Risk] MD export ≠ Streamdown render** → Mitigation: memor-markdown-profile doc + sample fixtures in UI package or smoke script.
- **[Risk] Bundle size** → Mitigation: code-split admin editor route; diagram block optional behind slash menu only.
- **[Risk] Workspace resolve `@mdxeditor` removal** → Mitigation: remove dep and grep; `pnpm install` at root.

## Migration Plan

1. Ship `@memor/ui` with new components and deps.
2. Admin uses new editor; existing saved MD in DB renders via Streamdown without migration.
3. Rollback: revert package versions and restore MDXEditor + react-markdown implementation.

## Open Questions

- Whether to keep optional Markdown source panel in admin (BlockNote has no built-in dual view; defer unless requested).
- Diagram block vs fenced `mermaid` only in v1.
