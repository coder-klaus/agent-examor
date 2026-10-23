import { useEffect, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Markdown,
  Progress,
  Textarea,
  ThemeToggle,
  brand,
} from '@memor/ui'
import { BookOpen, Loader2, RefreshCw, Sparkles } from 'lucide-react'

type DueRow = { card: { id: number; question: string }; state: unknown }
type Grading = {
  score: number
  standardAnswer: string
  mistakes: string[]
  improvements: string[]
}

const api = (path: string, init?: RequestInit) => fetch(path, init)

export function App() {
  const [queue, setQueue] = useState<DueRow[]>([])
  const [current, setCurrent] = useState<DueRow | null>(null)
  const [answer, setAnswer] = useState('')
  const [grading, setGrading] = useState<Grading | null>(null)
  const [mode, setMode] = useState<'today' | 'practice'>('today')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [sessionTotal, setSessionTotal] = useState(0)

  const remaining = queue.length
  const completedInSession = sessionTotal - remaining + (grading ? 1 : 0)
  const sessionProgress = sessionTotal > 0 ? (completedInSession / sessionTotal) * 100 : 0

  const load = async () => {
    setLoading(true)
    setGrading(null)
    setAnswer('')
    try {
      const path = mode === 'today' ? '/api/v1/review/today' : '/api/v1/review/practice'
      const res = await api(path)
      const data = await res.json()
      const rows =
        mode === 'today' ? data : data.map((c: { id: number; question: string }) => ({ card: c }))
      setQueue(rows)
      setSessionTotal(rows.length)
      setCurrent(rows[0] ?? null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [mode])

  const submit = async () => {
    if (!current) return
    setSubmitting(true)
    try {
      const res = await api(`/api/v1/cards/${current.card.id}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer, practice: mode === 'practice' }),
      })
      setGrading(await res.json())
    } finally {
      setSubmitting(false)
    }
  }

  const next = () => {
    const rest = queue.slice(1)
    setQueue(rest)
    setCurrent(rest[0] ?? null)
    setAnswer('')
    setGrading(null)
  }

  const scoreTone = (score: number) => {
    if (score >= 80) return 'success' as const
    if (score >= 60) return 'warning' as const
    return 'default' as const
  }

  return (
    <div className="mx-auto min-h-dvh max-w-lg px-4 py-6 md:max-w-2xl md:py-10">
      <header className="mb-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-primary/15 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">{brand.name}</h1>
                <p className="text-sm text-muted-foreground">间隔复习 · AI 阅卷</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle className="min-h-9 px-2" />
            <Button variant="ghost" className="min-h-9 px-2" onClick={load} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="flex gap-2 rounded-[var(--radius-md)] bg-muted p-1">
          <Button
            variant={mode === 'today' ? 'primary' : 'ghost'}
            className="flex-1 min-h-9"
            onClick={() => setMode('today')}
          >
            今日
          </Button>
          <Button
            variant={mode === 'practice' ? 'primary' : 'ghost'}
            className="flex-1 min-h-9"
            onClick={() => setMode('practice')}
          >
            练习
          </Button>
        </div>

        {sessionTotal > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {mode === 'today' ? '今日队列' : '练习模式'}
              </span>
              <Badge tone="muted">剩余 {remaining} 张</Badge>
            </div>
            <Progress value={sessionProgress} max={100} />
          </div>
        )}
      </header>

      {loading ? (
        <Card className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          加载队列…
        </Card>
      ) : !current ? (
        <Card className="text-center py-12">
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-primary" />
          <CardTitle className="text-base">暂无题目</CardTitle>
          <CardDescription>在管理端导入 Markdown 题库后开始复习。</CardDescription>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>题目</CardTitle>
              <CardDescription>尽量用自己的话作答</CardDescription>
            </CardHeader>
            <Markdown content={current.card.question} />
          </Card>

          {!grading ? (
            <Card>
              <CardHeader>
                <CardTitle>你的回答</CardTitle>
              </CardHeader>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="输入答案…"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit()
                }}
              />
              <Button
                className="mt-4 w-full"
                onClick={submit}
                disabled={submitting || !answer.trim()}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> 阅卷中…
                  </>
                ) : (
                  '提交阅卷'
                )}
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">⌘/Ctrl + Enter 提交</p>
            </Card>
          ) : (
            <Card className="space-y-4 border-primary/20">
              <div className="flex items-center justify-between">
                <CardTitle>阅卷结果</CardTitle>
                <Badge tone={scoreTone(grading.score)}>得分 {grading.score}</Badge>
              </div>

              <section className="rounded-[var(--radius-md)] bg-muted p-3">
                <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  参考答案
                </h3>
                <Markdown content={grading.standardAnswer} />
              </section>

              {grading.mistakes?.length ? (
                <section>
                  <h3 className="mb-2 text-sm font-medium text-danger">错因</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {grading.mistakes.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {grading.improvements?.length ? (
                <section>
                  <h3 className="mb-2 text-sm font-medium text-primary">改进建议</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {grading.improvements.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <Button className="w-full" onClick={next}>
                下一题
              </Button>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
