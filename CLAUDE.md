# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build, Test, and Lint Commands

```bash
# Active frontend (Next.js in /web — only working app right now)
cd web && npm run dev          # Start dev server (port 3000)
cd web && npm run build        # Production build
cd web && npm run lint         # ESLint

# Root monorepo (uses Turbo — backends not yet scaffolded)
npm run build                  # Build all apps/libs
npm run lint                   # Lint all packages
npm run format                 # Prettier format all files
npm run format:check           # Check formatting
npm run type-check             # TypeScript check

# Database (Prisma — once libs/database exists)
cd libs/database && npx prisma generate      # Generate Prisma client
cd libs/database && npx prisma migrate dev   # Run migrations
cd libs/database && npx prisma studio        # Open Prisma Studio GUI
cd libs/database && npx prisma db seed       # Seed database

# Docker infrastructure
docker-compose up -d           # Start PostgreSQL + Redis + MinIO
docker-compose down            # Stop all services
docker-compose logs -f postgres # View postgres logs
```

## Architecture Overview

**Monorepo Structure** (npm workspaces + Turbo):
- `/web/` — Next.js 16 frontend (active development, fully working)
- `/apps/` — Future NestJS microservices (empty, not yet scaffolded)
- `/libs/` — Future shared code: database/Prisma, types, utilities (empty)
- `/docs/` — Reference docs including `schema-prototype.sql` (DB design)
- `/docker/` and `/k8s/` — Infrastructure placeholders

**Current State**: The prototype from `bellat-prototype` has been fully migrated into `/web`. It is a working bilingual e-commerce frontend with mock data. Backend microservices in `/apps/` have not been started.

**Active tech stack in `/web`**:
- Next.js 16.1.1 (App Router), React 19, Tailwind CSS 4, TypeScript strict
- next-intl 4.7.0 for bilingual routing (`/fr/*`, `/ar/*`)
- lucide-react, sonner, date-fns, clsx, @radix-ui/react-label
- Context API (CartContext, CheckoutContext) + localStorage persistence
- Mock data in `public/data/` (products.json, categories.json, mock-orders.json)
- No real backend or database yet — all data is static JSON

**`/web` directory layout**:
```
web/
├── app/
│   ├── [locale]/      # Bilingual customer-facing routes (fr/ar)
│   │   ├── page.tsx           # Home (HeroSection, CategoryGrid, PopularProducts)
│   │   ├── products/          # Listing + [id] detail pages
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # 4-step checkout (address, delivery, review, success)
│   │   ├── search/            # Search results
│   │   └── layout.tsx         # Locale layout (sets dir="rtl" for Arabic)
│   ├── admin/                 # Admin dashboard (mock login, display-only)
│   └── layout.tsx             # Root pass-through layout
├── components/        # home/, products/, checkout/, cart/, layout/, ui/
├── context/           # CartContext.tsx, CheckoutContext.tsx
├── types/             # product.ts, category.ts, order.ts, cart.ts
├── lib/               # Data loading utilities
├── public/data/       # products.json, categories.json, mock-orders.json
├── messages/          # fr.json, ar.json (50+ translation keys each)
├── i18n.ts            # next-intl request config
├── proxy.ts           # next-intl middleware (Next.js 16: proxy.ts, not middleware.ts)
└── next.config.ts     # withNextIntl + image optimization
```

**Target Backend Stack** (not yet started):
- NestJS 10 microservices: api-gateway, auth, product, order, delivery, notification
- PostgreSQL 15 + Prisma 5, Redis 7, Docker + Kubernetes
- Schema reference: `docs/schema-prototype.sql`

## Algerian Market Context

This is an e-commerce platform for Bellat (CVA - Conserverie de Viandes d'Algérie), serving B2C retail and B2B wholesale customers:

- **Bilingual**: Arabic (RTL) primary, French (LTR) secondary — use `start`/`end` not `left`/`right` in Tailwind
- **Phone format**: +213 with 10 digits (e.g., +213 555 123 456)
- **Currency**: DZD (Algerian Dinar) — no decimal places
- **Wilayas**: 48 administrative divisions (codes 1-48) for delivery zones
- **Payment**: Cash on Delivery is primary (~80%), B2B gets credit terms
- **Localization**: Use `Intl.DateTimeFormat` with `ar-DZ` / `fr-DZ`

## Key Standards

**API Response Format** (for future backend):
```typescript
// Success: { success: true, data: {...}, message: "..." }
// Error: { success: false, error: { code: "ERROR_CODE", message: "...", details: {...} } }
```

**Security** (for future backend):
- Passwords: bcrypt cost factor 12
- JWT: RS256, 15-min access tokens, 7-day refresh tokens
- Rate limiting: 100 req/min public, 1000 authenticated
- Input validation: Zod schemas for all API inputs

**Code Style**:
- TypeScript strict mode, avoid `any`
- Components: PascalCase files (`ProductCard.tsx`)
- Services/utils: kebab-case files (`product.service.ts`)
- Tests: `*.spec.ts` for unit, `*.e2e-spec.ts` for E2E (no test framework configured yet — planned with NestJS/Jest)
- Path alias in `/web`: `@/*` resolves to the web root (e.g., `@/components/...`, `@/app/...`)
- Tailwind CSS 4: configured via `@tailwindcss/postcss` in `postcss.config.mjs` — no `tailwind.config.js`
- i18n in `/web`: use `next-intl` hooks (`useTranslations`) and server functions — not i18next
- Next.js 16 middleware convention: use `proxy.ts` (not `middleware.ts`)

**Comments**: Add comments for business logic (especially Algerian-specific rules), complex algorithms, RTL/LTR handling, and security decisions. Skip obvious code.

## Development Workflow

- **Branch naming**: `feat/description`, `fix/description`, `hotfix/description`
- **Commits**: Follow conventional commits (`feat(auth): add JWT refresh`)
- **Environments**: localhost:3000 (web/frontend), localhost:3001 (admin — future), localhost:3002 (API — future)
- **Check `/TODO.md`** for current roadmap (110 tasks across 6 phases, Phase 0 complete)
- **Admin demo credentials**: admin@bellat.net / demo123 (mock only — no real auth)

## Out of Scope

Driver/Delivery Staff Mobile App is a separate initiative — delivery status updates are manual via Admin Dashboard in Phase 1.
