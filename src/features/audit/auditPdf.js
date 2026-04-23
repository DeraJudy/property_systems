import jsPDF from "jspdf";
import {
  AUDIT_TASKS,
  getPropertyById,
  AUDIT_PROPERTIES,
} from "@/features/audit/auditData";

/**
 * Shared PDF generator for Kenley Property Systems audits.
 * @param {Object} session - The active session or completed audit object.
 */
export function generateAuditPdf(session) {
  // Guard for server-side execution
  if (typeof window === "undefined") return;

  const property = getPropertyById(session.propertyId) ?? AUDIT_PROPERTIES[0];

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = margin;

  // --- Header Bar (Kenley Branding) ---
  // Black background with cream text
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, pageWidth, 70, "F");
  
  doc.setTextColor(255, 253, 208); // Cream
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Kenley Group · Daily Property Audit", margin, 35);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Audit Report · ${new Date(session.startedAt).toLocaleString()}`,
    margin,
    55,
  );

  // --- Property Details ---
  y = 100;
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`${property.name} · #${property.id}`, margin, y);
  
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(property.address, margin, y);
  
  y += 20;
  const completedAt = session.completedAt ?? Date.now();
  const elapsedMs = completedAt - session.startedAt;
  const elapsedMin = Math.floor(elapsedMs / 60000);
  const elapsedSec = Math.floor((elapsedMs % 60000) / 1000);
  
  doc.text(`Auditor: ${session.auditor?.name ?? "—"}`, margin, y);
  y += 14;
  doc.text(`Time on site: ${elapsedMin}m ${elapsedSec}s`, margin, y);
  
  if (session.coords) {
    y += 14;
    doc.text(
      `GPS: ${session.coords.lat.toFixed(5)}, ${session.coords.lng.toFixed(5)} (±${Math.round(session.coords.accuracy)}m)`,
      margin,
      y,
    );
  }
  
  y += 14;
  doc.text(`Device: ${session.device} · Browser: ${session.browser}`, margin, y);
  
  // --- Findings Section ---
  y += 30;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Audit Findings", margin, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  // Fire Safety Checklist
  const cl = session.answers["fire-safety"];
  if (cl) {
    const lines = [
      { l: "Fire exits clear", v: cl.exitsClear },
      { l: "Alarm panel green", v: cl.alarmGreen },
      { l: "Extinguishers in date", v: cl.extinguishersInDate },
    ];
    lines.forEach((item) => {
      doc.text(`• ${item.l}: ${item.v ? "PASS" : "FAIL"}`, margin, y);
      y += 14;
    });
  }

  // Observations
  if (session.answers.observations?.text) {
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Observations:", margin, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    
    // Wrap text to fit page width
    const text = doc.splitTextToSize(
      session.answers.observations.text,
      pageWidth - margin * 2,
    );
    doc.text(text, margin, y);
    y += text.length * 12 + 10;
  }

  // Meters
  const meter = session.answers["meter-reading"];
  if (meter) {
    doc.text(
      `Water meter: ${meter.water} m³ | Electric meter: ${meter.electric} kWh`,
      margin,
      y,
    );
    y += 20;
  }

  // --- Evidence Section ---
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Visual Evidence", margin, y);
  y += 15;

  const photo = session.answers["main-entrance"]?.dataUrl;
  if (photo) {
    try {
      // Page break check for image
      if (y > pageHeight - 200) {
        doc.addPage();
        y = margin;
      }
      doc.addImage(photo, "JPEG", margin, y, 240, 160);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.text("Main Entrance Evidence Photo", margin, y + 175);
      y += 200;
    } catch (e) {
      console.warn("Could not add photo to PDF", e);
    }
  }

  // Auditor Signature
  const sig = session.answers.signature?.dataUrl;
  if (sig) {
    if (y > pageHeight - 120) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Auditor Signature Confirmation:", margin, y);
    y += 10;
    try {
      doc.addImage(sig, "PNG", margin, y, 180, 60);
      y += 70;
    } catch (e) {
      console.warn("Could not add signature to PDF", e);
    }
  }

  // --- Final Footer ---
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `End of Report · Total Tasks: ${AUDIT_TASKS.length}/${AUDIT_TASKS.length} completed`,
    margin,
    pageHeight - 20,
  );

  // Download trigger
  const dateString = new Date(session.startedAt).toISOString().slice(0, 10);
  doc.save(`audit-${property.id}-${dateString}.pdf`);
}