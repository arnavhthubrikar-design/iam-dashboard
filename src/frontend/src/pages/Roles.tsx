import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateRole, useGetRoles } from "../hooks/useQueries";

export function Roles() {
  const { data: roles = [] } = useGetRoles();
  const createRole = useCreateRole();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const handleCreate = async () => {
    if (!form.name || !form.description) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await createRole.mutateAsync(form);
      toast.success("Role created");
      setCreateOpen(false);
      setForm({ name: "", description: "" });
    } catch {
      toast.error("Failed to create role");
    }
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Roles</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {roles.length} roles configured
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => setCreateOpen(true)}
          data-ocid="roles.add_button"
        >
          <Plus className="h-4 w-4" /> Create Role
        </Button>
      </div>

      <Card className="shadow-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="pl-5 text-xs font-semibold">
                  Role Name
                </TableHead>
                <TableHead className="text-xs font-semibold">
                  Description
                </TableHead>
                <TableHead className="text-xs font-semibold">Members</TableHead>
                <TableHead className="text-xs font-semibold">
                  Permissions
                </TableHead>
                <TableHead className="text-xs font-semibold pr-5">
                  Created
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role, i) => (
                <TableRow
                  key={String(role.id)}
                  className="text-xs"
                  data-ocid={`roles.item.${i + 1}`}
                >
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                        <Shield className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="font-semibold text-foreground">
                        {role.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {role.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {String(role.memberCount)} members
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {role.permissions.slice(0, 3).map((p) => (
                        <Badge
                          key={p}
                          variant="outline"
                          className="text-xs py-0 px-1.5"
                        >
                          {p}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs py-0 px-1.5"
                        >
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="pr-5 text-muted-foreground">
                    {role.createdAt}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md" data-ocid="roles.create_dialog">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Define a new role with a name and description. Assign permissions
              after creation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Role Name</Label>
              <Input
                placeholder="e.g. Data Scientist"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                data-ocid="roles.name_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea
                placeholder="Describe the purpose of this role..."
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                data-ocid="roles.description_textarea"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              data-ocid="roles.create_cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createRole.isPending}
              data-ocid="roles.create_submit_button"
            >
              {createRole.isPending ? "Creating..." : "Create Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
