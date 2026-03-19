# Bellat Platform — Project Summary & Quick Reference

**Last Updated:** March 18, 2026
**Owner:** Ryad

---

## Current State

| Area | Status | Notes |
|---|---|---|
| Monorepo scaffold | ✅ Done | Turbo + npm workspaces |
| Docker Compose | ✅ Done | Postgres 15 + Redis 7 + MinIO |
| Frontend `/web` | ✅ Prototype migrated | Next.js 16, working bilingual UI |
| Bilingual routing | ✅ Done | next-intl 4.7 (`/fr/*`, `/ar/*`) |
| Cart + Checkout | ✅ Done | Mock data, localStorage |
| Admin dashboard | ✅ Skeleton | Display-only, mock auth |
| Backend (`/apps`) | ⏳ Not started | NestJS 10 planned |
| Database | ⏳ Not connected | Schema reference in `docs/schema-prototype.sql` |
| CI/CD | ⏳ Not started | GitHub Actions planned |
| Tests | ⏳ Not configured | Jest planned with NestJS |

---

## What's in `/web` Right Now

**Routes:**
- `localhost:3000` → redirects to `/fr`
- `/fr` and `/ar` — bilingual home page
- `/fr/products`, `/ar/products` — product listing (20+ products, 5 categories)
- `/fr/products/[id]` — product detail
- `/fr/cart` — shopping cart (localStorage)
- `/fr/checkout/address`, `/delivery`, `/review` — 4-step checkout
- `/fr/order-success` — confirmation page
- `/fr/search` — search page (UI only, logic incomplete)
- `/admin/login`, `/admin/dashboard`, `/admin/orders`, `/admin/products` — mock admin

**Mock data** (static JSON in `public/data/`):
- `products.json`, `categories.json`, `mock-orders.json`

**Key libraries in use:**
- `next-intl` — bilingual routing and translations (`messages/fr.json`, `messages/ar.json`)
- `lucide-react` — icons
- `sonner` — toast notifications
- `date-fns` — date formatting
- `clsx` — conditional class names

---

## Business Rules (Quick Reference)

### Pricing
- B2C customers → `retail_price`
- B2B customers → `b2b_price`
- All prices TTC (includes VAT), in DZD (no decimals)

### Inventory
- `available_stock = stock_quantity − reserved_quantity`
- Order placement → increment `reserved_quantity`
- Order cancellation → decrement `reserved_quantity`
- Order delivered → decrement both

### Orders
- Minimum order: 1,500 DZD (default, configurable per zone)
- Order number format: `BLT-YYYYMMDD-XXXXX`
- Delivery date: tomorrow minimum, +7 days maximum
- Cancellation: PENDING status only
- Evening slot adds zone surcharge

### Authentication (planned)
- OTP valid: 10 minutes, max 3 requests/phone/hour
- Account locked: 5 failed attempts → 15-minute lockout
- JWT: RS256, 15-min access / 7-day refresh (CLAUDE.md says 15-min; project-initialization.md says 24h — use 15-min for production)
- B2B accounts require manual admin approval

### B2B Credit
- `credit_used` increases on INVOICE order placed
- `credit_used` decreases when order marked PAID
- Reject if `(credit_used + order_total) > credit_limit`

---

## Performance Targets

| Metric | Target |
|---|---|
| FCP (4G) | < 2s |
| FCP (3G) | < 4s |
| API response P95 | < 500ms |
| Search | < 300ms |
| Normal load | 1,000 concurrent users |
| Ramadan/Eid peak | 5,000 concurrent users |

---

## Phase Roadmap

- ✅ **Planning** — All specs written, architecture defined
- ✅ **Prototype** — Full UI built in `bellat-prototype` repo
- ✅ **Phase 0** — Monorepo scaffolded, prototype migrated to `/web`
- ⏳ **Phase 1** — Backend: NestJS microservices, Prisma schema, real auth
- ⏳ **Phase 2** — Connect frontend to real API, PWA (service workers, offline)
- ⏳ **Phase 3** — Admin dashboard with real data
- ⏳ **Phase 4** — Notifications: SMS, email, push (FCM)
- ⏳ **Phase 5** — QA, load testing, security audit, launch

See [../TODO.md](../TODO.md) for all 110 tasks with acceptance criteria.

---

## Out of Scope

- Driver/Delivery Staff mobile app — separate Bellat initiative
- Online payments (CIB/Dahabia) — Phase 2
- GPS tracking — Phase 2
- Native mobile apps — Phase 2
- ERP integration, AI features — Phase 3

---

## Key Files to Know

| Path | What it is |
|---|---|
| `web/proxy.ts` | next-intl middleware (Next.js 16 convention) |
| `web/i18n.ts` | next-intl server config |
| `web/messages/fr.json` | French translations |
| `web/messages/ar.json` | Arabic translations |
| `web/context/CartContext.tsx` | Cart state (localStorage key: `bellat_cart`) |
| `web/app/[locale]/layout.tsx` | Sets `dir="rtl"` for Arabic |
| `docs/schema-prototype.sql` | Database schema reference for Prisma work |
| `docker-compose.yml` | Local Postgres + Redis + MinIO |
