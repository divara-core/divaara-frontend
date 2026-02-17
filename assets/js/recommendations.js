/* ======================================================
   1. DATA GUARDS
====================================================== */
const bodyScanStr = localStorage.getItem("divaara.scan");
const paletteStr = localStorage.getItem("divaara.palette");
const lowConfidence = localStorage.getItem("divaara.low_confidence");

if (!bodyScanStr || !paletteStr) {
  window.location.href = "index.html";
}

const bodyScan = JSON.parse(bodyScanStr);
const palette = JSON.parse(paletteStr);

/* ======================================================
   2. CONFIDENCE UX
====================================================== */
if (lowConfidence === "true") {
  document
    .getElementById("confidence-note")
    .classList.remove("hidden");
}

/* ======================================================
   3. HELPERS
====================================================== */
function renderColors(containerId, colors) {
  const c = document.getElementById(containerId);
  if (!c) return;

  c.innerHTML = "";
  colors.forEach(hex => {
    const d = document.createElement("div");
    d.className =
      "w-10 h-10 rounded-full border border-white/20 shadow-inner";
    d.style.background = hex;
    c.appendChild(d);
  });
}

/* ======================================================
   4. COLOR RENDERING
====================================================== */
renderColors("colorChips", palette);
renderColors("tops-colors", palette.slice(0, 3));
renderColors("bottoms-colors", palette.slice(1, 4));
renderColors("outfit-colors", palette.slice(0, 2));

/* ======================================================
   5. COPY (BODY-SHAPE AWARE)
====================================================== */
const shape = bodyScan.body_shape?.primary || "";

document.getElementById("tops-note").innerText =
  shape
    ? `Structured tops that complement a ${shape} body shape.`
    : "Structured tops that balance your proportions.";

document.getElementById("bottoms-note").innerText =
  shape
    ? `Bottom wear chosen to enhance ${shape} body balance.`
    : "Clean silhouettes that work well with your proportions.";

document.getElementById("outfit-note").innerText =
  "Monochrome or soft-contrast outfits elevate your overall look.";

if (lowConfidence === "true") {
  document.querySelectorAll("button[onclick^='shop']")
    .forEach(btn => {
      btn.classList.add("opacity-50");
      btn.title = "Results based on low-confidence scan";
    });
}

/* ======================================================
   6. AFFILIATE REDIRECTION
====================================================== */
function shop(platform) {
  const shape = bodyScan.body_shape?.primary || "";
  const color = palette[0] || "";

  localStorage.setItem("divaara.last_shop_intent", JSON.stringify({
    platform,
    shape,
    color,
    time: Date.now()
  }));

  const query = encodeURIComponent(
    `${shape} outfit ${color}`
  );

  let url = "";

  switch (platform) {
    case "myntra":
      url = `https://www.myntra.com/shop/search?q=${query}`;
      break;
    case "amazon":
      url = `https://www.amazon.in/s?k=${query}`;
      break;
    case "meesho":
      url = `https://www.meesho.com/search?q=${query}`;
      break;
  }

  window.open(url, "_blank");
}
