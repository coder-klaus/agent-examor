## Context

双端 React 19 + Vite；`packages/ui` 仅占位 brand。参考产品优点合并为一套克制现代风（非重度玻璃拟态）。

## Goals / Non-Goals

**Goals:**

- Tailwind v4 + `@tailwindcss/vite`  per app；主题 CSS 由 `@memor/ui/styles.css` 导出。
- Web：顶栏统计（剩余/模式）、进度条、题目 Card、作答区、Grading 分区（分数 Badge、标答/错因/改进）。
- Admin：深色侧栏 + 浅色内容（FlashForge/Supabase 式）；导入步骤 Preview → Commit；inline 状态。
- `react-markdown` 渲染题目与标答；`lucide-react` 图标；`cn()` 合并 class。

**Non-Goals:**

- 完整 shadcn CLI 代码生成；统计大屏；PWA；主题切换 UI（跟随 `prefers-color-scheme` 即可）。

## Decisions

| 来源 | 吸收点 | 实现 |
|------|--------|------|
| Spaced2 | 今日队列、进度感 | header stats + Progress |
| Denki | 单卡专注 | 主内容区最大宽度、弱化 chrome |
| OpenFlashcards | Markdown 卡面 | Markdown 组件 |
| FlashForge | App shell | web header / admin sidebar |
| shadcn 思路 | 变体按钮、Card | 手写轻量组件，避免复制整库 |

## Risks / Trade-offs

- Tailwind 扫描 `packages/ui` 路径 → 各 app Vite 需 `@source` 或 content 包含 ui 包（Tailwind 4 `@source` in CSS）。
