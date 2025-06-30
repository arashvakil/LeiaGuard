"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Shield,
  UserCheck,
  UserX,
  ArrowLeft,
  ShieldCheck,
  ShieldX,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface AdminUser {
  id: string;
  username: string;
  isAdmin: boolean;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  deviceCount: number;
  invitationCode: string | null;
  invitationCodeUsedAt: string | null;
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    type: 'activate' | 'deactivate' | 'makeAdmin' | 'removeAdmin' | null;
    user: AdminUser | null;
  }>({ type: null, user: null });

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        toast.error("Failed to load users");
      }
    } catch (error) {
      toast.error("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, updates: { isActive?: boolean; isAdmin?: boolean }) => {
    setUpdating(userId);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...updates }),
      });

      if (response.ok) {
        if (updates.isActive !== undefined) {
          toast.success(`User ${updates.isActive ? 'activated' : 'deactivated'} successfully`);
        }
        if (updates.isAdmin !== undefined) {
          toast.success(`User ${updates.isAdmin ? 'promoted to admin' : 'removed from admin'} successfully`);
        }
        fetchUsers(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update user");
      }
    } catch (error) {
      toast.error("Error updating user");
    } finally {
      setUpdating(null);
      setConfirmDialog({ type: null, user: null });
    }
  };

  const handleConfirmAction = () => {
    if (!confirmDialog.user) return;

    const updates: { isActive?: boolean; isAdmin?: boolean } = {};
    
    switch (confirmDialog.type) {
      case 'activate':
        updates.isActive = true;
        break;
      case 'deactivate':
        updates.isActive = false;
        break;
      case 'makeAdmin':
        updates.isAdmin = true;
        break;
      case 'removeAdmin':
        updates.isAdmin = false;
        break;
    }

    updateUser(confirmDialog.user.id, updates);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  const formatLastLogin = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return date.toLocaleDateString();
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        Disabled
      </Badge>
    );
  };

  const getRoleBadge = (isAdmin: boolean) => {
    return isAdmin ? (
      <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
        <Shield className="h-3 w-3 mr-1" />
        Admin
      </Badge>
    ) : (
      <Badge variant="outline">User</Badge>
    );
  };

  const getLastLoginBadge = (lastLoginAt: string | null) => {
    if (!lastLoginAt) {
      return (
        <Badge variant="outline" className="text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          Never
        </Badge>
      );
    }

    const date = new Date(lastLoginAt);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
          <Clock className="h-3 w-3 mr-1" />
          Recent
        </Badge>
      );
    } else if (diffInHours < 168) {
      return (
        <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" />
          This Week
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="text-orange-600">
          <Clock className="h-3 w-3 mr-1" />
          Inactive
        </Badge>
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle loading and redirect states
  if (status === "loading") return <div>Loading...</div>;
  if (!session?.user?.isAdmin) {
    redirect("/dashboard");
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Manage user accounts and access permissions
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Total: {users.length}</span>
          </div>
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-700">Active: {users.filter(u => u.isActive).length}</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg">
            <Shield className="h-4 w-4 text-purple-600" />
            <span className="font-medium text-purple-700">Admins: {users.filter(u => u.isAdmin).length}</span>
          </div>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Username</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Devices</TableHead>
              <TableHead className="font-semibold">Last Login</TableHead>
              <TableHead className="font-semibold">Invitation Code</TableHead>
              <TableHead className="font-semibold">Joined</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/25">
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{getRoleBadge(user.isAdmin)}</TableCell>
                <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{user.deviceCount}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {getLastLoginBadge(user.lastLoginAt)}
                    <div className="text-xs text-muted-foreground">
                      {formatLastLogin(user.lastLoginAt)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {user.invitationCode ? (
                    <Badge variant="outline" className="font-mono text-xs">
                      {user.invitationCode}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Admin Role Toggle */}
                    {user.id !== session?.user?.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmDialog({
                          type: user.isAdmin ? 'removeAdmin' : 'makeAdmin',
                          user
                        })}
                        disabled={updating === user.id}
                        className={user.isAdmin ? "text-orange-600 hover:text-orange-700" : "text-purple-600 hover:text-purple-700"}
                      >
                        {user.isAdmin ? (
                          <>
                            <ShieldX className="h-4 w-4 mr-1" />
                            Remove Admin
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-4 w-4 mr-1" />
                            Make Admin
                          </>
                        )}
                      </Button>
                    )}

                    {/* Status Toggle */}
                    {user.id !== session?.user?.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmDialog({
                          type: user.isActive ? 'deactivate' : 'activate',
                          user
                        })}
                        disabled={updating === user.id}
                        className={user.isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                      >
                        {updating === user.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                        ) : user.isActive ? (
                          <>
                            <UserX className="h-4 w-4 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.type !== null} onOpenChange={() => setConfirmDialog({ type: null, user: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.type === 'activate' && 'Activate User'}
              {confirmDialog.type === 'deactivate' && 'Deactivate User'}
              {confirmDialog.type === 'makeAdmin' && 'Promote to Admin'}
              {confirmDialog.type === 'removeAdmin' && 'Remove Admin Privileges'}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.type === 'activate' && `Are you sure you want to activate "${confirmDialog.user?.username}"? They will be able to log in and use their devices.`}
              {confirmDialog.type === 'deactivate' && `Are you sure you want to deactivate "${confirmDialog.user?.username}"? They will not be able to log in or use their devices.`}
              {confirmDialog.type === 'makeAdmin' && `Are you sure you want to promote "${confirmDialog.user?.username}" to admin? They will have full access to manage users and settings.`}
              {confirmDialog.type === 'removeAdmin' && `Are you sure you want to remove admin privileges from "${confirmDialog.user?.username}"? They will lose access to admin functions.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ type: null, user: null })}
            >
              Cancel
            </Button>
            <Button
              variant={confirmDialog.type === 'deactivate' || confirmDialog.type === 'removeAdmin' ? 'destructive' : 'default'}
              onClick={handleConfirmAction}
              disabled={updating === confirmDialog.user?.id}
            >
              {updating === confirmDialog.user?.id ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
              ) : null}
              {confirmDialog.type === 'activate' && 'Activate User'}
              {confirmDialog.type === 'deactivate' && 'Deactivate User'}
              {confirmDialog.type === 'makeAdmin' && 'Promote to Admin'}
              {confirmDialog.type === 'removeAdmin' && 'Remove Admin'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 