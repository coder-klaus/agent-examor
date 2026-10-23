## Why

Admin 导入仍使用分栏 Markdown 编辑器（`@uiw/react-md-editor`），编辑时以源码为主，不符合「所见即所得」预期。需要在仍存储 **纯 Markdown** 的前提下，提供单栏 WYSIWYG 编辑体验。

## What Changes

- 将 `@memor/ui` 的 `MarkdownEditor` 替换为 **MDXEditor**（WYSIWYG，可切换源码视图）。
- 移除 `@uiw/react-md-editor` 依赖。
- 更新 `admin-console` 规格：导入编辑为 WYSIWYG Markdown。

## Capabilities

### Modified Capabilities

- `admin-console`: 富文本导入编辑器定义为 WYSIWYG（持久化 Markdown）。

## Impact

- `packages/ui` 仅 `MarkdownEditor` 实现与依赖；Admin 无 API 变更。
