import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Key } from "lucide-react";
import { useMemo } from "react";
import { useGetPermissions } from "../hooks/useQueries";

const categoryColors: Record<string, string> = {
  "User Management": "bg-blue-100 text-blue-700 border-blue-200",
  "Access Control": "bg-violet-100 text-violet-700 border-violet-200",
  Compliance: "bg-teal-100 text-teal-700 border-teal-200",
  Development: "bg-orange-100 text-orange-700 border-orange-200",
  Operations: "bg-gray-100 text-gray-700 border-gray-200",
  Workflow: "bg-indigo-100 text-indigo-700 border-indigo-200",
  Analytics: "bg-cyan-100 text-cyan-700 border-cyan-200",
  Finance: "bg-green-100 text-green-700 border-green-200",
};

export function Permissions() {
  const { data: permissions = [] } = useGetPermissions();

  const grouped = useMemo(() => {
    const map: Record<string, typeof permissions> = {};
    for (const p of permissions) {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    }
    return map;
  }, [permissions]);

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Permissions</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {permissions.length} permissions across {Object.keys(grouped).length}{" "}
          categories
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(grouped).map(([category, perms]) => (
          <Card key={category} className="shadow-card border-border">
            <CardHeader className="pb-0 pt-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Key className="h-4 w-4 text-primary" />
                {category}
                <Badge variant="secondary" className="text-xs ml-1">
                  {perms.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-2">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="pl-5 text-xs font-semibold">
                      Permission
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Resource
                    </TableHead>
                    <TableHead className="text-xs font-semibold pr-5">
                      Description
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {perms.map((perm, i) => (
                    <TableRow
                      key={String(perm.id)}
                      className="text-xs"
                      data-ocid={`permissions.item.${i + 1}`}
                    >
                      <TableCell className="pl-5">
                        <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                          {perm.name}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs rounded-full ${categoryColors[perm.category] ?? ""}`}
                        >
                          {perm.resource}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-5 text-muted-foreground">
                        {perm.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
