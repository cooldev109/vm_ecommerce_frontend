import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, UserCog, Loader2, Search, Users as UsersIcon, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as userService from '@/services/userService';

export const AdminUsers = () => {
  const [users, setUsers] = useState<userService.User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<userService.UserStats | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<userService.User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<userService.User | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'USER' as 'USER' | 'ADMIN',
    customerType: 'INDIVIDUAL' as 'INDIVIDUAL' | 'BUSINESS',
    taxId: '',
  });

  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
    loadStats();
  }, [roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const role = roleFilter === 'all' ? undefined : roleFilter;
      const data = await userService.getAllUsers(1, 100, role, search);
      setUsers(data.users);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await userService.getUserStats();
      setStats(data);
    } catch (error: any) {
      console.error('Failed to load user stats:', error);
    }
  };

  const handleSearch = () => {
    loadUsers();
  };

  const handleUpdateRole = async (userId: string, newRole: 'USER' | 'ADMIN') => {
    try {
      setUpdatingRole(userId);
      await userService.updateUserRole(userId, newRole);
      toast({
        title: 'Success',
        description: 'User role updated successfully',
      });
      await loadUsers();
      await loadStats();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user role',
        variant: 'destructive',
      });
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'USER',
      customerType: 'INDIVIDUAL',
      taxId: '',
    });
    setFormDialogOpen(true);
  };

  const handleEditUser = (user: userService.User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      role: user.role,
      customerType: user.customerType || 'INDIVIDUAL',
      taxId: user.taxId || '',
    });
    setFormDialogOpen(true);
  };

  const handleDeleteUser = (user: userService.User) => {
    setDeletingUser(user);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async () => {
    try {
      setFormSubmitting(true);

      if (editingUser) {
        // Update existing user
        await userService.updateUser(editingUser.id, {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          customerType: formData.customerType,
          taxId: formData.taxId,
        });
        toast({
          title: 'Success',
          description: 'User updated successfully',
        });
      } else {
        // Create new user
        if (!formData.email || !formData.password) {
          toast({
            title: 'Error',
            description: 'Email and password are required',
            variant: 'destructive',
          });
          return;
        }
        await userService.createUser({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          role: formData.role,
          customerType: formData.customerType,
        });
        toast({
          title: 'Success',
          description: 'User created successfully',
        });
      }

      setFormDialogOpen(false);
      await loadUsers();
      await loadStats();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save user',
        variant: 'destructive',
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;

    try {
      setDeleting(true);
      await userService.deleteUser(deletingUser.id);
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      setDeleteDialogOpen(false);
      setDeletingUser(null);
      await loadUsers();
      await loadStats();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards with Oriental Styling */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-feminine group hover-rose-glow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          <Card className="card-feminine group hover-rose-glow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.adminCount}</div>
            </CardContent>
          </Card>
          <Card className="card-feminine group hover-rose-glow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Regular Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.regularUsersCount}</div>
            </CardContent>
          </Card>
          <Card className="card-feminine group hover-rose-glow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">New This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.newUsersThisMonth}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Table */}
      <Card className="card-feminine">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-rose-gold flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-accent" />
              </div>
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </div>
            </div>
            <Button className="btn-gradient-gold" onClick={handleAddUser}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="border-border/50"
              />
              <Button onClick={handleSearch} variant="outline" className="border-gold-accent">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px] border-border/50">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="USER">Users</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto" />
                <p className="text-muted-foreground mt-2">Loading users...</p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-border/50">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Customer Type</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        <UsersIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No users found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">
                          {user.firstName || user.lastName ? `${user.firstName} ${user.lastName}` : 'No name'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          {user.role === 'ADMIN' ? (
                            <Badge variant="default" className="bg-purple-600">Admin</Badge>
                          ) : (
                            <Badge variant="outline">User</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{user.customerType}</Badge>
                        </TableCell>
                        <TableCell>{user.ordersCount}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              title="Edit user"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
                                if (confirm(`Change ${user.email} to ${newRole}?`)) {
                                  handleUpdateRole(user.id, newRole);
                                }
                              }}
                              disabled={updatingRole === user.id}
                              title="Toggle role"
                            >
                              {updatingRole === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <UserCog className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user)}
                              title="Delete user"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Form Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
            <DialogDescription>
              {editingUser ? 'Update user information below.' : 'Fill in the details to create a new user.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {!editingUser && (
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: 'USER' | 'ADMIN') => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="customerType">Customer Type</Label>
                <Select
                  value={formData.customerType}
                  onValueChange={(value: 'INDIVIDUAL' | 'BUSINESS') => setFormData({ ...formData, customerType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                    <SelectItem value="BUSINESS">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {editingUser && (
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  placeholder="Tax identification number"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFormSubmit} disabled={formSubmitting} className="btn-gradient-gold">
              {formSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                editingUser ? 'Update User' : 'Create User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the user "{deletingUser?.email}"?
              This action cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
