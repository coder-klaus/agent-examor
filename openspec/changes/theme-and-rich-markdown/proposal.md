## Why

仅有系统 `prefers-color-scheme` 无法满足手动明暗切换；题目/导入仍用裸 `react-markdown` 与 `<textarea>`，缺少 GFM、代码高亮、公式、Mermaid 与 `==高亮==` 及分栏编辑体验。

## What Changes

- `@memor/ui`：`ThemeProvider`（light/dark/system + localStorage）、`ThemeToggle`、`.dark` token。
- 升级 `Markdown` 渲染管道（GFM、highlight、KaTeX、Mermaid 代码块、`==mark==`）。
- `MarkdownEditor`（分栏 MD 编辑器）用于 Admin 导入；Web/Admin 顶栏主题切换。
- 更新 `design-system`、`admin-console`、`web-review-experience` 规格。

## Capabilities

### Modified Capabilities

- `design-system`: 手动主题与持久化。
- `admin-console`: 富 Markdown 导入编辑。
- `web-review-experience`: 富 Markdown 题目/标答展示。

## Impact

- `packages/ui` 依赖增加；`apps/web`、`apps/admin` 入口与布局。
