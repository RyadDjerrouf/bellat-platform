# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build, Test, and Lint Commands

```bash
# Frontend (Next.js in /web)
# NOTE: /web is NOT part of root npm workspaces (apps/* and libs/* only)
# All web development must be run from inside the /web directory
cd web && npm run dev          # Dev server on port 3000
cd web && npm run build        # Production build
cd web && npm run start        # Run production server (after build)
cd web && npm run lint         # ESLint

# Backend (NestJS in /apps/api-gateway)
cd apps/api-gateway && npm run dev    # Dev server on port 3002 (watch mode)
cd apps/api-gateway && npm run build  # Compile TypeScript → dist/
cd apps/api-gateway && npm run start  # Run compiled server
cd apps/api-gateway && npm run lint   # ESLint

# Database (Prisma — source of truth is in /libs/database)
cd libs/database && npx prisma generate      # Regenerate Prisma client after schema changes
cd libs/database && npx prisma migrate dev   # Create + apply a new migration
cd libs/database && npx prisma migrate deploy # Apply migrations in production
cd libs/database && npx prisma studio        # Open Prisma Studio GUI (browse DB)
cd libs/database && npx prisma db seed       # Seed categories + products

# Root monorepo (Turbo — covers apps/* and libs/*, NOT /web)
npm run build        # Build all apps/libs
npm run lint         # Lint all packages
npm run format       # Prettier format all files
npm run type-check   # TypeScript check across all packages

# Docker infrastructure (local dev only — production uses Supabase)
docker-compose up -d            # Start PostgreSQL + Redis + MinIO
docker-compose down             # Stop all services
docker-compose logs -f postgres # View postgres logs
```

## Architecture Overview

**Monorepo structure** (npm workspaces + Turbo):
- `/web/` — Next.js 16 frontend: customer shop + admin dashboard (active, fully wired to backend)
- `/apps/api-gateway/` — NestJS 10 REST API (active, running on port 3002)
- `/libs/database/` — Prisma schema, migrations, seed data (source of truth for DB)
- `/docs/` — Reference docs including `schema-prototype.sql`
- `/docker/` and `/k8s/` — Infrastructure placeholders

**Current State (March 2026):**
- Full-stack app is live end-to-end. Frontend talks to real NestJS backend.
- Database: **Supabase** (PostgreSQL 15) — `libs/database/.env` and `apps/api-gateway/.env` both point to it.
- All customer pages wired to real API: auth, products, cart, checkout, orders, profile, addresses, favorites, recipes (static).
- Admin dashboard fully wired: login (real JWT), orders (list + detail + status advance + search + date range filter), products (list + create + edit + deactivate + search), inventory (search), customers (search), analytics (date range presets).
- PWA: service worker (`/public/sw.js` v2), manifest, icons (`/public/icons/`), offline fallback page (`/offline`).
- Email: `MailService` sends password-reset links via SendGrid v3 REST API (native `https`, no extra npm package). Falls back to console log when `SENDGRID_API_KEY=REPLACE_ME`.

---

## `/web` — Frontend (Next.js 16)

**Tech stack**: Next.js 16.1.1 (App Router), React 19, Tailwind CSS 4, TypeScript strict, next-intl 4.7, lucide-react, sonner, @radix-ui/react-label

