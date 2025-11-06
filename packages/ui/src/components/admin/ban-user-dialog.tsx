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
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { UserAvatar } from "../user/user-avatar";
import { toast } from "sonner";

// Localization interface
export interface BanUserDialogLocalization {
  // Dialog
  title: string;
  description: string;
  
  // Form labels
  reasonLabel: string;
  reasonPlaceholder: string;
  durationLabel: string;
  customDurationLabel: string;
  customDurationPlaceholder: string;
  daysLabel: string;
  
  // Duration options
  permanent: string;
  oneDay: string;
  threeDays: string;
  sevenDays: string;
  thirtyDays: string;
  custom: string;
  
  // Buttons
  cancel: string;
  banUser: string;
  banning: string;
  
  // Messages
  success: string;
  errorBanning: string;
  invalidDuration: string;
}

const defaultLocalization: BanUserDialogLocalization = {
  // Dialog
  title: "Ban User",
  description: "Ban this user from accessing the platform. You can specify a reason and duration.",
  
  // Form labels
  reasonLabel: "Ban Reason",
  reasonPlaceholder: "Enter the reason for banning this user...",
  durationLabel: "Ban Duration",
  customDurationLabel: "Custom Duration (days)",
  customDurationPlaceholder: "Enter number of days",
  daysLabel: "days",
  
  // Duration options
  permanent: "Permanent",
  oneDay: "1 Day",
  threeDays: "3 Days",
  sevenDays: "7 Days",
  thirtyDays: "30 Days",
  custom: "Custom",
  
  // Buttons
  cancel: "Cancel",
  banUser: "Ban User",
  banning: "Banning...",
  
  // Messages
  success: "User banned successfully",
  errorBanning: "Failed to ban user",
  invalidDuration: "Please enter a valid duration in days",
};

export interface BanUserDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;
  
  /**
   * Callback when dialog open state changes
   */
  onOpenChange: (open: boolean) => void;
  
  /**
   * User to ban
   */
  user: {
    id: string;
    name?: string;
    email: string;
    image?: string;
  } | null;
  
  /**
   * Callback after successful ban
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
  localization?: Partial<BanUserDialogLocalization>;
}

export function BanUserDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
  onError,
  localization: customLocalization,
}: BanUserDialogProps) {
  const context = useContext(AuthUIContext);
  if (!context) {
    throw new Error("BanUserDialog must be used within AuthUIProvider");
  }
  const { authClient } = context;
  const localization = { ...defaultLocalization, ...customLocalization };

  const [reason, setReason] = useState("");
  const [durationType, setDurationType] = useState<"permanent" | "1" | "3" | "7" | "30" | "custom">("permanent");
  const [customDays, setCustomDays] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBan = async () => {
    if (!user || !authClient?.admin) return;
    
    // Validate custom duration
    if (durationType === "custom") {
      const days = parseInt(customDays);
      if (isNaN(days) || days <= 0) {
        toast.error(localization.invalidDuration);
        return;
      }
    }
    
    setLoading(true);
    try {
      // Calculate ban expiration in seconds
      let banExpiresIn: number | undefined;
      if (durationType !== "permanent") {
        const days = durationType === "custom" 
          ? parseInt(customDays) 
          : parseInt(durationType);
        banExpiresIn = days * 24 * 60 * 60; // Convert days to seconds
      }
      
      const { error } = await authClient.admin.banUser({
        userId: user.id,
        banReason: reason || undefined,
        banExpiresIn,
      });

      if (error) {
        throw new Error(error.message || localization.errorBanning);
      }

      toast.success(localization.success);
      onSuccess?.();
      onOpenChange(false);
      
      // Reset form
      setReason("");
      setDurationType("permanent");
      setCustomDays("");
    } catch (error) {
      const err = error instanceof Error ? error : new Error(localization.errorBanning);
      toast.error(err.message);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setReason("");
      setDurationType("permanent");
      setCustomDays("");
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

          {/* Ban reason */}
          <div className="space-y-2">
            <Label htmlFor="ban-reason">{localization.reasonLabel}</Label>
            <Textarea
              id="ban-reason"
              placeholder={localization.reasonPlaceholder}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>

          {/* Duration selector */}
          <div className="space-y-2">
            <Label htmlFor="ban-duration">{localization.durationLabel}</Label>
            <Select
              value={durationType}
              onValueChange={(value: any) => setDurationType(value)}
              disabled={loading}
            >
              <SelectTrigger id="ban-duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="permanent">{localization.permanent}</SelectItem>
                <SelectItem value="1">{localization.oneDay}</SelectItem>
                <SelectItem value="3">{localization.threeDays}</SelectItem>
                <SelectItem value="7">{localization.sevenDays}</SelectItem>
                <SelectItem value="30">{localization.thirtyDays}</SelectItem>
                <SelectItem value="custom">{localization.custom}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom duration input */}
          {durationType === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="custom-days">{localization.customDurationLabel}</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="custom-days"
                  type="number"
                  min="1"
                  placeholder={localization.customDurationPlaceholder}
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value)}
                  disabled={loading}
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {localization.daysLabel}
                </span>
              </div>
            </div>
          )}
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
            variant="destructive"
            onClick={handleBan}
            disabled={loading || !user}
          >
            {loading ? localization.banning : localization.banUser}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
