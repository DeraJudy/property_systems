"use client";

import { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Client-side image compression logic
 */
async function compressImage(file, maxDim = 1280, quality = 0.72) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });

  const ratio = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.round(img.width * ratio);
  const h = Math.round(img.height * ratio);
  
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(img, 0, 0, w, h);
  
  const out = canvas.toDataURL("image/jpeg", quality);
  return { 
    dataUrl: out, 
    sizeKb: Math.round((out.length * 0.75) / 1024) 
  };
}

// --- PHOTO TASK ---
export const PhotoTask = ({ value, onChange }) => {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const compressed = await compressImage(file);
      onChange(compressed);
    } catch (err) {
      console.error("Compression failed", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-border">
          <img src={value.dataUrl} alt="Captured" className="h-64 w-full object-cover sm:h-80" />
          <div className="absolute bottom-2 left-2 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
            {value.sizeKb} KB · compressed
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/40 text-muted-foreground transition-colors hover:bg-muted/70 sm:h-80"
        >
          <Camera className="h-10 w-10" />
          <span className="text-sm font-medium">Tap to take a photo</span>
        </button>
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={busy}>
          <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} /> 
          {value ? "Retake" : busy ? "Compressing..." : "Open Camera"}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(undefined)}>
            <ImageOff className="h-4 w-4" /> Clear
          </Button>
        )}
      </div>
    </div>
  );
};

// --- CHECKLIST TASK ---
const CHECK_ITEMS = [
  { key: "exitsClear", label: "Are all fire exits clear and unobstructed?" },
  { key: "alarmGreen", label: "Is the alarm panel green / no faults?" },
  { key: "extinguishersInDate", label: "Are extinguishers in date and sealed?" },
];

export const ChecklistTask = ({ value, onChange }) => {
  const v = value ?? { exitsClear: null, alarmGreen: null, extinguishersInDate: null };
  return (
    <div className="space-y-3">
      {CHECK_ITEMS.map((item) => {
        const current = v[item.key];
        return (
          <div key={item.key} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium">{item.label}</p>
            <div className="flex gap-2">
              {[
                { val: true, label: "Yes" },
                { val: false, label: "No" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => onChange({ ...v, [item.key]: opt.val })}
                  className={`flex-1 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors sm:flex-none ${
                    current === opt.val
                      ? opt.val
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-destructive bg-destructive text-destructive-foreground"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- OBSERVATION TASK ---
export const ObservationTask = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <div className="relative">
        <textarea
          rows={6}
          value={value?.text ?? ""}
          onChange={(e) => onChange(e.target.value ? { text: e.target.value } : undefined)}
          placeholder="e.g. Cracked tile in 2nd floor hallway..."
          className="w-full resize-none rounded-2xl border border-border bg-card p-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="absolute right-3 top-3 grid h-8 w-8 cursor-not-allowed place-items-center rounded-full border border-border bg-background text-muted-foreground opacity-50">
          🎙
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{(value?.text?.length ?? 0)} characters · minimum 10</p>
    </div>
  );
};

// --- VIDEO TASK ---
export const VideoTask = ({ value, onChange }) => {
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange({ dataUrl: reader.result, sizeKb: Math.round(file.size / 1024) });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <video src={value.dataUrl} controls className="h-64 w-full rounded-2xl border border-border bg-black object-cover sm:h-80" />
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/40 text-muted-foreground transition-colors hover:bg-muted/70 sm:h-80"
        >
          <Camera className="h-10 w-10" />
          <span className="text-sm font-medium">Tap to record clip</span>
        </button>
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          <RefreshCw className="h-4 w-4" /> {value ? "Re-record" : "Open Camera"}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(undefined)}>
            <ImageOff className="h-4 w-4" /> Clear
          </Button>
        )}
      </div>
    </div>
  );
};

// --- METER TASK ---
export const MeterTask = ({ value, onChange }) => {
  const v = value ?? { water: "", electric: "" };
  const water = parseFloat(v.water);
  const electric = parseFloat(v.electric);
  const waterOk = !isNaN(water) && water >= 100 && water <= 9999;
  const electricOk = !isNaN(electric) && electric >= 1000 && electric <= 99999;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-2 rounded-2xl border border-border bg-card p-4">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Water (m³)
        </label>
        <input
          type="number"
          inputMode="decimal"
          value={v.water}
          onChange={(e) => onChange({ ...v, water: e.target.value })}
          placeholder="e.g. 1284"
          className={`w-full rounded-xl border bg-background p-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary ${
            v.water && !waterOk ? "border-destructive text-destructive" : "border-border"
          }`}
        />
      </div>
      <div className="space-y-2 rounded-2xl border border-border bg-card p-4">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Electric (kWh)
        </label>
        <input
          type="number"
          inputMode="decimal"
          value={v.electric}
          onChange={(e) => onChange({ ...v, electric: e.target.value })}
          placeholder="e.g. 24850"
          className={`w-full rounded-xl border bg-background p-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary ${
            v.electric && !electricOk ? "border-destructive text-destructive" : "border-border"
          }`}
        />
      </div>
    </div>
  );
};

// --- SIGNATURE TASK ---
export const SignatureTask = ({ value, onChange }) => {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);
  const [hasInk, setHasInk] = useState(!!value);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    
    const ctx = canvas.getContext("2d");
    ctx?.scale(ratio, ratio);
    if (ctx) {
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000";
    }

    if (value?.dataUrl) {
      const img = new Image();
      img.onload = () => ctx?.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = value.dataUrl;
    }
  }, [value?.dataUrl]);

  const pos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const start = (e) => {
    drawing.current = true;
    last.current = pos(e);
  };

  const move = (e) => {
    if (!drawing.current || !last.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const p = pos(e);
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(last.current.x, last.current.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    last.current = p;
    setHasInk(true);
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    if (canvasRef.current && hasInk) {
      onChange({ dataUrl: canvasRef.current.toDataURL("image/png") });
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasInk(false);
    onChange(undefined);
  };

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border bg-card">
        <canvas
          ref={canvasRef}
          className="h-48 w-full touch-none sm:h-56 cursor-crosshair"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
        />
        {!hasInk && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-muted-foreground font-medium opacity-50">
            Sign inside this area
          </div>
        )}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={clear}>
        Clear signature
      </Button>
    </div>
  );
};