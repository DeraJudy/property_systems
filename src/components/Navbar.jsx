// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { Menu, X, Building2, ArrowRight } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "./ui/button";

// export default function Navbar() {
//   const [open, setOpen] = useState(false);

//   return (
//     <nav className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-md bg-[#f5f0e6]/80">
//       <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

//         {/* Logo */}
//         <Link href="/" className="flex items-center gap-2">
//           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F6B4A]">
//             <Building2 className="h-5 w-5 text-[#F7F2E9]" />
//           </div>
//           <span className="text-lg font-bold text-[#123D2B]">
//             Kenley Property Systems
//           </span>
//         </Link>

//         {/* Desktop Nav */}
//         <div className="hidden items-center gap-8 md:flex">
//           <a href="#features" className="text-sm font-medium text-[#6B7D74] hover:text-[#123D2B] transition-colors">
//             Our Story
//           </a>
//           {/* <a href="#benefits" className="text-sm font-medium text-[#6B7D74] hover:text-[#123D2B] transition-colors">
//             Benefits
//           </a>
//           <a href="#pricing" className="text-sm font-medium text-[#6B7D74] hover:text-[#123D2B] transition-colors">
//             Pricing
//           </a> */}
//         </div>

//         {/* Desktop Buttons */}
//         <div className="hidden items-center gap-3 md:flex">
//           <Link href="/login">
//             <Button variant="ghost" size="sm">
//               Sign In
//             </Button>
//           </Link>

//           <Link href="/register">
//             <Button
//               size="lg"
//               className="bg-[#1F6B4A] hover:bg-[#17563B] text-[#F7F2E9]"
//             >
//               Get Started
//               <ArrowRight className="ml-1 h-4 w-4" />
//             </Button>
//           </Link>
//         </div>

//         {/* Mobile Button */}
//         <button
//           className="md:hidden p-2 rounded-lg hover:bg-black/5"
//           onClick={() => setOpen(!open)}
//         >
//           {open ? <X /> : <Menu />}
//         </button>
//       </div>

//       {/* Mobile Dropdown */}
//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ opacity: 0, y: -15 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -15 }}
//             transition={{ duration: 0.25 }}
//             className="md:hidden border-t border-border/50 bg-[#f5f0e6]/95 backdrop-blur-xl"
//           >
//             <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col gap-4">

//               <a href="#features" className="text-sm font-medium text-[#123D2B]">
//                 Our Story
//               </a>

//               {/* <a href="#benefits" className="text-sm font-medium text-[#123D2B]">
//                 Benefits
//               </a>

//               <a href="#pricing" className="text-sm font-medium text-[#123D2B]">
//                 Pricing
//               </a> */}

//               <div className="flex flex-col gap-3 pt-4 border-t border-border/40">
//                 <Link href="/login">
//                   <Button variant="outline" className="w-full">
//                     Sign In
//                   </Button>
//                 </Link>

//                 <Link href="/register">
//                   <Button className="w-full bg-[#1F6B4A] hover:bg-[#17563B] text-[#F7F2E9]">
//                     Get Started
//                   </Button>
//                 </Link>
//               </div>

//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// }


"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-md">
      {/* Increased height from h-16 to h-20 and standardized horizontal padding */}
      <div className="container mx-auto flex h-20 items-center justify-between px-8 md:px-12">
        <Link href="/" className="flex items-center gap-2">
          {/* Matched logo style to Footer logo */}
          <span className="text-xl font-black tracking-tighter text-foreground uppercase">
            Kenley Group
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-10 md:flex">
          <a href="#story" className="text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
            Our Story
          </a>
          <a href="#video" className="text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
            Watch
          </a>
          <a href="#connect" className="text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
            Social
          </a>
        </div>

        {/* Auth Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/login">
            <Button variant="ghost" className="font-bold text-sm">Sign in</Button>
          </Link>
          <Link href="/register">
            <Button className="rounded-full px-6 font-bold text-sm">Get Started</Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="p-2 md:hidden" 
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/50 bg-background md:hidden"
          >
            <div className="flex flex-col gap-6 p-8"> {/* Increased padding for mobile menu */}
              <a href="#story" onClick={() => setMobileOpen(false)} className="text-lg font-bold text-foreground">Our Story</a>
              <a href="#video" onClick={() => setMobileOpen(false)} className="text-lg font-bold text-foreground">Watch</a>
              <a href="#connect" onClick={() => setMobileOpen(false)} className="text-lg font-bold text-foreground">Social</a>
              <hr className="border-border/50" />
              <div className="flex flex-col gap-3">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full rounded-full py-6 font-bold">Sign in</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full rounded-full py-6 font-bold">Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;