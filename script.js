/* ====== Edit these: your skills + projects ====== */

const SKILLS = [
  "TypeScript", "Angular", ".NET / C#", "MySQL",
  "Node.js", "Python", "C++", "GitHub Actions",
  "REST APIs", "UI/UX", "Testing", "CI/CD"
];

// Each project must have a unique slug.
// This slug maps to a custom page at: projects/<slug>/index.html
const PROJECTS = [
  {
    slug: "minecraft",
    title: "Minecraft",
    subtitle: "Independently developed a self-made Minecraft clone using OpenGL and C++",
    category: "game",
    year: "2025",
    description:
      "An independently developed game in the style of Minecraft that utilizes chunk optimization, OpenGL, and various game development techniques.",
    stack: ["C++", "OpenGL"],
    highlights: [
      "Built responsive UI with clear navigation and filtering.",
      "Designed API endpoints and data models for request workflows.",
      "Implemented export/reporting features for admins."
    ],
    links: [
      { label: "GitHub", url: "https://github.com/yourusername/yourrepo" },
      { label: "Live Demo", url: "https://your-site.example.com" }
    ]
  },
  {
    slug: "mario",
    title: "Mario",
    subtitle: "Independently developed a self-made Minecraft clone using OpenGL and C++",
    category: "game",
    year: "2025",
    description:
      "Created a 2D Mario-style platformer prototype with tight movement, tile-based levels, collision, and physics using C and the Win32 API. Features an expandable architecture for new gameplay elements.",
    stack: ["C", "Window32 API", "FreeImage"],
    highlights: [
      "Built responsive UI with clear navigation and filtering.",
      "Designed API endpoints and data models for request workflows.",
      "Implemented export/reporting features for admins."
    ],
    links: [
      { label: "GitHub", url: "https://github.com/yourusername/yourrepo" },
      { label: "Live Demo", url: "https://your-site.example.com" }
    ]
  },
  {
    slug: "nspire",
    title: "NSPIRE",
    subtitle: "Full-stack web application with clean frontend paired with structured backend and service layer",
    category: "web",
    year: "2024",
    description:
      "A collaborative full-stack web application developed by a team of six, featuring HTML/CSS/TypeScript frontend, Node.js backend, and modular service architecture with search-driven interaction and clear page flow.",
    stack: ["HTML", "CSS", "TypeScript", "Node.js"],
    highlights: [
      "Team-based architecture with divided responsibilities across frontend, backend, and services.",
      "Service-layer design isolating data logic from routing and presentation.",
      "Search-driven interaction with seamless navigation from results to detailed views."
    ],
    links: [
      { label: "GitHub", url: "https://github.com/cseseniordesign/NSPIRE" }
    ]
  }
];

/* ====== Reveal on scroll ====== */

function setupReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) e.target.classList.add("in");
      }
    },
    { threshold: 0.14 }
  );

  els.forEach((el) => io.observe(el));
}

/* ====== Projects render + filtering ====== */

let activeFilter = "all";
let activeSearch = "";

function matchesFilter(project) {
  const filterOk = activeFilter === "all" || project.category === activeFilter;

  if (!activeSearch.trim()) return filterOk;

  const q = activeSearch.trim().toLowerCase();
  const hay = [
    project.title,
    project.subtitle,
    project.description,
    project.category,
    project.year,
    project.slug,
    ...(project.stack || [])
  ]
    .join(" ")
    .toLowerCase();

  return filterOk && hay.includes(q);
}

function tagForCategory(cat) {
  const map = {
    web: "Web",
    backend: "Backend",
    tooling: "Tooling",
    research: "Research",
    game: "Game"
  };
  return map[cat] || "Project";
}

function projectHref(project) {
  const slug = String(project.slug || "").trim();
  return `projects/${encodeURIComponent(slug)}/index.html`;
}

