"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Settings, LogOut, Building2 } from "lucide-react";

export default function MobileSidebar({ open, setOpen, navItems }) {
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
            <span className="font-semibold text-sm">Kenley Property</span>
          </div>

          <button onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
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
            href="/"
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