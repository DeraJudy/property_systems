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
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileOpen]);

  const navLinks = [
    { name: "Our Story", href: "#story" },
    { name: "Watch", href: "#video" },
    { name: "Social", href: "#connect" },
  ];

  return (
    /* CHANGE BACKGROUND COLOR HERE:
       bg-[#0d0d0d] is that deep black we generated.
       border-white/5 gives it a very subtle 'top' edge.
    */
    <nav className="sticky top-0 z-100 border-b border-white/5 bg-background/90 shadow-2xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 md:px-12">
        {/* Logo */}
        <Link href="/" className="z-110 group">
          <span className="text-xl font-black tracking-tighter uppercase transition-transform group-hover:-translate-y-0.5 inline-block">
            Kenley Group
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-12 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="relative text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-colors group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-white transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-6 md:flex">
          {/* <Link href="/login">
            <Button variant="ghost" className="font-bold text-xs uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5">
              Sign in
            </Button>
          </Link> */}
          <Link href="/login">
            <Button className="h-12 px-10 w-full rounded-xl text-lg font-bold bg-white text-black shadow-xl hover:text-white">
              Log In
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="relative z-110 flex h-12 w-12 items-center justify-center md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <div className="relative h-6 w-6">
            <motion.span 
               animate={mobileOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
               className="absolute inset-0 m-auto h-0.5 w-6 bg-black rounded-full" 
            />
            <motion.span 
               animate={mobileOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
               className="absolute inset-0 m-auto h-0.5 w-6 bg-black rounded-full" 
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-100 flex flex-col bg-background/90 md:hidden"
          >
            <div className="flex flex-col h-full pt-32 px-10 pb-16">
              <div className="space-y-10">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-xl font-black tracking-tighter text-black"
                    >
                      {link.name}
                    </a>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-4">
                {/* <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="h-16 w-full rounded-2xl text-lg font-bold border-white/10 bg-white/5 text-white">
                    Sign in
                  </Button>
                </Link> */}
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button className="h-16 w-full rounded-2xl text-lg font-bold bg-black text-white shadow-xl">
                    Log In
                  </Button>
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