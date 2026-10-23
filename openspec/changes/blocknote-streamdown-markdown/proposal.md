## Why

Memor’s Markdown authoring and read paths use different stacks (MDXEditor vs `react-markdown`), which feels unlike Notion and can diverge in tables, code, math, and diagrams. We want Notion-like block editing while keeping Markdown as the stored interchange format, and a modern read renderer aligned with agent-style UIs (Shiki, block memoization, future streaming grading).

## What Changes

- Replace admin import/editor with **BlockNote** (block UX); persist **plain Markdown** via lossy export compatible with existing `### Q` / `### A` import.
- Replace learner/admin read path **`Markdown`** with **Streamdown** in static mode (GFM, math, mermaid, code via plugins).
- Extend BlockNote schema with official **math** (and diagram where practical) blocks; document a **Memor MD profile** for round-trip expectations.
- Remove **@mdxeditor/editor** dependency from `@memor/ui`.
- Reserve Streamdown streaming props for future LLM markdown streams (no API change in this change).

## Capabilities

### New Capabilities

- `memor-markdown-profile`: Documented subset of Markdown (GFM, math, mermaid, code) that import, BlockNote export, and Streamdown read SHALL support consistently.

### Modified Capabilities

- `design-system`: Shared components SHALL expose BlockNote-based editor and Streamdown-based reader instead of MDXEditor + react-markdown `Markdown`.
- `admin-console`: Import editor SHALL use BlockNote block editing while still committing Markdown strings to the API.
- `web-review-experience`: Card questions and grading Markdown fields SHALL render via the shared Streamdown reader.

## Impact

- **Packages**: `@memor/ui` — new deps `@blocknote/*`, `streamdown`, `@streamdown/code`, `@streamdown/mermaid`; remove `@mdxeditor/editor`.
- **Apps**: `apps/admin` (editor swap), `apps/web` (reader swap).
- **API / DB**: No schema changes; card fields remain Markdown strings.
- **Bundle**: Larger editor chunk; consider Vite `optimizeDeps` for BlockNote and lazy diagram plugins.
