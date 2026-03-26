import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Bell,
  ChevronRight,
  FileCheck,
  FileText,
  Key,
  LayoutDashboard,
  LogOut,
  Menu,
  ScrollText,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

type Page =
  | "dashboard"
  | "users"
  | "roles"
  | "permissions"
  | "access-requests"
  | "audit-log"
  | "policies"
  | "settings";

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}

const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "roles", label: "Roles", icon: ShieldCheck },
  { id: "permissions", label: "Permissions", icon: Key },
  { id: "access-requests", label: "Access Requests", icon: FileCheck },
  { id: "audit-log", label: "Audit Log", icon: ScrollText },
  { id: "policies", label: "Policies", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

const pageTitles: Record<Page, string> = {
  dashboard: "Dashboard Overview",
  users: "User Management",
  roles: "Roles",
  permissions: "Permissions",
  "access-requests": "Access Requests",
  "audit-log": "Audit Log",
  policies: "Policies",
  settings: "Settings",
};

export function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Enter" && setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-60 flex-col",
          "bg-sidebar transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{
          background:
            "linear-gradient(180deg, oklch(0.145 0.035 250) 0%, oklch(0.19 0.025 250) 100%)",
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
          <span className="text-sidebar-foreground font-semibold text-base tracking-tight">
            Apex IAM
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              data-ocid={`nav.${id}.link`}
              onClick={() => {
                onNavigate(id);
                setSidebarOpen(false);
              }}
              className={cn(
                "group w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                currentPage === id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  currentPage === id
                    ? "text-primary"
                    : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80",
                )}
              />
              {label}
              {currentPage === id && (
                <ChevronRight className="ml-auto h-3 w-3 text-primary" />
              )}
            </button>
          ))}
        </nav>

        {/* User / Logout */}
        <div className="border-t border-sidebar-border px-3 py-4 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary text-white text-xs">
                AR
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground text-xs font-medium truncate">
                ARNAV
              </p>
              <p className="text-sidebar-foreground/50 text-xs truncate">
                Administrator
              </p>
            </div>
          </div>
          <button
            type="button"
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-foreground">
              {pageTitles[currentPage]}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-48 pl-8 text-xs bg-muted border-transparent focus:border-border"
                data-ocid="topbar.search_input"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 relative"
              data-ocid="topbar.notifications_button"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
            </Button>
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary text-white text-xs">
                AR
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export type { Page };
