const DEFAULTS = {
  profile: {
    name: "Khun Thaw Zin Htun",
    title: "IT Infrastructure Engineer",
    tagline: "Infrastructure, automation, and AI tooling for small businesses.",
    location: "Yangon, Myanmar",
    email: "khunthawzinhtun.workspace@gmail.com",
    github: "",
    telegram: ""
  },
  about: {
    heading: "About",
    body: "I am an IT infrastructure engineer. From 2024 to 2026 I worked as a help desk and service technician at a systems integrator, handling 4,000 tickets across L1, L2, and L3. The work that defines me is what I built.\n\nI migrated the company Redmine from version 4 to 6 across servers with 4 hours of downtime and zero data loss. I built a working hours platform in PHP with role-based access, analytics, and Docker deployment. I run a production monitoring stack on Grafana and Loki. I build AI agents that manage infrastructure, including one that heals network faults on its own.\n\nNow I work for myself. Infrastructure and automation for small businesses, AI-assisted builds, and portfolio sites like this one."
  },
  skills: {
    categories: [
      {
        name: "Infrastructure",
        items: ["FortiGate firewalls and routers", "Cisco switches", "Aruba, UniFi and Meraki wireless", "HIKVISION NVR and CCTV", "Dell servers", "VMware ESXi (6 hosts, 30 VMs)"]
      },
      {
        name: "Platforms and DevOps",
        items: ["Docker and Compose", "Grafana, Loki and Promtail", "PHP and MariaDB", "n8n automation", "Nginx reverse proxy", "Cloudflare (Tunnels, Pages, D1)"]
      },
      {
        name: "AI-assisted development",
        items: ["AI agents for infrastructure", "MCP servers", "Python and PowerShell", "Shipping Android apps", "Portfolio and business sites"]
      }
    ]
  },
  projects: [
    {
      title: "Working Hours Platform",
      description: "A complete working hours and task management platform in PHP. Role-based access for admins, semi-admins, and members, analytics dashboards, audit logging, and Docker deployment. Built for the whole company staff.",
      tech: ["PHP", "MariaDB", "Docker"],
      link: ""
    },
    {
      title: "Infrastructure Monitoring",
      description: "A production monitoring stack on my own domain. Grafana dashboards, Loki log aggregation, and Promtail collectors, all running in Docker with health checks and persistent storage.",
      tech: ["Grafana", "Loki", "Docker"],
      link: ""
    },
    {
      title: "Nazarick Bridge",
      description: "An MCP server daemon that gives AI assistants authenticated remote control over infrastructure servers. System telemetry, remote command execution, and service management, reachable through a Cloudflare tunnel.",
      tech: ["Python", "MCP", "Cloudflare Tunnel"],
      link: ""
    },
    {
      title: "Connection Guard",
      description: "A self-healing network guard. It probes connectivity every 15 seconds, and when the link drops, a tuned model triggers a bounded repair through NetworkManager. Every repair is logged and every action is sandboxed.",
      tech: ["Python", "systemd", "Machine learning"],
      link: ""
    },
    {
      title: "Redmine Migration",
      description: "Our ticketing system ran Redmine 4 on CentOS 7, which the latest Redmine no longer supports. I set up a new CentOS 10 server, installed Redmine 6, and migrated every ticket and record. 4 hours of downtime, zero data loss.",
      tech: ["Redmine", "CentOS", "Data migration"],
      link: ""
    },
    {
      title: "Veil Reader",
      description: "A private Android reader for manga and manhwa. History, bookmarks, and reading progress stay on the phone and nowhere else. Tracker blocking, HTTPS-only browsing, and volume keys turn the pages.",
      tech: ["Android", "Kotlin", "Privacy"],
      link: ""
    }
  ],
  experience: [
    {
      role: "Independent IT Engineer",
      org: "Self-employed",
      period: "2026 - Present",
      points: [
        "Infrastructure and automation for small businesses.",
        "Production monitoring stacks, AI infrastructure agents, and portfolio sites."
      ]
    },
    {
      role: "IT Help Desk and Service Technician",
      org: "Systems integrator",
      period: "2024 - 2026",
      points: [
        "Handled 4,000 support tickets across L1, L2, and L3 over two years.",
        "Migrated Redmine 4 on CentOS 7 to Redmine 6 on CentOS 10 with 4 hours of downtime and zero data loss.",
        "Built the company working hours platform with PHP, role-based access, analytics, and Docker deployment.",
        "Built the company corporate website.",
        "Managed FortiGate firewalls and routers, Cisco switches, Aruba, UniFi and Meraki wireless, HIKVISION CCTV, and 6 ESXi hosts running 30 VMs."
      ]
    }
  ],
  contact: {
    heading: "Contact",
    text: "I do infrastructure and automation for small businesses, AI-assisted builds, and portfolio sites like this one. Email is the fastest way to reach me.",
    email: "khunthawzinhtun.workspace@gmail.com"
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
