// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import { useState } from "react";
// import {
//   Building2,
//   Mail,
//   Lock,
//   User,
//   ArrowRight,
//   Building,
//   Eye,
//   EyeOff,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import { toast } from "sonner";

// export default function LoginForm() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);

//   const [error, setError] = useState(null);

//   async function handleLogin(e) {
//     e.preventDefault();

//     const formData = new FormData(e.target);

//     const email = formData.get("email");
//     const password = formData.get("password");

//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) {
//       setError(error.message);
//       return;
//     }

//     toast.success("Account Log In successfully 🎉", {
//     description: "Welcome to Kenley Property Systems",
//   });

//     router.push("/dashboard");
//   }

//   // Google log In
//   async function handleGoogleLogin() {
//   const { error } = await supabase.auth.signInWithOAuth({
//     provider: "google",
//     options: {
//       redirectTo: `${window.location.origin}/auth/callback`,
//       queryParams: {
//         prompt: "select_account",
//       },
//     },
//   });

//   if (error) {
//     toast.error("Google login failed");
//   }
// }

//   return (
//     <div className="flex min-h-screen">
//       <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 background">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="w-full max-w-sm"
//         >
//           <Link href="/" className="mb-8 flex items-center gap-2 group">
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg primary transition-transform group-hover:scale-110">
//               <Building2 className="h-5 w-5 primary-foreground-text" />
//             </div>
//             <span className="text-lg font-bold foreground-text ">
//               Kenley Property Systems
//             </span>
//           </Link>

//           <h1 className="mb-2 text-2xl font-bold foreground-text">
//             Welcome back
//           </h1>
//           <p className="mb-8 text-sm muted-foreground-text ">
//             Sign in to your account to continue
//           </p>

//           <form onSubmit={handleLogin} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email" className="foreground-text">
//                 Email
//               </Label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 muted-foreground-text " />
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="name@organisation.com"
//                   className="pl-10 h-11 
//                 focus-visible:ring-black focus-visible:border-black"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password" className="foreground-text">
//                 Password
//               </Label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 muted-foreground-text " />
//                 <Input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Min. 8 characters"
//                   className="pl-10 pr-10 h-11 
//                 focus-visible:ring-black focus-visible:border-black"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 muted-foreground-text hover:text-[#123d2b] transition-colors"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-4 w-4" />
//                   ) : (
//                     <Eye className="h-4 w-4" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
//               <Button type="submit" className="w-full h-11 primary">
//                 Sign in <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             </motion.div>
//           </form>

//           {/* <p className="mt-6 text-center text-sm muted-foreground-text">
//             Don't have an account?{" "}
//             <Link
//               href="/register"
//               className="font-medium primary-text hover:underline"
//             >
//               Create account
//             </Link>
//           </p> */}
//         </motion.div>
//       </div>

//       <div className="hidden relative flex-1 overflow-hidden lg:flex">
//         <Image
//           src="https://res.cloudinary.com/dcfl8iot4/image/upload/v1776732259/WhatsApp_Image_2026-04-20_at_22.53.34_pyhvlf.jpg"
//           alt="Background Image"
//           fill
//           sizes="100vw"
//           className="absolute inset-0 object-cover"
//         />
//         <div className="absolute inset-0 bg-black/75 z-10" />

