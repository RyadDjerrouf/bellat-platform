# Technology Decisions

**Bellat Digital Ordering Platform**
**Last Updated:** March 18, 2026

---

## What's Actually in Use Today

The prototype (migrated into `/web`) established the actual frontend stack. Some decisions from the January 2026 planning phase were revised during prototype development:

| Original Plan | Actual Choice | Why Changed |
|---|---|---|
| Next.js 14 | **Next.js 16.1.1** | Used latest stable throughout prototype |
| React 18 | **React 19.2.3** | Next.js 16 ships with React 19 |
| Tailwind CSS 3 | **Tailwind CSS 4** | v4 CSS-first config is simpler, no config file needed |
| i18next / next-i18next | **next-intl 4.7** | Better App Router support, cleaner locale routing |
| Zustand (cart state) | **React Context** | Sufficient for prototype; Zustand planned for Phase 2 PWA |

---

## Frontend

### Next.js 16 (App Router)
- Server-side rendering for product catalog SEO
- App Router with `[locale]` dynamic segments for bilingual routing
- Built-in image optimization (WebP/AVIF, configured in `next.config.ts`)
- `proxy.ts` for middleware (Next.js 16 renamed `middleware.ts` → `proxy.ts`)

### React 19
- Ships with Next.js 16 — no separate version choice needed
- Server Components for product pages, Client Components for cart/checkout

### Tailwind CSS 4
- CSS-first config: `@import "tailwindcss"` + `@theme` blocks in `globals.css`
- No `tailwind.config.ts` — configuration lives in CSS
- Uses `@tailwindcss/postcss` plugin in `postcss.config.mjs`
- Use `start`/`end` instead of `left`/`right` for RTL support

### next-intl 4.7
- URL-based locale routing: `/fr/*` (French LTR) and `/ar/*` (Arabic RTL)
- `proxy.ts` handles locale detection and redirects
- `messages/fr.json` and `messages/ar.json` for translations
- `useTranslations()` in client components, `getTranslations()` in server components

### State Management (current)
- **CartContext** — React Context + `useReducer` + localStorage (`bellat_cart` key)
- **CheckoutContext** — React Context for 4-step checkout flow
- **Plan for Phase 2:** Zustand for authenticated cart synced to backend

---

## Backend (Planned — not yet built)

### NestJS 10
- TypeScript-native, modular microservices architecture
- Dependency injection makes services testable
- Built-in: auth guards, validation pipes, Swagger/OpenAPI
- Fastify adapter for better performance than Express

### Prisma 5 + PostgreSQL 15
- Schema-first ORM with auto-generated TypeScript types
- Single source of truth: `schema.prisma` → migrations → Prisma Client
- PostgreSQL pg_trgm for fuzzy full-text search (Arabic + French)
- JSONB for flexible data (product images, delivery addresses, nutritional info)
- **Reference schema:** `docs/schema-prototype.sql` (18 tables designed)

### Redis 7
- Cart persistence (Redis hash per user)
- JWT refresh token storage
- OTP codes with 10-minute TTL
- Rate limiting counters
- Pub/Sub between microservices

---

## Security Decisions

| Concern | Solution |
|---|---|
| Passwords | bcrypt, cost factor 12 |
| JWT signing | RS256 (asymmetric) |
| Access token TTL | 15 minutes |
| Refresh token TTL | 7 days |
| Rate limiting | 100 req/min public, 1,000 authenticated |
| Input validation | Zod (frontend), class-validator (NestJS) |
| Session storage | httpOnly cookies (XSS protection) |

---

## Infrastructure (Planned)

### Docker + Kubernetes
- Docker Compose for local dev (Postgres + Redis + MinIO) — **already configured**
- Kubernetes for staging/production (auto-scaling for Ramadan/Eid peaks)

### Cloudflare
- CDN, WAF, DDoS protection, free SSL
- Good MENA coverage for Algeria latency

### GitHub Actions
- CI: lint + type-check + build on every PR
- CD: auto-deploy to staging on merge, manual approval for production

---

## Integrations (Planned for Phase 4)

| Service | Purpose |
|---|---|
| Firebase FCM | Push notifications (web + future mobile) |
| SendGrid | Transactional email (order confirmation, invoices) |
| Algerian SMS gateway | OTP + order status SMS (Mobilis/Djezzy/Ooredoo) |
| MinIO (local) / S3 (prod) | Product images, uploaded documents |

---

## Rejected / Deferred

| Technology | Decision | Reason |
|---|---|---|
| GraphQL | Rejected | REST sufficient; simpler caching |
| MongoDB | Rejected | Relational data + ACID needed for B2B credit |
| Native mobile apps | Phase 2 | PWA sufficient for Phase 1; faster to ship |
| Zustand (Phase 1) | Deferred | React Context works for prototype; add when backend sync needed |
| Server-Sent Events | Rejected | WebSockets better for bidirectional order updates |

---

## Version Lock

| Technology | Version |
|---|---|
| Node.js | 18 LTS |
| Next.js | 16.1.1 |
| React | 19.2.3 |
| Tailwind CSS | 4.x |
| next-intl | 4.7.0 |
| NestJS | 10.x (planned) |
| Prisma | 5.x (planned) |
| PostgreSQL | 15.x |
| Redis | 7.x |
| TypeScript | 5.x |

**Policy:** Minor updates allowed (security patches). Major updates require team discussion.
