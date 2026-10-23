## Why

On wide screens the admin UI leaves large empty margins because each tab wraps content in narrow `max-w-xl`–`max-w-3xl` cards while the main area is full width. The import editor uses a fixed 360px height, which feels cramped for BlockNote workflows. Desktop-first admin should use available width and vertical space.

## What Changes

- Introduce a consistent admin content shell: full-width up to a generous max (e.g. 1440px), no per-tab `max-w-2xl` caps on primary work surfaces.
- Import tab: two-column layout on large viewports (editor left, preview/summary right); taller BlockNote editor using viewport-based min-height.
- Decks, LLM, and Keys tabs: use full shell width; LLM/keys may keep a readable inner max only for form fields if needed.
- Optional `MarkdownEditor` prop for viewport-relative min-height.

## Capabilities

### Modified Capabilities

- `admin-console`: Desktop layouts SHALL use available horizontal and vertical space on wide viewports without leaving unused gutters beside primary management tasks.

## Impact

- `apps/admin/src/App.tsx`
- `packages/ui/src/components/MarkdownEditor.tsx` (minor layout props)
