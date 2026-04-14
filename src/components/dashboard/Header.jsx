"use client";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Bell, Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

export default function Header({ setSidebarOpen }) {
  const [initials, setInitials] = useState("");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (!profile) return;

      if (profile.avatar_url) {
        setAvatar(profile.avatar_url);
      }

      if (profile.full_name) {
        const parts = profile.full_name.trim().split(" ");

        const first = parts[0]?.charAt(0) || "";
        const second = parts[1]?.charAt(0) || "";

        setInitials((first + second).toUpperCase());
      }
    }

    loadProfile();
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-[#FFFDD0] px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1" />

      {/* Notifications */}
      {/* <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5 text-gray-500" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
      </Button> */}

      {/* Profile Avatar */}
      {/* <div className="ml-4">
        {avatar ? (
          <div className="relative h-8 w-8">
            <Image
              src={avatar}
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#206c3c] text-xs font-semibold text-white">
            {initials || "U"}
          </div>
        )}
      </div> */}
      <DropdownMenu>
    <DropdownMenuTrigger className="focus:outline-none ml-4">
      {avatar ? (
        <div className="relative h-8 w-8 transition-transform hover:scale-105">
          <Image
            src={avatar}
            alt="Profile"
            fill
            className="rounded-full object-cover border border-[#e1dbd2]"
          />
        </div>
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-semibold text-[#FFFDD0] transition-transform hover:scale-105">
          {initials || "U"}
        </div>
      )}
    </DropdownMenuTrigger>
    
    <DropdownMenuContent align="end" className="w-48 bg-[#fbf8f2] border-[#e1dbd2]">
      <DropdownMenuLabel className="text-black font-bold">My Account</DropdownMenuLabel>
      <DropdownMenuSeparator className="bg-[#e1dbd2]" />
      
      {/* <DropdownMenuItem className="cursor-pointer text-[#123d2b] hover:bg-[#f1ede4]">
        <User className="mr-2 h-4 w-4" />
        <span>Profile</span>
      </DropdownMenuItem> */}
      
      {/* <DropdownMenuSeparator className="bg-[#e1dbd2]" /> */}
      
      {/* Logout Link */}
      <Link href="/logout">
        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </Link>
    </DropdownMenuContent>
  </DropdownMenu>
    </header>
  );
}
