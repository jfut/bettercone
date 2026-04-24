"use client";

import { useState, useEffect, useContext } from "react";
import { AuthUIContext } from "@/lib/auth-ui-provider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Search, UserX, UserCheck, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string | string[];
  banned?: boolean;
  banReason?: string;
  banExpires?: Date | null;
  createdAt: Date;
  emailVerified: boolean;
}

interface ListUsersResponse {
  users: User[];
  total: number;
  limit?: number;
  offset?: number;
}

export interface UserManagementTableProps {
  /**
   * Callback fired when a user action is successful
   */
  onSuccess?: () => void;
  /**
   * Callback fired when an error occurs
   */
  onError?: (error: Error) => void;
  /**
   * Custom CSS class
   */
  className?: string;
  /**
   * Custom localization
   */
  localization?: Partial<UserManagementLocalization>;
}

export interface UserManagementLocalization {
  // Table
  userManagement: string;
  userManagementDescription: string;
  
  // Search
  searchPlaceholder: string;
  searchByEmail: string;
  searchByName: string;
  
  // Table headers
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
  actions: string;
  
  // Status badges
  active: string;
  banned: string;
  verified: string;
  unverified: string;
  
  // Actions
  viewDetails: string;
  banUser: string;
  unbanUser: string;
  impersonate: string;
  deleteUser: string;
  
  // Pagination
  showing: string;
  of: string;
  users: string;
  previous: string;
  next: string;
  
  // Dialogs
  banUserTitle: string;
  banUserDescription: string;
  unbanUserTitle: string;
  unbanUserDescription: string;
  deleteUserTitle: string;
  deleteUserDescription: string;
  cancel: string;
  confirm: string;
  
  // Messages
  userBanned: string;
  userUnbanned: string;
  userDeleted: string;
  impersonationStarted: string;
  errorLoadingUsers: string;
  errorBanningUser: string;
  errorUnbanningUser: string;
  errorDeletingUser: string;
  errorImpersonating: string;
  
  // Empty state
  noUsers: string;
  noUsersDescription: string;
}

const defaultLocalization: UserManagementLocalization = {
  // Table
  userManagement: "User Management",
  userManagementDescription: "Manage users, roles, and permissions",
  
  // Search
  searchPlaceholder: "Search users...",
  searchByEmail: "Email",
  searchByName: "Name",
  
  // Table headers
  email: "Email",
  name: "Name",
  role: "Role",
  status: "Status",
  createdAt: "Created",
  actions: "Actions",
  
  // Status badges
  active: "Active",
  banned: "Banned",
  verified: "Verified",
  unverified: "Unverified",
  
  // Actions
  viewDetails: "View Details",
  banUser: "Ban User",
  unbanUser: "Unban User",
  impersonate: "Impersonate",
  deleteUser: "Delete User",
  
  // Pagination
  showing: "Showing",
  of: "of",
  users: "users",
  previous: "Previous",
  next: "Next",
  
  // Dialogs
  banUserTitle: "Ban User?",
  banUserDescription: "This will prevent the user from signing in and revoke all their sessions.",
  unbanUserTitle: "Unban User?",
  unbanUserDescription: "This will allow the user to sign in again.",
  deleteUserTitle: "Delete User?",
  deleteUserDescription: "This will permanently delete the user and all their data. This action cannot be undone.",
  cancel: "Cancel",
  confirm: "Confirm",
  
  // Messages
  userBanned: "User banned successfully",
  userUnbanned: "User unbanned successfully",
  userDeleted: "User deleted successfully",
  impersonationStarted: "Now impersonating user",
  errorLoadingUsers: "Failed to load users",
  errorBanningUser: "Failed to ban user",
  errorUnbanningUser: "Failed to unban user",
  errorDeletingUser: "Failed to delete user",
  errorImpersonating: "Failed to impersonate user",
  
  // Empty state
  noUsers: "No users found",
  noUsersDescription: "No users match your search criteria",
};

