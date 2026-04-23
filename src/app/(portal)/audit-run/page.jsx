"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Save, 
  FileDown, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  UserCircle2,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Assets and Logic from your lib
import {
  AUDIT_TASKS,
  SESSION_STORAGE_KEY,
  AUDIT_PROPERTIES,
  saveCompletedAudit,
} from "@/features/audit/auditData";
import {
  PhotoTask,
  ChecklistTask,
  ObservationTask,
  VideoTask,
  MeterTask,
  SignatureTask,
} from "@/components/audit/TaskInputs";
import { generateAuditPdf } from "@/features/audit/auditPdf";

// Helper: Safe LocalStorage Access
function loadSession() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSession(s) {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(s));
  }
}

function isAnswerValid(taskId, a) {
  if (!a) return false;
  switch (taskId) {
    case "main-entrance":
      return !!a["main-entrance"]?.dataUrl;
    case "fire-safety": {
      const v = a["fire-safety"];
      return !!v && v.exitsClear !== null && v.alarmGreen !== null && v.extinguishersInDate !== null;
    }
    case "observations":
      return (a.observations?.text?.trim().length ?? 0) >= 10;
    case "walkthrough":
      return !!a.walkthrough?.dataUrl;
    case "meter-reading": {
      const v = a["meter-reading"];
      if (!v) return false;
      const w = parseFloat(v.water);
      const e = parseFloat(v.electric);
      return w >= 100 && w <= 9999 && e >= 1000 && e <= 99999;
    }
    case "signature":
      return !!a.signature?.dataUrl;
    default:
      return false;
  }
}

