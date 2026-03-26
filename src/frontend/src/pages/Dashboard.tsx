import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileCheck,
  Key,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatusBadge } from "../components/StatusBadge";
import { activityData, requestStatusData } from "../data/sampleData";
import {
  useGetAccessRequests,
  useGetPermissions,
  useGetRoles,
  useGetUsers,
} from "../hooks/useQueries";

const DONUT_COLORS = ["#2563EB", "#F59E0B", "#EF4444"];

function KpiCard({
  title,
  value,
  delta,
  deltaUp,
  icon: Icon,
  iconBg,
}: {
  title: string;
  value: string | number;
  delta: string;
  deltaUp: boolean;
  icon: React.ElementType;
  iconBg: string;
}) {
  return (
    <Card className="shadow-card border-border">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {title}
            </p>
            <p className="mt-1.5 text-3xl font-bold text-foreground">{value}</p>
            <div className="mt-1 flex items-center gap-1">
              {deltaUp ? (
                <TrendingUp className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              )}
              <span
                className={`text-xs font-medium ${deltaUp ? "text-green-600" : "text-red-500"}`}
              >
                {delta}
              </span>
            </div>
          </div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function renderCustomLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return percent > 0.08 ? (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
}

export function Dashboard({ onNavigate }: { onNavigate: (page: any) => void }) {
  const { data: users } = useGetUsers();
  const { data: roles } = useGetRoles();
  const { data: permissions } = useGetPermissions();
  const { data: accessRequests } = useGetAccessRequests();

  const stats = useMemo(
    () => ({
      totalUsers: users?.length ?? 0,
      activeUsers: users?.filter((u) => u.status === "active").length ?? 0,
      totalRoles: roles?.length ?? 0,
      totalPermissions: permissions?.length ?? 0,
      pendingRequests:
        accessRequests?.filter((r) => r.status === "pending").length ?? 0,
    }),
    [users, roles, permissions, accessRequests],
  );

  const recentRequests = useMemo(
    () => (accessRequests ?? []).slice(0, 6),
    [accessRequests],
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">
          Dashboard Overview
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Welcome back, Sarah. Here's what's happening with your IAM
          environment.
        </p>
      </div>

      {/* KPI Cards */}
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        data-ocid="dashboard.section"
      >
        <KpiCard
          title="Total Users"
          value={stats.totalUsers}
          delta="+3 this month"
          deltaUp={true}
          icon={Users}
          iconBg="bg-blue-500"
        />
        <KpiCard
          title="Active Roles"
          value={stats.totalRoles}
          delta="+1 this month"
          deltaUp={true}
          icon={ShieldCheck}
          iconBg="bg-teal-500"
        />
        <KpiCard
          title="Permissions"
          value={stats.totalPermissions}
          delta="+2 this week"
          deltaUp={true}
          icon={Key}
          iconBg="bg-violet-500"
        />
        <KpiCard
          title="Pending Requests"
          value={stats.pendingRequests}
          delta="-2 vs yesterday"
          deltaUp={false}
          icon={FileCheck}
          iconBg="bg-amber-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Line Chart */}
        <Card className="lg:col-span-2 shadow-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">
              User Activity & Access Trends
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Last 6 months overview
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={activityData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  name="Active Users"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="accessEvents"
                  name="Access Events"
                  stroke="#14B8A6"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Donut Chart */}
        <Card className="shadow-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">
              Access Request Status
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Current period breakdown
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={requestStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {requestStatusData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1.5">
              {requestStatusData.map((item, i) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: DONUT_COLORS[i] }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Access Requests */}
      <Card className="shadow-card border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">
              Recent Access Requests
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Latest requests requiring review
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={() => onNavigate("access-requests")}
            data-ocid="dashboard.access_requests.link"
          >
            View All
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-xs font-semibold pl-5">
                  Requester
                </TableHead>
                <TableHead className="text-xs font-semibold">
                  Resource
                </TableHead>
                <TableHead className="text-xs font-semibold">Type</TableHead>
                <TableHead className="text-xs font-semibold">
                  Requested
                </TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold pr-5">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRequests.map((req, i) => (
                <TableRow
                  key={String(req.id)}
                  className="text-xs"
                  data-ocid={`dashboard.access_requests.item.${i + 1}`}
                >
                  <TableCell className="font-medium pl-5">
                    {req.requesterName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {req.resourceName}
                  </TableCell>
                  <TableCell>{req.requestType}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(req.requestedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={req.status} />
                  </TableCell>
                  <TableCell className="pr-5">
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs text-primary"
                      onClick={() => onNavigate("access-requests")}
                      data-ocid={`dashboard.access_requests.view.${i + 1}`}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground pt-2 pb-4">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          className="underline hover:text-foreground"
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
