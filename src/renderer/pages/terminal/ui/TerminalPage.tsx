import { AlertCircle, Loader2, Terminal, WifiOff } from 'lucide-react'
import { useEffect } from 'react'
import { useSessionStore } from '@/entities/session'
import { ConnectionList } from '@/widgets/connection-list'
import { TerminalTabs } from '@/widgets/terminal-tabs'
import { TerminalView } from '@/widgets/terminal-view'

export function TerminalPage() {
  const { sessions, activeSessionId, updateSessionStatus } = useSessionStore()

  useEffect(() => {
    const removeCloseListener = window.electronAPI.ssh.onClose((sessionId) => {
      updateSessionStatus(sessionId, 'disconnected')
    })

    const removeErrorListener = window.electronAPI.ssh.onError((sessionId, error) => {
      updateSessionStatus(sessionId, 'error', error)
    })

    return () => {
      removeCloseListener()
      removeErrorListener()
    }
  }, [updateSessionStatus])

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Connection List */}
      <div className="w-72 border-r border-white/5 flex-shrink-0">
        <ConnectionList />
      </div>

      {/* Main Content - Terminal Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[hsl(240,10%,8%)]">
        {/* Draggable area + Tabs */}
        <div className="flex flex-col">
          {/* Draggable Title Bar for main area */}
          <div className="h-10 flex-shrink-0 titlebar border-b border-white/5" />
          <TerminalTabs />
        </div>

        <div className="flex-1 relative">
          {sessions.length === 0 ? (
            /* Empty State */
            <div className="flex items-center justify-center h-full">
              <div className="text-center animate-fade-in">
                <div className="relative mb-6">
                  <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full" />
                  <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                    <Terminal className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">No Active Sessions</h2>
                <p className="text-sm text-muted-foreground max-w-[280px]">
                  Select a connection from the sidebar or create a new one to start your SSH session
                </p>
                <div className="flex items-center justify-center gap-6 mt-8 text-xs text-muted-foreground/60">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    Connected
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    Connecting
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-zinc-500" />
                    Disconnected
                  </div>
                </div>
              </div>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="absolute inset-0"
                style={{
                  display: session.id === activeSessionId ? 'block' : 'none',
                }}
              >
                {session.status === 'connected' ? (
                  <TerminalView sessionId={session.id} isActive={session.id === activeSessionId} />
                ) : session.status === 'connecting' ? (
                  /* Connecting State */
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center animate-fade-in">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 blur-3xl bg-amber-500/20 rounded-full animate-pulse" />
                        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/20">
                          <Loader2 className="h-12 w-12 text-amber-500 animate-spin" />
                        </div>
                      </div>
                      <h2 className="text-xl font-semibold text-foreground mb-2">Connecting...</h2>
                      <p className="text-sm text-muted-foreground">
                        Establishing connection to{' '}
                        <span className="text-amber-500">{session.connectionName}</span>
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">{session.host}</p>
                    </div>
                  </div>
                ) : session.status === 'error' ? (
                  /* Error State */
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center animate-fade-in">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 blur-3xl bg-red-500/20 rounded-full" />
                        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/20">
                          <AlertCircle className="h-12 w-12 text-red-500" />
                        </div>
                      </div>
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        Connection Failed
                      </h2>
                      <p className="text-sm text-red-400 max-w-[300px]">
                        {session.error || 'Unable to establish SSH connection'}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-3">
                        Check your credentials and try again
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Disconnected State */
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center animate-fade-in">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 blur-3xl bg-zinc-500/10 rounded-full" />
                        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                          <WifiOff className="h-12 w-12 text-zinc-400" />
                        </div>
                      </div>
                      <h2 className="text-xl font-semibold text-foreground mb-2">Session Ended</h2>
                      <p className="text-sm text-muted-foreground">
                        Connection to{' '}
                        <span className="text-foreground">{session.connectionName}</span> was closed
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
