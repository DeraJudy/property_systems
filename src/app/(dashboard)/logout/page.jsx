// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import { toast } from "sonner";

// export default function LogoutPage() {
//   const router = useRouter();

//   useEffect(() => {
//   const handleLogout = async () => {
//     console.log("Logout started");

//     const { error } = await supabase.auth.signOut();

//     console.log(" Supabase response:", { error });

//     if (error) {
//       console.log(" Logout failed:", error.message);
//       toast.error("Logout failed");
//       router.push("/dashboard");
//     } else {
//       console.log("Logout successful. Redirecting to login...");

//       setTimeout(() => {
//         console.log("Navigating to /login");
//         toast.success("Logged out successfully");
//         router.push("/login");
//       }, 1200);
//     }
//   };

//   handleLogout();
// }, [router]);

//   return (
//     <div className="flex h-screen flex-col items-center justify-center">
      
//       {/* Animated Spinner */}
//       <div className="relative">
//         <div
//           className="h-16 w-16 rounded-full border-4 border-t-transparent animate-spin"
//           style={{ borderColor: "black", borderTopColor: "transparent" }}
//         /> 
        
//         <div
//           className="absolute inset-0 m-auto h-4 w-4 rounded-full animate-pulse"
//           style={{ backgroundColor: "black" }}
//         />
//       </div>

//       {/* Text */}
//       <p
//         className="mt-6 text-sm font-medium tracking-wide animate-pulse"
//         style={{ color: "black" }}
//       >
//         Logging you out...
//       </p>
//     </div>
//   );
// }

"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function LogoutPage() {
  const router = useRouter();
  const hasLoggedOut = useRef(false); // Prevents double-execution in React Strict Mode

  useEffect(() => {
    const handleLogout = async () => {
      // If we've already initiated logout in this mount cycle, stop here.
      if (hasLoggedOut.current) return;
      hasLoggedOut.current = true;

      console.log("Logout process initiated");

      try {
        // 1. Check if a session exists before trying to sign out
        // This prevents the "Refresh Token Not Found" error
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          console.log("No active session found, redirecting...");
          router.push("/login");
          return;
        }

        // 2. Perform the sign out
        // { scope: 'local' } can be added if you only want to clear the current tab
        const { error } = await supabase.auth.signOut();

        if (error) {
          // If the error is specifically about a missing refresh token, 
          // it means we are already logged out effectively.
          if (error.message.includes("Refresh Token Not Found")) {
            router.push("/login");
            return;
          }
          
          console.error("Logout failed:", error.message);
          toast.error("Logout failed");
          router.push("/dashboard");
        } else {
          console.log("Logout successful");
          toast.success("Logged out successfully");
          
          // Use replace instead of push to prevent users from clicking 'back' to a protected route
          router.replace("/login");
        }
      } catch (err) {
        console.error("Unexpected error during logout:", err);
        router.push("/login");
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#FFFDD0]">
      {/* Animated Spinner matching Kenley Branding */}
      <div className="relative">
        <div
          className="h-16 w-16 rounded-full border-4 animate-spin"
          style={{ borderColor: "#123D2B", borderTopColor: "transparent" }}
        /> 
        <div
          className="absolute inset-0 m-auto h-4 w-4 rounded-full animate-pulse"
          style={{ backgroundColor: "#123D2B" }}
        />
      </div>

      <p
        className="mt-6 text-sm font-medium tracking-wide animate-pulse"
        style={{ color: "#123D2B" }}
      >
        Signing out of Kenley Property Systems...
      </p>
    </div>
  );
}