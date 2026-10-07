let PASSWORD = "";
let CONTENT = {};

const $ = (id) => document.getElementById(id);
const clone = (o) => JSON.parse(JSON.stringify(o));

$("unlock").addEventListener("click", unlock);
$("pw").addEventListener("keydown", (e) => { if (e.key === "Enter") unlock(); });
$("lock").addEventListener("click", () => location.reload());
$("view-site").addEventListener("click", () => window.open("/", "_blank"));

async function unlock() {
  const pw = $("pw").value;
  $("gate-error").textContent = "";
  try {
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "x-admin-password": pw }
    });
    if (!res.ok) throw new Error("wrong");
    PASSWORD = pw;
    CONTENT = (await fetch("/api/content").then((r) => r.json())) || {};
    $("gate").style.display = "none";
    $("editor").style.display = "block";
    renderAll();
  } catch {
    $("gate-error").textContent = "Wrong password.";
  }
}

async function save(key, value, btn) {
  const msg = $("save-msg");
  msg.textContent = "";
  const old = btn.textContent;
  btn.textContent = "Saving…";
  btn.disabled = true;
  try {
    const res = await fetch("/api/admin/save", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": PASSWORD },
      body: JSON.stringify({ key, value })
    });
    if (!res.ok) throw new Error("save failed");
    CONTENT[key] = clone(value);
    msg.textContent = "Saved.";
    setTimeout(() => (msg.textContent = ""), 2500);
  } catch {
    msg.textContent = "Save failed. Try again.";
  }
  btn.textContent = old;
  btn.disabled = false;
}

function field(label, value, onInput, multiline) {
  const wrap = document.createElement("div");
  wrap.className = "field";
  const lab = document.createElement("label");
  lab.textContent = label;
  wrap.appendChild(lab);
  const input = multiline ? document.createElement("textarea") : document.createElement("input");
  if (!multiline) input.type = "text";
  input.value = value || "";
  input.addEventListener("input", () => onInput(input.value));
  wrap.appendChild(input);
  return wrap;
}

// A section edits one content key. draft is a private clone; Save persists it.
function section(title, key, empty, buildBody) {
  const div = document.createElement("div");
  div.className = "editor-section";
  const h = document.createElement("h3");
  h.textContent = title;
  div.appendChild(h);
  const body = document.createElement("div");
  div.appendChild(body);

  let draft = clone(CONTENT[key] !== undefined ? CONTENT[key] : empty);
  const rerender = () => {
    body.innerHTML = "";
    buildBody(body, draft, rerender);
  };
  rerender();

  const btn = document.createElement("button");
  btn.textContent = "Save " + title;
  btn.style.marginTop = "8px";
  btn.addEventListener("click", () => save(key, draft, btn));
  div.appendChild(btn);
  return div;
}

// Editable add/remove list. Mutates arr in place, then onChange re-renders the section.
function repeatList(body, arr, renderItem, addLabel, emptyItem, onChange) {
  arr.forEach((item, i) => {
    const wrap = document.createElement("div");
    wrap.className = "repeat-item";
    const head = document.createElement("div");
    head.className = "repeat-head";
    const strong = document.createElement("strong");
    strong.textContent = "#" + (i + 1);
    const del = document.createElement("button");
    del.className = "danger small";
    del.textContent = "Remove";
    del.addEventListener("click", () => {
      arr.splice(i, 1);
      onChange();
    });
    head.appendChild(strong);
    head.appendChild(del);
    wrap.appendChild(head);
    renderItem(wrap, item);
    body.appendChild(wrap);
  });
  const add = document.createElement("button");
  add.className = "ghost small";
  add.textContent = "+ " + addLabel;
  add.style.marginTop = "4px";
  add.addEventListener("click", () => {
    arr.push(clone(emptyItem));
    onChange();
  });
  body.appendChild(add);
}

function renderAll() {
  const root = $("sections");
  root.innerHTML = "";

  root.appendChild(section("Profile", "profile",
    { name: "", title: "", tagline: "", location: "", email: "", github: "", telegram: "" },
    (body, d) => {
      body.appendChild(field("Name", d.name, (v) => (d.name = v)));
      body.appendChild(field("Title", d.title, (v) => (d.title = v)));
      body.appendChild(field("Tagline", d.tagline, (v) => (d.tagline = v), true));
      body.appendChild(field("Location", d.location, (v) => (d.location = v)));
      body.appendChild(field("Email", d.email, (v) => (d.email = v)));
      body.appendChild(field("GitHub URL", d.github, (v) => (d.github = v)));
      body.appendChild(field("Telegram URL", d.telegram, (v) => (d.telegram = v)));
    }));

  root.appendChild(section("About", "about",
    { heading: "About", body: "" },
    (body, d) => {
      body.appendChild(field("Heading", d.heading, (v) => (d.heading = v)));
      body.appendChild(field("Body", d.body, (v) => (d.body = v), true));
    }));

  root.appendChild(section("Skills", "skills",
    { categories: [] },
    (body, d, rerender) => {
      d.categories = d.categories || [];
      repeatList(body, d.categories, (wrap, cat) => {
        wrap.appendChild(field("Category name", cat.name, (v) => (cat.name = v)));
        wrap.appendChild(field("Skills (one per line)", (cat.items || []).join("\n"), (v) => {
          cat.items = v.split("\n").map((s) => s.trim()).filter(Boolean);
        }, true));
      }, "Add category", { name: "", items: [] }, rerender);
    }));

  root.appendChild(section("Projects", "projects", [],
    (body, d, rerender) => {
      const list = Array.isArray(d) ? d : [];
      repeatList(body, list, (wrap, pr) => {
        wrap.appendChild(field("Title", pr.title, (v) => (pr.title = v)));
        wrap.appendChild(field("Description", pr.description, (v) => (pr.description = v), true));
        wrap.appendChild(field("Tech (comma separated)", (pr.tech || []).join(", "), (v) => {
          pr.tech = v.split(",").map((s) => s.trim()).filter(Boolean);
        }));
        wrap.appendChild(field("Link URL", pr.link, (v) => (pr.link = v)));
      }, "Add project", { title: "", description: "", tech: [], link: "" }, () => {
        // keep draft pointing at the mutated array, then re-render
        while (d.length) d.pop();
        list.forEach((x) => d.push(x));
        rerender();
      });
    }));

  root.appendChild(section("Experience", "experience", [],
    (body, d, rerender) => {
      const list = Array.isArray(d) ? d : [];
      repeatList(body, list, (wrap, e) => {
        wrap.appendChild(field("Role", e.role, (v) => (e.role = v)));
        wrap.appendChild(field("Organization", e.org, (v) => (e.org = v)));
        wrap.appendChild(field("Period", e.period, (v) => (e.period = v)));
        wrap.appendChild(field("Points (one per line)", (e.points || []).join("\n"), (v) => {
          e.points = v.split("\n").map((s) => s.trim()).filter(Boolean);
        }, true));
      }, "Add role", { role: "", org: "", period: "", points: [] }, () => {
        while (d.length) d.pop();
        list.forEach((x) => d.push(x));
        rerender();
      });
    }));

  root.appendChild(section("Contact", "contact",
    { heading: "Contact", text: "", email: "" },
    (body, d) => {
      body.appendChild(field("Heading", d.heading, (v) => (d.heading = v)));
      body.appendChild(field("Text", d.text, (v) => (d.text = v), true));
      body.appendChild(field("Email", d.email, (v) => (d.email = v)));
    }));
}
