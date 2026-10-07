export async function onRequestGet({ env }) {
  const rows = await env.DB.prepare("SELECT key, value FROM site_content").all();
  const content = {};
  for (const r of rows.results || []) {
    try {
      content[r.key] = JSON.parse(r.value);
    } catch {
      content[r.key] = r.value;
    }
  }
  return Response.json(content);
}
