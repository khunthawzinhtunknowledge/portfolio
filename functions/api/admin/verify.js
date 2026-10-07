export async function onRequestPost({ request, env }) {
  const pw = request.headers.get("x-admin-password");
  if (!pw || pw !== env.ADMIN_PASSWORD) {
    return Response.json({ ok: false }, { status: 401 });
  }
  return Response.json({ ok: true });
}
