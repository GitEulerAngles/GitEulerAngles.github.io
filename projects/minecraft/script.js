const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// --- YouTube embed ---
const ytInput = document.getElementById("ytInput");
const ytApply = document.getElementById("ytApply");
const ytFrame = document.getElementById("ytFrame");
const ytTop = document.getElementById("youtubeTop");
const videoShell = document.getElementById("videoShell");
const videoPlaceholder = document.getElementById("videoPlaceholder");

const projectKey = document.body?.dataset?.projectKey || "project";
const STORAGE_KEY = `yt:${projectKey}`;

function extractYouTubeId(raw) {
  if (!raw) return null;
  const s = String(raw).trim();

  // If they paste just the id
  if (/^[a-zA-Z0-9_-]{6,}$/.test(s) && !s.includes("/")) return s;

  try {
    const u = new URL(s);
    const host = u.hostname.replace(/^www\./, "");

    // youtu.be/<id>
    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }

    // youtube.com/watch?v=<id>
    const v = u.searchParams.get("v");
    if (v) return v;

    // youtube.com/embed/<id>
    // youtube.com/shorts/<id>
    // youtube.com/live/<id>
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => ["embed", "shorts", "live"].includes(p));
    if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];

    // Fallback: last path segment
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}

function setVideo(id) {
  if (!ytFrame || !ytTop) return;

  const clean = (id || "").trim();
  if (!clean) {
    ytFrame.removeAttribute("src");
    ytFrame.setAttribute("aria-hidden", "true");
    if (videoPlaceholder) videoPlaceholder.style.display = "grid";
    ytTop.setAttribute("href", "#video");
    ytTop.removeAttribute("target");
    ytTop.removeAttribute("rel");
    return;
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(clean)}`;
  const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(clean)}`;

  ytFrame.setAttribute("src", embedUrl);
  ytFrame.removeAttribute("aria-hidden");
  if (videoPlaceholder) videoPlaceholder.style.display = "none";

  ytTop.setAttribute("href", watchUrl);
  ytTop.setAttribute("target", "_blank");
  ytTop.setAttribute("rel", "noreferrer");
}

function loadInitialVideo() {
  const hardCoded = document.body?.dataset?.youtube || "";
  const saved = localStorage.getItem(STORAGE_KEY) || "";
  const fromEither = saved || hardCoded;
  const id = extractYouTubeId(fromEither);

  if (ytInput && fromEither) ytInput.value = fromEither;
  setVideo(id);
}

if (ytApply) {
  ytApply.addEventListener("click", () => {
    const raw = ytInput?.value || "";
    const id = extractYouTubeId(raw);

    if (id) {
      localStorage.setItem(STORAGE_KEY, raw.trim());
      setVideo(id);
    } else {
      // Keep what they typed, just clear the embed.
      localStorage.removeItem(STORAGE_KEY);
      setVideo(null);
      if (videoShell) videoShell.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

if (ytInput) {
  ytInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      ytApply?.click();
    }
  });
}

loadInitialVideo();

// --- Screenshot fallbacks (show filename if image missing) ---
document.querySelectorAll(".shot").forEach((shot) => {
  const img = shot.querySelector("img");
  const ph = shot.querySelector(".shot-ph");
  if (!img) return;

  img.addEventListener("error", () => {
    img.style.display = "none";
    shot.classList.add("missing");
    if (ph) ph.style.display = "grid";
    shot.removeAttribute("href");
    shot.removeAttribute("target");
    shot.removeAttribute("rel");
  });

  img.addEventListener("load", () => {
    if (ph) ph.style.display = "none";
    shot.classList.remove("missing");
  });
});
