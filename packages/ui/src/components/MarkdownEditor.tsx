import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
import { BlockNoteSchema, createCodeBlockSpec } from '@blocknote/core'
import { codeBlockOptions, syntaxHighlighter } from '@blocknote/code-block'
import { en } from '@blocknote/core/locales'
import { BlockNoteView } from '@blocknote/mantine'
import { createReactMathBlockSpec, createReactInlineMathSpec } from '@blocknote/math-block'
import { useCreateBlockNote } from '@blocknote/react'
import { MantineProvider } from '@mantine/core'
import { useEffect, useRef } from 'react'
import { useTheme } from '../theme/ThemeProvider'
import { cn } from '../lib/cn'

const schema = BlockNoteSchema.create().extend({
  blockSpecs: {
    codeBlock: createCodeBlockSpec(codeBlockOptions),
    mathBlock: createReactMathBlockSpec(),
  },
  inlineContentSpecs: {
    math: createReactInlineMathSpec(),
  },
})

export function MarkdownEditor({
  value,
  onChange,
  height = 360,
  minHeight,
  className,
}: {
  value: string
  onChange: (v: string) => void
  height?: number
  /** CSS length, e.g. `calc(100dvh - 12rem)` or `max(480px, 60dvh)` */
  minHeight?: string
  className?: string
}) {
  const { resolved } = useTheme()
  const lastEmitted = useRef(value)
  const syncing = useRef(false)
  const initialized = useRef(false)

  const editor = useCreateBlockNote({
    schema,
    dictionary: en,
    extensions: [syntaxHighlighter],
  })

  useEffect(() => {
    if (!editor || initialized.current) return
    initialized.current = true
    syncing.current = true
    const blocks = editor.tryParseMarkdownToBlocks(value || '')
    editor.replaceBlocks(editor.document, blocks)
    lastEmitted.current = value
    syncing.current = false
  }, [editor, value])

  useEffect(() => {
    if (!editor) return
    return editor.onChange(() => {
      if (syncing.current) return
      const md = editor.blocksToMarkdownLossy()
      if (md === lastEmitted.current) return
      lastEmitted.current = md
      onChange(md)
    })
  }, [editor, onChange])

  return (
    <MantineProvider forceColorScheme={resolved === 'dark' ? 'dark' : 'light'}>
      <div
        className={cn(
          'blocknote-editor-root overflow-hidden rounded-[var(--radius-md)] border border-border bg-card',
          minHeight && 'flex min-h-0 flex-col [&_.bn-container]:min-h-[inherit]',
          className,
        )}
        style={{ minHeight: minHeight ?? height }}
      >
        <BlockNoteView editor={editor} theme={resolved === 'dark' ? 'dark' : 'light'} />
      </div>
    </MantineProvider>
  )
}
