import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  inactive: {
    label: "Inactive",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  suspended: {
    label: "Suspended",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  approved: {
    label: "Approved",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  denied: {
    label: "Denied",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  success: {
    label: "Success",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  failure: {
    label: "Failure",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  warning: {
    label: "Warning",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] ?? {
    label: status,
    className: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full text-xs font-medium px-2.5 py-0.5",
        config.className,
        className,
      )}
    >
      {config.label}
    </Badge>
  );
}
