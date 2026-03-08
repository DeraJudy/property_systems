"use client";

import {
  Building2, Users, Shield, BarChart3, FileText, Bell, CheckCircle2,
  ArrowRight, ChevronRight, Brain, Scale, TrendingUp, Lock, UserCog,
  Eye, Briefcase, Wrench,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Building2, title: "Property & Room Management", description: "Full lifecycle property tracking with room allocation, certificates, maintenance, and approval workflows." },
  { icon: Users, title: "Service User Profiles", description: "Comprehensive resident profiles with medical, financial, residency, and support needs across 8 detailed tabs." },
  { icon: Shield, title: "Case & Safeguarding", description: "Priority-based case management with automatic escalation, confidential handling, and regulatory compliance." },
  { icon: BarChart3, title: "Finance & Rent Engine", description: "Payment tracking, bulk uploads, rent statements, arrears monitoring, and full financial reporting." },
  { icon: UserCog, title: "HR & Workforce", description: "Employee profiles, DBS tracking, right to work, safeguarding training, contract management, and compliance scoring." },
  { icon: Brain, title: "Predictive Intelligence", description: "AI-powered risk signals, burnout detection, incident clustering, maintenance forecasting, and anomaly alerts." },
  { icon: Scale, title: "CQC & Ofsted Readiness", description: "Framework-aligned compliance scoring, gap identification, digital audit pack generation, and inspection management." },
  { icon: Lock, title: "Security & Governance", description: "Full audit trails, GDPR compliance, role-based access, MFA enforcement, and data retention policies." },
  { icon: TrendingUp, title: "Benchmarking & Analytics", description: "Industry percentile comparisons, trend analytics, and executive dashboards for board-ready reporting." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export default function Features() {
  return (
    <section id="features" className="border-t border-border/50 bg-[#fbf8f2]/50">
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">
        <div className="container">

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold foreground-text md:text-4xl">
              Everything you need to manage supported housing
            </h2>
            <p className="mx-auto max-w-2xl muted-foreground-text">
              From property management to case handling, our platform covers
              every aspect of supported accommodation operations.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={i + 1}
                className="group rounded-xl border border-border/50 bg-[#fbf8f2] p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(20,40,30,0.15)] transform-gpu"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#e6f2ec] transition-colors duration-300 group-hover:bg-[#1f6b4a]">
                  <feature.icon className="h-6 w-6 text-[#1f6b4a] transition-colors duration-300 group-hover:text-[#f7f2e9]" />
                </div>

                <h3 className="mb-2 text-lg font-semibold foreground-text">
                  {feature.title}
                </h3>

                <p className="text-sm muted-foreground-text leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}