# 📋 Bellat Digital Ordering Platform - Development Roadmap

**Status:** 🟡 Phase 1 + Phase 2 + Phase 3 In Progress | **Next:** Delivery zones, Notifications, PWA/offline, B2B features
**Last Updated:** March 20, 2026
**Target Launch:** Q2 2026

---

## 📊 Progress Overview

| Phase | Status | Progress | Notes |
|-------|--------|----------|-------|
| Phase 0: Foundation | ✅ Done | Core done | Monorepo + Docker + frontend prototype migrated |
| Phase 1: Backend | 🟡 In Progress | ~26/32 tasks | Auth+refresh, Products, Orders+reorder, Inventory, Users/Addresses, Analytics done; Delivery+Notifications next |
| Phase 2: Frontend | 🟡 In Progress | ~28/30 tasks | Order detail page, checkout→saved addresses, profile, addresses, header dropdown, all API wired; PWA/offline next |
| Phase 3: Admin | 🟡 In Progress | ~13/18 tasks | Real auth, dashboard, orders+detail, products+create/edit/delete, inventory, customers list, analytics done |
| Phase 4: Integrations | ⏸️ Blocked | 0/12 tasks | SMS, email, push |
| Phase 5: QA & Launch | ⏸️ Blocked | 0/16 tasks | — |

**Phase 2 detail:** UI + API fully wired. All customer pages live against real backend. Order detail/tracking page done (5-step timeline). Checkout → saved addresses done. Remaining: PWA/service worker, recipe pages.

---

## 🏗️ Phase 0: Foundation & Infrastructure ✅ Complete

**Goal:** Set up development, staging, and production environments
**Status:** Core tasks complete — cloud/CI-CD still pending
**Owner:** DevOps + Tech Lead

### ✅ Completed
- [x] Monorepo structure (Turbo + npm workspaces)
- [x] Docker Compose (PostgreSQL 15 + Redis 7 + MinIO)
- [x] Frontend prototype migrated to `/web` (Next.js 16, bilingual, cart, checkout, admin)
- [x] Database schema designed (`docs/schema-prototype.sql`)

### Still Needed

### 0.1 Cloud Infrastructure Setup

- [ ] **Provision VPS/Cloud Resources** `[DevOps]` `[M]`
  - [ ] Set up production Kubernetes cluster (3 nodes minimum)
  - [ ] Set up staging Kubernetes cluster (2 nodes)
  - [ ] Configure auto-scaling policies (CPU > 80%, Memory > 85%)
  - [ ] Set up load balancers (Nginx Ingress Controller)
  - **Acceptance:** `kubectl get nodes` shows all nodes Ready

- [ ] **Database Infrastructure** `[DevOps]` `[L]`
  - [ ] Provision PostgreSQL 15 (production: 2 vCPU, 4GB RAM)
  - [ ] Set up read replicas (1 replica minimum)
  - [ ] Configure automated backups (every 6 hours, 30-day retention)
  - [ ] Enable connection pooling (PgBouncer)
  - **Acceptance:** Database accessible, backups running, replication lag < 1s

- [ ] **Redis Cluster** `[DevOps]` `[M]`
  - [ ] Set up Redis 7 cluster (3 nodes)
  - [ ] Configure persistence (RDB + AOF)
  - [ ] Set up Redis Sentinel for high availability
  - **Acceptance:** `redis-cli cluster info` shows healthy cluster

- [ ] **Object Storage (S3-compatible)** `[DevOps]` `[S]`
  - [ ] Set up MinIO or cloud S3
  - [ ] Create buckets: `bellat-products`, `bellat-uploads`, `bellat-backups`
  - [ ] Configure bucket policies (public read for products)
  - **Acceptance:** Files uploadable, public URLs accessible

### 0.2 CI/CD Pipeline

- [ ] **GitHub Actions Workflow** `[DevOps]` `[L]`
  - [ ] Create `.github/workflows/ci.yml` (lint, test, build)
  - [ ] Create `.github/workflows/cd-staging.yml` (auto-deploy to staging)
  - [ ] Create `.github/workflows/cd-production.yml` (manual approval)
  - [ ] Set up Docker registry (GitHub Container Registry or private)
  - **Acceptance:** PR triggers CI, staging auto-deploys on merge to `develop`

- [ ] **Secrets Management** `[DevOps]` `[M]`
  - [ ] Set up secrets in GitHub Actions
  - [ ] Configure Kubernetes secrets
  - [ ] Set up secret rotation policy
  - **Acceptance:** No secrets in code, all env vars from vault

### 0.3 Monitoring & Logging

- [ ] **Prometheus + Grafana** `[DevOps]` `[L]`
  - [ ] Deploy Prometheus in Kubernetes
  - [ ] Deploy Grafana with pre-configured dashboards
  - [ ] Set up alerting rules (API errors, high latency, pod crashes)
  - [ ] Configure PagerDuty/email alerts
  - **Acceptance:** Grafana accessible, alerts triggering on test failures

- [ ] **ELK Stack (Logging)** `[DevOps]` `[L]`
  - [ ] Deploy Elasticsearch cluster
  - [ ] Deploy Logstash for log aggregation
  - [ ] Deploy Kibana for visualization
  - [ ] Configure log retention (30 days)
  - **Acceptance:** Application logs visible in Kibana

### 0.4 Security Baseline

