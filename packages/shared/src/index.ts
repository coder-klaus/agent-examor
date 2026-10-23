export type ApiScope = 'cards:read' | 'cards:write' | 'export'

export type GradingResult = {
  score: number
  standardAnswer: string
  mistakes: string[]
  improvements: string[]
  raw?: string
}
