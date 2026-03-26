import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Search, UserCheck, UserX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { User } from "../backend";
import { StatusBadge } from "../components/StatusBadge";
import {
  useCreateUser,
  useGetUsers,
  useUpdateUserStatus,
} from "../hooks/useQueries";

const ROLES = ["Admin", "Developer", "Analyst", "Manager", "Auditor"];
const DEPARTMENTS = [
  "Engineering",
  "Finance",
  "Operations",
  "Product",
  "Compliance",
  "HR",
];

export function Users() {
  const { data: users = [] } = useGetUsers();
  const createUser = useCreateUser();
  const updateStatus = useUpdateUserStatus();

  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deactivateUser, setDeactivateUser] = useState<User | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
  });

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = async () => {
    if (!form.name || !form.email || !form.role || !form.department) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await createUser.mutateAsync(form);
      toast.success("User created successfully");
      setAddOpen(false);
      setForm({ name: "", email: "", role: "", department: "" });
    } catch {
      toast.error("Failed to create user");
    }
  };

  const handleDeactivate = async () => {
    if (!deactivateUser) return;
    const newStatus =
      deactivateUser.status === "active" ? "inactive" : "active";
    try {
      await updateStatus.mutateAsync({
        id: deactivateUser.id,
        status: newStatus,
      });
      toast.success(
        `User ${newStatus === "active" ? "activated" : "deactivated"}`,
      );
      setDeactivateUser(null);
    } catch {
      toast.error("Failed to update user status");
    }
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">User Management</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {users.length} total users
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => setAddOpen(true)}
          data-ocid="users.add_button"
        >
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      <Card className="shadow-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-sm"
                data-ocid="users.search_input"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="pl-5 text-xs font-semibold">
                  User
                </TableHead>
                <TableHead className="text-xs font-semibold">Role</TableHead>
                <TableHead className="text-xs font-semibold">
                  Department
                </TableHead>
                <TableHead className="text-xs font-semibold">
                  Last Login
                </TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold pr-5">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow data-ocid="users.empty_state">
                  <TableCell
                    colSpan={6}
                    className="text-center text-sm text-muted-foreground py-10"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((user, i) => (
                <TableRow
                  key={String(user.id)}
                  className="text-xs"
                  data-ocid={`users.item.${i + 1}`}
                >
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">
                          {user.name}
                        </p>
                        <p className="text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.lastLogin}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                  <TableCell className="pr-5">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setEditUser(user)}
                        data-ocid={`users.edit_button.${i + 1}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setDeactivateUser(user)}
                        data-ocid={`users.delete_button.${i + 1}`}
                      >
                        {user.status === "active" ? (
                          <UserX className="h-3.5 w-3.5 text-destructive" />
                        ) : (
                          <UserCheck className="h-3.5 w-3.5 text-green-600" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md" data-ocid="users.add_modal">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account in the IAM system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Full Name</Label>
              <Input
                placeholder="e.g. John Smith"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                data-ocid="users.name_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email Address</Label>
              <Input
                type="email"
                placeholder="john@company.com"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                data-ocid="users.email_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Role</Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm((p) => ({ ...p, role: v }))}
              >
                <SelectTrigger data-ocid="users.role_select">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Department</Label>
              <Select
                value={form.department}
                onValueChange={(v) => setForm((p) => ({ ...p, department: v }))}
              >
                <SelectTrigger data-ocid="users.department_select">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              data-ocid="users.add_cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={createUser.isPending}
              data-ocid="users.add_submit_button"
            >
              {createUser.isPending ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={!!editUser} onOpenChange={(o) => !o && setEditUser(null)}>
        <DialogContent className="sm:max-w-md" data-ocid="users.edit_modal">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details for {editUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Full Name</Label>
              <Input
                defaultValue={editUser?.name}
                data-ocid="users.edit_name_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email Address</Label>
              <Input
                defaultValue={editUser?.email}
                data-ocid="users.edit_email_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Role</Label>
              <Select defaultValue={editUser?.role}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditUser(null)}
              data-ocid="users.edit_cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("User updated");
                setEditUser(null);
              }}
              data-ocid="users.edit_save_button"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Confirm */}
      <Dialog
        open={!!deactivateUser}
        onOpenChange={(o) => !o && setDeactivateUser(null)}
      >
        <DialogContent
          className="sm:max-w-sm"
          data-ocid="users.deactivate_dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {deactivateUser?.status === "active" ? "Deactivate" : "Activate"}{" "}
              User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to{" "}
              {deactivateUser?.status === "active" ? "deactivate" : "activate"}{" "}
              <strong>{deactivateUser?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeactivateUser(null)}
              data-ocid="users.deactivate_cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant={
                deactivateUser?.status === "active" ? "destructive" : "default"
              }
              onClick={handleDeactivate}
              disabled={updateStatus.isPending}
              data-ocid="users.deactivate_confirm_button"
            >
              {updateStatus.isPending
                ? "Updating..."
                : deactivateUser?.status === "active"
                  ? "Deactivate"
                  : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
