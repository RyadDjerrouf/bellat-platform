# 📋 Bellat Digital Ordering Platform - Development Roadmap

**Status:** 🟢 Phase 0 Complete | **Next:** Phase 1 - Backend Development
**Last Updated:** March 18, 2026
**Target Launch:** Q2 2026

---

## 📊 Progress Overview

| Phase | Status | Progress | Notes |
|-------|--------|----------|-------|
| Phase 0: Foundation | ✅ Done | Core done | Monorepo + Docker + frontend prototype migrated |
| Phase 1: Backend | 🟡 Ready to Start | 0/28 tasks | NestJS microservices, Prisma, real auth |
| Phase 2: Frontend | 🔵 Partial | ~14/24 tasks | UI/routing/components done via prototype |
| Phase 3: Admin | ⏸️ Blocked | 0/18 tasks | Needs real backend data |
| Phase 4: Integrations | ⏸️ Blocked | 0/12 tasks | SMS, email, push |
| Phase 5: QA & Launch | ⏸️ Blocked | 0/16 tasks | — |

**Phase 2 detail:** UI foundation complete (bilingual routing, all customer pages, cart, 4-step checkout, components). Missing: PWA/service worker, Zustand + API layer, user account pages (login/register/profile/addresses/order history), recipe pages, real backend integration.

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

- [ ] **Prisma Schema Definition** `[Backend Lead]` `[L]`
  - [ ] Define all 18 tables (users, products, orders, etc.)
  - [ ] Add indexes (unique, foreign key, query optimization)
  - [ ] Add full-text search indexes (pg_trgm)
  - [ ] Write seed script (15 categories, sample products)
  - **Acceptance:** `prisma migrate dev` creates schema, seed populates data
  - **Reference:** See `.claude/project-initialization.md` § 4.2 Database Schema

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

- [ ] **Gateway Setup** `[Backend]` `[M]`
  - [ ] Create NestJS API Gateway application
  - [ ] Configure routing to microservices
  - [ ] Implement rate limiting (100 req/min public, 1,000 authenticated)
  - [ ] Add CORS configuration (whitelist origins)
  - [ ] Add request logging middleware
  - **Acceptance:** Gateway routes requests to services
  - **Requirement:** NFR-SEC-005 (Rate limiting)

- [ ] **OpenAPI Documentation** `[Backend]` `[S]`
  - [ ] Set up Swagger/OpenAPI 3.0
  - [ ] Auto-generate API docs from decorators
  - [ ] Make docs accessible at `/api/docs`
  - **Acceptance:** Swagger UI accessible, all endpoints documented

### 1.3 Auth Service

- [ ] **JWT Authentication** `[Backend]` `[L]`
  - [ ] Implement JWT strategy (RS256)
  - [ ] Implement token generation (24h access, 30d refresh)
  - [ ] Implement token refresh endpoint
  - [ ] Implement session storage in Redis
  - [ ] Add account lockout (5 failed attempts)
  - **Acceptance:** Login returns JWT, protected routes verify token
  - **Requirements:** FR-AUTH-002, NFR-SEC-003

- [ ] **Registration & Login** `[Backend]` `[M]`
  - [ ] POST `/auth/register` (email, phone, password)
  - [ ] POST `/auth/login` (email/phone + password)
  - [ ] Password hashing with bcrypt (cost factor 12)
  - [ ] Input validation (phone: +213, email format, password complexity)
  - **Acceptance:** Users can register and login
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

- [ ] **Product CRUD** `[Backend]` `[M]`
  - [ ] GET `/products` (list with pagination, filters)
  - [ ] GET `/products/:slug` (product details with variants)
  - [ ] POST `/admin/products` (create product)
  - [ ] PUT `/admin/products/:id` (update product)
  - [ ] DELETE `/admin/products/:id` (soft delete)
  - **Acceptance:** Products manageable via API
  - **Requirements:** FR-CAT-001, FR-ADM-002

- [ ] **Category & Brand Management** `[Backend]` `[S]`
  - [ ] GET `/categories` (list all 15 categories)
  - [ ] GET `/categories/:slug/products` (products by category)
  - [ ] GET `/brands` (list all brands)
  - [ ] GET `/brands/:id/products` (products by brand)
  - **Acceptance:** Categories and brands filterable
  - **Requirements:** FR-CAT-001.1, FR-CAT-001.2

