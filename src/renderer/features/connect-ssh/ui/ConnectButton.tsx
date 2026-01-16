import { Check, Loader2, Play } from 'lucide-react'
import { useState } from 'react'
import type { ConnectionSafe } from '@/entities/connection'
import { useSessionStore } from '@/entities/session'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui'

interface ConnectButtonProps {
  connection: ConnectionSafe
}

export function ConnectButton({ connection }: ConnectButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const { addSession, updateSessionStatus, getSessionByConnectionId } = useSessionStore()

  const existingSession = getSessionByConnectionId(connection.id)
  const isConnected = existingSession?.status === 'connected'

  const handleConnect = async () => {
    if (isConnected) return

    setIsConnecting(true)

    const tempSession = {
      id: `temp-${Date.now()}`,
      connectionId: connection.id,
      connectionName: connection.name,
      host: connection.host,
      status: 'connecting' as const,
    }
    addSession(tempSession)

    try {
      const result = await window.electronAPI.ssh.connect(connection.id)
      updateSessionStatus(tempSession.id, 'connected')

      useSessionStore.setState((state) => ({
        sessions: state.sessions.map((s) =>
          s.id === tempSession.id
            ? {
                ...s,
                id: result.sessionId,
                connectedAt: new Date().toISOString(),
              }
            : s
        ),
        activeSessionId: result.sessionId,
      }))
    } catch (error) {
      updateSessionStatus(tempSession.id, 'error', (error as Error).message)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Button
      size="sm"
      onClick={handleConnect}
      disabled={isConnecting || isConnected}
      className={cn(
        'h-8 w-8 p-0 transition-all duration-200',
        isConnected
          ? 'bg-primary/20 text-primary hover:bg-primary/30 border-primary/30'
          : 'bg-primary hover:bg-primary/90 glow-sm hover:glow'
      )}
    >
      {isConnecting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isConnected ? (
        <Check className="h-4 w-4" />
      ) : (
        <Play className="h-4 w-4 ml-0.5" />
      )}
    </Button>
  )
}
