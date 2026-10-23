## Context

Admin uses `md:grid-cols-[240px_1fr]` with `Card className="max-w-3xl"` on import and smaller caps on other tabs.

## Goals / Non-Goals

**Goals:** Wider cards, taller import editor, sticky preview column on `lg+`.

**Non-Goals:** New routes, mobile layout rewrite, card-level CRUD screens.

## Decisions

1. **Shell** — `main` is scrollable; inner `max-w-[1440px] w-full mx-auto px-4 md:px-6 py-4 md:py-6`.
2. **Import** — `lg:grid-cols-[minmax(0,1fr)_minmax(280px,24rem)]`; preview panel always visible when `preview` set, placeholder hint when empty.
3. **Editor height** — `MarkdownEditor` `minHeight="calc(100dvh - 12rem)"` with floor ~480px via `max(480px, calc(...))` in CSS.
4. **Forms** — LLM/keys: `w-full max-w-2xl` on inner form only, card still full shell width.

## Risks / Trade-offs

- Very wide BlockNote lines — acceptable for admin; preview column balances layout.