//         <div className="relative flex flex-1 items-center justify-center p-12 z-20">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7, delay: 0.3 }}
//             className="max-w-md text-[#f7f2e9]"
//           >
//             <Building2 className="mb-6 h-12 w-12" />
//             <h2 className="mb-4 text-3xl lg:text-4xl font-black">
//               Supported housing management, simplified
//             </h2>
//             <p className="mb-8 text-[#f7f2e9]/80 leading-relaxed">
//               Manage properties, service users, employees all in one
//               integrated platform designed for supported accommodation
//               providers.
//             </p>
//             {/* <div className="grid grid-cols-2 gap-4">
//               {[
//                 { val: "2,400+", label: "Properties Managed" },
//                 { val: "98.2%", label: "Occupancy Rate" },
//                 { val: "150+", label: "Organisations" },
//                 { val: "99.9%", label: "Uptime" },
//               ].map((stat, i) => (
//                 <motion.div
//                   key={stat.label}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.5 + i * 0.1 }}
//                   className="rounded-lg bg-[#f7f2e9]/10 backdrop-blur-sm p-3"
//                 >
//                   <p className="text-xl font-bold">{stat.val}</p>
//                   <p className="text-xs text-[#f7f2e9]/70">{stat.label}</p>
//                 </motion.div>
//               ))}
//             </div> */}
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 10 minutes in milliseconds
  const TIMEOUT_DURATION = 10 * 60 * 1000; 
  const timeoutRef = useRef(null);

  // --- 1. SESSION TIMEOUT LOGIC ---
  const handleAutoLogout = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Only logout if a session actually exists
    if (session) {
      await supabase.auth.signOut();
      toast.error("Session expired", {
        description: "You have been logged out due to 10 minutes of inactivity.",
      });
      router.push("/login");
    }
  }, [router]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(handleAutoLogout, TIMEOUT_DURATION);
  }, [handleAutoLogout]);

  useEffect(() => {
    // Events that count as 'activity'
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    
    // Initialize timer
    resetTimer();

    // Add listeners to the window
    events.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      // Clean up to prevent memory leaks
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [resetTimer]);


  // --- 2. SECURE LOGIN LOGIC ---
  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      toast.error("Missing credentials", { description: "Please enter both email and password." });
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      
      // Handle specific Supabase error codes for better security/UX
      switch (error.status) {
        case 400:
          toast.error("Invalid Login", { description: "The email or password you entered is incorrect." });
          break;
        case 422:
          toast.error("Configuration Error", { description: "Please check your email format." });
          break;
        case 429:
          toast.error("Too many attempts", { description: "Security lock: Please try again in a few minutes." });
          break;
        default:
          toast.error("Authentication Failed", { description: error.message });
      }
      return;
    }

    toast.success("Account Logged In successfully 🎉", {
      description: "Welcome to Kenley Property Systems",
    });

    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-[#FFFDD0]"> {/* Cream Background */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Link href="/" className="mb-8 flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#123D2B] transition-transform group-hover:scale-110">
              <Building2 className="h-5 w-5 text-[#FFFDD0]" />
            </div>
            <span className="text-lg font-bold text-[#123D2B]">
              Kenley Property Systems
            </span>
          </Link>

          <h1 className="mb-2 text-2xl font-bold text-[#123D2B]">
            Welcome back
          </h1>
          <p className="mb-8 text-sm text-[#123D2B]/70">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#123D2B]">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#123D2B]/50" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@organisation.com"
                  className="pl-10 h-11 border-[#123D2B]/20 focus-visible:ring-[#123D2B]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#123D2B]">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#123D2B]/50" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Min. 8 characters"
                  className="pl-10 pr-10 h-11 border-[#123D2B]/20 focus-visible:ring-[#123D2B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#123D2B]/50 hover:text-[#123D2B]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-11 bg-[#123D2B] hover:bg-[#123D2B]/90 text-[#FFFDD0]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>Sign in <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>

      {/* Decorative Right Panel */}
      <div className="hidden relative flex-1 overflow-hidden lg:flex">
        <Image
          src="https://res.cloudinary.com/dcfl8iot4/image/upload/v1776732259/WhatsApp_Image_2026-04-20_at_22.53.34_pyhvlf.jpg"
          alt="Kenley Properties"
          fill
          priority
          className="absolute inset-0 object-cover"
        />
        <div className="absolute inset-0 bg-[#123D2B]/80 z-10" />
        <div className="relative flex flex-1 items-center justify-center p-12 z-20">
          <div className="max-w-md text-[#FFFDD0]">
            <h2 className="mb-4 text-4xl font-black">
              Supported housing management, simplified
            </h2>
            <p className="text-[#FFFDD0]/80 leading-relaxed">
              Secure, role-based access control for Kenley Group employees and auditors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}