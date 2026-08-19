# Magisa Art

Storefront and back-office console for Magisa Art, a handmade jewelry studio. React/Vite frontend, a small Express API for orders/AI-chat/shipping labels, and a PocketBase backend for the admin console (CRM, tickets, warehouse, tracking, marketing).

## Stack

- **Frontend:** React 18 + React Router 7, built with Vite
- **Storefront API:** Express (orders, support chat, shipping label PDFs)
- **Admin data:** PocketBase (customers, deals, tickets, messages, inventory, shipments, campaigns, plus the `users` auth collection used for admin login)

## Project layout

```
src/                  storefront (Header, ProductCard, cart, pages) + src/admin/ (CRM console)
server/               Express API (orders, server/routes/ai.js, server/routes/labels.js)
scripts/setup-pb.mjs  creates PocketBase collections + seed data
public/products/      product photos
```

## Local setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in what you need (SMTP, OpenAI key, etc). `VITE_PB_URL` defaults to `http://127.0.0.1:8090` for local dev.
3. Download [PocketBase](https://pocketbase.io/docs/) (use a `0.22.x` release — the setup script and `AuthContext` target the legacy admin/API shape, not the `0.23+` superusers rewrite) and run it from a `pb/` folder (gitignored):
   ```
   pocketbase.exe serve
   pocketbase.exe admin create admin@magisa.art <password>
   ```
4. Create the collections and seed demo data:
   ```
   PB_EMAIL=admin@magisa.art PB_PASSWORD=<password> node scripts/setup-pb.mjs
   ```
5. Create a login user for the admin console (PocketBase Admin UI at `http://127.0.0.1:8090/_/`, or via the API) in the `users` collection.
6. Start everything:
   ```
   npm run server   # Express API on :4000
   npm run dev       # Vite on :3000 (falls back to next free port)
   ```
7. Storefront: `http://localhost:3000/`. Admin console: `http://localhost:3000/admin`.

## Admin console

Routes live under `/admin` (`src/admin/`): Dashboard, CRM, Support & Tickets, Warehouse, Tracking & Labels, Marketing, Settings. Auth is a PocketBase `users` record — login redirects to the dashboard on success.

PocketBase collections created by `scripts/setup-pb.mjs` have `@request.auth.id != ""` list/view/create/update/delete rules, so any authenticated `users` record (not just a PocketBase admin) can use the console.

## Deployment

Intended to use **Hostinger** for the frontend and **Railway** for the Express API and PocketBase database. Set `VITE_API_URL=https://api.magisa.art`, `VITE_PB_URL=https://db.magisa.art`, and `PB_URL=https://db.magisa.art` in the corresponding deployment environments.

### Railway PocketBase service

Configure the Railway PocketBase service to use `Dockerfile.pocketbase` as its Dockerfile. Mount its persistent volume at `/data` and keep the public domain pointed at the service. The container listens on Railway's `$PORT`, stores PocketBase data in `/data`, and applies the checked-in `pb_migrations` directory on startup.

### Railway API service

Configure the separate API service to use `Dockerfile.api`. It runs only `server/index.js` and listens on Railway's `$PORT`. Use `/api/health` as its healthcheck and set `VITE_API_URL` in the Hostinger frontend build to the API service domain.
