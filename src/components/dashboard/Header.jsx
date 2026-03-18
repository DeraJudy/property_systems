// "use client";

// import { Bell, Menu } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";

// export default function Header({ setSidebarOpen }) {
//   const [initials, setInitials] = useState("");

//   useEffect(() => {
//     async function getInitials() {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) return;

//       const { data: profile } = await supabase
//         .from("profiles")
//         .select("full_name")
//         .eq("id", user.id)
//         .single();

//       if (profile?.full_name) {
//         const parts = profile.full_name.trim().split(" ");

//         const first = parts[0]?.charAt(0) || "";
//         const second = parts[1]?.charAt(0) || "";

//         setInitials((first + second).toUpperCase());
//       }
//     }

//     getInitials();
//   }, []);

//   return (
//     <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-white px-6">
//       <Button
//         variant="ghost"
//         size="icon"
//         className="lg:hidden"
//         onClick={() => setSidebarOpen(true)}
//       >
//         <Menu className="h-5 w-5" />
//       </Button>

//       <div className="flex-1" />

//       <Button variant="ghost" size="icon" className="relative">
//         <Bell className="h-5 w-5 text-gray-500" />
//         <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
//       </Button>

//       <div className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#206c3c] text-xs font-semibold text-white">
//         {initials || "U"}
//       </div>
//     </header>
//   );
// }

"use client";

import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

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

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5 text-gray-500" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
      </Button>

      {/* Profile Avatar */}
      <div className="ml-4">
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
      </div>
    </header>
  );
}