function projectCard(project) {
  const stackHtml = (project.stack || [])
    .slice(0, 6)
    .map((s) => `<span class="tag">${escapeHtml(s)}</span>`)
    .join("");

  return `
    <a class="card project-card reveal" href="${escapeAttr(projectHref(project))}" aria-label="Open project: ${escapeAttr(project.title)}">
      <div class="project-top">
        <h3 class="project-title">${escapeHtml(project.title)}</h3>
        <div class="project-tag">${tagForCategory(project.category)}</div>
      </div>
      <p class="project-desc">${escapeHtml(project.description)}</p>
      <div class="project-stack">${stackHtml}</div>
    </a>
  `;
}

function renderProjects() {
  const grid = document.getElementById("projectGrid");
  if (!grid) return;

  const filtered = PROJECTS.filter(matchesFilter);
  grid.innerHTML = filtered.map((p) => projectCard(p)).join("");

  setupReveal();

  const countPill = document.getElementById("projectCountPill");
  if (countPill) countPill.textContent = `${PROJECTS.length} projects`;

  const metricProjects = document.getElementById("metricProjects");
  if (metricProjects) metricProjects.textContent = `${PROJECTS.length}+`;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="card reveal" style="grid-column: 1 / -1;">
        <h3 style="margin:0 0 6px;">No matches</h3>
        <p class="muted" style="margin:0;">Try a different filter or search term.</p>
      </div>
    `;
    setupReveal();
  }
}

/* ====== Filters + search ====== */

function setupFilters() {
  const buttons = document.querySelectorAll(".chip");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });

      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      activeFilter = btn.dataset.filter || "all";
      renderProjects();
    });
  });

  const input = document.getElementById("searchInput");
  if (!input) return;

  input.addEventListener("input", () => {
    activeSearch = input.value || "";
    renderProjects();
  });
}

/* ====== Misc utilities ====== */

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", id);
    });
  });
}

function setupCopyEmail() {
  const btn = document.getElementById("copyEmailBtn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const email = "keith@example.com"; // update
    try {
      await navigator.clipboard.writeText(email);
      btn.textContent = "Copied";
      setTimeout(() => (btn.textContent = "Copy email"), 900);
    } catch {
      btn.textContent = "Copy failed";
      setTimeout(() => (btn.textContent = "Copy email"), 900);
    }
  });
}

function setupMailtoForm() {
  const form = document.getElementById("mailtoForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("msgName")?.value?.trim?.() || "";
    const from = document.getElementById("msgEmail")?.value?.trim?.() || "";
    const body = document.getElementById("msgBody")?.value?.trim?.() || "";

    const to = "keith@example.com"; // update
    const subject = encodeURIComponent(`Portfolio message from ${name || "someone"}`);
    const msg = encodeURIComponent(`From: ${name}\nEmail: ${from}\n\n${body}`);

    window.location.href = `mailto:${to}?subject=${subject}&body=${msg}`;
  });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll("`", "&#096;");
}

function initCounts() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const metricYears = document.getElementById("metricYears");
  if (metricYears) metricYears.textContent = "5+";

  const metricFocus = document.getElementById("metricFocus");
  if (metricFocus) metricFocus.textContent = "Full stack";

  const metricProjects = document.getElementById("metricProjects");
  if (metricProjects) metricProjects.textContent = `${PROJECTS.length}+`;

  const projectCountPill = document.getElementById("projectCountPill");
  if (projectCountPill) projectCountPill.textContent = `${PROJECTS.length} projects`;
}

function renderSkills() {
  const row = document.getElementById("skillsRow");
  if (!row) return;
  row.innerHTML = SKILLS.map((s) => `<span class="tag">${escapeHtml(s)}</span>`).join("");
}

/* ====== Start ====== */

window.addEventListener("DOMContentLoaded", () => {
  initCounts();
  renderSkills();
  renderProjects();
  setupFilters();
  setupReveal();
  setupSmoothScroll();
  setupCopyEmail();
  setupMailtoForm();
});
