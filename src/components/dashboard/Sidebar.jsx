"use client";

import { useState } from "react";
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
  Bell,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  UserCog,
  Shield,
  AlertOctagon,
  Package,
  Lock,
  Cog,
  Brain,
  Scale,
  TrendingUp,
  Eye,
  Users2,
  Link2,
  Briefcase,
  Search,
  Globe,
  Building,
  GitBranch,
  Wrench,
  FileCheck,
  Clock,
  ShieldCheck,
  Moon,
  Sun,
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

const navSections = [
  {
    label: "Core",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Organisations", url: "/organisations", icon: Building2 },
      { title: "Users", url: "/users", icon: Users },
      { title: "Properties", url: "/properties", icon: Home },
      { title: "Service Users", url: "/service-users", icon: UserCircle },
      // { title: "Support Logs", url: "/support-logs", icon: FileText },
      // { title: "Cases", url: "/cases", icon: AlertTriangle },
      // { title: "Finance", url: "/finance", icon: PoundSterling },
      // { title: "Approvals", url: "/approvals", icon: CheckSquare },
      // { title: "Documents", url: "/documents", icon: FolderOpen },
      // { title: "Reports", url: "/reports", icon: BarChart3 },
      { title: "HR", url: "/hrList", icon: UserCog },
    ],
  },
  // {
  //   label: "Operations",
  //   items: [
  //     { title: "Landlords", url: "/landlords", icon: Building },
  //     { title: "Referrals", url: "/referrals", icon: GitBranch },
  //     { title: "Vendors", url: "/vendors", icon: Wrench },
  //     { title: "Contracts", url: "/contracts", icon: FileCheck },
  //   ],
  // },
  // {
  //   label: "Enterprise",
  //   items: [
  //     { title: "Employees", url: "/employees", icon: UserCog },
  //     { title: "Compliance", url: "/compliance", icon: Shield },
  //     {
  //       title: "Risk Register",
  //       url: "/risk-register",
  //       icon: AlertOctagon,
  //     },
  //     { title: "Assets", url: "/assets", icon: Package },
  //     { title: "Security", url: "/security", icon: Lock },
  //     { title: "Configuration", url: "/configuration", icon: Cog },
  //     { title: "Insurance", url: "/insurance", icon: ShieldCheck },
  //     {
  //       title: "Data Protection",
  //       url: "/data-protection",
  //       icon: Shield,
  //     },
  //   ],
  // },
  // {
  //   label: "Intelligence",
  //   items: [
  //     { title: "Insights", url: "/insights", icon: Brain },
  //     { title: "Expiry Center", url: "/expiry-center", icon: Clock },
  //   ],
  // },
  // {
  //   label: "Regulatory",
  //   items: [{ title: "Regulatory", url: "/regulatory", icon: Scale }],
  // },
  // {
  //   label: "Infrastructure",
  //   items: [
  //     {
  //       title: "Benchmarking",
  //       url: "/benchmarking",
  //       icon: TrendingUp,
  //     },
  //     { title: "Auditor Access", url: "/auditor-access", icon: Eye },
  //     {
  //       title: "Resident Portal",
  //       url: "/dashboard/resident-portal",
  //       icon: Users2,
  //     },
  //     { title: "Secure Share", url: "/secure-share", icon: Link2 },
  //     { title: "Investor Board", url: "/investor", icon: Briefcase },
  //   ],
  // },
];

export default function Sidebar() {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-[#1E5A43] border-r border-[#184F38]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-5 border-b border-[#184F38] shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#206c3c]">
          <Building2 className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-bold text-white">Kenley Property</span>
      </div>

      {/* Navigation */}
      {/* <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
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
      </nav> */}

      <nav className="flex-1 px-3 py-3">
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-[#E8E1D6]">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <Link
                    key={item.title}
                    href={item.url}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-[#206c3c] text-white"
                        : "text-[#E8E1D6]/70 hover:bg-[#184F38] hover:text-white"
                    }`}
                  >
                    <item.icon className="h-3.5 w-3.5 shrink-0" />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
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
          href="/logout"
          className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg font-medium text-[#E8E1D6]/70 hover:bg-[#184F38] hover:text-white transition"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Link>
      </div>
    </aside>
  );
}
