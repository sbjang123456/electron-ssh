import { useCallback, useEffect, useRef } from 'react'
import '@xterm/xterm/css/xterm.css'
import { createTerminal, fitTerminal, type XTermInstance } from '../lib/xterm-setup'

interface TerminalViewProps {
  sessionId: string
  isActive: boolean
}

export function TerminalView({ sessionId, isActive }: TerminalViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTermInstance | null>(null)

  const handleResize = useCallback(() => {
    if (!xtermRef.current) return
    const dimensions = fitTerminal(xtermRef.current.fitAddon)
    if (dimensions) {
      window.electronAPI.ssh.resize(sessionId, dimensions.cols, dimensions.rows)
    }
  }, [sessionId])

  useEffect(() => {
    if (!containerRef.current || xtermRef.current) return

    const xterm = createTerminal()
    xtermRef.current = xterm

    xterm.terminal.open(containerRef.current)

    setTimeout(() => {
      handleResize()
      xterm.terminal.focus()
    }, 100)

    xterm.terminal.onData((data) => {
      window.electronAPI.ssh.sendData(sessionId, data)
    })

    const removeDataListener = window.electronAPI.ssh.onData((id, data) => {
      if (id === sessionId) {
        xterm.terminal.write(data)
      }
    })

    const resizeObserver = new ResizeObserver(() => {
      handleResize()
    })
    resizeObserver.observe(containerRef.current)

    return () => {
      removeDataListener()
      resizeObserver.disconnect()
      xterm.terminal.dispose()
      xtermRef.current = null
    }
  }, [sessionId, handleResize])

  useEffect(() => {
    if (isActive && xtermRef.current) {
      xtermRef.current.terminal.focus()
      handleResize()
    }
  }, [isActive, handleResize])

  return (
    <div ref={containerRef} className="h-full w-full bg-[#1e1e1e]" style={{ padding: '8px' }} />
  )
}
