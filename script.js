/* ====== Edit these: your skills + projects ====== */

const SKILLS = [
  "TypeScript", "Angular", ".NET / C#", "MySQL",
  "Node.js", "Python", "C++", "GitHub Actions",
  "REST APIs", "UI/UX", "Testing", "CI/CD"
];

const PROJECTS = [
  {
    title: "NSPIRE Platform",
    subtitle: "Full stack equipment & services platform",
    category: "web",
    year: "2025",
    description:
      "A web platform to discover and request research equipment and services. Focused on usability and clear workflows.",
    stack: ["Angular", ".NET", "MySQL", "Azure"],
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
    title: "APK Analyzer (Static Risk Scoring)",
    subtitle: "Cross platform tooling for APK inspection",
    category: "tooling",
    year: "2025",
    description:
      "A tool that analyzes APKs and summarizes risk signals. Includes a desktop UI and automated analysis pipeline.",
    stack: ["C++", "SDL", "Python", "Apktool"],
    highlights: [
      "Built UI components for reports and risk cards.",
      "Integrated analysis steps into a repeatable workflow.",
      "Produced readable outputs for non technical users."
    ],
    links: [
      { label: "GitHub", url: "https://github.com/yourusername/yourrepo" }
    ]
  },
  {
    title: "Data Modeling Projects",
    subtitle: "Schemas, constraints, and validation utilities",
    category: "backend",
    year: "2024",
    description:
      "A set of coursework and utilities around ER modeling, normalization, and consistency checking.",
    stack: ["SQL", "Python", "ERD"],
    highlights: [
      "Created consistent sample datasets and validation rules.",
      "Automated checks for referential integrity edge cases.",
      "Documented assumptions and tradeoffs."
    ],
    links: [
      { label: "Repository", url: "https://github.com/yourusername/yourrepo" }
    ]
  },
  {
    title: "Surface Coatings and Catalysts Work",
    subtitle: "Research portfolio highlights",
    category: "research",
    year: "2023–2025",
    description:
      "Selected research work including experimental design, characterization workflows, and analysis pipelines.",
    stack: ["Data Analysis", "Instrumentation", "Electrochem"],
    highlights: [
      "Built repeatable workflows for sample processing and analysis.",
      "Produced publication quality plots and data summaries.",
      "Maintained detailed documentation and reproducibility."
    ],
    links: [
      { label: "Writeup", url: "https://your-site.example.com/research" }
    ]
  }
];

/* ====== Reveal on scroll ====== */

function setupReveal() {
  const els = document.querySelectorAll(".reveal");
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
    research: "Research"
  };
  return map[cat] || "Project";
}

function projectCard(project, idx) {
  const stackHtml = (project.stack || [])
    .slice(0, 6)
    .map((s) => `<span class="tag">${escapeHtml(s)}</span>`)
    .join("");

  return `
    <article class="card project-card reveal" data-index="${idx}" tabindex="0" role="button" aria-label="Open project: ${escapeAttr(project.title)}">
      <div class="project-top">
        <h3 class="project-title">${escapeHtml(project.title)}</h3>
        <div class="project-tag">${tagForCategory(project.category)}</div>
      </div>
      <p class="project-desc">${escapeHtml(project.description)}</p>
      <div class="project-stack">${stackHtml}</div>
    </article>
  `;
}

function renderProjects() {
  const grid = document.getElementById("projectGrid");
  const filtered = PROJECTS.filter(matchesFilter);

  grid.innerHTML = filtered.map((p) => projectCard(p, PROJECTS.indexOf(p))).join("");

  // Re-attach reveal observer to newly injected cards
  setupReveal();

  // Update counts in hero
  const countPill = document.getElementById("projectCountPill");
  countPill.textContent = `${PROJECTS.length} projects`;

  const metricProjects = document.getElementById("metricProjects");
  metricProjects.textContent = `${PROJECTS.length}+`;

  // If nothing matches
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

/* ====== Modal ====== */

function openModal(project) {
  const backdrop = document.getElementById("modalBackdrop");
  const title = document.getElementById("modalTitle");
  const subtitle = document.getElementById("modalSubtitle");
  const meta = document.getElementById("modalMeta");
  const desc = document.getElementById("modalDesc");
  const bullets = document.getElementById("modalBullets");
  const actions = document.getElementById("modalActions");

  title.textContent = project.title;
  subtitle.textContent = project.subtitle || "";

  const metaTags = [
    project.category ? tagForCategory(project.category) : null,
    project.year || null,
    ...(project.stack || []).slice(0, 8)
  ].filter(Boolean);

  meta.innerHTML = metaTags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");

  desc.textContent = project.description || "";

  bullets.innerHTML = (project.highlights || [])
    .map((h) => `<li>${escapeHtml(h)}</li>`)
    .join("");

  actions.innerHTML = (project.links || [])
    .map((l) => `<a class="btn btn-primary" href="${escapeAttr(l.url)}" target="_blank" rel="noreferrer">${escapeHtml(l.label)}</a>`)
    .join("");

  backdrop.hidden = false;
  document.body.classList.add("modal-open");

  const closeBtn = document.getElementById("modalCloseBtn");
  closeBtn.focus();
}

function closeModal() {
  const backdrop = document.getElementById("modalBackdrop");
  backdrop.hidden = true;
  document.body.classList.remove("modal-open");
}

function setupModalHandlers() {
  const backdrop = document.getElementById("modalBackdrop");
  const closeBtn = document.getElementById("modalCloseBtn");
  const grid = document.getElementById("projectGrid");

  function isOpen() {
    return !backdrop.hidden;
  }

  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeModal();
  });

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) closeModal();
  });

  // Only open from inside the Projects grid
  grid.addEventListener("click", (e) => {
    if (isOpen()) return;
    const card = e.target.closest(".project-card");
    if (!card) return;

    const idx = Number(card.dataset.index);
    if (!Number.isFinite(idx)) return;

    const project = PROJECTS[idx];
    if (project) openModal(project);
  });

  // Keyboard open for focused card inside the grid
  grid.addEventListener("keydown", (e) => {
    if (isOpen()) return;
    if (e.key !== "Enter" && e.key !== " ") return;

    const card = document.activeElement?.closest?.(".project-card");
    if (!card) return;

    e.preventDefault();
    const idx = Number(card.dataset.index);
    if (!Number.isFinite(idx)) return;

    const project = PROJECTS[idx];
    if (project) openModal(project);
  });
}

/* ====== Filters + search ====== */

function setupFilters() {
  const buttons = document.querySelectorAll(".chip");
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
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("msgName").value.trim();
    const from = document.getElementById("msgEmail").value.trim();
    const body = document.getElementById("msgBody").value.trim();

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
  yearEl.textContent = new Date().getFullYear();

  // Set these to whatever you want
  document.getElementById("metricYears").textContent = "5+";
  document.getElementById("metricFocus").textContent = "Full stack";

  document.getElementById("metricProjects").textContent = `${PROJECTS.length}+`;
  document.getElementById("projectCountPill").textContent = `${PROJECTS.length} projects`;
}

function renderSkills() {
  const row = document.getElementById("skillsRow");
  row.innerHTML = SKILLS.map((s) => `<span class="tag">${escapeHtml(s)}</span>`).join("");
}

/* ====== Start ====== */

window.addEventListener("DOMContentLoaded", async () => {
  initCounts();
  renderSkills();

  renderProjects();
  setupFilters();
  setupModalHandlers();
  setupReveal();
  setupSmoothScroll();
  setupCopyEmail();
  setupMailtoForm();
});
