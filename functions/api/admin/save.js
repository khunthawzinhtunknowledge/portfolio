export async function onRequestPost({ request, env }) {
  const pw = request.headers.get("x-admin-password");
  if (!pw || pw !== env.ADMIN_PASSWORD) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad json" }, { status: 400 });
  }
  const { key, value } = body;
  if (!key || typeof key !== "string" || !/^[a-z_]+$/.test(key)) {
    return Response.json({ error: "bad key" }, { status: 400 });
  }
  const stored = typeof value === "string" ? value : JSON.stringify(value);
  await env.DB.prepare(
    "INSERT INTO site_content (key, value, updated_at) VALUES (?, ?, datetime('now')) " +
      "ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at"
  )
    .bind(key, stored)
    .run();
  return Response.json({ ok: true });
}
