import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { StatusBadge } from "../components/StatusBadge";
import { useGetAuditLogs } from "../hooks/useQueries";

export function AuditLog() {
  const { data: logs = [] } = useGetAuditLogs();
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        !search ||
        log.userName.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.resource.toLowerCase().includes(search.toLowerCase()) ||
        log.ipAddress.includes(search);
      const matchesDate = !dateFilter || log.timestamp.startsWith(dateFilter);
      return matchesSearch && matchesDate;
    });
  }, [logs, search, dateFilter]);

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Audit Log</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Complete record of all access events and changes
        </p>
      </div>

      <Card className="shadow-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-sm"
                data-ocid="audit_log.search_input"
              />
            </div>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="h-8 text-sm w-auto"
              data-ocid="audit_log.date_input"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="pl-5 text-xs font-semibold">
                  Timestamp
                </TableHead>
                <TableHead className="text-xs font-semibold">User</TableHead>
                <TableHead className="text-xs font-semibold">Action</TableHead>
                <TableHead className="text-xs font-semibold">
                  Resource
                </TableHead>
                <TableHead className="text-xs font-semibold">
                  IP Address
                </TableHead>
                <TableHead className="text-xs font-semibold pr-5">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow data-ocid="audit_log.empty_state">
                  <TableCell
                    colSpan={6}
                    className="text-center text-sm text-muted-foreground py-10"
                  >
                    No log entries found
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((log, i) => (
                <TableRow
                  key={String(log.id)}
                  className="text-xs"
                  data-ocid={`audit_log.item.${i + 1}`}
                >
                  <TableCell className="pl-5 text-muted-foreground font-mono text-xs">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">{log.userName}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {log.resource}
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground">
                    {log.ipAddress}
                  </TableCell>
                  <TableCell className="pr-5">
                    <StatusBadge status={log.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
