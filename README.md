# Bellat Digital Ordering Platform

A modern, bilingual e-commerce platform for **CVA (Conserverie de Viandes d'Algérie)**, serving B2C retail and B2B wholesale customers across Algeria.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Current Status — March 2026

| Layer | Status | Notes |
|---|---|---|
| Frontend `/web` | ✅ Live | Next.js 16 + React 19 + Tailwind 4 — all pages wired to real API |
| Bilingual routing | ✅ Live | `/fr/*` (French LTR) and `/ar/*` (Arabic RTL) via next-intl 4.7 |
| Backend API | ✅ Live | NestJS 10 on port 3002 — auth, products, orders, inventory, analytics, favorites |
| Database | ✅ Live | Supabase (PostgreSQL 15) + Prisma 5 — 7 models, migrations applied |
| Admin dashboard | ✅ Live | Full JWT auth, orders + products + inventory + customers + analytics |
| PWA | ✅ Live | Service worker, manifest, icons, offline fallback page |
| Email | ✅ Partial | Password reset via SendGrid (set `SENDGRID_API_KEY` in `.env`) |
| CI/CD | ⏳ Not started | GitHub Actions planned |
| Delivery zones | ⏳ Deferred | Per-wilaya fee config (Phase 1.9) |
| SMS / Push | ⏳ Blocked | Phase 4 — Algerian SMS gateway + FCM |

**Target Launch:** Q2 2026

---

## Quick Start

```bash
# 1. Frontend
cd web && npm install
cd web && npm run dev          # http://localhost:3000 → /fr

# 2. Backend
cd apps/api-gateway && npm install
cd apps/api-gateway && npm run dev   # http://localhost:3002

# 3. Database (Supabase — already configured, no local Docker needed)
cd libs/database && npx prisma studio   # browse data
```

See [CLAUDE.md](CLAUDE.md) for all commands, architecture details, and dev standards.

---

## Architecture

```
bellat-platform/
├── web/                # Next.js 16 frontend (customer shop + admin dashboard)
├── apps/
│   └── api-gateway/    # NestJS 10 REST API (port 3002)
├── libs/
│   └── database/       # Prisma schema + migrations (source of truth for DB)
├── docs/               # Reference docs
└── CLAUDE.md           # Development guide (architecture, patterns, standards)
```

**Stack:**
- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, next-intl 4.7, lucide-react, sonner
- **Backend:** NestJS 10, Prisma 5, JWT HS256, bcrypt, class-validator, @nestjs/swagger
- **Database:** Supabase (PostgreSQL 15) — pooled via pgBouncer
- **Infrastructure:** Docker Compose (local dev), Kubernetes (planned prod)

---

## Live Features

**Customer:**
- Bilingual shop (`/fr/*`, `/ar/*`) — products, categories, search
- Cart (localStorage) → checkout → real orders (`BLT-YYYYMMDD-NNNNN`)
- Order history with status filter + tracking timeline + cancel/reorder
- Profile, saved addresses (full CRUD + inline edit), favorites
- Password recovery (email link via SendGrid)
- Recipes page — 6 bilingual recipes with "add all Bellat products to cart"
- PWA — installable, offline fallback page

**Admin (`/admin`):**
- Login with `admin@bellat.net` / `demo123` (real JWT, role=admin)
- Orders — list, detail, advance status, search, date range + status filters
- Products — list, create, edit, deactivate, stock management
- Inventory — stock levels, alerts, batch update, search
- Customers — searchable list
- Analytics — KPI cards, daily revenue chart, top products, 7/30/90d presets

---

## Documentation

| Document | Purpose |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Development guide — architecture, patterns, all commands |
| [TODO.md](TODO.md) | Full roadmap with per-task acceptance criteria |
| [.claude/QUICKSTART.md](.claude/QUICKSTART.md) | New developer setup guide |
| [.claude/TECH-DECISIONS.md](.claude/TECH-DECISIONS.md) | Why each technology was chosen |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Branch naming, commit style, PR process |
| [docs/schema-prototype.sql](docs/schema-prototype.sql) | Original DB schema reference |

---

## Algerian Market Context

- **Bilingual:** Arabic (RTL) and French (LTR) — use `start`/`end` not `left`/`right` in Tailwind
- **Currency:** DZD — no decimal places, format with `toLocaleString('fr-DZ')`
- **Delivery zones:** 48 Wilayas (administrative divisions)
- **Payment:** Cash on Delivery primary — `paymentMethod: "cash_on_delivery"`
- **Phone format:** `+213XXXXXXXXX`

---

**Client:** Bellat Group (CVA) — Tessala-El-Merdja, Algeria — [bellat.net](https://bellat.net)

*"غذاؤك ترعاه أياد أمينة" — Your food is cared for by trustworthy hands*
