"use client";

import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Header({ setSidebarOpen }) {
  const [initials, setInitials] = useState("");

  useEffect(() => {
    async function getInitials() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (profile?.full_name) {
        const parts = profile.full_name.trim().split(" ");

        const first = parts[0]?.charAt(0) || "";
        const second = parts[1]?.charAt(0) || "";

        setInitials((first + second).toUpperCase());
      }
    }

    getInitials();
  }, []);

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
        {initials || "U"}
      </div>
    </header>
  );
}