- [ ] **SSL/TLS Configuration** `[DevOps]` `[S]`
  - [ ] Configure Cloudflare (or Let's Encrypt)
  - [ ] Enable TLS 1.3 only
  - [ ] Configure HTTPS redirects
  - **Acceptance:** SSL Labs A+ rating

- [ ] **WAF Configuration** `[DevOps]` `[M]`
  - [ ] Enable Cloudflare WAF
  - [ ] Configure rate limiting rules
  - [ ] Set up DDoS protection
  - **Acceptance:** Rate limits tested, DDoS simulation passed

### 0.5 Monorepo Setup

- [x] **Initialize Monorepo** `[Tech Lead]` `[M]` ✅ Done
  - [x] Set up Turborepo
  - [x] Configure workspace packages (`apps/*`, `libs/*`)
  - [x] Set up shared TypeScript config
  - [x] Configure build pipeline (turbo.json)

**Phase 0 Remaining Deliverables:**
- [ ] Production & staging environments live
- [ ] CI/CD pipeline functional
- [ ] Monitoring dashboards accessible
- [ ] All secrets managed securely

---

## 💻 Phase 1: Core Backend Development (Week 3-8)

**Goal:** Build microservices foundation and core APIs
**Prerequisites:** Phase 0 complete
**Owner:** Backend Team (2 developers)

### 1.1 Shared Libraries & Database

- [x] **Prisma Schema Definition** `[Backend Lead]` `[L]` ✅ Done
  - [x] Define core tables (users, products, categories, orders, order_items, addresses)
  - [x] Add indexes (unique, foreign key, query optimization)
  - [ ] Add full-text search indexes (pg_trgm) — deferred to 1.4 Product Service
  - [x] Write seed script (categories + sample products in `libs/database/prisma/seed.ts`)
  - [x] `prisma migrate dev` runs — migration applied to Supabase
  - **Note:** 6 core tables implemented (simplified from 18 in prototype SQL — enough for Phase 1)
  - **Reference:** `libs/database/prisma/schema.prisma`

- [ ] **Common Library** `[Backend]` `[M]`
  - [ ] Create `@bellat/common` package
  - [ ] Implement guards (AuthGuard, RolesGuard)
  - [ ] Implement decorators (@CurrentUser, @Roles)
  - [ ] Implement pipes (ValidationPipe)
  - [ ] Implement filters (HttpExceptionFilter)
  - **Acceptance:** All microservices can import and use

- [ ] **Types Library** `[Backend]` `[S]`
  - [ ] Create `@bellat/types` package
  - [ ] Define all TypeScript interfaces (User, Product, Order, etc.)
  - [ ] Export shared enums (OrderStatus, UserType, etc.)
  - **Acceptance:** Types used across frontend and backend

### 1.2 API Gateway

- [x] **Gateway Setup** `[Backend]` `[M]` ✅ Done
  - [x] Create NestJS API Gateway application (`apps/api-gateway`, port 3002)
  - [x] Configure routing to microservices
  - [x] Implement rate limiting (100 req/min via ThrottlerModule, global guard)
  - [x] Add CORS configuration (localhost:3000, localhost:3001 whitelisted)
  - [x] Add request logging middleware
  - **Acceptance:** ✅ Gateway running, health check at GET `/api/health`
  - **Requirement:** NFR-SEC-005 (Rate limiting)

- [x] **OpenAPI Documentation** `[Backend]` `[S]` ✅ Done
  - [x] Set up Swagger/OpenAPI 3.0 (via `@nestjs/swagger`)
  - [x] Auto-generate API docs from decorators
  - [x] Accessible at `/api/docs` — BearerAuth configured
  - **Acceptance:** ✅ Verified — all endpoints documented at http://localhost:3002/api/docs

### 1.3 Auth Service

- [~] **JWT Authentication** `[Backend]` `[L]` 🟡 Partial
  - [x] Implement JWT strategy (HS256 — RS256 deferred to production hardening)
  - [x] Implement token generation (15m access, 7d refresh)
  - [x] Implement token refresh endpoint (`POST /api/auth/refresh`) — returns new access token
  - [x] Frontend auto-refresh on 401 (`authFetch` wrapper + `tryRefresh` in `web/lib/api.ts`)
  - [ ] Implement session storage in Redis
  - [ ] Add account lockout (5 failed attempts)
  - **Acceptance:** ✅ Login returns JWT + refresh token, `JwtAuthGuard` protects routes, 401s auto-refresh
  - **Requirements:** FR-AUTH-002, NFR-SEC-003

- [x] **Registration & Login** `[Backend]` `[M]` ✅ Done
  - [x] POST `/api/auth/register` (fullName, email, phoneNumber?, password)
  - [x] POST `/api/auth/login` (email + password)
  - [x] Password hashing with bcrypt (cost factor 12)
  - [x] Input validation (phone: +213XXXXXXXXX, email format, password ≥8 chars)
  - [x] Conflict errors (duplicate email/phone) return 409 — not 500
  - **Acceptance:** ✅ Tested end-to-end — register, login, duplicate detection all verified
  - **Requirements:** FR-AUTH-001

- [ ] **OTP Verification** `[Backend]` `[M]`
  - [ ] POST `/auth/otp/send` (generate 6-digit OTP)
  - [ ] POST `/auth/otp/verify` (validate OTP)
  - [ ] Store OTP in Redis (10-minute TTL)
  - [ ] Integrate with Algerian SMS gateway
  - [ ] Rate limit OTP requests (3 per phone per hour)
  - **Acceptance:** OTP sent via SMS, verified successfully
  - **Requirements:** FR-AUTH-001.1, AUTH-001

- [ ] **OAuth Integration** `[Backend]` `[L]`
  - [ ] Google OAuth 2.0 (Passport strategy)
  - [ ] Facebook Login (Passport strategy)
  - [ ] Link OAuth accounts to existing users
  - [ ] Handle new user creation from OAuth
  - **Acceptance:** Users can login with Google/Facebook
  - **Requirements:** FR-AUTH-001.3, FR-AUTH-001.4

- [ ] **Password Recovery** `[Backend]` `[M]`
  - [ ] POST `/auth/password/reset` (send reset link/OTP)
  - [ ] POST `/auth/password/confirm` (set new password)
  - [ ] Invalidate all sessions on password change
  - **Acceptance:** Users can reset forgotten passwords
  - **Requirements:** FR-AUTH-003

- [ ] **B2B Registration Workflow** `[Backend]` `[L]`
  - [ ] B2B registration endpoint (requires business docs)
  - [ ] File upload for documents (RC, NIF, Attestation)
  - [ ] Store B2B status as PENDING
  - [ ] Send notification to admins for approval
  - **Acceptance:** B2B users can register, docs uploaded
  - **Requirements:** FR-AUTH-005

### 1.4 Product Service

- [x] **Product CRUD** `[Backend]` `[M]` ✅ Done
  - [x] GET `/api/products` (list with pagination + category/stockStatus/search filters)
  - [x] GET `/api/products/:id` (product details with category)
  - [x] POST `/api/admin/products` (create — admin JWT required)
  - [x] PUT `/api/admin/products/:id` (update — admin JWT required)
  - [x] DELETE `/api/admin/products/:id` (soft delete — sets isActive=false)
  - [x] RolesGuard + @Roles decorator for admin access control
  - **Acceptance:** ✅ All routes tested — 401/403 correctly enforced, soft delete hides from public

- [x] **Category Management** `[Backend]` `[S]` ✅ Done
  - [x] GET `/api/categories` (list all seeded categories)
  - [x] GET `/api/categories/:id/products` (products by category, paginated)
  - **Note:** Brands not in current schema (deferred — not a Bellat requirement for Phase 1)

- [~] **Full-Text Search** `[Backend]` `[L]` 🟡 Partial
  - [x] GET `/api/products?q=<query>` — ILIKE search on nameFr + nameAr
  - [ ] PostgreSQL FTS with pg_trgm (fuzzy matching / typo tolerance)
  - [ ] Arabic transliteration support
  - [ ] Autocomplete endpoint
  - **Note:** Basic ILIKE search is live; pg_trgm upgrade deferred to Phase 1 polish

- [ ] **Variant Management** `[Backend]` `[M]`
  - [ ] Support multiple variants per product (weight, pack size)
  - [ ] Independent pricing (retail_price, b2b_price)
  - [ ] Stock tracking per variant
  - **Note:** Current schema has single price + stockStatus per product — variants deferred

- [x] **Filtering & Sorting** `[Backend]` `[M]` ✅ Done
  - [x] Filter by category, stockStatus, search query
  - [x] Paginated results with meta (total, page, totalPages)
  - [ ] Sort by: popularity, price, newest — deferred (defaulting to createdAt desc)

### 1.5 Order Service

- [~] **Cart Management** `[Backend]` `[L]` 🟡 Deferred
  - [ ] Backend cart (Redis + PostgreSQL) — deferred; frontend uses localStorage cart (React Context) which is fully working
  - [ ] Merge guest cart on login — deferred
  - **Note:** Checkout accepts items array directly — no separate cart API needed for Phase 1

- [x] **Checkout Flow** `[Backend]` `[XL]` ✅ Done
  - [x] POST `/api/orders` — create order from items array
  - [x] Validate all products exist and are not out_of_stock
  - [x] Calculate delivery fee by wilaya (500 DZD Alger / 800 DZD other)
  - [x] Generate unique order number: `BLT-YYYYMMDD-NNNNN`
  - [x] Price snapshot (priceAtPurchase) captured at order time
  - **Acceptance:** ✅ Tested — BLT-20260321-00001 created, subtotal/fee/total correct
  - **Note:** Slot surcharge + min order amount deferred to delivery zone config (1.7)

- [x] **Order Lifecycle** `[Backend]` `[L]` ✅ Done
  - [x] State machine: pending → confirmed → preparing → out_for_delivery → delivered
  - [x] PATCH `/api/admin/orders/:id/status` (validated transitions)
  - [x] Invalid transitions return 400 with allowed states listed
  - **Acceptance:** ✅ Tested — bad transitions blocked (confirmed → delivered = 400)

- [x] **Order History & Tracking** `[Backend]` `[M]` ✅ Done
  - [x] GET `/api/orders` — user's order history with status filter + pagination
  - [x] GET `/api/orders/:id` — order details with items + product info
  - [x] Users can only access their own orders (ForbiddenException on mismatch)
  - **Acceptance:** ✅ Tested end-to-end

- [x] **Order Cancellation** `[Backend]` `[M]` ✅ Done
  - [x] PATCH `/api/orders/:id/cancel` — cancels only if status = pending
  - [x] Clear error message when cancelling a non-pending order
  - **Acceptance:** ✅ Tested — double-cancel returns 400

- [x] **Reordering** `[Backend]` `[S]` ✅ Done
  - [x] POST `/api/orders/:id/reorder` — clones previous order at current prices
  - [x] Validates stock availability for all items (reuses `create()` logic)
  - [x] Prices updated to current catalog pricing (not historical snapshot)
  - [ ] Notify of unavailable items — deferred (throws 422 if item unavailable)
  - **Acceptance:** ✅ Backend done; frontend has "Recommander" button on delivered/cancelled orders
  - **Requirements:** FR-ORD-005

- [ ] **B2B Credit Management** `[Backend]` `[M]`
  - [ ] Check credit limit before placing invoice order
  - [ ] Increment credit_used on invoice order
  - [ ] Decrement credit_used when marked PAID
  - [ ] Reject orders exceeding credit limit
  - **Acceptance:** B2B credit limits enforced
  - **Requirements:** FR-CART-003, B2B-003, B2B-004

### 1.6 Inventory Service

- [x] **Stock Management** `[Backend]` `[M]` ✅ Done
  - [x] GET `/api/admin/inventory` (view stock levels, paginated, with summary counts)
  - [x] PATCH `/api/admin/inventory/:id` (manual stockStatus adjustment)
  - [x] POST `/api/admin/inventory/batch` (batch update via Prisma transaction)
  - [x] GET `/api/admin/inventory/alerts` (low_stock + out_of_stock report)
  - [ ] Log all stock changes (audit trail) — deferred
  - **Acceptance:** ✅ Stock levels visible and adjustable via admin UI
  - **Requirements:** FR-INV-001

- [ ] **Stock Alerts** `[Backend]` `[S]`
  - [ ] Monitor stock levels (cron job every hour) — deferred
  - [ ] Auto-hide products when stock = 0 — deferred
  - [ ] "Notify me when available" subscription — deferred
  - **Acceptance:** Low stock alerts sent to admins
  - **Requirements:** FR-INV-002

- [ ] **Batch Import** `[Backend]` `[M]`
  - [ ] POST `/admin/inventory/import` (CSV/Excel upload) — deferred
  - **Acceptance:** Stock imported from CSV successfully
  - **Requirements:** FR-INV-001.2

### 1.7 User Profile & Address Service

- [x] **User Profile** `[Backend]` `[M]` ✅ Done
  - [x] GET `/api/users/me` — return current user's profile (id, fullName, email, phoneNumber, role, createdAt)
  - [x] PATCH `/api/users/me` — update fullName, phoneNumber; change password (requires currentPassword)
  - [x] Password change validates current password with bcrypt before updating
  - **Acceptance:** ✅ Profile editable; wrong current password returns 401

- [x] **Saved Addresses** `[Backend]` `[M]` ✅ Done
  - [x] GET `/api/users/me/addresses` — list addresses (default first)
  - [x] POST `/api/users/me/addresses` — create address (max 10 per account, first is auto-default)
  - [x] PATCH `/api/users/me/addresses/:id` — update address
  - [x] DELETE `/api/users/me/addresses/:id` — delete (auto-promotes next to default)
  - [x] PATCH `/api/users/me/addresses/:id/default` — set as default
  - [x] Phone validation: +213XXXXXXXXX format (class-validator)
  - **Acceptance:** ✅ Full address CRUD with default management

- [x] **Admin User List** `[Backend]` `[S]` ✅ Done
  - [x] GET `/api/admin/users` — paginated list of all users with order count, searchable by name/email
  - **Acceptance:** ✅ Admin can search and view all customers

### 1.8 Analytics Service

- [x] **Platform Analytics** `[Backend]` `[M]` ✅ Done
  - [x] GET `/api/admin/analytics` — total orders, total revenue (non-cancelled), orders by status, daily revenue last 30 days, top 5 products by revenue
  - **Acceptance:** ✅ Analytics data available in admin dashboard

### 1.9 Delivery Service
> **Note:** Bellat is primarily B2B — delivery is free for all zones. Delivery zone configuration (per-wilaya fees, slot capacity) is deferred until B2C pricing is defined.



- [ ] **Delivery Zone Management** `[Backend]` `[M]`
  - [ ] GET `/delivery/zones` (list all zones)
  - [ ] POST `/admin/delivery/zones` (create zone)
  - [ ] PUT `/admin/delivery/zones/:id` (update zone)
  - [ ] Configure zone: wilaya, communes, delivery_fee, slot availability
  - [ ] Set min_order_amount per zone
  - **Acceptance:** Zones configurable via API
  - **Requirements:** FR-DEL-003

- [ ] **Delivery Scheduling** `[Backend]` `[M]`
  - [ ] GET `/delivery/slots` (available slots for zone + date)
  - [ ] Check max_orders_per_slot capacity
  - [ ] Block fully-booked slots
  - [ ] Calculate slot surcharge (evening +200 DZD)
  - **Acceptance:** Slots have capacity limits
  - **Requirements:** FR-DEL-003

- [ ] **Driver Assignment (Manual)** `[Backend]` `[S]`
  - [ ] PATCH `/admin/orders/:id/assign-driver` (assign to driver)
  - [ ] Group orders by zone for route optimization
  - [ ] Display assigned deliveries for admin
  - **Acceptance:** Orders assignable to drivers
  - **Requirements:** FR-DEL-001
  - **Note:** Driver mobile app is OUT OF SCOPE (separate project)

### 1.10 Notification Service

- [ ] **SMS Integration** `[Backend]` `[M]`
  - [ ] Integrate Algerian SMS gateway
  - [ ] Send OTP via SMS
  - [ ] Send order confirmation SMS
  - [ ] Send "out for delivery" SMS
  - [ ] Use templates with variables (order_id, date, driver)
  - **Acceptance:** SMS sent successfully
  - **Requirements:** FR-NOT-002

- [ ] **Email Integration** `[Backend]` `[M]`
  - [ ] Integrate SendGrid
  - [ ] Send order confirmation email (with PDF invoice)
  - [ ] Send B2B approval/rejection emails
  - [ ] Send password reset emails
  - [ ] Use HTML templates (bilingual)
  - **Acceptance:** Emails sent successfully
  - **Requirements:** FR-NOT-003

- [ ] **Push Notifications Setup** `[Backend]` `[M]`
  - [ ] Integrate Firebase Cloud Messaging (FCM)
  - [ ] POST `/notifications/subscribe` (register device token)
  - [ ] Send order status update notifications
  - [ ] Send promotional notifications (admin triggered)
  - **Acceptance:** Push notifications received on devices
  - **Requirements:** FR-NOT-001

**Phase 1 Deliverables:**
- ✅ All microservices functional
- ✅ API endpoints documented (OpenAPI)
- ✅ 80%+ test coverage
- ✅ Postman collection for testing

---

## 📱 Phase 2: Frontend & PWA Experience

**Goal:** Complete customer-facing PWA with offline support and real API integration
**Note:** UI components and core pages already built via prototype migration into `/web`
**Prerequisites:** Phase 1 Auth, Product, Order APIs complete (for API integration tasks)
**Owner:** Frontend Team

### 2.1 Foundation ✅ Done (via prototype migration)

- [x] **Next.js 16 App Router in `/web`** — bilingual routing, Tailwind 4, TypeScript strict
- [x] **next-intl 4.7 i18n** — `/fr/*` and `/ar/*` routing, RTL support, `messages/fr.json` + `messages/ar.json`
- [x] **Cart state** — CartContext + localStorage persistence (`bellat_cart` key)
- [x] **Checkout state** — CheckoutContext, 4-step flow

- [ ] **Zustand stores** `[Frontend]` `[M]` — Replace Context with Zustand when backend ready
  - [ ] `authStore` (user session, token)
  - [ ] `cartStore` (synced to backend, falls back to localStorage for guests)
  - [ ] Custom hooks: `useAuth`, `useCart`, `useOffline`
  - **Acceptance:** State persists across refreshes, syncs to backend on login

- [x] **API Service Layer** `[Frontend]` `[M]` ✅ Done
  - [x] API client in `web/lib/api.ts` (native fetch, no axios needed)
  - [x] JWT auto-refresh on 401 via `authFetch()` wrapper
  - [x] Functions: auth, products, categories, orders, inventory, users/addresses
  - **Acceptance:** ✅ All API calls work with proper auth headers + silent refresh

### 2.2 PWA & Offline Capabilities

- [ ] **Service Worker Setup** `[Frontend]` `[L]`
  - [ ] Configure Workbox via next-pwa
  - [ ] Define caching strategies (NetworkFirst, CacheFirst, StaleWhileRevalidate)
  - [ ] Cache product catalog and images
  - [ ] Cache static assets (JS, CSS, fonts)
  - [ ] Add offline fallback page
  - **Acceptance:** App works offline, assets cached
  - **Requirements:** FR-OFF-001

- [ ] **IndexedDB for Offline Data** `[Frontend]` `[L]`
  - [ ] Set up Dexie.js for IndexedDB
  - [ ] Store product catalog for offline browsing
  - [ ] Store cart items locally
  - [ ] Queue orders placed offline
  - **Acceptance:** Cart and products available offline
  - **Requirements:** FR-OFF-001

- [ ] **Background Sync** `[Frontend]` `[M]`
  - [ ] Implement background sync for queued orders
  - [ ] Retry failed requests when online
  - [ ] Show offline indicator banner
  - [ ] Notify user when orders submitted successfully
  - **Acceptance:** Queued orders submit when connection restored
  - **Requirements:** FR-OFF-002

- [ ] **PWA Manifest & Installation** `[Frontend]` `[S]`
  - [ ] Create `manifest.json` (icons, theme colors, name)
  - [ ] Add app icons (192x192, 512x512)
  - [ ] Add install prompt
  - [ ] Test "Add to Home Screen" on Android/iOS
  - **Acceptance:** App installable as PWA

### 2.3 UI Component Library ✅ Done (via prototype migration)

- [x] **Base Components** — Button, Input, Select, Label, Badge, Card, Container, Skeleton, Toast (sonner), ImagePlaceholder, ResponsivePicture
- [x] **Product Components** — ProductCard, ProductCardSkeleton, AddToCartForm, QuantitySelector, StockBadge
- [x] **Cart Components** — CartItem (quantity, price, remove)
- [x] **Layout Components** — Header, Footer, BottomNav, LocaleSwitcher, CheckoutProgress

- [ ] **Modal / Drawer** `[Frontend]` `[S]` — not yet built; needed for address selection, confirmations

### 2.4 Customer Pages

- [x] **Home Page** — HeroSection, CategoryGrid, PopularProducts, FeaturesSection, BottomNav
- [x] **Product Listing Page** — grid layout, category filter (`/products/categories/[category]`)
- [x] **Product Detail Page** — image, description, quantity, add to cart
- [x] **Cart Page** — items, quantity update, subtotal, proceed to checkout
- [x] **Checkout Pages** — 4 steps: address → delivery slot → review → order-success
- [x] **Order Success Page** — mock confirmation with fake order ID

- [~] **Search Page** `[Frontend]` `[M]` 🟡 Partial
  - [x] Wired to backend search API (`GET /api/products?q=`) with 350ms debounce
  - [x] Skeleton loading state while search is in progress
  - [x] "No results" empty state
  - [ ] Autocomplete (top 5 suggestions) — deferred
  - **Acceptance:** ✅ Search returns live backend results; autocomplete deferred to pg_trgm upgrade
  - **Requirements:** FR-CAT-002, NFR-PERF-005

- [~] **Connect checkout to real backend** `[Frontend]` `[L]` 🟡 Partial
  - [x] Replace mock address entry with saved addresses from API — auto-selects default, picker above form
  - [ ] Fetch real delivery zones and slot availability — deferred (delivery service 1.7 not built)
  - [x] Submit order to `POST /api/orders` (real backend, JWT auth, auto-refresh on 401)
  - [x] Show real order number (`BLT-YYYYMMDD-XXXXX`) on order-success page
  - **Acceptance:** ✅ Orders created in database; saved addresses + slot capacity deferred
  - **Requirements:** FR-CART-002, ORD-002

### 2.5 User Account Pages 🟡 Mostly done

- [~] **Login/Register Page** `[Frontend]` `[M]` 🟡 Partial
  - [x] Login form (email + password) at `/[locale]/login`
  - [x] Register form (name, phone optional, email, password) — mode toggle on same page
  - [x] JWT + refresh token stored in localStorage (`bellat_token`, `bellat_refresh_token`)
  - [x] Auth-aware Header (login/logout, orders link)
  - [ ] Social login buttons (Google, Facebook) — deferred (OAuth not built)
  - [ ] OTP verification modal — deferred
  - [ ] "Forgot Password" link — deferred
  - [ ] B2B registration option — deferred
  - **Acceptance:** ✅ Users can register/login with email+password
  - **Requirements:** FR-AUTH-001, FR-AUTH-002

- [~] **Profile Page** `[Frontend]` `[S]` 🟡 Done (delete account deferred)
  - [x] View/edit personal info (name, phone) at `/[locale]/profile`
  - [x] Change password (verify current → set new) — backend validates current pw
  - [ ] Delete account option — deferred
  - **Acceptance:** ✅ Profile editable; delete account deferred
  - **Requirements:** FR-AUTH-004

- [x] **Addresses Page** `[Frontend]` `[M]` ✅ Done
  - [x] List of saved addresses (default highlighted) at `/[locale]/addresses`
  - [x] Add new address form (48 wilaya dropdown, +213 phone validation)
  - [x] Delete address (auto-promotes next to default)
  - [x] Set default address (clears other defaults)
  - [x] Max 10 addresses validation (backend enforces)
  - [x] Backend: full CRUD at `GET/POST /api/users/me/addresses`, `PATCH/DELETE /:id`, `PATCH /:id/default`
  - [ ] Edit existing address — deferred (add only for now)
  - **Acceptance:** ✅ Address add/delete/default-set works end-to-end
  - **Requirements:** FR-AUTH-004.1

- [x] **Order History Page** `[Frontend]` `[M]` ✅ Done
  - [x] List of past orders (paginated, real API `GET /api/orders`)
  - [x] Display order status badge (bilingual, color-coded)
  - [x] Cancel button for pending orders (PATCH `/api/orders/:id/cancel`)
  - [x] Reorder button for delivered/cancelled orders (POST `/api/orders/:id/reorder`)
  - [x] Order ID links to detail page (`/[locale]/orders/[id]`)
  - [ ] Filter by status, date range — deferred
  - **Acceptance:** ✅ Order history shows real data with cancel + reorder + detail link
  - **Requirements:** FR-AUTH-004.4, FR-ORD-005

- [x] **Order Detail/Tracking Page** `[Frontend]` `[M]` ✅ Done
  - [x] 5-step status timeline (Reçue → Confirmée → Préparation → En livraison → Livrée), bilingual
  - [x] Order items list with line totals, subtotal, delivery fee, total
  - [x] Delivery info card (address, date, time slot, payment method)
  - [x] Cancel order button (visible only for pending orders)
  - [ ] Driver info (when out for delivery) — deferred (driver app out of scope)
  - [ ] Contact support button — deferred
  - **Acceptance:** ✅ Order tracking page live at `/[locale]/orders/[id]`
  - **Requirements:** FR-ORD-003

- [ ] **Favorites Page** `[Frontend]` `[S]`
  - [ ] List of favorited products
  - [ ] Quick add to cart
  - [ ] Remove from favorites
  - **Acceptance:** Favorites manageable
  - **Requirements:** FR-AUTH-004

### 2.6 Recipe Integration — ❌ Not yet built

- [ ] **Recipes Page** `[Frontend]` `[M]`
  - [ ] Grid of recipe cards
  - [ ] Recipe image, title, prep time, difficulty
  - [ ] Filter by category (starter, main, quick, dessert)
  - **Acceptance:** Recipes display nicely
  - **Requirements:** FR-REC-001

- [ ] **Recipe Detail Page** `[Frontend]` `[M]`
  - [ ] Recipe image and info
  - [ ] Step-by-step instructions
  - [ ] List of Bellat product ingredients (with add to cart)
  - [ ] Other ingredients list
  - [ ] "Add all Bellat ingredients to cart" button
  - [ ] Serving size adjuster
  - **Acceptance:** Recipe-to-cart works
  - **Requirements:** FR-REC-002

**Phase 2 Deliverables:**
- [x] Bilingual UI with RTL (Arabic) and LTR (French)
- [x] All customer-facing pages (home, products, cart, checkout, search shell)
- [x] Mobile-first layout with bottom nav
- [ ] PWA: service worker, offline mode, install prompt
- [ ] Real API integration (replace all mock data)
- [ ] User account pages (login, register, profile, addresses, order history)
- [ ] Recipe-to-cart pages
- [ ] < 2s page load on 4G (Lighthouse audit)

---

## 🛠️ Phase 3: Admin & Operations Dashboard (Week 15-18)

**Goal:** Build back-office admin dashboard
**Prerequisites:** Phase 1 backend APIs, Phase 2 for UI components
**Owner:** Frontend Team (1 developer)

### 3.1 Admin Dashboard Setup

- [x] **Admin skeleton built** — `/admin/login`, `/admin/dashboard`, `/admin/orders`, `/admin/products` exist in `/web/app/admin/`

- [x] **Wire up real auth** `[Frontend]` `[M]` ✅ Done
  - [x] Real JWT login (`POST /api/auth/login`) with role=admin check
  - [x] All `/admin/*` routes protected — redirect to `/admin/login` if no token
  - [x] Token stored as `bellat_admin_token` in localStorage (httpOnly cookie deferred to production)
  - **Acceptance:** ✅ Only admin JWT holders can access dashboard

- [~] **Dashboard Home** `[Frontend]` `[M]` 🟡 Partial
  - [x] KPI cards: total orders, revenue, pending orders, low-stock/out-of-stock
  - [x] Recent 5 orders table (real data, customer name, amount, status)
  - [x] Inventory alert link (→ /admin/inventory)
  - [ ] Sales chart (daily/weekly/monthly) — deferred (needs analytics endpoint)
  - [ ] Peak hours heatmap — deferred
  - [ ] Top products list — deferred
  - **Acceptance:** ✅ Dashboard shows live KPI data; charts deferred
  - **Requirements:** FR-ADM-001

### 3.2 Order Management

- [~] **Order List Page** `[Frontend]` `[L]` 🟡 Partial
  - [x] Table with all orders (paginated, real API `GET /api/admin/orders`)
  - [x] Status filter tabs: All, En attente, Confirmé, Préparation, En livraison, Livré, Annulé
  - [x] Inline status advancement button (→ next state)
  - [x] Shows customer name, wilaya, total
  - [ ] Search by order number or customer — deferred
  - [ ] Date range filter, zone filter — deferred
  - [ ] Bulk export to Excel — deferred
  - **Acceptance:** ✅ Orders list live with status management; search/export deferred
  - **Requirements:** FR-ADM-001

- [x] **Order Detail Page** `[Frontend]` `[M]` ✅ Done
  - [x] Customer information card (name, email, phone)
  - [x] Order items table with quantities, unit price, line total, subtotal, delivery fee, total
  - [x] Delivery address card (name, address, commune, wilaya, phone)
  - [x] Delivery date + time slot
  - [x] Status advance button (→ next state, with label)
  - [ ] Driver assignment dropdown — deferred (driver app out of scope)
  - [ ] Internal notes field — deferred
  - [ ] Print invoice button — deferred
  - **Acceptance:** ✅ Order fully visible and status-advanceable from detail page
  - **Requirements:** FR-ADM-001

### 3.3 Product Management

- [x] **Product List Page** `[Frontend]` `[M]` ✅ Done
  - [x] Table with all products (real API via `GET /api/admin/inventory`)
  - [x] Inline stock status update per row (select dropdown → PATCH `/api/admin/inventory/:id`)
  - [x] "Ajouter un produit" button → `/admin/products/new`
  - [x] Edit icon per row → `/admin/products/[id]/edit`
  - [x] Delete (soft-deactivate) icon per row with confirm dialog
  - [ ] Search by name — deferred
  - [ ] Filter by category, stock status — deferred (use Inventory page for now)
  - **Acceptance:** ✅ Products fully manageable (list, create, edit, deactivate)
  - **Requirements:** FR-ADM-002

- [x] **Product Create/Edit Page** `[Frontend]` `[L]` ✅ Done
  - [x] `/admin/products/new` — create form with all fields
  - [x] `/admin/products/[id]/edit` — edit form pre-filled from API
  - [x] Fields: ID, name FR/AR, description FR/AR, category dropdown (from API), price, unit, stock status, image URL
  - [x] Backend: `POST /api/admin/products`, `PUT /api/admin/products/:id`, `DELETE /api/admin/products/:id`
  - [ ] Image upload (file picker, drag-to-reorder) — deferred (URL input used for now)
  - **Acceptance:** ✅ Products creatable and editable via admin UI
  - **Requirements:** FR-ADM-002

### 3.4 Customer Management

- [x] **Customer List Page** `[Frontend]` `[M]` ✅ Done
  - [x] Table with all customers (name, email, phone, role, order count, signup date)
  - [x] Live search by name or email (debounced 350ms)
  - [x] Backend: `GET /api/admin/users` (paginated, searchable, includes `_count.orders`)
  - [ ] Filter by type (B2C, B2B) — deferred (no B2B roles yet)
  - [ ] View order history button — deferred
  - [ ] Edit customer button — deferred
  - **Acceptance:** ✅ Customers listed and searchable
  - **Requirements:** FR-ADM-003

- [ ] **B2B Approval Queue** `[Frontend]` `[L]`
  - [ ] List of pending B2B applications
  - [ ] Document viewer (RC, NIF, Attestation)
  - [ ] Approval form:
    - [ ] Credit limit input
    - [ ] Payment terms (Net 15/30)
    - [ ] Default discount percentage
    - [ ] Assigned sales rep
    - [ ] Notes
  - [ ] Approve / Reject / Request More Info buttons
  - **Acceptance:** B2B approvals processed
  - **Requirements:** FR-ADM-003.2

- [ ] **B2B Customer Detail Page** `[Frontend]` `[M]`
  - [ ] Business information
  - [ ] Credit limit and usage (progress bar)
  - [ ] Payment terms
  - [ ] Order history table
  - [ ] Outstanding invoices
  - [ ] Credit adjustment controls
  - **Acceptance:** B2B accounts fully manageable
  - **Requirements:** FR-ADM-003.3

### 3.5 Inventory Management

- [~] **Inventory Page** `[Frontend]` `[M]` 🟡 Partial
  - [x] Full inventory list at `/admin/inventory` with summary cards (in stock / low / out)
  - [x] Filter tabs: Tous / Faible stock / Rupture
  - [x] Inline stock status select per product
  - [x] Backend: `GET /api/admin/inventory`, `PATCH /api/admin/inventory/:id`, `POST /api/admin/inventory/batch`, `GET /api/admin/inventory/alerts`
  - [ ] Import stock CSV button — deferred
  - [ ] Audit log for stock changes — deferred (no StockLog model)
  - **Acceptance:** ✅ Stock levels visible and editable; CSV + audit log deferred
  - **Requirements:** FR-ADM-002, FR-INV-001

### 3.6 Delivery Management

- [ ] **Delivery Zones Page** `[Frontend]` `[M]`
  - [ ] List of all zones
  - [ ] Add zone button
  - [ ] Edit zone button
  - [ ] Zone form:
    - [ ] Wilaya selector
    - [ ] Communes multi-select
    - [ ] Delivery fee input
    - [ ] Slot availability toggles
    - [ ] Evening surcharge input
    - [ ] Max orders per slot
    - [ ] Min order amount
  - **Acceptance:** Zones configurable
  - **Requirements:** FR-ADM-005.1

- [ ] **Driver Assignment Page** `[Frontend]` `[M]`
  - [ ] List of unassigned orders (by zone)
  - [ ] Drag-and-drop to assign driver
  - [ ] View driver's current route
  - [ ] Manual status update (for drivers without app)
  - **Acceptance:** Orders assignable to drivers
  - **Requirements:** FR-ADM-001
  - **Note:** Driver mobile app is OUT OF SCOPE

### 3.7 Analytics & Reporting

- [~] **Sales Report Page** `[Frontend]` `[M]` 🟡 Partial
  - [x] Revenue chart (daily — last 30 days bar chart at `/admin/analytics`)
  - [x] Orders count + total revenue KPI cards
  - [x] Top products table (by revenue, top 5)
  - [x] Orders by status breakdown
  - [x] Backend: `GET /api/admin/analytics` (AnalyticsService — daily revenue, top products, status breakdown)
  - [ ] Date range selector — deferred
  - [ ] Sales by category pie chart — deferred
  - [ ] B2C vs B2B breakdown — deferred (no B2B roles yet)
  - [ ] Export to PDF/Excel button — deferred
  - **Acceptance:** Reports generate correctly
  - **Requirements:** FR-ADM-004

- [ ] **Customer Report Page** `[Frontend]` `[S]`
  - [ ] New registrations chart
  - [ ] Active customers count
  - [ ] B2B conversion rate
  - [ ] Customer retention metrics
  - [ ] Geographic distribution map
  - **Acceptance:** Customer metrics accurate
  - **Requirements:** FR-ADM-004

- [ ] **Inventory Report Page** `[Frontend]` `[S]`
  - [ ] Stock levels by product table
  - [ ] Low stock alerts list
  - [ ] Stock movement history
  - [ ] Reorder recommendations
  - **Acceptance:** Inventory insights available
  - **Requirements:** FR-ADM-004

### 3.8 System Configuration

- [ ] **Settings Page** `[Frontend]` `[M]`
  - [ ] General settings (app name, contact info)
  - [ ] Email templates configuration
  - [ ] SMS templates configuration
  - [ ] Notification settings
  - [ ] Feature flags toggles
  - **Acceptance:** Settings editable
  - **Requirements:** FR-ADM-005

**Phase 3 Deliverables:**
- ✅ Fully functional admin dashboard
- ✅ All admin features working
- ✅ Reports generating correctly
- ✅ Manual delivery management working

---

## 🔔 Phase 4: Notifications & Integrations (Week 19-21)

**Goal:** Complete notification system and third-party integrations
**Prerequisites:** Phase 1-3 complete
**Owner:** Backend Team (1 developer)

### 4.1 Firebase Cloud Messaging (FCM)

- [ ] **FCM Setup** `[Backend]` `[M]`
  - [ ] Create Firebase project
  - [ ] Configure FCM credentials
  - [ ] Generate VAPID keys for web push
  - [ ] Test push notifications on Chrome/Firefox
  - **Acceptance:** Push notifications received on browsers

- [ ] **Notification Templates** `[Backend]` `[M]`
  - [ ] Order confirmed notification
  - [ ] Order preparing notification
  - [ ] Out for delivery notification
  - [ ] Order delivered notification
  - [ ] Promotional notification
  - [ ] Back in stock notification
  - **Acceptance:** All notification types work
  - **Requirements:** FR-NOT-001

### 4.2 SMS Integration

- [ ] **Algerian SMS Gateway** `[Backend]` `[L]`
  - [ ] Research and select provider (Mobilis, Djezzy, Ooredoo API)
  - [ ] Integrate SMS API
  - [ ] Create SMS templates (OTP, order updates)
  - [ ] Handle SMS delivery failures (retry logic)
  - [ ] Track SMS delivery status
  - **Acceptance:** SMS sent successfully to Algerian numbers
  - **Requirements:** FR-NOT-002

- [ ] **SMS Templates** `[Backend]` `[S]`
  - [ ] OTP template
  - [ ] Order confirmed template
  - [ ] Out for delivery template
  - [ ] Delivered template
  - [ ] Password reset template
  - **Acceptance:** All SMS templates functional

### 4.3 Email Templates

- [ ] **SendGrid Setup** `[Backend]` `[M]`
  - [ ] Create SendGrid account
  - [ ] Configure API key
  - [ ] Set up sender domain (noreply@bellat.net)
  - [ ] Verify domain (SPF, DKIM)
  - **Acceptance:** Emails deliverable, not marked as spam

- [ ] **Email Templates (HTML)** `[Backend]` `[L]`
  - [ ] Welcome email (registration)
  - [ ] Order confirmation email (with invoice PDF)
  - [ ] B2B approved/rejected emails
  - [ ] Password reset email
  - [ ] Monthly statement email (B2B)
  - [ ] Make templates bilingual (AR/FR)
  - **Acceptance:** All email templates render correctly
  - **Requirements:** FR-NOT-003

### 4.4 Recipe Migration

- [ ] **Scrape Existing Recipes** `[Backend]` `[M]`
  - [ ] Scrape recipes from bellat.net
  - [ ] Extract recipe data (title, image, instructions, ingredients)
  - [ ] Link Bellat products to recipes
  - [ ] Import into database
  - **Acceptance:** Recipes migrated successfully
  - **Requirements:** Recipe Linkage

- [ ] **Recipe CRUD** `[Backend]` `[S]`
  - [ ] Admin endpoints to create/edit/delete recipes
  - [ ] Upload recipe images
  - [ ] Link products to recipes
  - **Acceptance:** Admin can manage recipes

### 4.5 File Upload

- [ ] **Image Upload Service** `[Backend]` `[M]`
  - [ ] POST `/upload/image` (product images)
  - [ ] Integrate with MinIO/S3
  - [ ] Image optimization (compress, resize)
  - [ ] Generate thumbnails
  - [ ] Return public URL
  - **Acceptance:** Images uploadable, URLs accessible
  - **Requirements:** FR-ADM-002

- [ ] **Document Upload** `[Backend]` `[S]`
  - [ ] POST `/upload/document` (B2B documents)
  - [ ] Validate file types (PDF, JPG, PNG)
  - [ ] Virus scanning (ClamAV)
  - [ ] Store securely (not public)
  - **Acceptance:** Documents uploadable securely
  - **Requirements:** FR-AUTH-005

### 4.6 Real-Time Updates

- [ ] **WebSocket Setup** `[Backend]` `[M]`
  - [ ] Set up Socket.IO or native WebSockets
  - [ ] Implement authentication for WebSocket connections
  - [ ] Create room per order (order:ORDER_ID)
  - [ ] Emit order status updates in real-time
  - **Acceptance:** Frontend receives real-time updates

- [ ] **Frontend WebSocket Integration** `[Frontend]` `[M]`
  - [ ] Connect to WebSocket on order tracking page
  - [ ] Subscribe to order updates
  - [ ] Display real-time status changes
  - [ ] Handle reconnection
  - **Acceptance:** Order status updates in real-time

**Phase 4 Deliverables:**
- ✅ Push notifications working
- ✅ SMS and email notifications sent
- ✅ Recipes migrated and functional
- ✅ File uploads working
- ✅ Real-time order updates

---

## 🧪 Phase 5: QA & Launch Readiness (Week 22-24)

**Goal:** Ensure quality, performance, and security before launch
**Prerequisites:** Phase 1-4 complete
**Owner:** QA Engineer + Full Team

### 5.1 Testing

- [ ] **Unit Testing** `[All Developers]` `[L]`
  - [ ] Write unit tests for all services (target: 80%+ coverage)
  - [ ] Write unit tests for all React components
  - [ ] Write unit tests for utility functions
  - [ ] Run tests in CI pipeline
  - **Acceptance:** `npm test` passes, coverage > 80%

- [ ] **Integration Testing** `[Backend]` `[L]`
  - [ ] Write E2E tests for API endpoints
  - [ ] Test auth flow (register, login, JWT)
  - [ ] Test order flow (add to cart, checkout, order creation)
  - [ ] Test B2B credit flow
  - [ ] Test stock reservation/release
  - **Acceptance:** All critical flows tested

- [ ] **Frontend E2E Testing** `[Frontend + QA]` `[L]`
  - [ ] Set up Playwright or Cypress
  - [ ] Test user registration and login
  - [ ] Test product search and filtering
  - [ ] Test add to cart and checkout
  - [ ] Test order tracking
  - [ ] Test offline mode
  - **Acceptance:** E2E tests pass on Chrome, Firefox, Safari

- [ ] **Mobile Testing** `[QA]` `[M]`
  - [ ] Test on Android devices (Chrome)
  - [ ] Test on iOS devices (Safari)
  - [ ] Test PWA installation
  - [ ] Test offline mode on mobile
  - [ ] Test touch interactions (swipe, tap)
  - **Acceptance:** All features work on mobile

### 5.2 Performance Testing

- [ ] **Load Testing** `[DevOps + QA]` `[L]`
  - [ ] Set up k6 or Apache JMeter
  - [ ] Test 1,000 concurrent users (normal load)
  - [ ] Test 5,000 concurrent users (Ramadan/Eid peak)
  - [ ] Identify bottlenecks
  - [ ] Optimize slow endpoints
  - **Acceptance:** System handles 5,000 concurrent users
  - **Requirements:** NFR-PERF-007

- [ ] **Lighthouse Audits** `[Frontend]` `[M]`
  - [ ] Run Lighthouse on all pages
  - [ ] Achieve Performance score > 90
  - [ ] Achieve Accessibility score > 90
  - [ ] Achieve Best Practices score > 90
  - [ ] Achieve SEO score > 90
  - **Acceptance:** All Lighthouse scores > 90
  - **Requirements:** NFR-PERF-001, NFR-PERF-002

- [ ] **Network Throttling Tests** `[QA]` `[M]`
  - [ ] Test on 3G network (slow)
  - [ ] Test on intermittent connectivity (flaky network)
  - [ ] Verify offline mode works
  - [ ] Verify queued orders submit when online
  - **Acceptance:** App usable on 3G, offline mode works
  - **Requirements:** NFR-PERF-002

### 5.3 Security Testing

- [ ] **Security Audit** `[External Consultant or DevOps]` `[XL]`
  - [ ] OWASP Top 10 scan
  - [ ] SQL injection tests (should be blocked by Prisma)
  - [ ] XSS tests (should be blocked by CSP)
  - [ ] CSRF tests (should be blocked by tokens)
  - [ ] Rate limiting tests
  - [ ] JWT token validation tests
  - **Acceptance:** No critical security vulnerabilities
  - **Requirements:** NFR-SEC-008

- [ ] **Penetration Testing** `[External Consultant]` `[XL]`
  - [ ] Hire security firm for pen test
  - [ ] Test authentication bypass attempts
  - [ ] Test privilege escalation
  - [ ] Test payment flow security
  - [ ] Test file upload vulnerabilities
  - **Acceptance:** No critical findings
  - **Requirements:** NFR-SEC-009

### 5.4 Localization QA

- [ ] **Arabic QA** `[Native Arabic Speaker]` `[L]`
  - [ ] Review all Arabic translations
  - [ ] Check RTL layout on all pages
  - [ ] Verify Arabic numerals (٠١٢٣...)
  - [ ] Test Arabic search and transliteration
  - [ ] Verify Arabic fonts render correctly
  - **Acceptance:** Arabic experience is flawless
  - **Requirements:** NFR-LOC-001, NFR-LOC-002

- [ ] **French QA** `[Native French Speaker]` `[M]`
  - [ ] Review all French translations
  - [ ] Check LTR layout
  - [ ] Verify currency formatting (1 500 DZD)
  - [ ] Verify date formatting (DD/MM/YYYY)
  - **Acceptance:** French experience is professional

### 5.5 User Acceptance Testing (UAT)

- [ ] **UAT with Bellat Staff** `[Product Manager + QA]` `[XL]`
  - [ ] Train Bellat staff on admin dashboard
  - [ ] Have staff test B2C ordering flow
  - [ ] Have staff test B2B approval workflow
  - [ ] Have staff test inventory management
  - [ ] Have staff test order fulfillment
  - [ ] Collect feedback and iterate
  - **Acceptance:** Bellat staff approves system
  - **Requirements:** Launch Readiness Checklist

- [ ] **Beta Testing** `[Product Manager]` `[L]`
  - [ ] Recruit 20-30 beta testers (B2C and B2B)
  - [ ] Invite to test on staging
  - [ ] Collect feedback via surveys
  - [ ] Identify bugs and usability issues
  - [ ] Fix critical issues
  - **Acceptance:** Beta testers satisfied, major bugs fixed

### 5.6 Documentation

- [ ] **API Documentation** `[Backend]` `[M]`
  - [ ] Ensure OpenAPI docs are complete
  - [ ] Add examples for all endpoints
  - [ ] Document error codes and responses
  - **Acceptance:** API docs published at api.bellat.net/docs

- [ ] **Admin User Manual** `[Product Manager]` `[M]`
  - [ ] Write guide for admin dashboard
  - [ ] Screenshot walkthrough of all features
  - [ ] How to approve B2B customers
  - [ ] How to manage inventory
  - [ ] How to assign deliveries
  - **Acceptance:** Admin manual complete (PDF + video)

- [ ] **Customer Help Center** `[Product Manager]` `[S]`
  - [ ] FAQ page (How to register, How to order, Payment methods, etc.)
  - [ ] Contact support page
  - [ ] Bilingual (AR/FR)
  - **Acceptance:** Help center live on website

### 5.7 Pre-Launch Checklist

- [ ] **Infrastructure Checklist** `[DevOps]`
  - [ ] SSL certificate valid and auto-renewing
  - [ ] Cloudflare DNS configured
  - [ ] Kubernetes cluster production-ready
  - [ ] Database backups running (every 6 hours)
  - [ ] Redis persistence enabled
  - [ ] Monitoring and alerting configured
  - [ ] Log aggregation working (ELK)
  - [ ] Rollback procedure tested

- [ ] **Security Checklist** `[DevOps + Backend]`
  - [ ] All secrets in vault (no hardcoded secrets)
  - [ ] CORS configured (whitelist only)
  - [ ] Rate limiting enabled
  - [ ] HTTPS enforced (redirect HTTP)
  - [ ] CSP headers configured
  - [ ] SQL injection tests passed
  - [ ] XSS tests passed
  - [ ] CSRF protection enabled

- [ ] **Data Checklist** `[Product Manager + Backend]`
  - [ ] 15 categories seeded
  - [ ] Initial products imported (at least 50)
  - [ ] Product images uploaded
  - [ ] Delivery zones configured (target Wilayas)
  - [ ] Admin accounts created
  - [ ] Test orders cleaned from production DB

**Phase 5 Deliverables:**
- ✅ All tests passing
- ✅ Security audit clean
- ✅ UAT approved by Bellat
- ✅ Documentation complete
- ✅ Pre-launch checklist ✅

---

## 🚀 Phase 6: Launch & Post-Launch (Week 25+)

**Goal:** Launch to production and monitor
**Prerequisites:** Phase 5 complete
**Owner:** Full Team

### 6.1 Launch Preparation

- [ ] **Soft Launch** `[Product Manager]` `[S]`
  - [ ] Deploy to production
  - [ ] Invite 50-100 early users
  - [ ] Monitor closely for issues
  - [ ] Fix any critical bugs immediately
  - **Acceptance:** Soft launch stable for 1 week

- [ ] **Marketing Assets** `[Product Manager]` `[M]`
  - [ ] Social media announcement (Facebook, Instagram)
  - [ ] Email blast to existing customers
  - [ ] Press release (Algerian tech media)
  - [ ] bellat.net homepage banner
  - **Acceptance:** Marketing materials ready

- [ ] **Public Launch** `[Product Manager]` `[S]`
  - [ ] Announce on all channels
  - [ ] Monitor traffic spike
  - [ ] Be on standby for issues
  - **Acceptance:** Public launch successful

### 6.2 Post-Launch Monitoring

- [ ] **Daily Monitoring (First Week)** `[DevOps + All]` `[Ongoing]`
  - [ ] Monitor error rates (ELK)
  - [ ] Monitor API response times (Grafana)
  - [ ] Monitor order success rate
  - [ ] Check SMS/email delivery
  - [ ] Respond to user support requests

- [ ] **Weekly Retrospectives** `[All Team]` `[Ongoing]`
  - [ ] Review metrics (users, orders, errors)
  - [ ] Discuss what went well / what didn't
  - [ ] Plan improvements for next week
  - [ ] Update roadmap for Phase 2

### 6.3 Continuous Improvement

- [ ] **User Feedback Collection** `[Product Manager]` `[Ongoing]`
  - [ ] In-app NPS survey
  - [ ] Collect feature requests
  - [ ] Monitor app store reviews (when native apps launch)
  - [ ] Customer support tickets analysis

- [ ] **Performance Optimization** `[Backend + Frontend]` `[Ongoing]`
  - [ ] Optimize slow API endpoints
  - [ ] Reduce bundle size
  - [ ] Improve caching strategies
  - [ ] Database query optimization

- [ ] **Bug Fixes** `[All Developers]` `[Ongoing]`
  - [ ] Triage bugs (critical, high, medium, low)
  - [ ] Fix critical bugs within 24 hours
  - [ ] Fix high-priority bugs within 1 week

### 6.4 Phase 2 Planning

- [ ] **Plan Phase 2 Features** `[Product Manager + Tech Lead]`
  - [ ] CIB/Dahabia payment integration
  - [ ] GPS delivery tracking
  - [ ] Native mobile apps (iOS/Android)
  - [ ] Loyalty/rewards program
  - [ ] Create Phase 2 roadmap

**Phase 6 Deliverables:**
- ✅ Public launch successful
- ✅ Users onboarded
- ✅ Monitoring in place
- ✅ Support process established

---

## 📈 Success Metrics Tracking

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Users** |
| Registered Users | 5,000 | 0 | 🔴 |
| Monthly Active Users | 2,000 | 0 | 🔴 |
| B2B Accounts | 100 | 0 | 🔴 |
| **Orders** |
| Orders per Month | 1,000 | 0 | 🔴 |
| Order Fulfillment Rate | > 95% | N/A | ⚪ |
| Average Order Value | 3,000 DZD | N/A | ⚪ |
| **Performance** |
| System Uptime | > 99.5% | N/A | ⚪ |
| Page Load (4G, FCP) | < 2s | N/A | ⚪ |
| API Response (P95) | < 500ms | N/A | ⚪ |
| **Satisfaction** |
| NPS Score | > 40 | N/A | ⚪ |
| Customer Support Tickets | < 50/month | N/A | ⚪ |

---

## 🎯 Critical Path

The following tasks are on the critical path (blocking other work):

1. **Phase 0:** All infrastructure setup
2. **Phase 1:**
   - Prisma schema definition (blocks all backend)
   - Auth Service JWT (blocks all authenticated endpoints)
3. **Phase 2:**
   - Next.js setup + i18n (blocks all frontend)
   - Service Worker setup (blocks offline mode)
4. **Phase 5:**
   - UAT approval (blocks launch)

---

## 📝 Notes

### Important Clarifications
- ✅ Driver/Delivery Staff mobile app is **OUT OF SCOPE** (separate Bellat initiative)
- Admin dashboard will handle manual driver assignment and delivery status updates
- Delivery status updates will be manual in Phase 1 (via admin dashboard)

### Task Complexity Legend
- `[S]` Small (< 1 day)
- `[M]` Medium (1-2 days)
- `[L]` Large (3-5 days)
- `[XL]` Extra Large (1+ week)

### Role Tags
- `[DevOps]` - DevOps Engineer
- `[Backend]` - Backend Developer
- `[Backend Lead]` - Senior Backend Developer
- `[Frontend]` - Frontend Developer
- `[Frontend Lead]` - Senior Frontend Developer
- `[Tech Lead]` - Technical Lead
- `[QA]` - QA Engineer
- `[Product Manager]` - Product Manager

---

**Last Updated:** January 8, 2026
**Next Review:** Weekly during active development
**Repository:** https://github.com/rdjerrouf/bellat-platform
