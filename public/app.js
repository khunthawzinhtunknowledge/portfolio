const DEFAULTS = {
  profile: {
    name: "Khun Thaw Zin Htun",
    title: "IT Support Specialist",
    tagline: "I build my own tools and take on client work.",
    location: "Yangon, Myanmar",
    email: "hello@example.com",
    github: "",
    telegram: ""
  },
  about: {
    heading: "About",
    body: "I spent two years as an IT help desk technician at a systems integrator. Level 1 and Level 2 support, troubleshooting devices, talking to vendors. Firewalls, switches, routers, CCTV, VMware servers, Active Directory.\n\nOn my own I took on bigger things. I upgraded our Redmine ticketing system myself and migrated every ticket without losing one. I rebuilt our working hour management system into a much better version.\n\nNow I build software the same way I fixed systems. I design the tool, direct AI assistants to build it, test every part myself, and ship it. This site and the Android app in my projects were both built that way.\n\nI take on IT support and automation work."
  },
  skills: {
    categories: [
      {
        name: "IT Support",
        items: ["Help desk L1 and L2", "Device troubleshooting", "Vendor coordination", "Redmine ticketing"]
      },
      {
        name: "Infrastructure",
        items: ["Firewalls, switches, routers", "CCTV systems", "VMware ESXi", "Virtual servers", "Active Directory"]
      },
      {
        name: "AI-assisted development",
        items: ["Directing AI coding agents", "Python and PowerShell automation", "Cloudflare (Tunnels, Pages, Workers, D1)", "MCP servers", "Shipping Android apps"]
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
      title: "Redmine Upgrade",
      description: "Upgraded the company Redmine ticketing system on my own. Migrated every ticket and record to the new version without losing anything.",
      tech: ["Redmine", "Data migration"],
      link: ""
    },
    {
      title: "Working Hours Rebuild",
      description: "Took the company working hour management system and rebuilt it into a much better version for staff to track their hours.",
      tech: ["PHP", "Redesign"],
      link: ""
    }
  ],
  experience: [
    {
      role: "IT Help Desk Service Technician",
      org: "Systems integrator",
      period: "Two years, until October 2026",
      points: [
        "Level 1 and Level 2 support, troubleshooting IT devices, vendor communications.",
        "Upgraded the Redmine ticketing system alone and migrated all data without loss.",
        "Rebuilt the working hour management system into a much better version.",
        "Hands-on with firewalls, switches, routers, CCTV, VMware ESXi, and Active Directory."
      ]
    }
  ],
  contact: {
    heading: "Contact",
    text: "I am currently open to IT support and automation work. The fastest way to reach me is email.",
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
