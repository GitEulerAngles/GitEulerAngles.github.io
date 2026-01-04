const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const score = document.getElementById("score");
const scoreVal = document.getElementById("scoreVal");
const badge = document.getElementById("badge");

function labelFor(n) {
  if (n >= 75) return "High";
  if (n >= 45) return "Moderate";
  return "Low";
}

function sync() {
  const val = Number(score?.value || 0);
  if (scoreVal) scoreVal.textContent = String(val);
  if (badge) badge.textContent = labelFor(val);
}

if (score) {
  score.addEventListener("input", sync);
  sync();
}

const copyBtn = document.getElementById("copyBtn");
const snippet = document.getElementById("snippet");
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

if (copyBtn && snippet) {
  copyBtn.addEventListener("click", async () => {
    const ok = await copyText(snippet.textContent || "");
    if (toast) toast.textContent = ok ? "Copied." : "Copy failed.";
    if (toast) setTimeout(() => (toast.textContent = ""), 1200);
  });
}
