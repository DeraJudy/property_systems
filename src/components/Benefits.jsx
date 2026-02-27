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
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button";

const benefits = [
  "Multi-tenant organisation hierarchy",
  "Role-based access control",
  "Real-time dashboard analytics",
  "Mobile responsive design",
  "Document management & storage",
  "Automated approval workflows",
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


export default function Benefits() {
  return (
      <section id="benefits" className="py-20">
        <div className="mx-auto max-w-7xl ">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
            >
              <h2 className="mb-4 text-3xl font-bold foreground-text md:text-4xl">
                Built for scale, designed for simplicity
              </h2>
              <p className="mb-8 muted-foreground-text">
                Whether you manage 10 or 10,000 units, our platform grows with
                you while keeping things intuitive for every team member.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={benefit}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={i + 1}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 primary-text" />
                    <span className="text-sm font-medium foreground-text">
                      {benefit}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="rounded-2xl bg-[linear-gradient(135deg,#1F6B4A,#2A8C5F,#123D2B)] p-8 primary-foreground-text"
            >
              <h3 className="mb-2 text-2xl font-bold">
                Ready to transform your operations?
              </h3>
              <p className="mb-6 text-[#f7f2e9]/80">
                Join leading supported housing providers who trust Kenley
                Property Systems.
              </p>
              <Link href="/register">
                <Button variant="secondary" size="lg">
                  Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
  );
}
