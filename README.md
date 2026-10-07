# Portfolio — Cloudflare Pages + Functions + D1

Admin-editable portfolio. Public is read-only; `/admin` is password-protected.

## Stack (all free tier)
- **Cloudflare Pages** — static frontend (`public/`)
- **Pages Functions** (`functions/`) — JSON API
- **D1** — content database (`portfolio-db`)

## Deploy
1. `wrangler d1 create portfolio-db` → put `database_id` in `wrangler.toml`
2. `wrangler d1 execute portfolio-db --file=schema.sql --remote`
3. `wrangler pages deploy public --project-name=portfolio`
4. `wrangler pages secret put ADMIN_PASSWORD --project-name=portfolio`
5. Add custom domain `portfolio.nazarick.online` to the Pages project

## Editing
Open `/admin`, enter the password, edit sections, Save. Changes are live immediately.
The contact email is seeded as `hello@example.com` — change it in the admin panel.
