import { type ReactNode, useMemo } from 'react'
import { Streamdown } from 'streamdown'
import { code } from '@streamdown/code'
import { mermaid } from '@streamdown/mermaid'
import { createMathPlugin } from '@streamdown/math'
import remarkMark from 'remark-mark'
import 'katex/dist/katex.min.css'
import 'streamdown/styles.css'
import { cn } from '../lib/cn'
import { useTheme } from '../theme/ThemeProvider'

const math = createMathPlugin({ singleDollarTextMath: true })

const plugins = { code, mermaid, math }

const shikiThemes = ['github-light', 'github-dark'] as [string, string]

export function Markdown({ content, className }: { content: string; className?: string }) {
  const { resolved } = useTheme()

  const mermaidOptions = useMemo(
    () => ({
      config: {
        theme: resolved === 'dark' ? 'dark' : 'default',
      },
    }),
    [resolved],
  )

  const components = useMemo(
    () => ({
      mark({ children }: { children?: ReactNode }) {
        return (
          <mark className="rounded bg-amber-200/80 px-0.5 dark:bg-amber-500/40">{children}</mark>
        )
      },
    }),
    [],
  )

  return (
    <div
      className={cn(
        'markdown-body max-w-none text-sm leading-relaxed text-foreground',
        '[&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm [&_h3]:font-semibold',
        '[&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5',
        className,
      )}
    >
      <Streamdown
        mode="static"
        plugins={plugins}
        remarkPlugins={[remarkMark]}
        components={components}
        className="streamdown-memor"
        shikiTheme={shikiThemes}
        mermaid={mermaidOptions}
        controls={{ code: true, mermaid: true }}
      >
        {content}
      </Streamdown>
    </div>
  )
}