export function UserManagementTable({
  onSuccess,
  onError,
  className,
  localization: customLocalization,
}: UserManagementTableProps) {
  const context = useContext(AuthUIContext);
  if (!context) {
    throw new Error("UserManagementTable must be used within AuthUIProvider");
  }
  const { authClient } = context;
  const localization = { ...defaultLocalization, ...customLocalization };

  // State
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [searchField, setSearchField] = useState<"email" | "name">("email");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // Action states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [unbanDialogOpen, setUnbanDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    if (!authClient) return;
    
    setLoading(true);
    try {
      if (!authClient.admin) {
        throw new Error("Admin plugin not configured");
      }
      
      const { data, error } = await authClient.admin.listUsers({
        searchValue: searchValue || undefined,
        searchField,
        searchOperator: "contains",
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        sortBy: "createdAt",
        sortDirection: "desc",
      });

      if (error) {
        throw new Error(error.message || localization.errorLoadingUsers);
      }

      if (data) {
        const response = data as ListUsersResponse;
        setUsers(response.users || []);
        setTotal(response.total || 0);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(localization.errorLoadingUsers);
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  // Load users on mount and when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchValue, searchField]);

  // Ban user
  const handleBanUser = async () => {
    if (!selectedUser || !authClient?.admin) return;
    
    setActionLoading(true);
    try {
      const { error } = await authClient.admin.banUser({
        userId: selectedUser.id,
      });

      if (error) {
        throw new Error(error.message || localization.errorBanningUser);
      }

      toast.success(localization.userBanned);
      setBanDialogOpen(false);
      setSelectedUser(null);
      onSuccess?.();
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Error banning user:", error);
      toast.error(localization.errorBanningUser);
      onError?.(error as Error);
    } finally {
      setActionLoading(false);
    }
  };

  // Unban user
  const handleUnbanUser = async () => {
    if (!selectedUser || !authClient?.admin) return;
    
    setActionLoading(true);
    try {
      const { error } = await authClient.admin.unbanUser({
        userId: selectedUser.id,
      });

      if (error) {
        throw new Error(error.message || localization.errorUnbanningUser);
      }

      toast.success(localization.userUnbanned);
      setUnbanDialogOpen(false);
      setSelectedUser(null);
      onSuccess?.();
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Error unbanning user:", error);
      toast.error(localization.errorUnbanningUser);
      onError?.(error as Error);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!selectedUser || !authClient?.admin) return;
    
    setActionLoading(true);
    try {
      const { error } = await authClient.admin.removeUser({
        userId: selectedUser.id,
      });

      if (error) {
        throw new Error(error.message || localization.errorDeletingUser);
      }

      toast.success(localization.userDeleted);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      onSuccess?.();
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(localization.errorDeletingUser);
      onError?.(error as Error);
    } finally {
      setActionLoading(false);
    }
  };

  // Impersonate user
  const handleImpersonate = async (user: User) => {
    if (!authClient?.admin) return;
    
    try {
      const { error } = await authClient.admin.impersonateUser({
        userId: user.id,
      });

      if (error) {
        throw new Error(error.message || localization.errorImpersonating);
      }

      toast.success(localization.impersonationStarted);
      onSuccess?.();
      // Reload page to update session
      window.location.reload();
    } catch (error) {
      console.error("Error impersonating user:", error);
      toast.error(localization.errorImpersonating);
      onError?.(error as Error);
    }
  };

  // Pagination
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, total);

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get role display
  const getRoleDisplay = (role?: string | string[]) => {
    if (!role) return "user";
    return Array.isArray(role) ? role.join(", ") : role;
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{localization.userManagement}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {localization.userManagementDescription}
          </p>
        </div>

        {/* Search and filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={localization.searchPlaceholder}
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="pl-10"
            />
          </div>
          <Select
            value={searchField}
            onValueChange={(value: "email" | "name") => {
              setSearchField(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">{localization.searchByEmail}</SelectItem>
              <SelectItem value="name">{localization.searchByName}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">{localization.email}</TableHead>
              <TableHead className="font-semibold">{localization.name}</TableHead>
              <TableHead className="font-semibold">{localization.role}</TableHead>
              <TableHead className="font-semibold">{localization.status}</TableHead>
              <TableHead className="font-semibold">{localization.createdAt}</TableHead>
              <TableHead className="text-right font-semibold">{localization.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex items-center justify-center">
                    <div className="text-muted-foreground">Loading...</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p className="font-medium text-base">{localization.noUsers}</p>
                    <p className="text-sm mt-1">{localization.noUsersDescription}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-medium">
                      {getRoleDisplay(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {user.banned ? (
                        <Badge variant="destructive" className="font-medium">
                          {localization.banned}
                        </Badge>
                      ) : (
                        <Badge variant="default" className="font-medium">
                          {localization.active}
                        </Badge>
                      )}
                      {user.emailVerified ? (
                        <Badge variant="outline" className="font-medium">
                          {localization.verified}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="font-medium text-muted-foreground">
                          {localization.unverified}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{localization.actions}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleImpersonate(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          {localization.impersonate}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.banned ? (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setUnbanDialogOpen(true);
                            }}
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            {localization.unbanUser}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setBanDialogOpen(true);
                            }}
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            {localization.banUser}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {localization.deleteUser}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && users.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            {localization.showing} <span className="font-medium text-foreground">{startIndex}-{endIndex}</span> {localization.of} <span className="font-medium text-foreground">{total}</span>{" "}
            {localization.users}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              {localization.previous}
            </Button>
            <div className="flex items-center gap-1 px-2">
              <span className="text-sm font-medium">{currentPage}</span>
              <span className="text-sm text-muted-foreground">/</span>
              <span className="text-sm text-muted-foreground">{totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              {localization.next}
            </Button>
          </div>
        </div>
      )}

      {/* Ban User Dialog */}
      <AlertDialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{localization.banUserTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {localization.banUserDescription}
              {selectedUser && (
                <span className="mt-2 block p-2 bg-muted rounded-md">
                  <span className="font-medium">{selectedUser.email}</span>
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              {localization.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBanUser}
              disabled={actionLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading ? "Banning..." : localization.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unban User Dialog */}
      <AlertDialog open={unbanDialogOpen} onOpenChange={setUnbanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{localization.unbanUserTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {localization.unbanUserDescription}
              {selectedUser && (
                <span className="mt-2 block p-2 bg-muted rounded-md">
                  <span className="font-medium">{selectedUser.email}</span>
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              {localization.cancel}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleUnbanUser} disabled={actionLoading}>
              {actionLoading ? "Unbanning..." : localization.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete User Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{localization.deleteUserTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {localization.deleteUserDescription}
              {selectedUser && (
                <span className="mt-2 block p-2 bg-muted rounded-md">
                  <span className="font-medium">{selectedUser.email}</span>
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              {localization.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={actionLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading ? "Deleting..." : localization.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
