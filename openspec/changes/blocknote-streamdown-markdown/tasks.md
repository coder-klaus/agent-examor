## 1. Dependencies and profile

- [x] 1.1 Add BlockNote, math-block, Streamdown, and streamdown plugins to `packages/ui`; remove `@mdxeditor/editor`
- [x] 1.2 Add `docs/memor-markdown-profile.md` describing supported Markdown subset

## 2. Shared UI components

- [x] 2.1 Rewrite `MarkdownEditor.tsx` with BlockNote (math schema, MD load/save, theme-aware styles)
- [x] 2.2 Rewrite `Markdown.tsx` with Streamdown static + code/math/mermaid plugins and `==highlight==` preprocessing
- [x] 2.3 Update `globals.css` (remove MDXEditor rules; add BlockNote/Streamdown prose tokens)
- [x] 2.4 Configure Vite `optimizeDeps` in web and admin for new packages

## 3. Verification

- [x] 3.1 Run `pnpm install` and `make check` (or equivalent build/lint) until green
