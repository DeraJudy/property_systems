// import Header from "@/components/dashboard/Header";
// import SideBar from "@/components/dashboard/Sidebar";

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="flex items-start justify-between">
//         <SideBar />
//         <Header />
//         <main className="w-full h-full">{children}</main>
//       </body>
//     </html>
//   );
// }


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
  BarChart3,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Organisations", url: "/dashboard/organisations", icon: Building2 },
  { title: "Users", url: "/dashboard/users", icon: Users },
  { title: "Properties", url: "/dashboard/properties", icon: Home },
  { title: "Service Users", url: "/dashboard/service-users", icon: UserCircle },
  { title: "Support Logs", url: "/dashboard/support-logs", icon: FileText },
  { title: "Cases", url: "/dashboard/cases", icon: AlertTriangle },
  { title: "Finance", url: "/dashboard/finance", icon: PoundSterling },
  { title: "Approvals", url: "/dashboard/approvals", icon: CheckSquare },
  { title: "Documents", url: "/dashboard/documents", icon: FolderOpen },
  { title: "Reports", url: "/dashboard/reports", icon: BarChart3 },
]

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#faf6e7]">

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        navItems={navItems}
      />

      <div className="flex flex-1 flex-col">

        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-6">
          {children}
        </main>

      </div>

    </div>
  );
}