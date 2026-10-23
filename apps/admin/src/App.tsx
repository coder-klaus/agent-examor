import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  DeckCombobox,
  MarkdownEditor,
  Modal,
  ToastProvider,
  ThemeToggle,
  brand,
  pickDefaultDeckTarget,
  useToast,
  type DeckRow,
  type DeckTarget,
} from '@memor/ui'
import { Database, Key, Layers, Plus, Settings2 } from 'lucide-react'

type Tab = 'add-card' | 'llm' | 'keys' | 'decks' | 'backup'

type TopicRow = { id: number; deckId: number; name: string }

type BackupFile = {
  schemaVersion: number
  decks: { id: number; name: string }[]
  topics: { id: number; deckId: number; name: string }[]
  cards: { id: number; deckId: number; topicId: number | null }[]
}

const api = (path: string, init?: RequestInit) =>
  fetch(path, { ...init, credentials: 'include' })

const nav: { id: Tab; label: string; icon: typeof Plus }[] = [
  { id: 'add-card', label: '添加卡片', icon: Plus },
  { id: 'decks', label: '牌组', icon: Layers },
  { id: 'llm', label: 'LLM', icon: Settings2 },
  { id: 'keys', label: 'API Key', icon: Key },
  { id: 'backup', label: '备份', icon: Database },
]

const cardEditorMinHeight = 'min(220px, 32dvh)'

type ApiKeyRow = {
  id: number
  name: string
  scopes: string[]
  createdAt: string
  lastUsedAt: string | null
}

const allScopes = ['cards:read', 'cards:write', 'export'] as const

function formatWhen(iso: string | null) {
  if (!iso) return '从未使用'
  return new Date(iso).toLocaleString('zh-CN')
}

function matchDeckSearch(name: string, q: string) {
  if (!q.trim()) return true
  return name.toLowerCase().includes(q.trim().toLowerCase())
}

