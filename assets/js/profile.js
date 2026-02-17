/* ======================================================
   1. DATA GUARDS
====================================================== */
const gender = localStorage.getItem("divaara.gender");
const bodyScanStr = localStorage.getItem("divaara.scan");
const skinScanStr = localStorage.getItem("divaara.skin_scan");
const lowConfidence = localStorage.getItem("divaara.low_confidence");

if (!gender || (!bodyScanStr && !skinScanStr)) {
  window.location.href = "index.html";
  return;
}

const bodyScan = JSON.parse(bodyScanStr || "{}");
const skinScan = JSON.parse(skinScanStr || "{}");

/* ======================================================
   2. BASIC PROFILE
====================================================== */

// Confidence
if (lowConfidence === "true") {
  document.getElementById("confidence-warning").classList.remove("hidden");
  const btn = document.getElementById("continueBtn");
  if (btn) {
    btn.innerText = "View Estimated Recommendations";
  }
}

// Body (only if body scan data exists)
if (bodyScanStr) {
  document.getElementById("body-shape").innerText =
    bodyScan.body_shape?.primary || "Unknown";

  if (bodyScan.confidence) {
    document.getElementById("body-confidence").innerText =
      `AI Confidence: ${Math.round(bodyScan.confidence * 100)}%`;
  }

  document.getElementById("ctaBodyShape").innerText =
    bodyScan.body_shape?.primary || "unique";
}

// Skin
if (skinScan?.skin_tone) {
  document.getElementById("skin-label").innerText =
    skinScan.skin_tone.label.replace("-", " ");

  document.getElementById("skin-undertone").innerText =
    skinScan.undertone + " Undertone";

  document.getElementById("skin-swatch").style.background =
    skinScan.skin_tone.palette.hex;

  generateColorPalette(
    skinScan.skin_tone.label,
    skinScan.undertone
  );

  document.getElementById("dress-color-section").classList.remove("hidden");
}

/* ======================================================
   3. COLOR ENGINE (OPTION A – CHART STYLE LOGIC)
====================================================== */
function generateColorPalette(toneLabel, undertone) {
  const t = toneLabel.toLowerCase();
  const u = undertone.toLowerCase();

  let season = "summer";

  if (u.includes("cool")) {
    season = (t.includes("fair") || t.includes("light")) ? "summer" : "winter";
  } else if (u.includes("warm")) {
    season = (t.includes("fair") || t.includes("light")) ? "spring" : "autumn";
  } else {
    season = (t.includes("deep") || t.includes("dark")) ? "autumn" : "summer";
  }

  const PALETTES = {
    spring: {
      label: "Warm Spring",
      best: ['#FF7F50', '#40E0D0', '#FFD700', '#FA8072'],
      neutrals: ['#F5F5DC', '#D2B48C', '#8B4513'],
      avoid: ['#000000', '#FFFFFF']
    },
    summer: {
      label: "Cool Summer",
      best: ['#E6E6FA', '#87CEEB', '#D8BFD8', '#778899'],
      neutrals: ['#708090', '#F0F8FF', '#C0C0C0'],
      avoid: ['#FFA500', '#FFFF00']
    },
    autumn: {
      label: "Warm Autumn",
      best: ['#808000', '#B22222', '#DAA520', '#D2691E'],
      neutrals: ['#F5F5DC', '#8B4513', '#556B2F'],
      avoid: ['#FF00FF', '#00FFFF']
    },
    winter: {
      label: "Cool Winter",
      best: ['#0000CD', '#008000', '#DC143C', '#4B0082'],
      neutrals: ['#000000', '#FFFFFF', '#808080'],
      avoid: ['#D2B48C', '#DAA520']
    }
  };

  const p = PALETTES[season];
  document.getElementById("season-badge").innerText = p.label;

  // Persist palette for recommendations page
  localStorage.setItem(
    "divaara.palette",
    JSON.stringify(p.best)
  );

  renderSwatches("bestColors", p.best);
  renderSwatches("neutralColors", p.neutrals);
  renderSwatches("avoidColors", p.avoid);
}

function renderSwatches(containerId, colors) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  colors.forEach(hex => {
    const el = document.createElement("div");
    el.className =
      "w-12 h-12 rounded-full border border-white/20 shadow-lg";
    el.style.background = hex;
    container.appendChild(el);
  });
}

/* ======================================================
   4. NAVIGATION
====================================================== */
function continueJourney() {
  window.location.href = "/pages/recommendations.html";
}
