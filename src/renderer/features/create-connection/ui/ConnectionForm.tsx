import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Folder, Key, Lock, Loader2, Save } from "lucide-react";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import {
  connectionSchema,
  type ConnectionFormData,
} from "../model/connection-schema";
import { cn } from "@/shared/lib/utils";

interface ConnectionFormProps {
  defaultValues?: Partial<ConnectionFormData>;
  onSubmit: (data: ConnectionFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConnectionForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
}: ConnectionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ConnectionFormData>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      port: 22,
      authMethod: "password",
      ...defaultValues,
    },
  });

  const authMethod = watch("authMethod");

  const handleSelectFile = async () => {
    const result = await window.electronAPI.dialog.openFile({
      title: "Select Private Key",
      properties: ["openFile"],
      filters: [{ name: "All Files", extensions: ["*"] }],
    });
    if (!result.canceled && result.filePaths[0]) {
      setValue("privateKeyPath", result.filePaths[0]);
    }
  };

  const inputClassName = cn(
    "bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20",
    "placeholder:text-muted-foreground/50",
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4">
      {/* Connection Name */}
      <div className="space-y-2">
        <Label
          htmlFor="name"
          className="text-xs font-medium text-muted-foreground"
        >
          CONNECTION NAME
        </Label>
        <Input
          id="name"
          placeholder="My Production Server"
          className={inputClassName}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-red-400">{errors.name.message}</p>
        )}
      </div>

      {/* Host and Port */}
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-3 space-y-2">
          <Label
            htmlFor="host"
            className="text-xs font-medium text-muted-foreground"
          >
            HOST
          </Label>
          <Input
            id="host"
            placeholder="192.168.1.100 or example.com"
            className={inputClassName}
            {...register("host")}
          />
          {errors.host && (
            <p className="text-xs text-red-400">{errors.host.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="port"
            className="text-xs font-medium text-muted-foreground"
          >
            PORT
          </Label>
          <Input
            id="port"
            type="number"
            className={cn(inputClassName, "text-center")}
            {...register("port")}
          />
        </div>
      </div>

      {/* Username */}
      <div className="space-y-2">
        <Label
          htmlFor="username"
          className="text-xs font-medium text-muted-foreground"
        >
          USERNAME
        </Label>
        <Input
          id="username"
          placeholder="root"
          className={inputClassName}
          {...register("username")}
        />
        {errors.username && (
          <p className="text-xs text-red-400">{errors.username.message}</p>
        )}
      </div>

      {/* Auth Method Selection */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground">
          AUTHENTICATION
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setValue("authMethod", "password")}
            className={cn(
              "flex items-center gap-2 p-3 rounded-lg border transition-all text-left",
              authMethod === "password"
                ? "border-primary/50 bg-primary/10 text-foreground"
                : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20",
            )}
          >
            <Lock className="h-4 w-4" />
            <div>
              <p className="text-sm font-medium">Password</p>
              <p className="text-[10px] opacity-60">
                Use password authentication
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setValue("authMethod", "privateKey")}
            className={cn(
              "flex items-center gap-2 p-3 rounded-lg border transition-all text-left",
              authMethod === "privateKey"
                ? "border-primary/50 bg-primary/10 text-foreground"
                : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20",
            )}
          >
            <Key className="h-4 w-4" />
            <div>
              <p className="text-sm font-medium">Private Key</p>
              <p className="text-[10px] opacity-60">Use SSH key file</p>
            </div>
          </button>
        </div>
      </div>

      {/* Password Field */}
      {authMethod === "password" && (
        <div className="space-y-2 animate-fade-in">
          <Label
            htmlFor="password"
            className="text-xs font-medium text-muted-foreground"
          >
            PASSWORD
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            className={inputClassName}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>
      )}

      {/* Private Key Fields */}
      {authMethod === "privateKey" && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <Label
              htmlFor="privateKeyPath"
              className="text-xs font-medium text-muted-foreground"
            >
              PRIVATE KEY FILE
            </Label>
            <div className="flex gap-2">
              <Input
                id="privateKeyPath"
                placeholder="~/.ssh/id_rsa"
                className={cn(inputClassName, "flex-1")}
                {...register("privateKeyPath")}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleSelectFile}
                className="px-3 border-white/10 bg-white/5 hover:bg-white/10"
              >
                <Folder className="h-4 w-4" />
              </Button>
            </div>
            {errors.privateKeyPath && (
              <p className="text-xs text-red-400">
                {errors.privateKeyPath.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="passphrase"
              className="text-xs font-medium text-muted-foreground"
            >
              PASSPHRASE <span className="opacity-50">(optional)</span>
            </Label>
            <Input
              id="passphrase"
              type="password"
              placeholder="Key passphrase if required"
              className={inputClassName}
              {...register("passphrase")}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t border-white/5">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="gap-2 bg-primary hover:bg-primary/90 glow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Connection
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
