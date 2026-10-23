## Why

After adopting Streamdown for Markdown reading, code blocks appear unstyled (black blocks, no Shiki highlighting) and Mermaid diagrams do not render reliably. In light theme, the admin sidebar also stays dark because sidebar tokens were never defined for light mode. Streamdown requires shadcn-compatible CSS variables and Tailwind v4 `@source` entries for its distributed class names.

## What Changes

- Map Memor design tokens to Streamdown/shadcn CSS variables (`--background`, `--foreground`, `--muted`, etc.) for light and dark.
- Add Tailwind `@source` paths for `streamdown` and `@streamdown/code` / `@streamdown/mermaid` in web and admin entry CSS.
- Use light sidebar colors in the default (light) theme; keep dark sidebar only under `.dark`.
- Wire `Markdown` to theme-aware `shikiTheme` and Mermaid config; enable diagram controls as needed for static cards.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `design-system`: Theme tokens SHALL support light-mode sidebar and Streamdown/shadcn variable bridge; Markdown reader SHALL render highlighted code and Mermaid in both themes.

## Impact

- `packages/ui` (`globals.css`, `Markdown.tsx`)
- `apps/web/src/index.css`, `apps/admin/src/index.css`
