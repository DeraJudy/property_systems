"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";
import { LayoutDashboard, ClipboardCheck, MapPin, ArrowRight, Building2 } from "lucide-react";
import { NEXT_SCHEDULED } from "@/features/dashbord/auditData";

const TiltCard = ({ href, badge, title, description, icon, accent, meta }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Maps mouse position to rotation degrees
  const rotateX = useTransform(y, [-50, 50], [8, -8]);
  const rotateY = useTransform(x, [-50, 50], [-8, 8]);

  const handleMouse = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Calculate position relative to the center of the card
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div style={{ perspective: 1200 }} className="w-full">
      <Link href={href} className="block h-full">
        <motion.div
          ref={ref}
          onMouseMove={handleMouse}
          onMouseLeave={reset}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="group relative block h-full overflow-hidden rounded-3xl border border-white/40 bg-white/40 p-7 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-shadow hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)] sm:p-9"
        >
          {/* Decorative Glow Effect */}
          <div
            className={`pointer-events-none absolute -inset-1 rounded-3xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60 ${accent}`}
            aria-hidden
          />
          
          <div className="relative flex h-full flex-col gap-6">
            <div className="flex items-start justify-between">
              <div className="rounded-2xl border border-black/10 bg-background/60 p-3 backdrop-blur">
                {icon}
              </div>
              <span className="rounded-full border border-black/15 bg-background/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider">
                {badge}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
            </div>

            {meta && <div className="mt-auto">{meta}</div>}

            <div className="flex items-center gap-2 text-sm font-semibold">
              Enter
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

const page = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-background via-background to-secondary/40">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-112 w-md rounded-full bg-warning/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 sm:px-6 sm:py-16">
        <header className="mb-10 flex items-center justify-between">
          <Link href="/" className="text-lg font-extrabold tracking-tight">
            Kenley Group
          </Link>
          <Link href="/dashboard" className="text-xs font-medium text-muted-foreground hover:text-foreground">
            Skip to Dashboard →
          </Link>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 max-w-2xl space-y-3"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-background/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            Portal · Choose your workspace
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Welcome back. Where to today?
          </h1>
          <p className="text-base text-muted-foreground">
            Run the full ERP, or jump straight into an on-site property audit.
          </p>
        </motion.div>

        <div className="grid flex-1 gap-6 sm:grid-cols-2">
          {/* ERP Dashboard Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
            <TiltCard
              href="/dashboard"
              badge="Operations"
              title="Admin ERP Dashboard"
              description="Full property, finance, compliance and resident management for office-based teams."
              icon={<LayoutDashboard className="h-7 w-7" />}
              accent="bg-gradient-to-br from-primary/30 to-warning/30"
              meta={
                <div className="flex flex-wrap gap-2">
                  {["Properties", "Finance", "Compliance", "Reports"].map((t) => (
                    <span key={t} className="rounded-full border border-black/10 bg-background/60 px-2.5 py-1 text-[11px] font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              }
            />
          </motion.div>

          {/* Audit Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
            <TiltCard
              href="/audit"
              badge="On-site"
              title="Daily Property Audit"
              description="Mobile-first inspection flow with geo-lock, photo evidence, and instant PDF reports."
              icon={<ClipboardCheck className="h-7 w-7" />}
              accent="bg-gradient-to-br from-success/30 to-info/30"
              meta={
                <div className="rounded-2xl border border-black/10 bg-background/70 p-3 backdrop-blur">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> Next Scheduled
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Building2 className="h-4 w-4" />
                      Property #{NEXT_SCHEDULED.id} · {NEXT_SCHEDULED.name}
                    </div>
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                      {NEXT_SCHEDULED.scheduledFor}
                    </span>
                  </div>
                </div>
              }
            />
          </motion.div>
        </div>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Kenley Group · Secure operator portal
        </footer>
      </div>
    </div>
  );
};

export default page;