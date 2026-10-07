const DEFAULTS = {
  profile: {
    name: "Khun Thaw Zin Htun",
    title: "IT Infrastructure Engineer",
    tagline: "I build my own tools and take on client work.",
    location: "Yangon, Myanmar",
    email: "hello@example.com",
    github: "",
    telegram: ""
  },
  about: {
    heading: "About",
    body: "I work on infrastructure and automation. My days used to be spent in a NOC keeping systems up. Now I build my own tools and take on client work."
  },
  skills: {
    categories: [
      {
        name: "Infrastructure",
        items: ["Python", "PowerShell", "Windows infrastructure", "NOC monitoring", "Network diagnostics"]
      },
      {
        name: "Platforms",
        items: ["Cloudflare (Tunnels, Pages, Workers, D1)", "MCP servers", "Android app builds", "n8n automation"]
      }
    ]
  },
  projects: [
    {
      title: "Veil Reader",
      description: "A private Android reader for manga and manhwa. History, bookmarks, and reading progress stay on the phone and nowhere else. Tracker blocking, HTTPS-only browsing, and volume keys turn the pages.",
      tech: ["Android", "Kotlin", "Privacy"],
      link: ""
    },
    {
      title: "Nazarick Bridge",
      description: "My own server that lets AI assistants run tasks on my Windows machine. A local daemon does the work, a Cloudflare tunnel carries it out, and a health check proves it is alive.",
      tech: ["Python", "MCP", "Cloudflare Tunnel"],
      link: ""
    },
    {
      title: "SLA Tracker",
      description: "A tool from my time in infrastructure support. It reads support tickets, checks them against response targets, and flags the ones about to break. No more surprises in the morning report.",
      tech: ["Python", "Redmine", "Automation"],
      link: ""
    },
    {
      title: "Hours Exporter",
      description: "Another one from support days. It pulls logged hours out of tickets and builds the weekly timesheet. A chore that took an afternoon now takes one click.",
      tech: ["Python", "PowerShell", "Excel"],
      link: ""
    }
  ],
  experience: [
    {
      role: "IT Service Technician, Infrastructure and NOC",
      org: "",
      period: "Until October 2026",
      points: [
        "Ran monitoring and ticketing for company infrastructure.",
        "Built automation for SLA tracking and timesheets."
      ]
    }
  ],
  contact: {
    heading: "Contact",
    text: "I am currently open to infrastructure and automation work. The fastest way to reach me is email.",
    email: "hello@example.com"
  }
};

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function loadContent() {
  try {
    const res = await fetch("/api/content");
    if (!res.ok) throw new Error("api");
    const data = await res.json();
    if (!data || Object.keys(data).length === 0) throw new Error("empty");
    return Object.assign({}, DEFAULTS, data);
  } catch {
    return DEFAULTS;
  }
}

function render(c) {
  const p = c.profile || {};
  document.title = (p.name || "Portfolio") + (p.title ? " - " + p.title : "");
  setText("brand", p.name || "Portfolio");
  setText("hero-location", p.location);
  setText("hero-name", p.name);
  setText("hero-title", p.title);
  setText("hero-tagline", p.tagline);
  renderLinks("hero-links", p, true);
  setText("footer-line", "© 2026 " + (p.name || ""));

  const about = c.about || {};
  setText("about-body", about.body);

  const grid = document.getElementById("skills-grid");
  grid.innerHTML = "";
  (c.skills.categories || []).forEach((cat) => {
    const card = document.createElement("div");
    card.className = "skill-card";
    const items = (cat.items || []).map((i) => `<li>${esc(i)}</li>`).join("");
    card.innerHTML = `<h4>${esc(cat.name)}</h4><ul>${items}</ul>`;
    grid.appendChild(card);
  });

  const pg = document.getElementById("projects-grid");
  pg.innerHTML = "";
  (c.projects || []).forEach((pr) => {
    const card = document.createElement("div");
    card.className = "project-card";
    const tech = (pr.tech || []).map((t) => `<span>${esc(t)}</span>`).join("");
    const link = pr.link
      ? `<a class="project-link" href="${esc(pr.link)}" target="_blank" rel="noopener">View</a>`
      : "";
    card.innerHTML = `<h4>${esc(pr.title)}</h4><p>${esc(pr.description)}</p><div class="tech">${tech}</div>${link}`;
    pg.appendChild(card);
  });

  const ex = document.getElementById("experience-list");
  ex.innerHTML = "";
  (c.experience || []).forEach((e) => {
    const div = document.createElement("div");
    div.className = "exp-item";
    const points = (e.points || []).map((pt) => `<li>${esc(pt)}</li>`).join("");
    const org = e.org ? `<div class="exp-org">${esc(e.org)}</div>` : "";
    div.innerHTML =
      `<div class="exp-head"><h4>${esc(e.role)}</h4><span class="exp-period">${esc(e.period)}</span></div>` +
      org + `<ul>${points}</ul>`;
    ex.appendChild(div);
  });

  const ct = c.contact || {};
  setText("contact-heading", ct.heading || "Contact");
  setText("contact-text", ct.text);
  renderLinks("contact-links", { email: ct.email }, false);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "";
}

function renderLinks(id, p, includeSocial) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = "";
  const add = (href, label, solid) => {
    const a = document.createElement("a");
    a.className = "btn" + (solid ? " solid" : "");
    a.href = href;
    a.textContent = label;
    if (/^https?:/.test(href)) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    el.appendChild(a);
  };
  if (p.email) add("mailto:" + p.email, "Email me", true);
  if (includeSocial) {
    if (p.github) add(p.github, "GitHub", false);
    if (p.telegram) add(p.telegram, "Telegram", false);
  }
  if (id === "hero-links") {
    const cta = document.createElement("a");
    cta.className = "btn";
    cta.href = "#contact";
    cta.textContent = "Get in touch";
    el.appendChild(cta);
  }
}

loadContent().then(render);
