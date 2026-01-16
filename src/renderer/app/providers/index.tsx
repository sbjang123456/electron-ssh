import { type ReactNode } from 'react'
import { ThemeProvider } from './theme-provider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
}

export { useTheme } from './theme-provider'