- [ ] **Full-Text Search** `[Backend]` `[L]`
  - [ ] GET `/products/search?q=<query>`
  - [ ] Implement PostgreSQL FTS with pg_trgm (fuzzy matching)
  - [ ] Support Arabic transliteration ("kachir" → "كاشير")
  - [ ] Return results in < 300ms
  - [ ] Add autocomplete endpoint (top 5 suggestions)
  - **Acceptance:** Search finds products with typos, Arabic works
  - **Requirements:** FR-CAT-002, NFR-PERF-005

- [ ] **Variant Management** `[Backend]` `[M]`
  - [ ] Support multiple variants per product (weight, pack size)
  - [ ] Independent pricing (retail_price, b2b_price)
  - [ ] Stock tracking per variant
  - [ ] Price-per-kg calculation
  - **Acceptance:** Variants have separate pricing and stock
  - **Requirements:** FR-CAT-003

- [ ] **Filtering & Sorting** `[Backend]` `[M]`
  - [ ] Filter by category, brand, meat type, price range, availability
  - [ ] Sort by: popularity, price (asc/desc), newest, name (A-Z)
  - [ ] Remember user's last filter preferences (Redis)
  - **Acceptance:** All filters and sorts work correctly
  - **Requirements:** FR-CAT-002.5, FR-CAT-002.6, FR-CAT-002.7

### 1.5 Order Service

