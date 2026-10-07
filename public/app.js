const DEFAULTS = {
  profile: {
    name: "Khun Thaw Zin Htun",
    title: "IT Infrastructure Engineer",
    tagline: "I keep networks running and build the automation around them.",
    location: "Yangon, Myanmar",
    email: "hello@example.com",
    github: "",
    telegram: ""
  },
  about: {
    heading: "About",
    body: "I work in IT infrastructure. My background is in NOC operations, where I handled monitoring, ticketing, and SLA reporting.\n\nOver time I automated most of the repetitive parts. Ticket logs flow into timesheets on their own. SLA numbers get calculated without spreadsheets. Alerts reach the team over Telegram before anyone has to ask.\n\nI also work with AI agents now. I run my own MCP server, build custom agent skills, and route work across different models depending on the job.\n\nI am currently looking for infrastructure and automation work."
  },
  skills: {
    categories: [
      {
        name: "Infrastructure and Networking",
        items: ["Cloudflare Zero Trust and tunnels", "FortiGate firewalls", "Zabbix monitoring", "Tailscale and VPN mesh", "DNS and network diagnostics"]
      },
      {
        name: "Automation and Scripting",
        items: ["Python", "PowerShell", "n8n workflows", "JSON and Excel pipelines", "Windows services"]
      },
      {
        name: "AI and Agents",
        items: ["Google Antigravity", "Claude Code", "MCP server design", "Multi-agent setups", "Prompt engineering"]
      },
      {
        name: "Data",
        items: ["BigQuery and SQL", "Redmine API", "SLA reporting", "Excel automation"]
      }
    ]
  },
  projects: [
    {
      title: "WinMCP",
      description: "A Windows service that lets AI agents run tasks on the machine through the MCP protocol. It stays up around the clock and is reachable remotely through a Cloudflare tunnel.",
      tech: ["Python", "MCP", "Cloudflare Tunnel", "C#"],
      link: ""
    },
    {
      title: "Working Hours Automation",
      description: "Takes ticket logs from Redmine and turns them into timesheets. Runs every day without anyone touching it.",
      tech: ["Python", "PowerShell", "Excel"],
      link: ""
    },
    {
      title: "SLA Reporter",
      description: "Checks support tickets against SLA targets and produces the numbers. No spreadsheets involved.",
      tech: ["Python", "Redmine"],
      link: ""
    },
    {
      title: "Telegram Alert Bot",
      description: "Watches the ticket queue and sends SLA alerts to Telegram as they happen.",
      tech: ["Python", "Telegram API"],
      link: ""
    },
    {
      title: "Veil Reader",
      description: "A private Android app for reading manga. Fullscreen pages, volume keys turn the pages, and reading history never leaves the device.",
      tech: ["Kotlin", "Android"],
      link: ""
    }
  ],
  experience: [
    {
      role: "IT Service Technician, Infrastructure and NOC",
      org: "",
      period: "Until October 2026",
      points: [
        "Handled monitoring, ticketing, and SLA compliance for infrastructure operations.",
        "Built automation connecting Redmine, timesheets, and alerting.",
        "Managed Cloudflare tunnels, FortiGate firewalls, and Zabbix monitoring."
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
