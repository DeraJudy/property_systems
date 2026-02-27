"use client";
import {
  Building2,
  Users,
  Shield,
  BarChart3,
  FileText,
  Bell,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 background/80 backdrop-blur-md bg-[#f5f0e6]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg primary">
            <Building2 className="h-5 w-5 primary-foreground-text" />
          </div>
          <span className="text-lg font-bold text-[#123D2B]">Kenley Property Systems</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-[#6B7D74] hover:text-[#123D2B] transition-colors"
          >
            Features
          </a>
          <a
            href="#benefits"
            className="text-sm font-medium text-[#6B7D74] hover:text-[#123D2B] transition-colors"
          >
            Benefits
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-[#6B7D74] hover:text-[#123D2B] transition-colors"
          >
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="cursor-pointer ">Sign In</Button> 
          </Link>
          <Link href="/register">
            <Button size="lg" className="bg-[#1F6B4A] hover:bg-[#6B7D74] hover:text-[#123D2B]   cursor-pointer ">
                Get Started
                <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

      </div>
    </nav>
  );
}
