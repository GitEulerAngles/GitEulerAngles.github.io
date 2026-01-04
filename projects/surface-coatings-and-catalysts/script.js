const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const tabs = Array.from(document.querySelectorAll(".tab"));
const panes = Array.from(document.querySelectorAll("[data-pane]"));

function show(id) {
  panes.forEach((p) => {
    p.hidden = p.id !== id;
  });
  tabs.forEach((t) => {
    const active = t.dataset.tab === id;
    t.classList.toggle("active", active);
    t.setAttribute("aria-selected", active ? "true" : "false");
  });
}

tabs.forEach((t) => {
  t.addEventListener("click", () => show(t.dataset.tab));
});

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

// Default to the first tab.
show("workflows");