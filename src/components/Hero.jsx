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
import { motion } from "framer-motion";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <section className="container py-20 md:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1F6B4A]/20 accent px-4 py-1.5 text-sm font-medium accent-foreground-text">
            <span className="h-2 w-2 rounded-full primary animate-pulse" />
            Purpose-built for supported housing
          </div>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-[#123D2B] md:text-5xl lg:text-6xl">
            Manage housing, <span className="primary-text">support lives</span>
          </h1>
          <p className="mb-8 max-w-lg text-lg muted-foreground-text leading-relaxed">
            The all-in-one platform for supported housing providers. Manage
            properties, service users, cases, finances, and compliance — all in
            one place.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-[#1F6B4A] hover:bg-[#6B7D74] hover:text-[#123D2B]"
              >
                Start Free Trial <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Demo
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          ></motion.div>
      </div>
    </section>
  );
}
