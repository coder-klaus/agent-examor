## Why

学习者前台与管理端仍是 MVP 线框（裸 CSS、`alert`、无设计 token），与 FSRS+LLM 产品定位不匹配。需要统一设计系统，并吸收开源/线上标杆的优点：**Spaced2**（队列进度与清晰层级）、**Denki/OpenFlashcards**（一卡一屏专注与 Markdown）、**FlashForge/shadcn**（组件化 App shell 与可访问控件），在 MIT monorepo 内可维护实现。

## What Changes

- `@memor/ui`：Tailwind 主题 token、基础组件（Button、Card、Badge、Progress、Textarea、Markdown、Toast）。
- `apps/web`：移动优先复习壳层、今日/练习切换、队列进度、结构化阅卷反馈、空状态与 loading。
- `apps/admin`：侧栏 App shell、表单与预览区样式统一、Toast 替代 `alert`、Key 展示卡片。
- 扩写 `web-review-experience` 与 `admin-console` 规格中可测的 UI/UX 要求；新增 `design-system` capability。

## Capabilities

### New Capabilities

- `design-system`: 共享 token、组件与双端一致视觉语言（含浅色默认与系统暗色）。

### Modified Capabilities

- `web-review-experience`: 队列可见性、阅卷反馈分区、Markdown 题目展示。
- `admin-console`: 导入预览信息架构、非阻塞通知、桌面 shell。

## Impact

- `packages/ui`、`apps/web`、`apps/admin` 依赖与 Vite/Tailwind 配置
- 无 API 契约变更
