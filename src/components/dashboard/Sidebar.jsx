// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState } from "react";
// import {
//   LayoutDashboard,
//   Building2,
//   Users,
//   Home,
//   UserCircle,
//   FileText,
//   AlertTriangle,
//   PoundSterling,
//   CheckSquare,
//   FolderOpen,
//   Bell,
//   BarChart3,
//   Settings,
//   LogOut,
//   Menu,
//   X,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// const navItems = [
//   { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
//   { title: "Organisations", url: "/dashboard/organisations", icon: Building2 },
//   { title: "Users", url: "/dashboard/users", icon: Users },
//   { title: "Properties", url: "/dashboard/properties", icon: Home },
//   { title: "Service Users", url: "/dashboard/service-users", icon: UserCircle },
//   { title: "Support Logs", url: "/dashboard/support-logs", icon: FileText },
//   { title: "Cases", url: "/dashboard/cases", icon: AlertTriangle },
//   { title: "Finance", url: "/dashboard/finance", icon: PoundSterling },
//   { title: "Approvals", url: "/dashboard/approvals", icon: CheckSquare },
//   { title: "Documents", url: "/dashboard/documents", icon: FolderOpen },
//   { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
//   { title: "Reports", url: "/dashboard/reports", icon: BarChart3 },
// ];

// export default function SideBar() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const pathname = usePathname();

//   return (
//     <section className="flex min-h-screen background">

//       <aside
//         className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-200 lg:static lg:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >

//         <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
//           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
//             <Building2 className="h-4 w-4 text-sidebar-primary-foreground" />
//           </div>
//           <span className="text-sm font-bold text-sidebar-foreground">Kenley Property</span>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="ml-auto text-sidebar-foreground lg:hidden"
//             onClick={() => setSidebarOpen(false)}
//           >
//             <X className="h-4 w-4" />
//           </Button>
//         </div>

//         <nav className="flex-1 overflow-y-auto px-3 py-4">
//           <div className="space-y-1">
//             {navItems.map((item) => {
//               const isActive = pathname === item.url;
//               return (
//                 <Link
//                   key={item.title}
//                   href={item.url}
//                   onClick={() => setSidebarOpen(false)}
//                   className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
//                     isActive
//                       ? "bg-sidebar-accent text-sidebar-accent-foreground"
//                       : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
//                   }`}
//                 >
//                   <item.icon className="h-4 w-4 shrink-0" />
//                   {item.title}
//                 </Link>
//               );
//             })}
//           </div>
//         </nav>

//          <div className="border-t border-sidebar-border p-3">
//           <Link
//             href="/dashboard/settings"
//             className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
//           >
//             <Settings className="h-4 w-4" />
//             Settings
//           </Link>
//           <Link
//             href="/"
//             className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
//           >
//             <LogOut className="h-4 w-4" />
//             Sign out
//           </Link>
//         </div>

//       </aside>

//        <div className="flex flex-1 flex-col">
//         {/* Top bar */}
//         <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-md px-6">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="lg:hidden"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <Menu className="h-5 w-5" />
//           </Button>
//           <div className="flex-1" />
//           <Button variant="ghost" size="icon" className="relative">
//             <Bell className="h-5 w-5 text-muted-foreground" />
//             <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
//           </Button>
//           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
//             JD
//           </div>
//         </header>


//       </div>

//     </section>
//   );
// }


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
  { title: "Cases", url: "cases", icon: AlertTriangle },
  { title: "Finance", url: "finance", icon: PoundSterling },
  { title: "Approvals", url: "approvals", icon: CheckSquare },
  { title: "Documents", url: "documents", icon: FolderOpen },
  { title: "Reports", url: "reports", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-50 
    sidebar border-r border-[#1E5A43] transition-transform duration-200 lg:static lg:translate-x-0">
      
      <div className="flex h-16 items-center gap-2 px-5 border-b  border-[#1E5A43] ">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#206c3c]">
          <Building2 className="h-4 w-4 text-white" />
        </div>
        <span className=" text-sm font-bold sidebar-foreground-text">Kenley Property</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.url;

          return (
            <Link
              key={item.title}
              href={item.url}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3 space-y-1">
        <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
          <Settings className="h-4 w-4" />
          Settings
        </Link>

        <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
          <LogOut className="h-4 w-4" />
          Sign out
        </Link>
      </div>

    </aside>
  );
}