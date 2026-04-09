"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Settings, LogOut, Building2 } from "lucide-react";

export default function MobileSidebar({ open, setOpen, navItems, navSections, setSidebarOpen }) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r flex flex-col lg:hidden">

        {/* Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#206c3c]">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <Link href="/" className="text-sm font-bold text-white">
              <span className="text-sm font-bold text-white">Kenley Property</span>
            </Link>
          </div>

          <button onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        {/* <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.url;

            return (
              <Link
                key={item.title}
                href={item.url}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#206c3c] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.title}
              </Link>
            );
          })}
        </nav> */}

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-[#123d2b]/40">
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
                        : "text-gray-600 hover:bg-gray-100  hover:text-sidebar-foreground"
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
        <div className="border-t p-3 space-y-1 shrink-0">

          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>

          <Link
            href="/logout"
            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Link>

        </div>

      </aside>
    </>
  );
}