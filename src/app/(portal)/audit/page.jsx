"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  ShieldCheck, 
  Loader2, 
  AlertTriangle, 
  Building2, 
  Clock, 
  Smartphone 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  AUDIT_PROPERTIES, 
  distanceInMetres, 
  NEXT_SCHEDULED, 
  SESSION_STORAGE_KEY 
} from "@/features/audit/auditData";

// Device detection helper
const detectDevice = () => {
  if (typeof navigator === "undefined") return { device: "Unknown", browser: "Unknown" };
  const ua = navigator.userAgent;
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
  const browser = /Chrome/.test(ua) ? "Chrome" : /Safari/.test(ua) ? "Safari" : /Firefox/.test(ua) ? "Firefox" : "Other";
  return { device: isMobile ? "Mobile" : "Desktop", browser };
};

const page = () => {
  const router = useRouter();
  const property = NEXT_SCHEDULED;
  
  // States
  const [phase, setPhase] = useState("intro"); // "intro" | "locating" | "blocked" | "ready"
  const [coords, setCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState(null);

  // Resume an in-progress session on mount
  useEffect(() => {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      try {
        const sess = JSON.parse(raw);
        if (!sess.completedAt) {
          router.push(`/audit-run`);
        }
      } catch (e) {
        console.error("Session parse error", e);
      }
    }
  }, [router]);

  const beginSession = useCallback((override = false) => {
    const { device, browser } = detectDevice();
    const session = {
      propertyId: property.id,
      startedAt: Date.now(),
      device: override ? `${device} (Demo override)` : device,
      browser,
      coords: coords ?? null,
      currentIndex: 0,
      answers: {},
    };
    
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    router.push("/audit-run");
  }, [property, coords, router]);

  const startHandshake = () => {
    setPhase("locating");
    setError(null);

    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported on this device.");
      setPhase("blocked");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { 
          lat: pos.coords.latitude, 
          lng: pos.coords.longitude, 
          accuracy: pos.coords.accuracy 
        };
        setCoords(c);
        
        const d = distanceInMetres(c, { lat: property.lat, lng: property.lng });
        setDistance(d);

        // Geofence check (100 metres)
        if (d > 100) {
          setPhase("blocked");
        } else {
          setPhase("ready");
        }
      },
      (err) => {
        setError(err.message || "Could not access location.");
        setPhase("blocked");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute -top-32 right-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-xl px-4 py-8 sm:py-14">
        <button 
          onClick={() => router.push("/portal")} 
          className="mb-6 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to portal
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl"
        >
          {/* Header Section */}
          <div className="bg-black p-6 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-70">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Daily Property Audit
            </div>
            <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">{property.name}</h1>
            <div className="mt-1 text-sm opacity-80">
              Property #{property.id} · {property.code}
            </div>
            <div className="mt-3 flex items-start gap-2 text-xs opacity-80">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {property.address}
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-5 p-6">
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { icon: Clock, label: "6 tasks" },
                { icon: Building2, label: "On-site" },
                { icon: Smartphone, label: "Mobile-first" },
              ].map((m) => (
                <div key={m.label} className="rounded-xl border border-border bg-muted/40 p-3">
                  <m.icon className="mx-auto h-4 w-4 text-muted-foreground" />
                  <div className="mt-1 text-[11px] font-semibold">{m.label}</div>
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {phase === "intro" && (
                <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    For security, we'll verify you're at the property before starting. Your location, device and the time of audit are silently recorded.
                  </p>
                  <Button className="w-full h-12 bg-black text-white hover:bg-black/90" onClick={startHandshake}>
                    <ShieldCheck className="mr-2 h-4 w-4" /> Start Audit
                  </Button>
                </motion.div>
              )}

              {phase === "locating" && (
                <motion.div key="locating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm font-medium">Verifying your location...</p>
                  <p className="text-xs text-muted-foreground">Please allow location access when prompted.</p>
                </motion.div>
              )}

              {phase === "ready" && (
                <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                      <ShieldCheck className="h-4 w-4" /> Location verified
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      You are ~{Math.round(distance ?? 0)}m from {property.name}. Accuracy ±{Math.round(coords?.accuracy ?? 0)}m.
                    </p>
                  </div>
                  <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => beginSession(false)}>
                    Begin Audit →
                  </Button>
                </motion.div>
              )}

              {phase === "blocked" && (
                <motion.div key="blocked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-destructive text-white">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold">Security Check</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {error ? error : `You must be on-site at ${property.name} to start the log. Detected ~${Math.round(distance ?? 0)}m away.`}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <Button variant="outline" className="flex-1" onClick={() => setPhase("intro")}>
                        Try again
                      </Button>
                      <Button className="flex-1 bg-black text-white" onClick={() => beginSession(true)}>
                        Continue (Demo)
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Property Selector Footer */}
        <div className="mt-6 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Other scheduled</p>
          {AUDIT_PROPERTIES.filter((p) => p.id !== property.id).map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3 shadow-sm transition-all hover:border-primary/20">
              <div>
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">#{p.id} · {p.scheduledFor}</p>
              </div>
              <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold">Queued</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;