- [ ] **Cart Management** `[Backend]` `[L]`
  - [ ] GET `/cart` (fetch user's cart)
  - [ ] POST `/cart/items` (add item to cart)
  - [ ] PATCH `/cart/items/:id` (update quantity)
  - [ ] DELETE `/cart/items/:id` (remove item)
  - [ ] Store cart in Redis + PostgreSQL
  - [ ] Merge guest cart on login
  - [ ] Validate stock availability on add
  - **Acceptance:** Cart persists across sessions
  - **Requirements:** FR-CART-001

- [ ] **Checkout Flow** `[Backend]` `[XL]`
  - [ ] POST `/orders` (create order from cart)
  - [ ] Validate delivery address (zone exists)
  - [ ] Calculate delivery fee based on zone
  - [ ] Calculate slot surcharge (evening +200 DZD)
  - [ ] Enforce minimum order amount per zone
  - [ ] Reserve stock (increment reserved_quantity)
  - [ ] Generate unique order number: `BLT-YYYYMMDD-XXXXX`
  - [ ] Clear cart after order placed
  - **Acceptance:** Orders created with correct totals, stock reserved
  - **Requirements:** FR-CART-002, FR-CART-004, ORD-001, ORD-002

- [ ] **Order Lifecycle** `[Backend]` `[L]`
  - [ ] Implement order state machine (Pending → Confirmed → Preparing → Ready → Out for Delivery → Delivered)
  - [ ] PATCH `/admin/orders/:id/status` (transition to next state)
  - [ ] Validate state transitions (can't skip states)
  - [ ] Log all status changes with timestamp and user
  - [ ] Send notifications on each state change
  - **Acceptance:** Orders follow proper lifecycle
  - **Requirements:** FR-ORD-002

- [ ] **Order History & Tracking** `[Backend]` `[M]`
  - [ ] GET `/orders` (user's order history with filters)
  - [ ] GET `/orders/:id` (order details with items)
  - [ ] Display estimated delivery time
  - [ ] Show driver info when Out for Delivery
  - **Acceptance:** Users can view order history and track orders
  - **Requirements:** FR-ORD-003

- [ ] **Order Cancellation** `[Backend]` `[M]`
  - [ ] PATCH `/orders/:id/cancel` (user cancellation)
  - [ ] Allow cancel only if status = PENDING
  - [ ] Release reserved stock on cancellation
  - [ ] Send cancellation confirmation
  - **Acceptance:** Users can cancel pending orders
  - **Requirements:** FR-ORD-004, INV-006

- [ ] **Reordering** `[Backend]` `[S]`
  - [ ] POST `/orders/:id/reorder` (clone previous order)
  - [ ] Check stock availability for all items
  - [ ] Update prices to current pricing
  - [ ] Notify of unavailable items
  - **Acceptance:** Users can reorder with updated prices
  - **Requirements:** FR-ORD-005

- [ ] **B2B Credit Management** `[Backend]` `[M]`
  - [ ] Check credit limit before placing invoice order
  - [ ] Increment credit_used on invoice order
  - [ ] Decrement credit_used when marked PAID
  - [ ] Reject orders exceeding credit limit
  - **Acceptance:** B2B credit limits enforced
  - **Requirements:** FR-CART-003, B2B-003, B2B-004

### 1.6 Inventory Service

- [ ] **Stock Management** `[Backend]` `[M]`
  - [ ] GET `/admin/inventory` (view stock levels)
  - [ ] PATCH `/admin/inventory/:variantId` (manual adjustment)
  - [ ] Log all stock changes (audit trail)
  - [ ] Calculate available_stock = stock_quantity - reserved_quantity
  - **Acceptance:** Stock levels accurate, adjustments logged
  - **Requirements:** FR-INV-001

- [ ] **Stock Alerts** `[Backend]` `[S]`
  - [ ] Monitor stock levels (cron job every hour)
  - [ ] Alert when stock < low_stock_threshold
  - [ ] Auto-hide products when stock = 0
  - [ ] "Notify me when available" subscription
  - **Acceptance:** Low stock alerts sent to admins
  - **Requirements:** FR-INV-002

- [ ] **Batch Import** `[Backend]` `[M]`
  - [ ] POST `/admin/inventory/import` (CSV/Excel upload)
  - [ ] Parse CSV format: `sku,stock_quantity,last_updated`
  - [ ] Validate SKUs exist
  - [ ] Update stock in batch
  - [ ] Return import summary (success/failures)
  - **Acceptance:** Stock imported from CSV successfully
  - **Requirements:** FR-INV-001.2

### 1.7 Delivery Service

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

### 1.8 Notification Service

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

- [ ] **API Service Layer** `[Frontend]` `[M]`
  - [ ] Create API client with axios + base URL from env
  - [ ] JWT token interceptor (attach access token, refresh on 401)
  - [ ] Service functions: `authService`, `productService`, `orderService`
  - **Acceptance:** All API calls work with proper auth headers

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

- [ ] **Search Page** `[Frontend]` `[M]` — page exists at `/search` but filtering logic not implemented
  - [ ] Wire up to backend search API (`/products/search?q=`)
  - [ ] Autocomplete (top 5 suggestions)
  - [ ] "No results" state with suggestions
  - **Acceptance:** Search returns results in < 300ms
  - **Requirements:** FR-CAT-002, NFR-PERF-005

- [ ] **Connect checkout to real backend** `[Frontend]` `[L]`
  - [ ] Replace mock address entry with saved addresses from API
  - [ ] Fetch real delivery zones and slot availability
  - [ ] Submit order to `POST /orders` (not mock)
  - [ ] Show real order number (`BLT-YYYYMMDD-XXXXX`)
  - **Acceptance:** Orders created in database, stock reserved
  - **Requirements:** FR-CART-002, ORD-002

### 2.5 User Account Pages — ❌ Not yet built

- [ ] **Login/Register Page** `[Frontend]` `[M]`
  - [ ] Login form (email/phone + password)
  - [ ] Register form (name, phone, email, password)
  - [ ] Social login buttons (Google, Facebook)
  - [ ] OTP verification modal
  - [ ] "Forgot Password" link
  - [ ] B2B registration option
  - **Acceptance:** Users can register/login
  - **Requirements:** FR-AUTH-001, FR-AUTH-002

- [ ] **Profile Page** `[Frontend]` `[S]`
  - [ ] View/edit personal info
  - [ ] Change password
  - [ ] Delete account option
  - **Acceptance:** Profile editable
  - **Requirements:** FR-AUTH-004

- [ ] **Addresses Page** `[Frontend]` `[M]`
  - [ ] List of saved addresses
  - [ ] Add new address form
  - [ ] Edit/delete address
  - [ ] Set default address
  - [ ] Max 10 addresses validation
  - **Acceptance:** Address CRUD works
  - **Requirements:** FR-AUTH-004.1

- [ ] **Order History Page** `[Frontend]` `[M]`
  - [ ] List of past orders (paginated)
  - [ ] Filter by status, date range
  - [ ] Display order status badge
  - [ ] Click to view order details
  - [ ] Reorder button
  - **Acceptance:** Order history displays correctly
  - **Requirements:** FR-AUTH-004.4, FR-ORD-005

- [ ] **Order Detail/Tracking Page** `[Frontend]` `[M]`
  - [ ] Order timeline (status progression)
  - [ ] Order items with quantities
  - [ ] Delivery info (address, date, slot)
  - [ ] Driver info (when out for delivery)
  - [ ] Cancel order button (if allowed)
  - [ ] Contact support button
  - **Acceptance:** Real-time order tracking works
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

- [x] **Admin skeleton built** — `/admin/login`, `/admin/dashboard`, `/admin/orders`, `/admin/products` exist in `/web/app/admin/` (display-only, mock login: admin@bellat.net / demo123)

- [ ] **Wire up real auth** `[Frontend]` `[M]`
  - [ ] Replace mock login with real JWT auth (`POST /auth/login`)
  - [ ] Protect all `/admin/*` routes (redirect if not ADMIN role)
  - [ ] Add session persistence (httpOnly cookie)
  - **Acceptance:** Only authenticated admins can access dashboard

- [ ] **Dashboard Home** `[Frontend]` `[M]`
  - [ ] KPI cards (new orders, daily revenue, monthly revenue)
  - [ ] Recent orders table (last 10)
  - [ ] Sales chart (daily/weekly/monthly)
  - [ ] Peak hours heatmap
  - [ ] Top products list
  - **Acceptance:** Dashboard shows live data
  - **Requirements:** FR-ADM-001

### 3.2 Order Management

- [ ] **Order List Page** `[Frontend]` `[L]`
  - [ ] Table with all orders (paginated)
  - [ ] Tabs: All, New, In Progress, Delivered, Cancelled
  - [ ] Search by order number or customer
  - [ ] Date range filter
  - [ ] Zone filter
  - [ ] Bulk actions (export to Excel)
  - [ ] Highlight urgent orders (same-day delivery)
  - **Acceptance:** Orders searchable and filterable
  - **Requirements:** FR-ADM-001

- [ ] **Order Detail Page** `[Frontend]` `[M]`
  - [ ] Customer information
  - [ ] Order items with quantities and prices
  - [ ] Delivery address with map link
  - [ ] Payment status
  - [ ] Status change dropdown
  - [ ] Driver assignment dropdown
  - [ ] Internal notes field
  - [ ] Order history/timeline
  - [ ] Print invoice button
  - **Acceptance:** Order fully manageable
  - **Requirements:** FR-ADM-001

### 3.3 Product Management

- [ ] **Product List Page** `[Frontend]` `[M]`
  - [ ] Table with all products
  - [ ] Search by name or SKU
  - [ ] Filter by category, brand, stock status
  - [ ] Toggle active/inactive
  - [ ] Bulk import/export (CSV)
  - [ ] Add product button
  - **Acceptance:** Products searchable and manageable
  - **Requirements:** FR-ADM-002

- [ ] **Product Edit Page** `[Frontend]` `[L]`
  - [ ] Form with all fields (name FR/AR, description, category, brand)
  - [ ] Image upload (multiple, drag to reorder)
  - [ ] Variants table (SKU, weight, prices, stock)
  - [ ] Nutritional info section
  - [ ] Halal certification toggle
  - [ ] Active/featured toggles
  - [ ] Save button
  - **Acceptance:** Products editable with images
  - **Requirements:** FR-ADM-002

### 3.4 Customer Management

- [ ] **Customer List Page** `[Frontend]` `[M]`
  - [ ] Table with all customers
  - [ ] Filter by type (B2C, B2B), status
  - [ ] Search by name, email, phone
  - [ ] View order history button
  - [ ] Edit customer button
  - **Acceptance:** Customers searchable
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

- [ ] **Inventory List Page** `[Frontend]` `[M]`
  - [ ] Table with all product variants
  - [ ] Show SKU, product name, stock, reserved, available
  - [ ] Low stock warnings (red row)
  - [ ] Manual adjustment button
  - [ ] Import stock CSV button
  - **Acceptance:** Stock levels visible
  - **Requirements:** FR-ADM-002

- [ ] **Stock Adjustment Modal** `[Frontend]` `[S]`
  - [ ] Current stock display
  - [ ] Adjustment input (+/-)
  - [ ] Reason dropdown
  - [ ] Notes field
  - [ ] Confirm button
  - **Acceptance:** Stock adjustable with audit log
  - **Requirements:** FR-INV-001.6

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

- [ ] **Sales Report Page** `[Frontend]` `[M]`
  - [ ] Date range selector
  - [ ] Revenue chart (daily/weekly/monthly)
  - [ ] Orders count
  - [ ] Average order value
  - [ ] Top products table (by revenue and quantity)
  - [ ] Sales by category pie chart
  - [ ] B2C vs B2B breakdown
  - [ ] Export to PDF/Excel button
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
