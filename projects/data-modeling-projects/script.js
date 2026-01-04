const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const copyBtn = document.getElementById("copyBtn");
const code = document.getElementById("code");
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

if (copyBtn && code) {
  copyBtn.addEventListener("click", async () => {
    const ok = await copyText(code.textContent || "");
    if (toast) toast.textContent = ok ? "SQL copied." : "Copy failed.";
    if (toast) setTimeout(() => (toast.textContent = ""), 1200);
  });
}
