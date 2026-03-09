"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import Header from "@/components/dashboard/Header";
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
  { title: "AddProperties", url: "/addProperties", icon: Home },
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
      { title: "Support Logs", url: "/support-logs", icon: FileText },
      { title: "Cases", url: "/cases", icon: AlertTriangle },
      { title: "Finance", url: "/finance", icon: PoundSterling },
      { title: "Approvals", url: "/approvals", icon: CheckSquare },
      { title: "Documents", url: "/documents", icon: FolderOpen },
      { title: "Reports", url: "/reports", icon: BarChart3 },
      { title: "HR", url: "/hrList", icon: BarChart3 },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Landlords", url: "/landlords", icon: Building },
      { title: "Referrals", url: "/referrals", icon: GitBranch },
      { title: "Vendors", url: "/vendors", icon: Wrench },
      { title: "Contracts", url: "/contracts", icon: FileCheck },
    ],
  },
  {
    label: "Enterprise",
    items: [
      { title: "Employees", url: "/employees", icon: UserCog },
      { title: "Compliance", url: "/compliance", icon: Shield },
      {
        title: "Risk Register",
        url: "/risk-register",
        icon: AlertOctagon,
      },
      { title: "Assets", url: "/assets", icon: Package },
      { title: "Security", url: "/security", icon: Lock },
      { title: "Configuration", url: "/configuration", icon: Cog },
      { title: "Insurance", url: "/insurance", icon: ShieldCheck },
      {
        title: "Data Protection",
        url: "/data-protection",
        icon: Shield,
      },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { title: "Insights", url: "/insights", icon: Brain },
      { title: "Expiry Center", url: "/expiry-center", icon: Clock },
    ],
  },
  {
    label: "Regulatory",
    items: [{ title: "Regulatory", url: "/regulatory", icon: Scale }],
  },
  {
    label: "Infrastructure",
    items: [
      {
        title: "Benchmarking",
        url: "/benchmarking",
        icon: TrendingUp,
      },
      { title: "Auditor Access", url: "/auditor-access", icon: Eye },
      {
        title: "Resident Portal",
        url: "/dashboard/resident-portal",
        icon: Users2,
      },
      { title: "Secure Share", url: "/secure-share", icon: Link2 },
      { title: "Investor Board", url: "/investor", icon: Briefcase },
    ],
  },
];

export default function DashboardShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#faf6e7]">
      <Sidebar />

      <MobileSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        // navItems={navItems}
        navSections={navSections}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1 flex-col">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}