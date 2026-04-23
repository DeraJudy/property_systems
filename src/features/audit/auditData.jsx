/**
 * Mock property data for the Daily Property Audit demo.
 * Coordinates default to London for browser preview testing.
 */
export const AUDIT_PROPERTIES = [
  {
    id: "104",
    code: "KH-104",
    name: "Kenley House",
    address: "104 Kenley Road, London, SW19 3AB",
    lat: 51.5074,
    lng: -0.1278,
    scheduledFor: "Today · 14:30",
  },
  {
    id: "212",
    code: "SP-212",
    name: "St Paul's Lodge",
    address: "12 St Paul's Way, Bristol, BS2 8DE",
    lat: 51.4545,
    lng: -2.5879,
    scheduledFor: "Tomorrow · 09:00",
  },
];

export const NEXT_SCHEDULED = AUDIT_PROPERTIES[0];

/**
 * Helper to find a property by ID.
 * Required by the PDF generator.
 */
export function getPropertyById(id) {
  return AUDIT_PROPERTIES.find((p) => p.id === id);
}

/**
 * Persists a finished audit to the browser's local storage history.
 * @param {Object} audit - The completed audit session object.
 */

export function saveCompletedAudit(audit) {
  try {
    const historyKey = "kenley.audit.history.v1";
    const existingStr = localStorage.getItem(historyKey);
    let history = existingStr ? JSON.parse(existingStr) : [];

    // 1. Add the new audit
    history = [audit, ...history];

    // 2. Optimization: Strip heavy Base64 data from audits older than the 5 most recent
    // This keeps the logs/stats but dumps the "heavy" photos for old records.
    const optimizedHistory = history.map((item, index) => {
      if (index > 5) {
        return {
          ...item,
          answers: {
            ...item.answers,
            "main-entrance": item.answers?.["main-entrance"] ? { stripped: true } : null,
            signature: item.answers?.signature ? { stripped: true } : null,
            walkthrough: null // Remove video data urls entirely for old audits
          }
        };
      }
      return item;
    });

    // 3. Keep only the last 20 audits instead of 50
    const finalHistory = optimizedHistory.slice(0, 20);

    localStorage.setItem(historyKey, JSON.stringify(finalHistory));

    // Clear the active session
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error("Storage full! Clearing old history to make room.");
      // emergency clear if it still fails
      localStorage.removeItem("kenley.audit.history.v1");
    }
  }
}

/**
 * Haversine distance between two GPS points (in metres).
 * @param {Object} a - Starting coordinates {lat, lng}
 * @param {Object} b - Ending coordinates {lat, lng}
 * @returns {number} Distance in metres
 */
export function distanceInMetres(a, b) {
  const R = 6371000; // Earth's radius in metres
  const toRad = (d) => (d * Math.PI) / 180;
  
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * List of tasks required to complete a property audit.
 */
export const AUDIT_TASKS = [
  {
    id: "main-entrance",
    kind: "photo",
    title: "Main Entrance",
    prompt: "Take a high-quality photo of the Main Entrance.",
    hint: "Capture full door frame, signage, and approach in daylight.",
  },
  {
    id: "fire-safety",
    kind: "checklist",
    title: "Fire Safety Check",
    prompt: "Confirm the following safety items are in order.",
  },
  {
    id: "observations",
    kind: "observation",
    title: "Observations",
    prompt: "Record any new damage or maintenance needs.",
    hint: "Be specific — note location, severity, and any tenants reporting issues.",
  },
  {
    id: "walkthrough",
    kind: "video",
    title: "10-Second Walkthrough",
    prompt: "Capture a short walkthrough of the common hallway.",
    hint: "Hold the device steady, pan slowly from one end to the other.",
  },
  {
    id: "meter-reading",
    kind: "meter",
    title: "Meter Reading",
    prompt: "Enter the current Water and Electric meter values.",
    hint: "Expected ranges: Water 100–9,999 m³ · Electric 1,000–99,999 kWh",
  },
  {
    id: "signature",
    kind: "signature",
    title: "Auditor Sign-off",
    prompt: "Sign below to confirm this audit is true and complete.",
  },
];

/**
 * Storage key for persisting session progress in the browser.
 */
export const SESSION_STORAGE_KEY = "kenley.audit.session.v1";