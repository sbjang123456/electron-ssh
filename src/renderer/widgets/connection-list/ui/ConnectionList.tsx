import { useEffect } from "react";
import { Server, Terminal, Wifi } from "lucide-react";
import { ScrollArea } from "@/shared/ui";
import { useConnectionStore } from "@/entities/connection";
import { CreateConnectionDialog } from "@/features/create-connection";
import { ConnectionCard } from "./ConnectionCard";

export function ConnectionList() {
  const { connections, setConnections, isLoading, setLoading } =
    useConnectionStore();

  useEffect(() => {
    const loadConnections = async () => {
      setLoading(true);
      try {
        const data = await window.electronAPI.connection.getAll();
        setConnections(data);
      } catch (error) {
        console.error("Failed to load connections:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConnections();
  }, [setConnections, setLoading]);

  return (
    <div className="flex flex-col h-full bg-[hsl(240,10%,6%)]">
      {/* Draggable Title Bar Area */}
      <div className="h-10 flex-shrink-0 titlebar" />

      {/* Header */}
      <div className="px-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10 ring-1 ring-primary/20">
            <Terminal className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">SSH Client</h1>
            <p className="text-xs text-muted-foreground">
              Secure Shell Connections
            </p>
          </div>
        </div>
        <CreateConnectionDialog />
      </div>

      {/* Connection List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground animate-fade-in">
              <div className="relative">
                <Wifi className="h-8 w-8 animate-pulse" />
                <div className="absolute inset-0 h-8 w-8 animate-ping opacity-20">
                  <Wifi className="h-8 w-8" />
                </div>
              </div>
              <p className="mt-4 text-sm">Loading connections...</p>
            </div>
          ) : connections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground animate-fade-in">
              <div className="p-4 rounded-full bg-muted/30 mb-4">
                <Server className="h-10 w-10 opacity-50" />
              </div>
              <p className="font-medium">No connections yet</p>
              <p className="text-sm mt-1 text-center px-4">
                Click the button above to add your first SSH connection
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                SAVED CONNECTIONS ({connections.length})
              </p>
              {connections.map((connection, index) => (
                <div
                  key={connection.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ConnectionCard connection={connection} />
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-white/5">
        <p className="text-[10px] text-muted-foreground/50 text-center">
          Electron SSH v1.0.0
        </p>
      </div>
    </div>
  );
}
