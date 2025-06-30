"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Plus, 
  Users, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Copy,
  Eye,
  Settings,
  Edit,
  Ban,
  Check,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface InvitationCode {
  id: string;
  code: string;
  maxUses: number;
  usedCount: number;
  description: string | null;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
  remainingUses: number;
  isExpired: boolean;
  isFull: boolean;
}

interface UsageDetail {
  id: string;
  userId: string;
  username: string;
  usedAt: string;
  userIsActive: boolean;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [codes, setCodes] = useState<InvitationCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showUsageDialog, setShowUsageDialog] = useState(false);
  const [selectedCodeUsage, setSelectedCodeUsage] = useState<{
    code: InvitationCode;
    usage: UsageDetail[];
  } | null>(null);
  const [editingCode, setEditingCode] = useState<InvitationCode | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    maxUses: 50,
    expiresInDays: 30,
  });

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    maxUses: 50,
    expiresAt: "",
    description: "",
    isActive: true,
  });

  const fetchCodes = async () => {
    try {
      const response = await fetch("/api/admin/invite-codes");
      if (response.ok) {
        const data = await response.json();
        setCodes(data.codes);
      } else {
        toast.error("Failed to load invitation codes");
      }
    } catch (error) {
      toast.error("Error loading invitation codes");
    } finally {
      setLoading(false);
    }
  };

  const createCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await fetch("/api/admin/invite-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Invitation code created successfully");
        setShowCreateDialog(false);
        setFormData({ code: "", description: "", maxUses: 50, expiresInDays: 30 });
        fetchCodes();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create invitation code");
      }
    } catch (error) {
      toast.error("Error creating invitation code");
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const viewUsage = async (codeId: string) => {
    try {
      const response = await fetch(`/api/admin/invite-codes/${codeId}/usage`);
      if (response.ok) {
        const data = await response.json();
        setSelectedCodeUsage(data);
        setShowUsageDialog(true);
      } else {
        toast.error("Failed to load usage details");
      }
    } catch (error) {
      toast.error("Error loading usage details");
    }
  };

  const openEditDialog = (code: InvitationCode) => {
    setEditingCode(code);
    setEditFormData({
      maxUses: code.maxUses,
      expiresAt: code.expiresAt.split('T')[0], // Convert to date input format
      description: code.description || "",
      isActive: code.isActive,
    });
    setShowEditDialog(true);
  };

  const updateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCode) return;
    
    setUpdating(true);

    try {
      const response = await fetch(`/api/admin/invite-codes/${editingCode.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maxUses: editFormData.maxUses,
          expiresAt: new Date(editFormData.expiresAt).toISOString(),
          description: editFormData.description || null,
          isActive: editFormData.isActive,
        }),
      });

      if (response.ok) {
        toast.success("Invitation code updated successfully");
        setShowEditDialog(false);
        setEditingCode(null);
        fetchCodes();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update invitation code");
      }
    } catch (error) {
      toast.error("Error updating invitation code");
    } finally {
      setUpdating(false);
    }
  };

  const toggleCodeStatus = async (code: InvitationCode) => {
    try {
      const response = await fetch(`/api/admin/invite-codes/${code.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: !code.isActive,
        }),
      });

      if (response.ok) {
        toast.success(`Invitation code ${code.isActive ? 'disabled' : 'enabled'} successfully`);
        fetchCodes();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update invitation code status");
      }
    } catch (error) {
      toast.error("Error updating invitation code status");
    }
  };

  const deleteCode = async (code: InvitationCode) => {
    if (!confirm(`Are you sure you want to delete the invitation code "${code.code}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/invite-codes/${code.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Invitation code deleted successfully");
        fetchCodes();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete invitation code");
      }
    } catch (error) {
      toast.error("Error deleting invitation code");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (code: InvitationCode) => {
    if (!code.isActive) {
      return <Badge variant="destructive">Disabled</Badge>;
    }
    if (code.isExpired) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (code.isFull) {
      return <Badge variant="secondary">Full</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  // Handle loading and redirect states
  if (status === "loading") return <div>Loading...</div>;
  if (!session?.user?.isAdmin) {
    redirect("/dashboard");
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage invitation codes and user access</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Invitation Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Invitation Code</DialogTitle>
            </DialogHeader>
            <form onSubmit={createCode} className="space-y-4">
              <div>
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., FAMILY2024"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., For family members"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxUses">Max Uses</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) })}
                    min="1"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="expiresInDays">Expires In (Days)</Label>
                  <Input
                    id="expiresInDays"
                    type="number"
                    value={formData.expiresInDays}
                    onChange={(e) => setFormData({ ...formData, expiresInDays: parseInt(e.target.value) })}
                    min="1"
                    max="365"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? "Creating..." : "Create Code"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Admin Navigation */}
      <div className="mb-6">
        <div className="flex gap-4">
          <div className="p-4 bg-muted rounded-lg flex-1">
            <h3 className="font-semibold mb-2">Invitation Codes</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Create and manage invitation codes for new user registration
            </p>
            <p className="text-sm text-muted-foreground">
              Total Active Codes: {codes.filter(c => c.isActive && !c.isExpired && !c.isFull).length}
            </p>
          </div>
          
          <Link href="/dashboard/admin/users" className="flex-1">
            <div className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer h-full">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5" />
                <h3 className="font-semibold">User Management</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                View and manage all registered users and their access
              </p>
              <div className="flex items-center gap-1 text-sm text-blue-600">
                <Settings className="h-4 w-4" />
                <span>Manage Users →</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {codes.map((code) => (
              <TableRow key={code.id}>
                <TableCell className="font-mono">{code.code}</TableCell>
                <TableCell>{code.description || "—"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {code.usedCount} / {code.maxUses}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(code)}</TableCell>
                <TableCell>{formatDate(code.expiresAt)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(code.code)}
                      title="Copy code"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => viewUsage(code.id)}
                      title="View usage"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(code)}
                      title="Edit code"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleCodeStatus(code)}
                      title={code.isActive ? "Disable code" : "Enable code"}
                    >
                      {code.isActive ? <Ban className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteCode(code)}
                      title="Delete code"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Usage Details Dialog */}
      <Dialog open={showUsageDialog} onOpenChange={setShowUsageDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Usage Details: {selectedCodeUsage?.code.code}
            </DialogTitle>
          </DialogHeader>
          {selectedCodeUsage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total Uses</p>
                  <p className="font-semibold">{selectedCodeUsage.code.usedCount} / {selectedCodeUsage.code.maxUses}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="font-semibold">{selectedCodeUsage.code.remainingUses}</p>
                </div>
              </div>
              
              {selectedCodeUsage.usage.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Used At</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCodeUsage.usage.map((usage) => (
                      <TableRow key={usage.id}>
                        <TableCell>{usage.username}</TableCell>
                        <TableCell>{formatDate(usage.usedAt)}</TableCell>
                        <TableCell>
                          {usage.userIsActive ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="destructive">Disabled</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No usage records found
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Code Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit Invitation Code: {editingCode?.code}
            </DialogTitle>
          </DialogHeader>
          {editingCode && (
            <form onSubmit={updateCode} className="space-y-4">
              <div>
                <Label htmlFor="editDescription">Description (Optional)</Label>
                <Textarea
                  id="editDescription"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  placeholder="e.g., For family members"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editMaxUses">Max Uses</Label>
                  <Input
                    id="editMaxUses"
                    type="number"
                    value={editFormData.maxUses}
                    onChange={(e) => setEditFormData({ ...editFormData, maxUses: parseInt(e.target.value) })}
                    min="1"
                    max="1000"
                  />
                </div>
                <div>
                  <Label htmlFor="editExpiresAt">Expiration Date</Label>
                  <Input
                    id="editExpiresAt"
                    type="date"
                    value={editFormData.expiresAt}
                    onChange={(e) => setEditFormData({ ...editFormData, expiresAt: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editFormData.isActive}
                  onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="editIsActive">Code is active</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updating}>
                  {updating ? "Updating..." : "Update Code"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 