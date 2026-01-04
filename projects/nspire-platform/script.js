const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const arch = document.getElementById("arch");
const toggleBtn = document.getElementById("toggleBtn");

if (arch && toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const next = !arch.hidden;
    arch.hidden = next;
    toggleBtn.textContent = next ? "Show architecture" : "Hide architecture";
  });
}

const copyBtn = document.getElementById("copyBtn");
const toast = document.getElementById("toast");

async function copyText(text) {
  if (!navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    const ok = await copyText(window.location.href);
    if (toast) toast.textContent = ok ? "Link copied." : "Could not copy link.";
    if (toast) setTimeout(() => (toast.textContent = ""), 1200);
  });
}