**Directory layout**:
```
web/
├── app/
│   ├── [locale]/              # Bilingual customer routes (/fr/*, /ar/*)
│   │   ├── page.tsx           # Home
│   │   ├── products/          # Listing + [id] detail (with FavoriteButton) + categories/[category]
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # address → delivery → review (3 steps)
│   │   ├── order-success/     # Post-checkout confirmation (NOT under checkout/)
│   │   ├── orders/            # Order history list (status filter) + [id] detail/tracking
│   │   ├── profile/           # Edit name/phone/password + delete account
│   │   ├── addresses/         # Saved addresses CRUD + inline edit
│   │   ├── favorites/         # Favorited products list (add/remove)
│   │   ├── recipes/           # Recipe grid grouped by category + [id] detail
│   │   ├── search/            # Live search (debounced backend API)
│   │   ├── login/             # Login + register (mode toggle) + forgot password link
│   │   ├── forgot-password/   # Email form → triggers reset token
│   │   ├── reset-password/    # Token from URL → set new password
│   │   └── layout.tsx         # Sets dir="rtl" for Arabic
│   ├── admin/                 # Admin dashboard (real JWT auth)
│   │   ├── login/             # Admin login (checks role=admin in JWT)
│   │   ├── dashboard/         # KPI cards + recent orders + revenue chart + top products
│   │   ├── orders/            # Order list + [id] detail (search + status + date range filter)
│   │   ├── products/          # Product list (search) + new/ + [id]/edit/
│   │   ├── inventory/         # Stock management (search)
│   │   ├── customers/         # Customer list (searchable)
│   │   ├── analytics/         # Revenue chart, top products, status breakdown (7/30/90d presets)
│   │   └── layout.tsx         # Sidebar nav, auth guard
│   ├── offline/               # Offline fallback page (served by SW when navigation fails)
│   ├── page.tsx               # Root redirect → /fr
│   └── layout.tsx             # Root pass-through layout
├── components/
│   ├── home/, products/, checkout/, cart/, layout/, ui/   # existing
│   ├── products/FavoriteButton.tsx   # Heart toggle — add/remove favorite (client component)
│   └── recipes/AddBellatIngredientsButton.tsx  # Adds all Bellat recipe ingredients to cart
├── context/
│   ├── AuthContext.tsx        # JWT + refresh token, login/logout
│   └── CheckoutContext.tsx    # Multi-step checkout state (sessionStorage)
├── lib/
│   ├── api.ts                 # Central API client — ALL backend calls go here
│   └── data/
│       ├── products.ts        # Static product helpers (prototype-era, still used by some pages)
│       ├── categories.ts      # Static category helpers
│       └── recipes.ts         # Static recipe data (6 bilingual recipes, type definitions)
├── public/
│   ├── manifest.json          # PWA manifest (theme #16a34a, start_url /fr)
│   ├── sw.js                  # Service worker v2 (cache-first assets, network-first pages, /offline fallback)
│   └── icons/                 # icon-192.png, icon-512.png (green "B" logo, required for install prompt)
├── types/             # product.ts, category.ts, order.ts, cart.ts
├── messages/          # fr.json, ar.json (translation keys)
├── proxy.ts           # next-intl middleware (Next.js 16 uses proxy.ts not middleware.ts)
└── next.config.ts     # withNextIntl + image optimization
```

**Key patterns in `/web`**:
- All API calls go through `web/lib/api.ts`. Never call `fetch()` directly in components.
- `authFetch(url, init, token)` — use for authenticated calls; auto-retries once on 401 after silent token refresh.
- `tryRefresh()` — reads `bellat_refresh_token` from localStorage, calls `POST /api/auth/refresh`, stores new access token.
- Customer token keys: `bellat_token` (access), `bellat_refresh_token` (refresh)
- Admin token keys: `bellat_admin_token` (access), `bellat_admin_refresh_token` (refresh)
- `AuthContext` exposes `{ token, isAuthenticated, login(accessToken, refreshToken), logout() }`
- `CheckoutContext` stores `{ address, setAddress, deliverySlot, setDeliverySlot }` in sessionStorage
- `DeliveryAddress` context type fields: `fullName`, `phone`, `address`, `wilaya`, `commune` — note `phone` and `address` (not `phoneNumber`/`addressLine1` which are backend field names)

---

## `/apps/api-gateway` — Backend (NestJS 10)

**Port**: 3002
**Tech stack**: NestJS 10, Prisma 5, JWT (HS256), bcrypt, class-validator, @nestjs/swagger, @nestjs/throttler

**Module structure**:
```
src/
├── auth/          # POST /api/auth/register, /login, /refresh, /forgot-password, /reset-password
├── products/      # GET /api/products, /categories; POST/PUT/DELETE /api/admin/products
├── orders/        # GET/POST /api/orders; PATCH /cancel, /reorder; GET/PATCH /api/admin/orders
├── inventory/     # GET/PATCH /api/admin/inventory; batch; alerts
├── users/         # GET/PATCH /api/users/me; DELETE /api/users/me; CRUD /api/users/me/addresses; GET /api/admin/users
├── favorites/     # GET/POST/DELETE /api/favorites/:productId (JWT auth, customer)
├── analytics/     # GET /api/admin/analytics?from=&to=
├── mail/          # MailService — SendGrid v3 via native https (no extra package)
├── prisma/        # PrismaService (NestJS DI wrapper around PrismaClient)
└── common/        # RolesGuard, @Roles() decorator, LoggerMiddleware
```

**Auth**:
- JWT algorithm: **HS256** (not RS256) — secrets in `apps/api-gateway/.env`
- Access token: 15 minutes (`JWT_SECRET`)
- Refresh token: 7 days (`JWT_REFRESH_SECRET`)
- Admin routes protected with `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles('admin')`
- Account lockout: 5 failed login attempts → 15-min in-memory lock (ephemeral; Redis upgrade deferred)
- Password reset: `POST /api/auth/forgot-password` generates UUID token (1h TTL, in-memory); `POST /api/auth/reset-password` validates + updates password. `MailService` sends branded HTML email via SendGrid; logs link to console when `SENDGRID_API_KEY=REPLACE_ME`
- Delete account: `DELETE /api/users/me` — blocked if user has active (non-cancelled/delivered) orders

