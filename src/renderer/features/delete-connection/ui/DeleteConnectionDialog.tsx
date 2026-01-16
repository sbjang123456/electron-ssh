import { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/ui";
import { useConnectionStore, type ConnectionSafe } from "@/entities/connection";

interface DeleteConnectionDialogProps {
  connection: ConnectionSafe;
}

export function DeleteConnectionDialog({
  connection,
}: DeleteConnectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { removeConnection } = useConnectionStore();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await window.electronAPI.connection.delete(connection.id);
      removeConnection(connection.id);
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete connection:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 rounded-md text-muted-foreground/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <DialogContent className="sm:max-w-[400px] bg-[hsl(240,10%,8%)] border-white/10">
        <DialogHeader className="pb-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-red-500/10 text-red-500">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-lg">Delete Connection</DialogTitle>
              <DialogDescription className="mt-1.5 text-sm">
                Are you sure you want to delete{" "}
                <span className="text-foreground font-medium">
                  "{connection.name}"
                </span>
                ?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-3 px-4 rounded-lg bg-red-500/5 border border-red-500/10 text-sm text-muted-foreground">
          This action cannot be undone. All saved credentials for this
          connection will be permanently removed.
        </div>

        <DialogFooter className="gap-2 pt-4">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="gap-2 bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Connection
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
