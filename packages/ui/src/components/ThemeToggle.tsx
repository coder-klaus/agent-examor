import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '../theme/ThemeProvider'
import { Button } from './Button'

const icons = { light: Sun, dark: Moon, system: Monitor } as const

export function ThemeToggle({ className }: { className?: string }) {
  const { setting, cycle } = useTheme()
  const Icon = icons[setting]
  const label =
    setting === 'light' ? '浅色' : setting === 'dark' ? '深色' : '跟随系统'

  return (
    <Button
      type="button"
      variant="ghost"
      className={className}
      onClick={cycle}
      title={`主题：${label}（点击切换）`}
      aria-label={`主题：${label}`}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}
