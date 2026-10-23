import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ThemeSetting = 'light' | 'dark' | 'system'
type Resolved = 'light' | 'dark'

const STORAGE_KEY = 'memor-theme'

type Ctx = {
  setting: ThemeSetting
  resolved: Resolved
  setSetting: (t: ThemeSetting) => void
  cycle: () => void
}

const ThemeContext = createContext<Ctx | null>(null)

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function resolve(setting: ThemeSetting): Resolved {
  if (setting === 'dark') return 'dark'
  if (setting === 'light') return 'light'
  return systemPrefersDark() ? 'dark' : 'light'
}

function applyDom(resolved: Resolved) {
  document.documentElement.classList.toggle('dark', resolved === 'dark')
  document.documentElement.style.colorScheme = resolved
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [setting, setSettingState] = useState<ThemeSetting>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY) as ThemeSetting | null
      if (s === 'light' || s === 'dark' || s === 'system') return s
    } catch {
      /* ignore */
    }
    return 'system'
  })

  const resolved = useMemo(() => resolve(setting), [setting])

  useEffect(() => {
    applyDom(resolved)
    try {
      localStorage.setItem(STORAGE_KEY, setting)
    } catch {
      /* ignore */
    }
  }, [setting, resolved])

  useEffect(() => {
    if (setting !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyDom(resolve('system'))
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [setting])

  const setSetting = useCallback((t: ThemeSetting) => setSettingState(t), [])

  const cycle = useCallback(() => {
    setSettingState((prev) => {
      if (prev === 'light') return 'dark'
      if (prev === 'dark') return 'system'
      return 'light'
    })
  }, [])

  const value = useMemo(
    () => ({ setting, resolved, setSetting, cycle }),
    [setting, resolved, setSetting, cycle],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
