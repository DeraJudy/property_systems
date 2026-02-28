"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

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
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r lg:hidden flex flex-col">

        <div className="flex h-16 items-center justify-between px-5 border-b">
          <span className="font-semibold">Kenley Property</span>
          <button onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.url;

            return (
              <Link
                key={item.title}
                href={item.url}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                  isActive
                    ? "bg-[#206c3c] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>

      </aside>
    </>
  );
}