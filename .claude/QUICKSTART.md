# Bellat Platform — Quick Start Guide

**Last Updated:** March 21, 2026

---

## Prerequisites

```
Node.js >= 18.x
npm >= 9.x
Git >= 2.x
```

**Recommended VS Code extensions:** ESLint, Prettier, Tailwind CSS IntelliSense, Prisma, i18n Ally, GitLens

---

## 1. Clone & Install

```bash
git clone https://github.com/rdjerrouf/bellat-platform.git
cd bellat-platform
cd web && npm install                       # Frontend deps
cd ../apps/api-gateway && npm install       # Backend deps
```

---

## 2. Environment Variables

**Backend** — `apps/api-gateway/.env` (already committed with dev defaults):
```env
PORT=3002
DATABASE_URL="..."          # Supabase pooled connection
DIRECT_URL="..."            # Supabase direct connection (migrations only)
JWT_SECRET="..."
JWT_REFRESH_SECRET="..."
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
CORS_ORIGINS="http://localhost:3000"
SENDGRID_API_KEY="REPLACE_ME"   # Set real key for password reset emails
MAIL_FROM="noreply@bellat.dz"
APP_URL="http://localhost:3000"
```

**Frontend** — `web/.env.local` (create if missing):
```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

---

## 3. Start the Backend

```bash
cd apps/api-gateway
npm run dev       # NestJS on http://localhost:3002
```

Swagger API docs: `http://localhost:3002/api/docs`

---

## 4. Start the Frontend

```bash
cd web
npm run dev       # Next.js on http://localhost:3000 → redirects to /fr
```

**Key routes:**
- `http://localhost:3000/fr` — French homepage
- `http://localhost:3000/ar` — Arabic RTL homepage
- `http://localhost:3000/fr/products` — product listing
- `http://localhost:3000/fr/recipes` — recipe pages
- `http://localhost:3000/admin` — admin dashboard (login: `admin@bellat.net` / `demo123`)

---

## 5. Database

The database is **Supabase** (cloud PostgreSQL 15) — already provisioned and seeded. No local Docker needed for day-to-day development.

```bash
cd libs/database
npx prisma studio        # Browse DB at localhost:5555
npx prisma generate      # Regenerate client after schema changes
npx prisma migrate dev   # Create + apply a new migration (uses DIRECT_URL)
npx prisma db seed       # Re-seed categories + products
```

**Local Docker** (optional — for fully offline dev):
```bash
docker-compose up -d     # PostgreSQL + Redis + MinIO
# Then update DATABASE_URL in both .env files to use localhost:5432
```

---

## 6. Production Build Check

```bash
# Frontend
cd web && npm run build && npm run lint

# Backend
cd apps/api-gateway && npm run build && npm run lint
```

---

## Troubleshooting

**Port already in use:**
```bash
lsof -i :3000 && kill -9 <PID>
lsof -i :3002 && kill -9 <PID>
```

**Module not found after pulling:**
```bash
cd web && rm -rf node_modules && npm install
cd apps/api-gateway && rm -rf node_modules && npm install
```

**Prisma client out of sync after schema change:**
```bash
cd libs/database && npx prisma generate
```

**TypeScript errors:**
```bash
cd web && npx tsc --noEmit
cd apps/api-gateway && npm run build
```

**JWT 401 in browser:**
- Check `NEXT_PUBLIC_API_URL` in `web/.env.local`
- Ensure backend is running on port 3002
- Clear localStorage (`bellat_token`, `bellat_refresh_token`) and re-login

---

## Git Workflow

**Branch naming:** `feat/description`, `fix/description`, `hotfix/description`

**Commit format (conventional commits):**
```
feat(auth): add Google OAuth integration
fix(cart): prevent negative quantities
feat(recipes): add add-all-to-cart button
```

**PR checklist:**
- [ ] TypeScript check passes (`npx tsc --noEmit` in `web/`)
- [ ] ESLint clean (`npm run lint`)
- [ ] Production build passes (`npm run build`)
- [ ] Both locales tested (`/fr/*` and `/ar/*`)
- [ ] New DB models: `prisma migrate dev` run and migration committed
