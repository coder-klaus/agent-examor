# Memor Markdown profile

Card `question` and `reference_answer` fields use **plain Markdown strings** in the API and database.

## Supported syntax

| Feature | Syntax | Authoring | Read (Streamdown) |
|--------|--------|-----------|-------------------|
| GFM | headings, lists, tables, tasks, strikethrough, links, images | BlockNote (admin add-card) | Yes |
| Fenced code | ` ```lang ` | BlockNote | Shiki via `@streamdown/code` |
| Mermaid | ` ```mermaid ` | BlockNote / raw MD | `@streamdown/mermaid` |
| Math inline | `$...$` (enabled in reader) | `@blocknote/math-block` | `@streamdown/math` |
| Math block | `$$...$$` | math block in BlockNote | `@streamdown/math` |
| Highlight | `==text==` | raw MD / paste | `remark-mark` in reader |

## Lossy round-trip

BlockNote Markdown import/export may flatten nested structures or custom blocks. For interchange, treat exported Markdown from each card field as canonical; avoid relying on block-only features that do not serialize to this profile.
