## Decisions

| 项 | 选择 |
|----|------|
| 主题 | `memor-theme` in localStorage；`html.dark`；首屏 inline script 防闪 |
| 编辑 | `@uiw/react-md-editor`（存 Markdown 字符串，非 HTML） |
| 渲染 | `react-markdown` + remark-gfm/math/mark + rehype-katex/highlight |
| Mermaid | fenced `mermaid` 代码块 → 客户端 `mermaid` 渲染 |
| Admin 侧栏 | CSS 变量 `--color-sidebar-*`，随 `.dark` 变化 |

## Non-Goals

- 移动端翻转卡；Web PC 作答 MD 编辑器（后续 change）。
