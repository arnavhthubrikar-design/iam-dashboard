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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Check, Eye, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { AccessRequest } from "../backend";
import { StatusBadge } from "../components/StatusBadge";
import {
  useGetAccessRequests,
  useUpdateAccessRequest,
} from "../hooks/useQueries";

export function AccessRequests() {
  const { data: requests = [] } = useGetAccessRequests();
  const updateRequest = useUpdateAccessRequest();

  const [filter, setFilter] = useState("all");
  const [viewRequest, setViewRequest] = useState<AccessRequest | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    requesterName: "",
    resourceName: "",
    requestType: "",
    reason: "",
  });

  const filtered =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const handleAction = async (id: bigint, status: "approved" | "denied") => {
    try {
      await updateRequest.mutateAsync({ id, status, resolvedBy: "Sarah Chen" });
      toast.success(`Request ${status}`);
    } catch {
      toast.error("Failed to update request");
    }
  };

  const handleNewRequest = async () => {
    if (
      !newForm.requesterName ||
      !newForm.resourceName ||
      !newForm.requestType ||
      !newForm.reason
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Access request submitted");
    setNewOpen(false);
    setNewForm({
      requesterName: "",
      resourceName: "",
      requestType: "",
      reason: "",
    });
  };

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    denied: requests.filter((r) => r.status === "denied").length,
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Access Requests</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {counts.pending} pending review
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => setNewOpen(true)}
          data-ocid="access_requests.add_button"
        >
          <Plus className="h-4 w-4" /> New Request
        </Button>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="h-8" data-ocid="access_requests.filter.tab">
          <TabsTrigger
            value="all"
            className="text-xs px-3 h-6"
            data-ocid="access_requests.all_tab"
          >
            All ({counts.all})
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="text-xs px-3 h-6"
            data-ocid="access_requests.pending_tab"
          >
            Pending ({counts.pending})
          </TabsTrigger>
          <TabsTrigger
            value="approved"
            className="text-xs px-3 h-6"
            data-ocid="access_requests.approved_tab"
          >
            Approved ({counts.approved})
          </TabsTrigger>
          <TabsTrigger
            value="denied"
            className="text-xs px-3 h-6"
            data-ocid="access_requests.denied_tab"
          >
            Denied ({counts.denied})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="shadow-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="pl-5 text-xs font-semibold">
                  Requester
                </TableHead>
                <TableHead className="text-xs font-semibold">
                  Resource
                </TableHead>
                <TableHead className="text-xs font-semibold">Type</TableHead>
                <TableHead className="text-xs font-semibold">
                  Requested At
                </TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold pr-5">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow data-ocid="access_requests.empty_state">
                  <TableCell
                    colSpan={6}
                    className="text-center text-sm text-muted-foreground py-10"
                  >
                    No requests found
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((req, i) => (
                <TableRow
                  key={String(req.id)}
                  className="text-xs"
                  data-ocid={`access_requests.item.${i + 1}`}
                >
                  <TableCell className="font-medium pl-5">
                    {req.requesterName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {req.resourceName}
                  </TableCell>
                  <TableCell>{req.requestType}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(req.requestedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={req.status} />
                  </TableCell>
                  <TableCell className="pr-5">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setViewRequest(req)}
                        data-ocid={`access_requests.view.${i + 1}`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {req.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-green-600 hover:text-green-700"
                            onClick={() => handleAction(req.id, "approved")}
                            data-ocid={`access_requests.approve.${i + 1}`}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive/80"
                            onClick={() => handleAction(req.id, "denied")}
                            data-ocid={`access_requests.deny.${i + 1}`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Request Details Modal */}
      <Dialog
        open={!!viewRequest}
        onOpenChange={(o) => !o && setViewRequest(null)}
      >
        <DialogContent
          className="sm:max-w-md"
          data-ocid="access_requests.view_dialog"
        >
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              Access request submitted by {viewRequest?.requesterName}
            </DialogDescription>
          </DialogHeader>
          {viewRequest && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Resource</p>
                  <p className="font-medium mt-0.5">
                    {viewRequest.resourceName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Request Type</p>
                  <p className="font-medium mt-0.5">
                    {viewRequest.requestType}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <div className="mt-0.5">
                    <StatusBadge status={viewRequest.status} />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Requested At</p>
                  <p className="font-medium mt-0.5">
                    {new Date(viewRequest.requestedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Reason</p>
                <p className="mt-0.5 text-muted-foreground text-sm">
                  {viewRequest.reason}
                </p>
              </div>
              {viewRequest.resolvedBy && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Resolved By</p>
                    <p className="font-medium mt-0.5">
                      {viewRequest.resolvedBy}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Resolved At</p>
                    <p className="font-medium mt-0.5">
                      {viewRequest.resolvedAt
                        ? new Date(viewRequest.resolvedAt).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewRequest(null)}
              data-ocid="access_requests.close_button"
            >
              Close
            </Button>
            {viewRequest?.status === "pending" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleAction(viewRequest.id, "denied");
                    setViewRequest(null);
                  }}
                  data-ocid="access_requests.deny_confirm_button"
                >
                  Deny
                </Button>
                <Button
                  onClick={() => {
                    handleAction(viewRequest.id, "approved");
                    setViewRequest(null);
                  }}
                  data-ocid="access_requests.approve_confirm_button"
                >
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Request Modal */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent
          className="sm:max-w-md"
          data-ocid="access_requests.new_dialog"
        >
          <DialogHeader>
            <DialogTitle>New Access Request</DialogTitle>
            <DialogDescription>
              Submit a new access request for approval.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Requester Name</Label>
              <Input
                placeholder="Your name"
                value={newForm.requesterName}
                onChange={(e) =>
                  setNewForm((p) => ({ ...p, requesterName: e.target.value }))
                }
                data-ocid="access_requests.requester_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Resource Name</Label>
              <Input
                placeholder="e.g. Production Database"
                value={newForm.resourceName}
                onChange={(e) =>
                  setNewForm((p) => ({ ...p, resourceName: e.target.value }))
                }
                data-ocid="access_requests.resource_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Request Type</Label>
              <Select
                value={newForm.requestType}
                onValueChange={(v) =>
                  setNewForm((p) => ({ ...p, requestType: v }))
                }
              >
                <SelectTrigger data-ocid="access_requests.type_select">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Read Access">Read Access</SelectItem>
                  <SelectItem value="Write Access">Write Access</SelectItem>
                  <SelectItem value="Admin Access">Admin Access</SelectItem>
                  <SelectItem value="Temporary Access">
                    Temporary Access
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Reason</Label>
              <Textarea
                placeholder="Explain why you need this access..."
                value={newForm.reason}
                onChange={(e) =>
                  setNewForm((p) => ({ ...p, reason: e.target.value }))
                }
                rows={3}
                data-ocid="access_requests.reason_textarea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewOpen(false)}
              data-ocid="access_requests.new_cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleNewRequest}
              data-ocid="access_requests.new_submit_button"
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