**Order state machine**: `pending → confirmed → preparing → out_for_delivery → delivered`
Invalid transitions return 400. Cancellation only allowed from `pending`.

**Delivery fee**: currently `DELIVERY_FEE = 0` for all wilayas (free delivery, B2B model). Per-zone fee config is deferred to Phase 1.9.

**Order ID format**: `BLT-YYYYMMDD-NNNNN` (e.g. `BLT-20260321-00001`)

---

## `/libs/database` — Prisma Schema & Migrations

This is the **single source of truth** for the database schema. Run all `prisma migrate` commands from here.

The api-gateway has its own `src/prisma/prisma.service.ts` (NestJS DI wrapper) but **no schema of its own** — it uses the `@prisma/client` package generated from `libs/database`.

**Database**: Supabase (PostgreSQL 15)
- `DATABASE_URL` — pooled via pgBouncer (port 6543) — used at runtime
- `DIRECT_URL` — direct connection (port 5432) — used by `prisma migrate` only

**Models**: Category, Product, User, Address, Order, OrderItem, Favorite
**Enums**: `UserRole` (customer, admin), `StockStatus` (in_stock, low_stock, out_of_stock), `OrderStatus`
**Latest migration**: `20260321_add_favorites` — adds `favorites` table (`userId` + `productId` unique constraint, cascade delete)

---

## Algerian Market Context

Bellat (CVA — Conserverie de Viandes d'Algérie) — B2C retail and B2B wholesale of halal meat products.

- **Bilingual**: French (LTR) and Arabic (RTL) — use `start`/`end` not `left`/`right` in Tailwind
- **Phone format**: `+213XXXXXXXXX` — validated with regex in backend DTOs
- **Currency**: DZD — no decimal places, format with `toLocaleString('fr-DZ')`
- **Wilayas**: 48 Algerian administrative divisions — full list in `web/app/[locale]/addresses/page.tsx`
- **Payment**: Cash on Delivery primary — `paymentMethod: "cash_on_delivery"`
- **Localization**: `new Intl.DateTimeFormat('ar-DZ' | 'fr-DZ', ...)`

---

## Key Standards

**Security**:
- Passwords: bcrypt cost factor 12
- JWT: HS256, 15-min access tokens, 7-day refresh tokens
- Rate limiting: 100 req/min per IP (ThrottlerGuard applied globally)
- Input validation: class-validator DTOs on all POST/PATCH endpoints

**API conventions**:
- Public endpoints: no auth header required
- Authenticated endpoints: `Authorization: Bearer <token>` (handled by `authFetch`)
- Admin endpoints: same JWT but decoded `role` must be `admin`
- Errors return `{ message: string | string[], statusCode: number }`

**Code Style**:
- TypeScript strict mode, avoid `any`
- Components: PascalCase files (`ProductCard.tsx`)
- NestJS services/guards: kebab-case files (`orders.service.ts`)
- Path alias in `/web`: `@/*` → web root (`@/components/...`, `@/lib/api`)
- Tailwind CSS 4: no `tailwind.config.js` — configured via `@tailwindcss/postcss` in `postcss.config.mjs`
- i18n: `next-intl` hooks only (`useTranslations`, `useLocale`) — never i18next
- Next.js 16 middleware: `proxy.ts` (not `middleware.ts`)

**Comments**: Add comments for business logic (Algerian-specific rules, RTL/LTR handling, state machine transitions, security decisions). Skip obvious code.

---

## Development Workflow

- **Branch naming**: `feat/description`, `fix/description`, `hotfix/description`
- **Commits**: Conventional commits (`feat(orders): add reorder endpoint`)
- **Environments**:
  - `localhost:3000` — web frontend (Next.js)
  - `localhost:3002` — API gateway (NestJS)
  - Supabase dashboard — production DB
- **Admin credentials**: `admin@bellat.net` / `demo123` — hits real backend; JWT role=admin required
- **Check `/TODO.md`** for full roadmap — Phase 1 (~33/35 done), Phase 2 (~31/32 done ✅), Phase 3 (~18/22 done)
- **New env vars** (api-gateway): `SENDGRID_API_KEY`, `MAIL_FROM`, `APP_URL` — added to `apps/api-gateway/.env`

## Out of Scope

Driver/Delivery Staff Mobile App is a separate initiative — delivery status updates are manual via Admin Dashboard.
