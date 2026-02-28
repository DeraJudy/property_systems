"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Home,
  UserCircle,
  FileText,
  AlertTriangle,
  PoundSterling,
  CheckSquare,
  FolderOpen,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Organisations", url: "/organisations", icon: Building2 },
  { title: "Users", url: "/users", icon: Users },
  { title: "Properties", url: "/properties", icon: Home },
  { title: "Service Users", url: "/service-users", icon: UserCircle },
  { title: "Support Logs", url: "/support-logs", icon: FileText },
  { title: "Cases", url: "/cases", icon: AlertTriangle },
  { title: "Finance", url: "/finance", icon: PoundSterling },
  { title: "Approvals", url: "/approvals", icon: CheckSquare },
  { title: "Documents", url: "/documents", icon: FolderOpen },
  { title: "Reports", url: "/reports", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex h-screen w-64 flex-col bg-[#1E5A43] border-r border-[#184F38]">

      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-5 border-b border-[#184F38] shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#206c3c]">
          <Building2 className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-bold text-white">Kenley Property</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.url;

          return (
            <Link
              key={item.title}
              href={item.url}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-[#206c3c] text-white"
                  : "text-[#E8E1D6]/70 hover:bg-[#184F38] hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#184F38] p-3 space-y-1 shrink-0">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg font-medium text-[#E8E1D6]/70 hover:bg-[#184F38] hover:text-white transition"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>

        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg font-medium text-[#E8E1D6]/70 hover:bg-[#184F38] hover:text-white transition"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Link>
      </div>

    </aside>
  );
}