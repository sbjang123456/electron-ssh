import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { Terminal } from '@xterm/xterm'
import type { TerminalTheme } from '@/entities/session'

export interface XTermInstance {
  terminal: Terminal
  fitAddon: FitAddon
}

export function createTerminal(theme?: TerminalTheme): XTermInstance {
  const terminal = new Terminal({
    cursorBlink: true,
    cursorStyle: 'block',
    fontSize: 14,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    lineHeight: 1.2,
    theme: theme || {
      background: '#1e1e1e',
      foreground: '#d4d4d4',
      cursor: '#d4d4d4',
      cursorAccent: '#1e1e1e',
      selectionBackground: 'rgba(255, 255, 255, 0.3)',
    },
    allowTransparency: true,
    scrollback: 10000,
  })

  const fitAddon = new FitAddon()
  const webLinksAddon = new WebLinksAddon()

  terminal.loadAddon(fitAddon)
  terminal.loadAddon(webLinksAddon)

  return { terminal, fitAddon }
}

export function fitTerminal(fitAddon: FitAddon): { cols: number; rows: number } | null {
  try {
    fitAddon.fit()
    const dimensions = fitAddon.proposeDimensions()
    return dimensions ? { cols: dimensions.cols, rows: dimensions.rows } : null
  } catch {
    return null
  }
}
