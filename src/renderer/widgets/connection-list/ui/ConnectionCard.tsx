import { Server, Clock, Key, Lock } from "lucide-react";
import { ConnectButton } from "@/features/connect-ssh";
import { DeleteConnectionDialog } from "@/features/delete-connection";
import { useSessionStore } from "@/entities/session";
import type { ConnectionSafe } from "@/entities/connection";
import { cn } from "@/shared/lib/utils";

interface ConnectionCardProps {
  connection: ConnectionSafe;
}

export function ConnectionCard({ connection }: ConnectionCardProps) {
  const { sessions } = useSessionStore();
  const activeSession = sessions.find(
    (s) => s.connectionId === connection.id && s.status === "connected",
  );
  const isConnected = !!activeSession;

  const formatLastConnected = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={cn(
        "group relative rounded-lg transition-all duration-200",
        "bg-gradient-to-r from-white/[0.03] to-transparent",
        "hover:from-white/[0.06] hover:to-white/[0.02]",
        "border border-white/[0.06] hover:border-white/[0.1]",
        isConnected && "border-primary/30 from-primary/[0.05]",
      )}
    >
      {/* Connected indicator */}
      {isConnected && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-primary rounded-r-full" />
      )}

      <div className="p-3">
        <div className="flex items-start justify-between gap-3">
          {/* Left side - Icon and Info */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div
              className={cn(
                "p-2 rounded-lg transition-colors flex-shrink-0",
                isConnected
                  ? "bg-primary/20 text-primary"
                  : "bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-foreground",
              )}
            >
              <Server className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm truncate">
                  {connection.name}
                </h3>
                {isConnected && (
                  <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-medium bg-primary/20 text-primary rounded-full">
                    LIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {connection.username}@{connection.host}
              </p>

              {/* Meta info row */}
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
                  {connection.authMethod === "password" ? (
                    <Lock className="h-3 w-3" />
                  ) : (
                    <Key className="h-3 w-3" />
                  )}
                  {connection.authMethod === "password" ? "Password" : "Key"}
                </span>
                <span className="text-[10px] text-muted-foreground/70">
                  Port {connection.port}
                </span>
                {connection.lastConnectedAt && (
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
                    <Clock className="h-3 w-3" />
                    {formatLastConnected(connection.lastConnectedAt)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <ConnectButton connection={connection} />
            <DeleteConnectionDialog connection={connection} />
          </div>
        </div>
      </div>
    </div>
  );
}
