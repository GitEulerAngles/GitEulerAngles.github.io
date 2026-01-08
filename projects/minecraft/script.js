const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// --- Image fullscreen lightbox ---
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

document.querySelectorAll(".gallery .shot img").forEach((img) => {
  img.addEventListener("click", (e) => {
    e.preventDefault();
    if (!lightbox || !lightboxImg) return;

    lightboxImg.src = img.src;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

if (lightbox) {
  lightbox.addEventListener("click", () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    if (lightboxImg) lightboxImg.src = "";
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox) {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    if (lightboxImg) lightboxImg.src = "";
  }
});

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
