"use client";

import { useState, useContext } from "react";
import { AuthUIContext } from "../../lib/auth-ui-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertTriangle } from "lucide-react";
import { UserAvatar } from "../user/user-avatar";
import { toast } from "sonner";

// Localization interface
export interface ImpersonateUserDialogLocalization {
  // Dialog
  title: string;
  description: string;
  
  // Warning
  warningTitle: string;
  warningMessage: string;
  
  // Buttons
  cancel: string;
  impersonate: string;
  impersonating: string;
  
  // Messages
  success: string;
  errorImpersonating: string;
}

const defaultLocalization: ImpersonateUserDialogLocalization = {
  // Dialog
  title: "Impersonate User",
  description: "You are about to impersonate this user. All actions will be performed as this user.",
  
  // Warning
  warningTitle: "Important",
  warningMessage: "While impersonating, you will have full access to this user's account. Use this feature responsibly and only for support purposes. All actions will be logged.",
  
  // Buttons
  cancel: "Cancel",
  impersonate: "Start Impersonation",
  impersonating: "Starting...",
  
  // Messages
  success: "Impersonation started",
  errorImpersonating: "Failed to start impersonation",
};

export interface ImpersonateUserDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;
  
  /**
   * Callback when dialog open state changes
   */
  onOpenChange: (open: boolean) => void;
  
  /**
   * User to impersonate
   */
  user: {
    id: string;
    name?: string;
    email: string;
    image?: string;
  } | null;
  
  /**
   * Callback after successful impersonation
   */
  onSuccess?: () => void;
  
  /**
   * Callback on error
   */
  onError?: (error: Error) => void;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Localization overrides
   */
  localization?: Partial<ImpersonateUserDialogLocalization>;
}

export function ImpersonateUserDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
  onError,
  localization: customLocalization,
}: ImpersonateUserDialogProps) {
  const context = useContext(AuthUIContext);
  if (!context) {
    throw new Error("ImpersonateUserDialog must be used within AuthUIProvider");
  }
  const { authClient } = context;
  const localization = { ...defaultLocalization, ...customLocalization };

  const [loading, setLoading] = useState(false);

  const handleImpersonate = async () => {
    if (!user || !authClient?.admin) return;
    
    setLoading(true);
    try {
      const { error } = await authClient.admin.impersonateUser({
        userId: user.id,
      });

      if (error) {
        throw new Error(error.message || localization.errorImpersonating);
      }

      toast.success(localization.success);
      onSuccess?.();
      onOpenChange(false);
      
      // Reload page to update session
      window.location.reload();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(localization.errorImpersonating);
      toast.error(err.message);
      onError?.(err);
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{localization.title}</DialogTitle>
          <DialogDescription>
            {localization.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* User info */}
          {user && (
            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="flex items-center gap-3">
                <UserAvatar user={user} size="default" />
                <div>
                  <div className="font-medium">{user.name || user.email}</div>
                  {user.name && (
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-semibold mb-1">{localization.warningTitle}</div>
              <div className="text-sm">{localization.warningMessage}</div>
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            {localization.cancel}
          </Button>
          <Button
            variant="default"
            onClick={handleImpersonate}
            disabled={loading || !user}
          >
            {loading ? localization.impersonating : localization.impersonate}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
