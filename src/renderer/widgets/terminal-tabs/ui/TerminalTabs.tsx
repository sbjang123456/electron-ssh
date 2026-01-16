import { X, Terminal } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useSessionStore, type Session } from "@/entities/session";

export function TerminalTabs() {
  const { sessions, activeSessionId, setActiveSession, removeSession } =
    useSessionStore();

  const handleClose = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    window.electronAPI.ssh.disconnect(sessionId);
    removeSession(sessionId);
  };

  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center bg-[hsl(240,10%,6%)] border-b border-white/5">
      {/* Tabs container */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 overflow-x-auto flex-1">
        {sessions.map((session: Session) => (
          <div
            key={session.id}
            onClick={() => setActiveSession(session.id)}
            className={cn(
              "group relative flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer text-sm transition-all duration-150",
              activeSessionId === session.id
                ? "bg-[hsl(240,10%,12%)] text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5",
            )}
          >
            {/* Active indicator */}
            {activeSessionId === session.id && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-primary rounded-full" />
            )}

            {/* Status indicator */}
            <div className="relative flex-shrink-0">
              <Terminal className="h-3.5 w-3.5" />
              <span
                className={cn(
                  "absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-[hsl(240,10%,6%)]",
                  session.status === "connected" && "bg-emerald-500",
                  session.status === "connecting" &&
                    "bg-amber-500 animate-pulse",
                  session.status === "disconnected" && "bg-zinc-500",
                  session.status === "error" && "bg-red-500",
                )}
              />
            </div>

            {/* Tab content */}
            <span className="truncate max-w-[120px] font-medium text-xs">
              {session.connectionName}
            </span>

            {activeSessionId === session.id && (
              <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">
                {session.host}
              </span>
            )}

            {/* Close button */}
            <button
              onClick={(e) => handleClose(e, session.id)}
              className={cn(
                "ml-1 p-0.5 rounded transition-colors",
                "opacity-0 group-hover:opacity-100",
                "hover:bg-white/10",
                activeSessionId === session.id && "opacity-100",
              )}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Session count badge */}
      <div className="flex-shrink-0 px-3 py-1.5 border-l border-white/5">
        <span className="text-[10px] text-muted-foreground">
          {sessions.filter((s) => s.status === "connected").length}/
          {sessions.length} active
        </span>
      </div>
    </div>
  );
}
