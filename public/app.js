const DEFAULTS = {
  profile: {
    name: "Khun Thaw Zin Htun",
    title: "IT Support Specialist",
    tagline: "IT support and automation for small businesses.",
    location: "Yangon, Myanmar",
    email: "khunthawzinhtun.workspace@gmail.com",
    github: "",
    telegram: ""
  },
  about: {
    heading: "About",
    body: "I am an IT support specialist. From 2024 to 2026 I worked as a help desk and service technician at a systems integrator, handling 4,000 tickets across L1, L2, and L3.\n\nMy best work was self-directed. I migrated the company Redmine from version 4 to 6, moving it off CentOS 7 onto a new CentOS 10 server with 4 hours of downtime and zero data loss. I rebuilt the working hour management system into a properly structured app with new features.\n\nNow I work for myself. IT support for small businesses, automation that removes busywork, and AI-assisted builds. I even build portfolio sites like this one."
  },
  skills: {
    categories: [
      {
        name: "IT Support",
        items: ["Help desk L1, L2, L3", "Hardware and software troubleshooting", "Vendor coordination", "Ticketing systems (Redmine)"]
      },
      {
        name: "Infrastructure",
        items: ["FortiGate firewalls and routers", "Cisco switches", "Aruba and UniFi wireless", "HIKVISION NVR and CCTV", "Dell servers", "VMware ESXi (6 hosts, 30 VMs)"]
      },
      {
        name: "Builds and automation",
        items: ["AI-assisted development", "Python and PowerShell", "Cloudflare (Tunnels, Pages, D1)", "Portfolio and business sites"]
      }
    ]
  },
  projects: [
      {
          "title": "Redmine Migration",
          "description": "Our ticketing system ran Redmine 4 on CentOS 7, which the latest Redmine no longer supports. I set up a new CentOS 10 server, installed Redmine 6, and migrated every ticket and record. 4 hours of downtime, zero data loss.",
          "tech": [
              "Redmine",
              "CentOS",
              "Data migration"
          ],
          "link": ""
      },
      {
          "title": "Working Hours Rebuild",
          "description": "The old working hour system was unstructured and hard to use. I rebuilt it with a proper structure and additional features for the whole staff.",
          "tech": [
              "PHP",
              "Web app"
          ],
          "link": ""
      },
      {
          "title": "Veil Reader",
          "description": "A private Android reader for manga and manhwa. History, bookmarks, and reading progress stay on the phone and nowhere else. Tracker blocking, HTTPS-only browsing, and volume keys turn the pages.",
          "tech": [
              "Android",
              "Kotlin",
              "Privacy"
          ],
          "link": ""
      },
      {
          "title": "Nazarick Bridge",
          "description": "My own server that lets AI assistants run tasks on my Windows machine. A local daemon does the work, a Cloudflare tunnel carries it out, and a health check proves it is alive.",
          "tech": [
              "Python",
              "MCP",
              "Cloudflare Tunnel"
          ],
          "link": ""
      }
  ],
  experience: [
    {
      role: "IT Help Desk and Service Technician",
      org: "Systems integrator",
      period: "2024 - 2026",
      points: [
        "Handled 4,000 support tickets across L1, L2, and L3 over two years.",
        "Migrated Redmine 4 on CentOS 7 to Redmine 6 on CentOS 10 with 4 hours of downtime and zero data loss.",
        "Rebuilt the working hour management system with proper structure and new features.",
        "Managed FortiGate firewalls and routers, Cisco switches, Aruba and UniFi wireless, HIKVISION CCTV, and 6 ESXi hosts running 30 VMs."
      ]
    }
  ],
  contact: {
    heading: "Contact",
    text: "I do IT support for small businesses, automation that removes busywork, and portfolio sites like this one. Email is the fastest way to reach me.",
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
