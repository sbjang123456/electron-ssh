import { useState } from "react";
import { Plus, Server } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/shared/ui";
import { useConnectionStore } from "@/entities/connection";
import { ConnectionForm } from "./ConnectionForm";
import type { ConnectionFormData } from "../model/connection-schema";

export function CreateConnectionDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addConnection } = useConnectionStore();

  const handleSubmit = async (data: ConnectionFormData) => {
    setIsLoading(true);
    try {
      const connection = await window.electronAPI.connection.create(data);
      addConnection(connection);
      setOpen(false);
    } catch (error) {
      console.error("Failed to create connection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2 bg-primary hover:bg-primary/90 glow-sm hover:glow transition-all">
          <Plus className="h-4 w-4" />
          New Connection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-[hsl(240,10%,8%)] border-white/10">
        <DialogHeader className="pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Server className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg">New SSH Connection</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                Add a new server to your connection list
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <ConnectionForm
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
