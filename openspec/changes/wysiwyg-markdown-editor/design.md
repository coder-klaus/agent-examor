## Decisions

| 项 | 选择 |
|----|------|
| 编辑器 | `@mdxeditor/editor` WYSIWYG + `diffSourcePlugin` 源码切换 |
| 存储 | `onChange` 输出 Markdown 字符串，与 `parseImportMarkdown` 兼容 |
| 主题 | `useTheme().resolved` → editor `className` dark/light |
| 公式/Mermaid | 编辑期通过代码块或源码模式；复习仍用现有 `Markdown` 渲染 |

## Non-Goals

- Web 学习者作答区 WYSIWYG（后续 change）。