const AuditRunPage = () => {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [tick, setTick] = useState(0);
  const [completed, setCompleted] = useState(false);
  const reportRef = useRef(null);
  const saveTimer = useRef(null);

  // 1. Initial Load
  useEffect(() => {
    const s = loadSession();
    if (!s) {
      router.push("/audit");
      return;
    }
    setSession(s);
    if (s.completedAt) setCompleted(true);
  }, [router]);

  // 2. Timer Logic
  useEffect(() => {
    if (!session || completed) return;
    const i = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(i);
  }, [session, completed]);

  const persist = (next) => {
    setSession(next);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveSession(next), 400);
  };

  const property = useMemo(
    () => AUDIT_PROPERTIES.find((p) => p.id === session?.propertyId) ?? AUDIT_PROPERTIES[0],
    [session?.propertyId]
  );

  if (!session) return null;

  // Time Calculations
  const elapsedMs = (completed && session.completedAt ? session.completedAt : Date.now()) - session.startedAt;
  const elapsedMin = Math.floor(elapsedMs / 60000);
  const elapsedSec = Math.floor((elapsedMs % 60000) / 1000);

  const currentTask = AUDIT_TASKS[session.currentIndex];
  const valid = currentTask ? isAnswerValid(currentTask.id, session.answers) : false;
  const isLast = session.currentIndex === AUDIT_TASKS.length - 1;
  const progress = ((session.currentIndex + (valid ? 1 : 0)) / AUDIT_TASKS.length) * 100;

  const updateAnswer = (key, value) => {
    const next = {
      ...session,
      answers: { ...session.answers, [key]: value },
    };
    persist(next);
  };

  const goNext = () => {
    if (!valid) return;
    confetti({ particleCount: 12, spread: 50, origin: { y: 0.4 }, ticks: 60, scalar: 0.6 });
    
    if (isLast) {
      const completedAt = Date.now();
      const next = { ...session, completedAt };
      saveSession(next);
      saveCompletedAudit(next);
      setSession(next);
      setCompleted(true);
      
      // Celebration
      confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
      setTimeout(() => confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 }, angle: 60 }), 250);
      setTimeout(() => confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 }, angle: 120 }), 500);
    } else {
      persist({ ...session, currentIndex: session.currentIndex + 1 });
    }
  };

  const goBack = () => {
    if (session.currentIndex === 0) return;
    persist({ ...session, currentIndex: session.currentIndex - 1 });
  };

  const exitAudit = () => {
    if (confirm("Exit and discard this audit? Your progress will be cleared.")) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      router.push("/portal");
    }
  };

  const downloadPdf = () => generateAuditPdf(session);

  const startNew = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    router.push("/audit");
  };

  // --- Completion View ---
  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-emerald-500/10 px-4 py-10 sm:py-16">
        <div className="mx-auto max-w-2xl space-y-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
          >
            <div className="bg-emerald-600 p-8 text-center text-white">
              <CheckCircle2 className="mx-auto mb-3 h-14 w-14" />
              <h1 className="text-2xl font-bold sm:text-3xl">Audit Complete</h1>
              <p className="mt-1 text-sm opacity-90">
                Time on Site: {elapsedMin}m {elapsedSec}s · Saved to Property #{property.id}
              </p>
            </div>

            <div ref={reportRef} className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Tasks", value: `${AUDIT_TASKS.length}/${AUDIT_TASKS.length}` },
                  { label: "Photos", value: session.answers["main-entrance"] ? "1" : "0" },
                  { label: "Video", value: session.answers.walkthrough ? "1" : "0" },
                  { label: "Signed", value: session.answers.signature ? "Yes" : "No" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border bg-muted/40 p-3 text-center">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</div>
                    <div className="mt-1 text-lg font-bold">{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-4 text-[11px] leading-relaxed">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div><span className="font-bold text-muted-foreground uppercase">Auditor:</span> {session.auditor?.name ?? "—"}</div>
                  <div><span className="font-bold text-muted-foreground uppercase">Property:</span> {property.name}</div>
                  <div><span className="font-bold text-muted-foreground uppercase">Started:</span> {new Date(session.startedAt).toLocaleString()}</div>
                  <div><span className="font-bold text-muted-foreground uppercase">Device:</span> {session.device}</div>
                </div>
              </div>

              {session.answers["main-entrance"] && (
                <img 
                  src={session.answers["main-entrance"].dataUrl} 
                  alt="Main entrance" 
                  className="w-full rounded-xl border border-border object-cover aspect-video" 
                />
              )}
            </div>
          </motion.div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button className="flex-1 h-12 bg-black text-white" onClick={downloadPdf}>
              <FileDown className="mr-2 h-4 w-4" /> Preview PDF
            </Button>
            <Button variant="outline" className="flex-1 h-12" onClick={startNew}>
              Start New
            </Button>
            <Button variant="ghost" onClick={() => router.push("/portal")}>Portal</Button>
          </div>
        </div>
      </div>
    );
  }

  // --- Active Run View ---
  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <motion.div
          className="h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-amber-500"
          animate={{ width: `${progress}%` }}
          style={{ boxShadow: "0 0 15px rgba(16, 185, 129, 0.5)" }}
        />
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={exitAudit}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-card hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold tracking-tight">{property.name}</p>
              <p className="truncate text-[10px] font-medium uppercase text-muted-foreground">
                Step {session.currentIndex + 1} · {currentTask.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1 text-[11px] font-bold text-white">
              <Clock className="h-3 w-3" /> {String(elapsedMin).padStart(2, "0")}:{String(elapsedSec).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTask.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-black tracking-tight sm:text-4xl">{currentTask.title}</h2>
              <p className="mt-2 text-muted-foreground leading-relaxed">{currentTask.prompt}</p>
              
              {currentTask.hint && (
                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <Lightbulb className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 leading-relaxed font-medium">
                    {currentTask.hint}
                  </p>
                </div>
              )}
            </div>

            <div className="py-4">
              {currentTask.kind === "photo" && (
                <PhotoTask value={session.answers["main-entrance"]} onChange={(v) => updateAnswer("main-entrance", v)} />
              )}
              {currentTask.kind === "checklist" && (
                <ChecklistTask value={session.answers["fire-safety"]} onChange={(v) => updateAnswer("fire-safety", v)} />
              )}
              {currentTask.kind === "observation" && (
                <ObservationTask value={session.answers.observations} onChange={(v) => updateAnswer("observations", v)} />
              )}
              {currentTask.kind === "video" && (
                <VideoTask value={session.answers.walkthrough} onChange={(v) => updateAnswer("walkthrough", v)} />
              )}
              {currentTask.kind === "meter" && (
                <MeterTask value={session.answers["meter-reading"]} onChange={(v) => updateAnswer("meter-reading", v)} />
              )}
              {currentTask.kind === "signature" && (
                <SignatureTask value={session.answers.signature} onChange={(v) => updateAnswer("signature", v)} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Bar */}
      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 px-4 py-4 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <Button 
            variant="outline" 
            onClick={goBack} 
            disabled={session.currentIndex === 0}
            className="rounded-xl h-12 font-bold"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          
          {valid ? (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <Button onClick={goNext} size="lg" className="rounded-xl h-12 px-8 font-bold bg-black text-white shadow-xl">
                {isLast ? "Finish Audit" : "Next Step"} <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
              Requirement Pending
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditRunPage;