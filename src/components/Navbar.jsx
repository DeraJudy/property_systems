"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Building2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-md bg-[#f5f0e6]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F6B4A]">
            <Building2 className="h-5 w-5 text-[#F7F2E9]" />
          </div>
          <span className="text-lg font-bold text-[#123D2B]">
            Kenley Property Systems
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-[#6B7D74] hover:text-[#123D2B] transition-colors">
            Features
          </a>
          <a href="#benefits" className="text-sm font-medium text-[#6B7D74] hover:text-[#123D2B] transition-colors">
            Benefits
          </a>
          <a href="#pricing" className="text-sm font-medium text-[#6B7D74] hover:text-[#123D2B] transition-colors">
            Pricing
          </a>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/Login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>

          <Link href="/Register">
            <Button
              size="lg"
              className="bg-[#1F6B4A] hover:bg-[#17563B] text-[#F7F2E9]"
            >
              Get Started
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-black/5"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-border/50 bg-[#f5f0e6]/95 backdrop-blur-xl"
          >
            <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col gap-4">

              <a href="#features" className="text-sm font-medium text-[#123D2B]">
                Features
              </a>

              <a href="#benefits" className="text-sm font-medium text-[#123D2B]">
                Benefits
              </a>

              <a href="#pricing" className="text-sm font-medium text-[#123D2B]">
                Pricing
              </a>

              <div className="flex flex-col gap-3 pt-4 border-t border-border/40">
                <Link href="/Login">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>

                <Link href="/Register">
                  <Button className="w-full bg-[#1F6B4A] hover:bg-[#17563B] text-[#F7F2E9]">
                    Get Started
                  </Button>
                </Link>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
