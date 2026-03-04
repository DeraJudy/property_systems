"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
  const handleLogout = async () => {
    console.log("Logout started");

    const { error } = await supabase.auth.signOut();

    console.log(" Supabase response:", { error });

    if (error) {
      console.log(" Logout failed:", error.message);
      toast.error("Logout failed");
      router.push("/dashboard");
    } else {
      console.log("Logout successful. Redirecting to login...");

      setTimeout(() => {
        console.log("Navigating to /login");
        toast.success("Logged out successfully");
        router.push("/login");
      }, 1200);
    }
  };

  handleLogout();
}, [router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white">
      
      {/* Animated Spinner */}
      <div className="relative">
        <div
          className="h-16 w-16 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "#123d2b", borderTopColor: "transparent" }}
        /> 
        
        <div
          className="absolute inset-0 m-auto h-4 w-4 rounded-full animate-pulse"
          style={{ backgroundColor: "#123d2b" }}
        />
      </div>

      {/* Text */}
      <p
        className="mt-6 text-sm font-medium tracking-wide animate-pulse"
        style={{ color: "#123d2b" }}
      >
        Logging you out...
      </p>
    </div>
  );
}