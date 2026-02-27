"use client";

import {
  Building2,
  Users,
  Shield,
  BarChart3,
  FileText,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import Image from "next/image";

const features = [
  {
    icon: Building2,
    title: "Property Management",
    description:
      "Track properties, rooms, certificates, and maintenance with full approval workflows.",
  },
  {
    icon: Users,
    title: "Service User Profiles",
    description:
      "Comprehensive profiles with medical, financial, residency, and support needs tracking.",
  },
  {
    icon: Shield,
    title: "Case Management",
    description:
      "Handle complaints, safeguarding, and escalations with priority-based workflows.",
  },
  {
    icon: BarChart3,
    title: "Finance & Rent",
    description:
      "Payment tracking, bulk uploads, rent statements, and financial reporting.",
  },
  {
    icon: FileText,
    title: "Support Logs",
    description:
      "Digital session notes with signatures, file attachments, and staff assignment.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Automated reminders for expiring certificates, pending approvals, and overdue cases.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function Features() {
  return (
    <section
      id="features"
      className=" border-t border-border/50 bg-[#fbf8f2]/50 "
    >
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
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
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                className="group rounded-xl border border-border/50 bg-[#fbf8f2] p-6 
                shadow-sm transition-all duration-300 
                hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(20,40,30,0.15)] 
                transform-gpu  hover:scale-[1.02] "
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg 
                bg-[#e6f2ec] transition-colors duration-300 
                group-hover:bg-[#1f6b4a]"
                >
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
