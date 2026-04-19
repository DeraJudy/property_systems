"use client";

import { useState } from "react";
import MobileSidebar from "./MobileSidebar";
import Header from "./Header";
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
  FileArchiveIcon, HardDriveUpload
} from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Organisations", url: "/organisations", icon: Building2 },
  { title: "Users", url: "/users", icon: Users },
  { title: "Properties", url: "/properties", icon: Home },
  { title: "Service Users", url: "/service-users", icon: UserCircle },
  { title: "Repository", url: "/repository", icon: FileArchiveIcon },
  { title: "Pre-Migration", url: "/pre-migration", icon: HardDriveUpload },
  { title: "Core Documents", url: "/core-documents", icon: DownloadCloud },
  // { title: "Support Logs", url: "/support-logs", icon: FileText },
  // { title: "Cases", url: "/cases", icon: AlertTriangle },
  // { title: "Finance", url: "/finance", icon: PoundSterling },
  // { title: "Approvals", url: "/approvals", icon: CheckSquare },
  // { title: "Documents", url: "/documents", icon: FolderOpen },
  // { title: "Reports", url: "/reports", icon: BarChart3 },
];

export default function MobileSidebarWrapper({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col">
      <MobileSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        navItems={navItems}
      />
      <Header setSidebarOpen={setSidebarOpen} />
      {children}
    </div>
  );
}