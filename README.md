# Bellat Digital Ordering Platform

A modern, bilingual e-commerce platform for **CVA (Conserverie de Viandes d'Algérie)**, serving B2C retail and B2B wholesale customers across Algeria.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Current Status — March 2026

| Layer | Status | Tech |
|---|---|---|
| Frontend `/web` | ✅ Prototype migrated, working | Next.js 16 + React 19 + Tailwind 4 |
| Bilingual routing | ✅ Live (`/fr/*`, `/ar/*`) | next-intl 4.7 |
| Cart + Checkout | ✅ Working (mock data) | React Context + localStorage |
| Admin dashboard | ✅ Display skeleton (mock login) | — |
| Backend microservices | ⏳ Not started | NestJS 10 (planned) |
| Database | ⏳ Not connected | PostgreSQL 15 + Prisma 5 (planned) |
| Infrastructure | ✅ Docker Compose ready | Postgres + Redis + MinIO |

**Target Launch:** Q2 2026

---

## Quick Start

```bash
# Frontend (active development)
cd web && npm install
cd web && npm run dev      # http://localhost:3000

# Infrastructure (when backend work begins)
docker-compose up -d       # PostgreSQL + Redis + MinIO
```

See [.claude/QUICKSTART.md](.claude/QUICKSTART.md) for full setup instructions.

---

## Architecture

### Monorepo Structure

```
bellat-platform/
├── web/               # ← Active: Next.js 16 frontend (prototype migrated)
├── apps/              # ← Future: NestJS microservices (api-gateway, auth, product, order, delivery, notification)
├── libs/              # ← Future: shared database/Prisma, types, common utilities
├── docs/              # Reference: schema-prototype.sql (database design)
├── docker-compose.yml # Local infrastructure: PostgreSQL + Redis + MinIO
├── .claude/           # Project documentation
└── CLAUDE.md          # Claude Code development guide
```

### Target Stack (Phase 1 complete vision)

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, next-intl (bilingual), Zustand
- **Backend:** NestJS 10 microservices, Prisma 5, PostgreSQL 15, Redis 7
- **Infrastructure:** Docker + Kubernetes, Cloudflare CDN, GitHub Actions CI/CD

---

## Working Features (frontend, mock data)

- **Bilingual routing** — `/fr/*` (French LTR) and `/ar/*` (Arabic RTL)
- **Home page** — hero banner, category grid, popular products
- **Product catalog** — listing, detail pages, 20+ products in 5 categories
- **Shopping cart** — add/remove, quantity, subtotal, localStorage persistence
- **4-step checkout** — address → delivery slot → review → confirmation
- **Admin dashboard** — `/admin` with mock login (admin@bellat.net / demo123)
- **Mobile-first** — bottom nav, responsive grids, 44px touch targets

---

## Documentation

| Document | Purpose |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Development guide for Claude Code sessions |
| [.claude/QUICKSTART.md](.claude/QUICKSTART.md) | Developer setup and commands |
| [.claude/SUMMARY.md](.claude/SUMMARY.md) | Project status and business rules reference |
| [.claude/project-initialization.md](.claude/project-initialization.md) | Full architecture, DB schema, API design |
| [.claude/TECH-DECISIONS.md](.claude/TECH-DECISIONS.md) | Why each technology was chosen |
| [TODO.md](TODO.md) | 110-task development roadmap |
| [docs/schema-prototype.sql](docs/schema-prototype.sql) | Database schema reference (from prototype) |

---

## Algerian Market Context

- **Bilingual:** Arabic (RTL) primary, French (LTR) secondary
- **Currency:** DZD (Algerian Dinar) — no decimal places
- **Delivery zones:** 48 Wilayas (administrative divisions)
- **Payment:** Cash on Delivery (~80%), B2B credit/invoicing
- **Phone format:** +213 + 9 digits

---

**Client:** Bellat Group (CVA) — Tessala-El-Merdja, Algeria — [bellat.net](https://bellat.net)

*"غذاؤك ترعاه أياد أمينة" (Your food is cared for by trustworthy hands)*
