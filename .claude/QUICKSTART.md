# Bellat Platform — Quick Start Guide

**Last Updated:** March 18, 2026

---

## Prerequisites

```
Node.js >= 18.x
npm >= 9.x
Docker >= 24.x + Docker Compose >= 2.x
Git >= 2.x
```

**Recommended VS Code extensions:** ESLint, Prettier, Tailwind CSS IntelliSense, Prisma, i18n Ally, GitLens, Docker

---

## 1. Clone & Install

```bash
git clone https://github.com/rdjerrouf/bellat-platform.git
cd bellat-platform
cd web && npm install     # Install frontend dependencies
```

---

## 2. Start the Frontend (Active Now)

```bash
cd web
npm run dev               # http://localhost:3000 → redirects to /fr
```

**Test routes:**
- `http://localhost:3000/fr` — French homepage
- `http://localhost:3000/ar` — Arabic RTL homepage
- `http://localhost:3000/fr/products` — product listing
- `http://localhost:3000/fr/cart` — shopping cart
- `http://localhost:3000/admin` — admin (login: admin@bellat.net / demo123)

---

## 3. Infrastructure (when backend work begins)

```bash
# Start PostgreSQL 15 + Redis 7 + MinIO
docker-compose up -d

# Verify
docker-compose ps

# Access services
docker-compose exec postgres psql -U postgres -d bellat
docker-compose exec redis redis-cli
```

**Service ports:**
- PostgreSQL: `localhost:5432` (db: `bellat`, user: `postgres`, pw: `password`)
- Redis: `localhost:6379`
- MinIO: `localhost:9000` (API), `localhost:9001` (console) — user: `minioadmin`

---

## 4. Environment Variables

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

Key variables (see `.env.example` for full list):
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/bellat
REDIS_URL=redis://localhost:6379
JWT_SECRET=...
```

---

## 5. Database (when libs/database exists)

```bash
cd libs/database
npx prisma generate              # Generate client
npx prisma migrate dev           # Run migrations
npx prisma db seed               # Seed: 15 categories, sample products
npx prisma studio                # Open GUI at localhost:5555
```

**Reference schema:** `docs/schema-prototype.sql` (designed in prototype)

---

## 6. Future Backend (not yet scaffolded)

When NestJS apps are added under `apps/`:

```bash
# From repo root
npm run dev -w apps/api-gateway       # API Gateway (port 3002)
npm run dev -w apps/frontend          # Customer PWA (port 3000)
npm run dev -w apps/admin             # Admin dashboard (port 3001)
```

---

## Development Commands

```bash
# Frontend
cd web && npm run dev             # Dev server
cd web && npm run build           # Production build
cd web && npm run lint            # ESLint

# Root (Turbo)
npm run build                     # Build all packages
npm run lint                      # Lint all packages
npm run format                    # Prettier format
npm run type-check                # TypeScript check
```

---

## Git Workflow

**Branch naming:** `feat/description`, `fix/description`, `hotfix/description`

**Commit format (conventional commits):**
```
feat(auth): add JWT refresh token rotation
fix(cart): prevent negative quantities
feat(products): add category filter
```

**PR checklist:**
- [ ] TypeScript check passes (`npx tsc --noEmit` in `web/`)
- [ ] ESLint clean (`npm run lint`)
- [ ] Production build passes (`npm run build`)
- [ ] Both locales tested (`/fr/*` and `/ar/*`)

---

## Troubleshooting

**Port already in use:**
```bash
lsof -i :3000 && kill -9 <PID>
```

**Module not found after pulling:**
```bash
cd web && rm -rf node_modules && npm install
```

**Docker DB connection failed:**
```bash
docker-compose restart postgres
docker-compose logs postgres
```

**TypeScript errors after adding files:**
```bash
cd web && npx tsc --noEmit
```
