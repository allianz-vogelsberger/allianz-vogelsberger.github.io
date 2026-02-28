/* ══════════════════════════════════════════════════════
   CONFIGURATION — Only change these three values
   ══════════════════════════════════════════════════════ */

// Email that receives feedback submissions via FormSubmit.co.
// Currently set to internal test address. For production, change to:
// "agentur.vogelsberger@allianz.at"
const FEEDBACK_EMAIL = "lorenz@hygienemanagement.at";

// Google Place ID for the agency. Find it at:
// https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
// Leave as "" to disable the Google Review button.
const GOOGLE_PLACE_ID = "ChIJZyzTabVcnUcRcuwdF4j4OPE";

/* ══════════════════════════════════════════════════════
   Derived endpoints (do not edit)
   ══════════════════════════════════════════════════════ */
const FORMSPREE_ENDPOINT = FEEDBACK_EMAIL
  ? "https://formsubmit.co/ajax/" + FEEDBACK_EMAIL
  : "";

const GOOGLE_REVIEW_URL = GOOGLE_PLACE_ID
  ? "https://search.google.com/local/writereview?placeid=" + GOOGLE_PLACE_ID
  : "";

/* ── DOM ─────────────────────────────────────────────── */
const stars = document.querySelectorAll(".star");
const hint = document.querySelector(".rating-card__hint");
const panelFeedback = document.getElementById("panel-feedback");
const panelPositive = document.getElementById("panel-positive");
const panelThankyou = document.getElementById("panel-thankyou");
const feedbackForm = document.getElementById("feedback-form");
const feedbackRating = document.getElementById("feedback-rating");
const btnSubmit = document.getElementById("btn-submit");
const btnGoogle = document.getElementById("btn-google");
const endpointNotice = document.getElementById("endpoint-notice");
const googleNotice = document.getElementById("google-notice");
const yearEl = document.getElementById("year");

/* ── State ───────────────────────────────────────────── */
let selectedRating = 0;

/* ── Helpers ─────────────────────────────────────────── */
const hintTexts = {
  1: "Sehr schlecht",
  2: "Nicht zufrieden",
  3: "Geht so",
  4: "Zufrieden",
  5: "Sehr zufrieden",
};

function isConfigured(value) {
  return Boolean(value && value.trim().length > 0);
}

function showPanel(panel) {
  [panelFeedback, panelPositive, panelThankyou].forEach((p) => {
    if (p !== panel) {
      p.classList.remove("visible", "entering");
      p.hidden = true;
    }
  });

  if (panel) {
    panel.hidden = false;
    panel.classList.add("entering");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        panel.classList.remove("entering");
        panel.classList.add("visible");
        panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    });
  }
}

function updateStars(value, isHover) {
  stars.forEach((star) => {
    const v = parseInt(star.dataset.value);
    if (!isHover) {
      star.classList.toggle("active", v <= selectedRating);
    }
    star.classList.toggle("hovered", isHover && v <= value);
    star.setAttribute("aria-checked", v === selectedRating ? "true" : "false");
  });
}

function hapticFeedback() {
  if (navigator.vibrate) navigator.vibrate(10);
}

/* ── Star Events ─────────────────────────────────────── */
stars.forEach((star) => {
  star.addEventListener("click", () => {
    selectedRating = parseInt(star.dataset.value);
    feedbackRating.value = selectedRating;
    updateStars(selectedRating, false);
    hint.textContent = hintTexts[selectedRating] || "";
    hint.style.color = "";
    hapticFeedback();

    star.classList.remove("just-selected");
    void star.offsetWidth;
    star.classList.add("just-selected");

    if (selectedRating >= 4) {
      showPanel(panelPositive);
    } else {
      showPanel(panelFeedback);
    }
  });

  star.addEventListener("mouseenter", () => {
    const v = parseInt(star.dataset.value);
    updateStars(v, true);
    hint.textContent = hintTexts[v] || "";
  });

  star.addEventListener("mouseleave", () => {
    updateStars(0, true);
    hint.textContent = selectedRating ? hintTexts[selectedRating] : "";
    stars.forEach((s) => s.classList.remove("hovered"));
  });
});

/* Keyboard navigation for star group */
document.querySelector(".stars").addEventListener("keydown", (e) => {
  const current = document.activeElement;
  const idx = Array.from(stars).indexOf(current);
  let next = idx;

  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    next = Math.min(idx + 1, stars.length - 1);
    e.preventDefault();
  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    next = Math.max(idx - 1, 0);
    e.preventDefault();
  } else if (e.key === "Enter" || e.key === " ") {
    current.click();
    e.preventDefault();
    return;
  }

  if (next !== idx) {
    stars[idx].setAttribute("tabindex", "-1");
    stars[next].setAttribute("tabindex", "0");
    stars[next].focus();
  }
});

/* ── Form Submit ─────────────────────────────────────── */
function initForm() {
  if (!isConfigured(FORMSPREE_ENDPOINT)) {
    btnSubmit.disabled = true;
    endpointNotice.hidden = false;
  }
}

feedbackForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!isConfigured(FORMSPREE_ENDPOINT)) return;

  const message = document.getElementById("feedback-message").value.trim();
  const name = document.getElementById("feedback-name").value.trim();
  const email = document.getElementById("feedback-email").value.trim();

  if (!message) { document.getElementById("feedback-message").focus(); return; }
  if (!name) { document.getElementById("feedback-name").focus(); return; }
  if (!email) { document.getElementById("feedback-email").focus(); return; }

  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<span class="spinner"></span> Senden …';

  const formData = new FormData(feedbackForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      showPanel(panelThankyou);
    } else {
      throw new Error("Server error");
    }
  } catch {
    btnSubmit.disabled = false;
    btnSubmit.textContent = "Feedback senden";
    hint.textContent = "Senden fehlgeschlagen – bitte versuche es erneut.";
    hint.style.color = "var(--red)";
  }
});

/* ── Google Review ───────────────────────────────────── */
function initGoogle() {
  if (!isConfigured(GOOGLE_REVIEW_URL)) {
    btnGoogle.classList.add("disabled");
    btnGoogle.removeAttribute("href");
    googleNotice.hidden = false;
    return;
  }
  btnGoogle.href = GOOGLE_REVIEW_URL;
}

/* ── Init ────────────────────────────────────────────── */
yearEl.textContent = new Date().getFullYear();
initForm();
initGoogle();
