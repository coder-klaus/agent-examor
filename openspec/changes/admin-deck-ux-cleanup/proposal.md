## Why

The admin **牌组** tab exposes internal deck IDs, inline “new deck” fields, and sort toggles that add noise without matching how operators actually find and manage decks. A cleaner toolbar (name search + primary **新建牌组** action) and a modal for creation align with the rest of the desktop-first admin experience.

## What Changes

- Replace the inline “新牌组名称 + 新建” row with a **新建牌组** button that opens a modal dialog (name input, cancel/confirm).
- Keep deck list filtering as **name substring** search only; remove visible **按名称 / 按创建时间** sort controls and default the list to name order (`zh-CN` locale).
- Remove **`#id`** display from deck list rows (IDs remain internal for API calls).
- Add a reusable **Modal** (or Dialog) primitive in `@memor/ui` for admin and future flows.
- Optionally reuse the same create-deck modal pattern from the decks tab only in this change (DeckCombobox unchanged unless tasks specify).

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `admin-console`: Deck management UX requirements (search, create flow, list presentation).

## Impact

- `apps/admin/src/App.tsx` — decks tab UI and state.
- `packages/ui` — new Modal component export.
- No API or MCP contract changes.
