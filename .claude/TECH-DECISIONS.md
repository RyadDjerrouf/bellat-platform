# Technology Decisions

**Bellat Digital Ordering Platform**
**Last Updated:** March 21, 2026

---

## Stack in Use Today

| Layer | Technology | Version |
|---|---|---|
| Frontend | Next.js (App Router) | 16.1.1 |
| UI framework | React | 19.2.3 |
| Styling | Tailwind CSS | 4.x |
| i18n | next-intl | 4.7 |
| Icons | lucide-react | latest |
| Toasts | sonner | latest |
| Backend | NestJS | 10.x |
| ORM | Prisma | 5.x |
| Database | PostgreSQL 15 (Supabase) | 15.x |
| Auth | JWT HS256 | — |
| Node.js | — | 18 LTS |
| TypeScript | — | 5.x |

---

## Decisions Made During Prototype (vs. Original Plan)

| Original Plan | Actual Choice | Why Changed |
|---|---|---|
| Next.js 14 | **Next.js 16.1.1** | Used latest stable throughout prototype |
| React 18 | **React 19.2.3** | Next.js 16 ships with React 19 |
| Tailwind CSS 3 | **Tailwind CSS 4** | CSS-first config — no `tailwind.config.js` needed |
| i18next / next-i18next | **next-intl 4.7** | Better App Router support, cleaner locale routing |
| Zustand (cart state) | **React Context** | Sufficient for Phase 1; Zustand deferred to Phase 2 |
| Microservices (6 NestJS services) | **Single API gateway** | Simpler to ship; can extract services later if needed |
| RS256 JWT | **HS256 JWT** | Simpler for single-service setup; RS256 deferred to prod hardening |
| Redis for sessions | **In-memory Maps** | Lockout + reset tokens are ephemeral; Redis deferred to Phase 4 |
| Workbox (service worker) | **Custom sw.js** | Avoids extra dependency; cache-first + network-first patterns are simple enough |

---

## Frontend

### Next.js 16 (App Router)
- Server-side rendering for product catalog SEO
- `[locale]` dynamic segments for bilingual routing
- Built-in image optimization (WebP/AVIF)
- `proxy.ts` for middleware (Next.js 16 uses `proxy.ts`, not `middleware.ts`)

### Tailwind CSS 4
- CSS-first config: `@import "tailwindcss"` + `@theme` blocks in `globals.css`
- No `tailwind.config.ts` — configured via `@tailwindcss/postcss` in `postcss.config.mjs`
- Always use `start`/`end` (not `left`/`right`) for RTL support

### next-intl 4.7
- URL-based routing: `/fr/*` LTR and `/ar/*` RTL
- `proxy.ts` handles locale detection and redirects
- `useTranslations()` in client components, `getTranslations()` in server components
- Never use i18next — next-intl only

### State Management
- **CartContext** — React Context + localStorage (`bellat_cart`)
- **AuthContext** — JWT + refresh token, `bellat_token` / `bellat_refresh_token`
- **CheckoutContext** — sessionStorage for multi-step checkout
- Zustand deferred — React Context is sufficient until backend cart sync is needed

---

## Backend

### NestJS 10 (single API gateway)
- TypeScript-native, modular architecture
- Dependency injection makes services testable
- Built-in: auth guards, validation pipes, Swagger/OpenAPI at `/api/docs`
- Express adapter (Fastify deferred — Express is simpler for the team)

### Prisma 5 + PostgreSQL 15
- Schema-first ORM with auto-generated TypeScript types
- Single source of truth: `libs/database/prisma/schema.prisma`
- 7 models: Category, Product, User, Address, Order, OrderItem, Favorite
- JSONB for delivery address snapshot in orders
- pgBouncer pooling via Supabase (port 6543 for `DATABASE_URL`, port 5432 for `DIRECT_URL`)

### JWT HS256
- HS256 (symmetric) — simpler for single-service; RS256 planned for production hardening
- Access token: 15 min (`JWT_SECRET`)
- Refresh token: 7 days (`JWT_REFRESH_SECRET`)
- Auto-refresh on 401 via `authFetch()` wrapper in `web/lib/api.ts`

### Email — MailService (no extra npm package)
- Uses Node.js built-in `https` to call SendGrid v3 REST API directly
- Falls back to `console.log` when `SENDGRID_API_KEY=REPLACE_ME` (local dev)
- No `@sendgrid/mail` package — keeps dependencies minimal

---

## Security Decisions

| Concern | Solution |
|---|---|
| Passwords | bcrypt, cost factor 12 |
| JWT signing | HS256 (RS256 deferred to production hardening) |
| Access token TTL | 15 minutes |
| Refresh token TTL | 7 days |
| Rate limiting | 100 req/min per IP — ThrottlerGuard applied globally |
| Input validation | class-validator DTOs on all POST/PATCH endpoints |
| Account lockout | 5 failed logins → 15-min in-memory lock (Redis upgrade deferred) |

---

## Integrations

| Service | Status | Purpose |
|---|---|---|
| Supabase | ✅ Live | PostgreSQL 15 database hosting |
| SendGrid | ✅ Wired (key needed) | Password reset emails |
| Algerian SMS gateway | ⏳ Phase 4 | OTP + order status SMS |
| Firebase FCM | ⏳ Phase 4 | Push notifications |
| MinIO / S3 | ⏳ Phase 4 | Product image uploads |

---

## Deferred / Rejected

| Technology | Decision | Reason |
|---|---|---|
| GraphQL | Rejected | REST sufficient; simpler caching |
| MongoDB | Rejected | Relational data + ACID needed for B2B credit |
| Native mobile apps | Phase 2 | PWA sufficient for Phase 1; faster to ship |
| Zustand | Deferred | React Context works until backend cart sync needed |
| Redis | Deferred (Phase 4) | In-memory Maps sufficient for now; needed for OTP + distributed lockout |
| Workbox | Rejected | Custom `sw.js` is simpler and has no extra dependency |
| Microservices | Deferred | Single NestJS gateway ships faster; extract services if scaling needed |
| RS256 JWT | Deferred | HS256 fine for single-service; RS256 at production hardening |
