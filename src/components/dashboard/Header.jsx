"use client";

import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header({ setSidebarOpen }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-white px-6">

      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1" />

      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5 text-gray-500" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
      </Button>

      <div className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#206c3c] text-xs font-semibold text-white">
        JD
      </div>

    </header>
  );
}