function AdminApp() {
  const { push } = useToast()
  const [authChecked, setAuthChecked] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [loginPassword, setLoginPassword] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [tab, setTab] = useState<Tab>('add-card')
  const [cardTopic, setCardTopic] = useState('')
  const [cardQuestion, setCardQuestion] = useState('')
  const [cardAnswer, setCardAnswer] = useState('')
  const [cardsAddedSession, setCardsAddedSession] = useState(0)
  const [addingCard, setAddingCard] = useState(false)
  const [deckTarget, setDeckTarget] = useState<DeckTarget>({ mode: 'new', deckName: '默认牌组' })
  const [deckTargetInitialized, setDeckTargetInitialized] = useState(false)
  const [llm, setLlm] = useState({
    baseUrl: 'https://openrouter.ai/api/v1',
    apiKey: '',
    defaultModel: 'openai/gpt-4o-mini',
  })
  const [decks, setDecks] = useState<DeckRow[]>([])
  const [llmConfigured, setLlmConfigured] = useState(false)
  const [llmModels, setLlmModels] = useState<string[]>([])
  const [loadingModels, setLoadingModels] = useState(false)
  const [apiKeyRows, setApiKeyRows] = useState<ApiKeyRow[]>([])
  const [createKeyOpen, setCreateKeyOpen] = useState(false)
  const [keyName, setKeyName] = useState('')
  const [keyScopes, setKeyScopes] = useState<string[]>([...allScopes])
  const [revealedKey, setRevealedKey] = useState<string | null>(null)
  const [deckSearch, setDeckSearch] = useState('')
  const [createDeckOpen, setCreateDeckOpen] = useState(false)
  const [newDeckName, setNewDeckName] = useState('')
  const [editingDeckId, setEditingDeckId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [exportDeckId, setExportDeckId] = useState<number | ''>('')
  const [exportTopicKey, setExportTopicKey] = useState<string>('all')
  const [exportTopics, setExportTopics] = useState<TopicRow[]>([])
  const [importBackup, setImportBackup] = useState<BackupFile | null>(null)
  const [importSourceDeckId, setImportSourceDeckId] = useState<number | ''>('')
  const [importSourceTopicKey, setImportSourceTopicKey] = useState<string>('null')
  const [importTargetDeckId, setImportTargetDeckId] = useState<number | ''>('')
  const [importTargetTopicName, setImportTargetTopicName] = useState('')
  const [restoring, setRestoring] = useState(false)

  const reloadDecks = useCallback(async () => {
    const d = await api('/api/v1/decks').then((r) => r.json())
    setDecks(d)
    return d as DeckRow[]
  }, [])

  useEffect(() => {
    api('/api/v1/auth/session')
      .then((r) => r.json())
      .then((s) => {
        setAuthenticated(Boolean(s.authenticated))
        setAuthChecked(true)
      })
      .catch(() => setAuthChecked(true))
  }, [])

  useEffect(() => {
    if (!authenticated) return
    reloadDecks()
    api('/api/v1/llm/config')
      .then((r) => r.json())
      .then((c) => {
        setLlmConfigured(Boolean(c.configured))
        if (c.baseUrl) setLlm((x) => ({ ...x, baseUrl: c.baseUrl, defaultModel: c.defaultModel }))
      })
  }, [reloadDecks, authenticated])

  const reloadApiKeys = useCallback(async () => {
    const res = await api('/api/v1/api-keys')
    if (!res.ok) return
    setApiKeyRows(await res.json())
  }, [])

  useEffect(() => {
    if (tab === 'keys') reloadApiKeys()
  }, [tab, reloadApiKeys])

  useEffect(() => {
    if (!exportDeckId) {
      setExportTopics([])
      return
    }
    api(`/api/v1/decks/${exportDeckId}/topics`)
      .then((r) => r.json())
      .then((rows: TopicRow[]) => setExportTopics(rows))
  }, [exportDeckId])

  const importSourceTopicOptions = useMemo(() => {
    if (!importBackup || !importSourceDeckId) return []
    const deckId = importSourceDeckId
    const topicIds = new Set(
      importBackup.cards.filter((c) => c.deckId === deckId).map((c) => c.topicId),
    )
    const opts: { key: string; label: string }[] = []
    if (topicIds.has(null)) opts.push({ key: 'null', label: '（无主题）' })
    for (const t of importBackup.topics.filter((x) => x.deckId === deckId)) {
      if (topicIds.has(t.id)) opts.push({ key: String(t.id), label: t.name })
    }
    return opts
  }, [importBackup, importSourceDeckId])

  useEffect(() => {
    if (deckTargetInitialized || decks.length === 0) return
    setDeckTarget(pickDefaultDeckTarget(decks))
    setDeckTargetInitialized(true)
  }, [decks, deckTargetInitialized])

  const resolveDeckIdForCard = async (): Promise<number | null> => {
    if (deckTarget.mode === 'existing') return deckTarget.deckId
    const name = deckTarget.deckName.trim()
    if (!name) {
      push('请填写或选择牌组', 'error')
      return null
    }
    const res = await api('/api/v1/decks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (!res.ok) {
      push('创建牌组失败', 'error')
      return null
    }
    const row = await res.json()
    setDeckTarget({ mode: 'existing', deckId: row.id })
    await reloadDecks()
    return row.id as number
  }

  const addCard = async () => {
    const q = cardQuestion.trim()
    const a = cardAnswer.trim()
    if (!q || !a) {
      push('请填写问题和参考答案', 'error')
      return
    }
    setAddingCard(true)
    try {
      const deckId = await resolveDeckIdForCard()
      if (deckId == null) return
      const res = await api(`/api/v1/decks/${deckId}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: cardTopic.trim() || undefined,
          question: q,
          referenceAnswer: a,
        }),
      })
      if (!res.ok) {
        push('添加失败', 'error')
        return
      }
      setCardQuestion('')
      setCardAnswer('')
      setCardsAddedSession((n) => n + 1)
      push(`已添加（本会话 ${cardsAddedSession + 1} 张）`, 'success')
    } finally {
      setAddingCard(false)
    }
  }

  const visibleDecks = useMemo(() => {
    const filtered = decks.filter((d) => matchDeckSearch(d.name, deckSearch))
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
  }, [decks, deckSearch])

  const createDeck = async () => {
    const name = newDeckName.trim()
    if (!name) {
      push('请填写牌组名称', 'error')
      return
    }
    const res = await api('/api/v1/decks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (!res.ok) {
      push('创建失败', 'error')
      return
    }
    setNewDeckName('')
    setCreateDeckOpen(false)
    await reloadDecks()
    push('牌组已创建', 'success')
  }

  const saveRename = async (deckId: number) => {
    const name = editingName.trim()
    if (!name) return
    const res = await api(`/api/v1/decks/${deckId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (!res.ok) {
      push('重命名失败', 'error')
      return
    }
    setEditingDeckId(null)
    await reloadDecks()
    push('已重命名', 'success')
  }

  const deleteDeck = async (deckId: number, name: string) => {
    if (!confirm(`确定删除牌组「${name}」及其全部卡片？`)) return
    const res = await api(`/api/v1/decks/${deckId}`, { method: 'DELETE' })
    if (!res.ok) {
      push('删除失败', 'error')
      return
    }
    if (deckTarget.mode === 'existing' && deckTarget.deckId === deckId) {
      setDeckTarget({ mode: 'new', deckName: '默认牌组' })
      setDeckTargetInitialized(false)
    }
    await reloadDecks()
    push('牌组已删除', 'success')
  }

  const saveLlm = async () => {
    const payload: { baseUrl: string; defaultModel: string; apiKey?: string } = {
      baseUrl: llm.baseUrl,
      defaultModel: llm.defaultModel,
    }
    if (llm.apiKey.trim()) payload.apiKey = llm.apiKey.trim()
    const res = await api('/api/v1/llm/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      push(err.error ?? '保存失败', 'error')
      return
    }
    setLlmConfigured(true)
    setLlm((x) => ({ ...x, apiKey: '' }))
    push('LLM 配置已保存', 'success')
  }

  const loadLlmModels = async () => {
    setLoadingModels(true)
    try {
      const res = await api('/api/v1/llm/models')
      const data = await res.json()
      if (!res.ok) {
        push(data.error ?? '无法加载模型列表', 'error')
        return
      }
      setLlmModels(data.models ?? [])
      push(`已加载 ${(data.models ?? []).length} 个模型`, 'info')
    } finally {
      setLoadingModels(false)
    }
  }

  const testLlm = async () => {
    const res = await api('/api/v1/llm/test', { method: 'POST' })
    push(res.ok ? 'LLM 连通成功' : 'LLM 连通失败', res.ok ? 'success' : 'error')
  }

  const toggleKeyScope = (scope: string) => {
    setKeyScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    )
  }

  const createKey = async () => {
    const name = keyName.trim()
    if (!name) {
      push('请填写 Key 名称', 'error')
      return
    }
    if (keyScopes.length === 0) {
      push('请至少选择一个权限', 'error')
      return
    }
    const res = await api('/api/v1/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, scopes: keyScopes }),
    })
    const data = await res.json()
    if (!res.ok) {
      push('创建失败', 'error')
      return
    }
    setCreateKeyOpen(false)
    setKeyName('')
    setKeyScopes([...allScopes])
    setRevealedKey(data.key)
    await reloadApiKeys()
    push('已生成 API Key（仅显示一次）', 'success')
  }

  const revokeKey = async (id: number, name: string) => {
    if (!confirm(`撤销 Key「${name}」？撤销后无法用于 MCP。`)) return
    const res = await api(`/api/v1/api-keys/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      push('撤销失败', 'error')
      return
    }
    await reloadApiKeys()
    push('已撤销', 'success')
  }

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      push('已复制到剪贴板', 'success')
    } catch {
      push('复制失败', 'error')
    }
  }

  const downloadExport = async () => {
    if (!exportDeckId) {
      push('请选择牌组', 'error')
      return
    }
    const q = new URLSearchParams({ deckId: String(exportDeckId) })
    if (exportTopicKey !== 'all') q.set('topicId', exportTopicKey)
    const res = await api(`/api/v1/export/backup?${q}`)
    if (!res.ok) {
      push('导出失败', 'error')
      return
    }
    const data = await res.json()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `memor-backup-deck${exportDeckId}-${exportTopicKey}.json`
    a.click()
    URL.revokeObjectURL(url)
    push('已下载备份', 'success')
  }

  const onBackupFile = (file: File | null) => {
    if (!file) return
    file
      .text()
      .then((text) => {
        const data = JSON.parse(text) as BackupFile
        if (data.schemaVersion !== 1 || !Array.isArray(data.cards)) {
          push('无效的备份文件', 'error')
          return
        }
        setImportBackup(data)
        const deckIds = [...new Set(data.cards.map((c) => c.deckId))]
        if (deckIds.length === 1) setImportSourceDeckId(deckIds[0])
        push(`已读取 ${data.cards.length} 张卡片`, 'info')
      })
      .catch(() => push('无法解析 JSON', 'error'))
  }

  const runRestore = async () => {
    if (!importBackup || !importSourceDeckId || !importTargetDeckId) {
      push('请完成来源与目标牌组', 'error')
      return
    }
    const sourceTopicId =
      importSourceTopicKey === 'null' ? null : Number(importSourceTopicKey)
    setRestoring(true)
    try {
      const res = await api('/api/v1/import/library-restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          backup: importBackup,
          source: { deckId: importSourceDeckId, topicId: sourceTopicId },
          target: {
            deckId: importTargetDeckId,
            topicName: importTargetTopicName.trim() || undefined,
          },
          includeReviewStates: true,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        push(data.error ?? '导入失败', 'error')
        return
      }
      await reloadDecks()
      push(`已导入 ${data.imported} 张卡片`, 'success')
    } finally {
      setRestoring(false)
    }
  }

  const filteredModels = useMemo(() => {
    const q = llm.defaultModel.trim().toLowerCase()
    if (!q) return llmModels.slice(0, 80)
    return llmModels.filter((m) => m.toLowerCase().includes(q)).slice(0, 80)
  }, [llmModels, llm.defaultModel])

  const login = async () => {
    setLoggingIn(true)
    try {
      const res = await api('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPassword }),
      })
      if (!res.ok) {
        push('密码错误', 'error')
        return
      }
      setAuthenticated(true)
      setLoginPassword('')
      push('已登录', 'success')
    } finally {
      setLoggingIn(false)
    }
  }

  const logout = async () => {
    await api('/api/v1/auth/logout', { method: 'POST' })
    setAuthenticated(false)
    push('已退出', 'info')
  }

  const fieldClass =
    'mb-3 w-full rounded-[var(--radius-md)] border border-border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2'

  if (!authChecked) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-muted-foreground">
        加载中…
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>{brand.name} Admin</CardTitle>
            <CardDescription>请输入管理密码登录</CardDescription>
          </CardHeader>
          <input
            type="password"
            className={fieldClass}
            placeholder="管理密码"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') login()
            }}
          />
          <Button className="w-full" onClick={login} disabled={loggingIn || !loginPassword}>
            {loggingIn ? '登录中…' : '登录'}
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid min-h-dvh md:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="border-b border-border bg-sidebar p-4 text-sidebar-foreground md:border-b-0 md:border-r">
        <div className="mb-6 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">{brand.name} Admin</h2>
          <ThemeToggle className="min-h-9 shrink-0 px-2 text-sidebar-foreground" />
        </div>
        <Button variant="ghost" className="mb-3 w-full justify-start text-sidebar-muted" onClick={logout}>
          退出登录
        </Button>
        <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col">
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex min-h-10 items-center gap-2 rounded-[var(--radius-md)] px-3 text-left text-sm transition ${
                tab === id
                  ? 'bg-sidebar-active text-sidebar-foreground'
                  : 'text-sidebar-muted hover:bg-sidebar-active/70'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="min-h-0 overflow-y-auto bg-background">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 p-4 md:p-6">
        {tab === 'add-card' && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>添加卡片</CardTitle>
              <CardDescription>分别编辑问题与参考答案，确认后写入牌组，可连续添加</CardDescription>
            </CardHeader>
            <DeckCombobox decks={decks} target={deckTarget} onChange={setDeckTarget} />
            <label className="mb-1 block text-sm font-medium">主题（可选）</label>
            <input
              className={fieldClass}
              placeholder="如：高数 · 极限"
              value={cardTopic}
              onChange={(e) => setCardTopic(e.target.value)}
            />
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">问题 Q</label>
                <MarkdownEditor
                  value={cardQuestion}
                  onChange={setCardQuestion}
                  minHeight={cardEditorMinHeight}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">参考答案 A</label>
                <MarkdownEditor
                  value={cardAnswer}
                  onChange={setCardAnswer}
                  minHeight={cardEditorMinHeight}
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button onClick={addCard} disabled={addingCard}>确认添加</Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setCardQuestion('')
                  setCardAnswer('')
                }}
              >
                清空 Q/A
              </Button>
              {cardsAddedSession > 0 && (
                <span className="text-sm text-muted-foreground">本会话已添加 {cardsAddedSession} 张</span>
              )}
            </div>
          </Card>
        )}

        {tab === 'decks' && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>牌组</CardTitle>
              <CardDescription>按名称搜索、新建、重命名与删除</CardDescription>
            </CardHeader>
            <div className="mb-4 flex flex-wrap gap-2">
              <input
                className="min-w-[12rem] flex-1 rounded-[var(--radius-md)] border border-border bg-background px-3 py-2 text-sm"
                placeholder="搜索牌组名称"
                value={deckSearch}
                onChange={(e) => setDeckSearch(e.target.value)}
              />
              <Button onClick={() => setCreateDeckOpen(true)}>新建牌组</Button>
            </div>
            <Modal
              open={createDeckOpen}
              onClose={() => {
                setCreateDeckOpen(false)
                setNewDeckName('')
              }}
              title="新建牌组"
            >
              <label className="mb-4 block text-sm text-muted-foreground">
                名称
                <input
                  className="mt-1 w-full rounded-[var(--radius-md)] border border-border bg-background px-3 py-2 text-sm text-foreground"
                  placeholder="牌组名称"
                  value={newDeckName}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') createDeck()
                  }}
                />
              </label>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  data-modal-close
                  onClick={() => {
                    setCreateDeckOpen(false)
                    setNewDeckName('')
                  }}
                >
                  取消
                </Button>
                <Button onClick={createDeck}>创建</Button>
              </div>
            </Modal>
            <ul className="divide-y divide-border">
              {visibleDecks.map((d) => (
                <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                  {editingDeckId === d.id ? (
                    <div className="flex flex-1 gap-2">
                      <input
                        className="flex-1 rounded-[var(--radius-md)] border border-border bg-background px-2 py-1"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                      />
                      <Button variant="secondary" onClick={() => saveRename(d.id)}>保存</Button>
                      <Button variant="ghost" onClick={() => setEditingDeckId(null)}>取消</Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{d.name}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          className="min-h-8 px-2"
                          onClick={() => {
                            setEditingDeckId(d.id)
                            setEditingName(d.name)
                          }}
                        >
                          重命名
                        </Button>
                        <Button
                          variant="ghost"
                          className="min-h-8 px-2 text-danger"
                          onClick={() => deleteDeck(d.id, d.name)}
                        >
                          删除
                        </Button>
                      </div>
                    </>
                  )}
                </li>
              ))}
              {visibleDecks.length === 0 && (
                <li className="py-6 text-center text-muted-foreground">暂无匹配的牌组</li>
              )}
            </ul>
          </Card>
        )}

        {tab === 'llm' && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>LLM 配置</CardTitle>
              <CardDescription>OpenAI 兼容网关（OpenRouter / LiteLLM 等）</CardDescription>
            </CardHeader>
            <div className="max-w-2xl">
            <label className="text-sm font-medium">Base URL</label>
            <input className={fieldClass} value={llm.baseUrl} onChange={(e) => setLlm({ ...llm, baseUrl: e.target.value })} />
            <label className="text-sm font-medium">API Key</label>
            <input
              type="password"
              className={fieldClass}
              placeholder={llmConfigured ? '留空表示不修改已保存的 Key' : '必填'}
              value={llm.apiKey}
              onChange={(e) => setLlm({ ...llm, apiKey: e.target.value })}
            />
            <div className="mb-3 flex flex-wrap items-end gap-2">
              <div className="min-w-[12rem] flex-1">
                <label className="text-sm font-medium">Model</label>
                <input
                  className="mt-1 w-full rounded-[var(--radius-md)] border border-border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
                  list="llm-model-options"
                  value={llm.defaultModel}
                  onChange={(e) => setLlm({ ...llm, defaultModel: e.target.value })}
                  placeholder="模型 ID 或从列表选择"
                />
                <datalist id="llm-model-options">
                  {filteredModels.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>
              <Button variant="outline" onClick={loadLlmModels} disabled={loadingModels}>
                {loadingModels ? '加载中…' : '刷新模型列表'}
              </Button>
            </div>
            <div className="mt-2 flex gap-2">
              <Button onClick={saveLlm}>保存</Button>
              <Button variant="outline" onClick={testLlm}>测试连通</Button>
            </div>
            </div>
          </Card>
        )}

        {tab === 'keys' && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>MCP / API Key</CardTitle>
              <CardDescription>用于 `/mcp/invoke` 与自动化备份</CardDescription>
            </CardHeader>
            <div className="max-w-3xl">
              <div className="mb-4 flex justify-end">
                <Button onClick={() => setCreateKeyOpen(true)}>新建 Key</Button>
              </div>
              <ul className="divide-y divide-border">
                {apiKeyRows.map((k) => (
                  <li key={k.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                    <div>
                      <p className="font-medium">{k.name}</p>
                      <p className="text-muted-foreground">
                        {k.scopes.join(' · ')} · 创建于 {formatWhen(k.createdAt)} · {formatWhen(k.lastUsedAt)}
                      </p>
                    </div>
                    <Button variant="ghost" className="text-danger" onClick={() => revokeKey(k.id, k.name)}>
                      撤销
                    </Button>
                  </li>
                ))}
                {apiKeyRows.length === 0 && (
                  <li className="py-8 text-center text-muted-foreground">暂无 Key，点击「新建 Key」</li>
                )}
              </ul>
            </div>
            <Modal
              open={createKeyOpen}
              onClose={() => {
                setCreateKeyOpen(false)
                setKeyName('')
                setKeyScopes([...allScopes])
              }}
              title="新建 API Key"
            >
              <label className="mb-3 block text-sm text-muted-foreground">
                名称
                <input
                  className="mt-1 w-full rounded-[var(--radius-md)] border border-border bg-background px-3 py-2 text-sm text-foreground"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="如：Cursor MCP"
                />
              </label>
              <p className="mb-2 text-sm font-medium">权限</p>
              <div className="mb-4 flex flex-wrap gap-3">
                {allScopes.map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={keyScopes.includes(s)}
                      onChange={() => toggleKeyScope(s)}
                    />
                    {s}
                  </label>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setCreateKeyOpen(false)}>取消</Button>
                <Button onClick={createKey}>创建</Button>
              </div>
            </Modal>
            <Modal
              open={revealedKey != null}
              onClose={() => setRevealedKey(null)}
              title="请保存 Key（仅显示一次）"
            >
              <p className="mb-3 text-sm text-muted-foreground">
                关闭后无法再次查看明文，只能撤销并新建。
              </p>
              <code className="mb-4 block break-all rounded-md border border-border bg-muted/50 p-3 text-xs">
                {revealedKey}
              </code>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => revealedKey && copyText(revealedKey)}>复制</Button>
                <Button onClick={() => setRevealedKey(null)}>完成</Button>
              </div>
            </Modal>
          </Card>
        )}

        {tab === 'backup' && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>备份与恢复</CardTitle>
              <CardDescription>
                按牌组 + 库（主题）导出 JSON；导入时指定文件内来源库与目标库，ID 会重新映射
              </CardDescription>
            </CardHeader>
            <div className="grid gap-8 lg:grid-cols-2">
              <section>
                <h3 className="mb-3 text-sm font-semibold">导出</h3>
                <label className="mb-2 block text-sm">牌组</label>
                <select
                  className={fieldClass}
                  value={exportDeckId}
                  onChange={(e) =>
                    setExportDeckId(e.target.value ? Number(e.target.value) : '')
                  }
                >
                  <option value="">选择牌组</option>
                  {decks.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <label className="mb-2 block text-sm">库（主题）</label>
                <select
                  className={fieldClass}
                  value={exportTopicKey}
                  onChange={(e) => setExportTopicKey(e.target.value)}
                  disabled={!exportDeckId}
                >
                  <option value="all">整副牌组</option>
                  <option value="null">（无主题）</option>
                  {exportTopics.map((t) => (
                    <option key={t.id} value={String(t.id)}>{t.name}</option>
                  ))}
                </select>
                <Button onClick={downloadExport} disabled={!exportDeckId}>下载 JSON</Button>
              </section>
              <section>
                <h3 className="mb-3 text-sm font-semibold">导入</h3>
                <label className="mb-2 block text-sm">备份文件</label>
                <input
                  type="file"
                  accept="application/json,.json"
                  className={fieldClass}
                  onChange={(e) => onBackupFile(e.target.files?.[0] ?? null)}
                />
                {importBackup && (
                  <>
                    <label className="mb-2 block text-sm">文件中来源牌组 ID</label>
                    <select
                      className={fieldClass}
                      value={importSourceDeckId}
                      onChange={(e) =>
                        setImportSourceDeckId(e.target.value ? Number(e.target.value) : '')
                      }
                    >
                      <option value="">选择</option>
                      {importBackup.decks.map((d) => (
                        <option key={d.id} value={d.id}>{d.name} (#{d.id})</option>
                      ))}
                    </select>
                    <label className="mb-2 block text-sm">文件中来源库</label>
                    <select
                      className={fieldClass}
                      value={importSourceTopicKey}
                      onChange={(e) => setImportSourceTopicKey(e.target.value)}
                    >
                      {importSourceTopicOptions.map((o) => (
                        <option key={o.key} value={o.key}>{o.label}</option>
                      ))}
                    </select>
                    <label className="mb-2 block text-sm">导入到牌组</label>
                    <select
                      className={fieldClass}
                      value={importTargetDeckId}
                      onChange={(e) =>
                        setImportTargetDeckId(e.target.value ? Number(e.target.value) : '')
                      }
                    >
                      <option value="">选择</option>
                      {decks.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <label className="mb-2 block text-sm">目标库名称（主题，可新建）</label>
                    <input
                      className={fieldClass}
                      placeholder="留空则沿用来源库名或无主题"
                      value={importTargetTopicName}
                      onChange={(e) => setImportTargetTopicName(e.target.value)}
                    />
                    <Button onClick={runRestore} disabled={restoring}>
                      {restoring ? '导入中…' : '导入到目标库'}
                    </Button>
                  </>
                )}
              </section>
            </div>
          </Card>
        )}
        </div>
      </main>
    </div>
  )
}

export function App() {
  return (
    <ToastProvider>
      <AdminApp />
    </ToastProvider>
  )
}
