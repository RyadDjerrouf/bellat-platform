# Bellat Digital Ordering Platform
## Project Initialization Document

**Status:** Initialization Only - Kickoff Pending
**Date:** January 8, 2026
**Project Type:** Full-Stack E-Commerce Platform (Progressive Web Application)

---

## Executive Summary

The Bellat Digital Ordering Platform is a comprehensive digital transformation initiative for CVA (Conserverie de Viandes d'Algérie), a 50+ year legacy meat products company in Algeria. This project will deliver a modern, mobile-first ordering system supporting both retail (B2C) and wholesale (B2B) customer segments with bilingual Arabic/French support.

### Project Scope
- **Phase 1 (Current):** Core platform with offline PWA, admin dashboard
- **Phase 2:** Online payments (CIB/Dahabia), GPS tracking, native apps
- **Phase 3:** ERP integration, AI forecasting, personalization
- **Out of Scope:** Driver/Delivery Staff application (separate Bellat initiative)

---

## Architecture Overview

### Technology Stack

#### Frontend Layer
```
Customer PWA:
├── Next.js 14 (App Router, SSR)
├── React 18 (UI Components)
├── Tailwind CSS 3 (Styling)
├── Zustand 4 (State Management)
├── i18next (AR/FR Localization)
└── Workbox (Service Worker/Offline)

Admin Dashboard:
├── React 18
├── Ant Design (UI Library)
├── React Query (Data Fetching)
└── Recharts (Analytics)

Note: Delivery Staff App is OUT OF SCOPE (separate Bellat project)
```

#### Backend Layer
```
Microservices (NestJS 10):
├── api-gateway          → Request routing, rate limiting, auth
├── auth-service         → Registration, login, OAuth, OTP
├── product-service      → Catalog, search, inventory
├── order-service        → Cart, checkout, order lifecycle
├── delivery-service     → Zones, scheduling, drivers
└── notification-service → SMS, Email, Push (FCM)

Shared Libraries:
├── @bellat/common       → Guards, decorators, utilities
├── @bellat/database     → Prisma schema, migrations
└── @bellat/types        → TypeScript interfaces
```

#### Data Layer
```
Primary Database:
└── PostgreSQL 15
    ├── 18 tables (users, products, orders, etc.)
    ├── Full-text search (pg_trgm)
    ├── JSONB for flexible data
    └── Read replicas for scaling

Caching Layer:
└── Redis 7
    ├── Session storage
    ├── Cart persistence
    ├── Pub/Sub messaging
    └── Rate limiting
```

#### Infrastructure
```
Deployment:
├── Docker 24 (Containerization)
├── Kubernetes 1.28 (Orchestration)
├── Cloudflare (CDN/WAF/DDoS)
├── Nginx (Load Balancer)
└── Prometheus + Grafana (Monitoring)
```

---

## Core Functional Requirements

### 1. Authentication & User Management (FR-AUTH)
- [x] **Multi-channel Registration**
  - Phone + OTP (Algerian +213 format)
  - Email + Password
  - Google OAuth 2.0
  - Facebook Login
- [x] **Session Management**
  - JWT tokens (24h access, 30d refresh)
  - "Remember me" functionality
  - Multi-device session tracking
  - Account lockout (5 failed attempts)
- [x] **B2B Approval Workflow**
  - Business document upload (RC, NIF, Attestation)
  - Manual admin approval (24-48h)
  - Credit limit assignment
  - Wholesale pricing activation

### 2. Product Catalog (FR-CAT)
- [x] **15 Product Categories** (from bellat.net)
  - Chawarma, Luncheon, Conserves, Pâtés, Kachir
  - Enfant, Slices, Salami, Les délices, Mortadella
  - Rôtis, Hot Dog, Jambon, Galantine, Autres
- [x] **Advanced Search**
  - Full-text search (PostgreSQL FTS)
  - Fuzzy matching (Levenshtein distance ≤ 2)
  - Arabic transliteration ("kachir" → "كاشير")
  - Autocomplete (top 5 suggestions)
- [x] **Product Variants**
  - Multiple weight/pack options
  - Independent pricing (retail/B2B)
  - Stock tracking per variant
  - Price-per-kg comparison
- [x] **Filtering & Sorting**
  - Category, brand, meat type, price range
  - Availability toggle
  - Sort: popularity, price, newest, A-Z

### 3. Shopping Cart & Checkout (FR-CART)
- [x] **Smart Cart**
  - Guest cart (localStorage, 30d)
  - Authenticated cart (database sync)
  - Merge on login (quantities summed)
  - Real-time stock validation
- [x] **Checkout Flow**
  - Multi-address management (max 10)
  - Zone-based delivery fee calculation
  - Delivery scheduling (tomorrow + 7 days)
  - Time slots: Morning/Afternoon/Evening
  - Minimum order enforcement per zone
- [x] **Payment Options (Phase 1)**
  - Cash on Delivery (all customers)
  - Invoice on Delivery (B2B with credit)
  - Credit limit validation

### 4. Order Management (FR-ORD)
- [x] **Order Lifecycle**
  - Unique ID: `BLT-YYYYMMDD-XXXXX`
  - Status progression: Pending → Confirmed → Preparing → Ready → Out for Delivery → Delivered
  - Alternative flows: Cancelled, Failed Delivery
- [x] **Customer Features**
  - Real-time status tracking
  - Order history with filters
  - One-click reorder
  - Cancellation (Pending status only)
- [x] **Notifications**
  - SMS (OTP, order updates, delivery alerts)
  - Email (confirmation, invoices, receipts)
  - Push notifications (FCM)

### 5. Inventory Management (FR-INV)
- [x] **Stock Control**
  - Real-time stock levels per variant
  - Reserved quantity (order placement)
  - Manual adjustments with audit log
  - Batch import (CSV/Excel)
- [x] **Alerts**
  - Low stock threshold (configurable)
  - Auto-hide when stock = 0
  - "Notify when available" feature

### 6. Delivery & Logistics (FR-DEL)
- [x] **Zone Management** (Admin Dashboard)
  - 48 Algerian Wilayas
  - Commune-level granularity
  - Zone-specific fees and minimums
  - Slot capacity limits
- [x] **Order Assignment** (Admin Dashboard)
  - Assign orders to drivers (manual)
  - View delivery routes
  - Track delivery status updates
- [ ] **Driver App:** OUT OF SCOPE - Separate Bellat initiative
  - Note: Driver status updates will be received via API
  - Admin can manually update delivery statuses

### 7. Recipe Integration (FR-REC)
- [x] **Recipe Display**
  - Recipes featuring Bellat products
  - Prep time, servings, difficulty
  - Step-by-step instructions
- [x] **Recipe-to-Cart**
  - One-click add all ingredients
  - Serving size adjustment
  - Stock availability indication

### 8. Offline Capabilities (FR-OFF)
- [x] **PWA Features**
  - Service worker caching
  - IndexedDB for cart/orders
  - Offline browsing (cached catalog)
  - Queued orders (auto-submit on reconnect)
  - Offline indicator banner

---

## Non-Functional Requirements

### Performance Targets
| Metric | Target | Network |
|--------|--------|---------|
| First Contentful Paint | < 2s | 4G |
| First Contentful Paint | < 4s | 3G |
| Time to Interactive | < 3s | 4G |
| API Response (P95) | < 500ms | N/A |
| Search Results | < 300ms | N/A |
| Concurrent Users | 1,000 | Normal |
| Peak Capacity (Ramadan) | 5,000 | Spike |

### Security Requirements
- **Encryption:** TLS 1.3 for all communications
- **Passwords:** bcrypt (cost factor 12)
- **JWT:** RS256 asymmetric signing
- **CSRF:** Double-submit cookie pattern
- **Rate Limiting:** 100 req/min (public), 1,000 (authenticated)
- **SQL Injection:** Parameterized queries (Prisma)
- **XSS:** Content Security Policy headers
- **Compliance:** OWASP Top 10, Algerian data residency

### Availability & Reliability
- **Uptime:** 99.5% (excluding planned maintenance)
- **RTO:** < 4 hours (Recovery Time Objective)
- **RPO:** < 1 hour (Recovery Point Objective)
- **Backups:** Every 6 hours, 30-day retention
- **Maintenance Window:** Sundays 02:00-06:00 Algeria time

### Localization
- **Languages:** Arabic (RTL), French (LTR)
- **Currency:** DZD (Algerian Dinar)
- **Date Format:** DD/MM/YYYY
- **Phone Format:** +213 + 9 digits
- **Fonts:** Noto Sans Arabic, Inter

---

## Database Schema Overview

### Core Entities (8 Primary Tables)

#### 1. users
```sql
id              UUID PRIMARY KEY
email           VARCHAR(255) UNIQUE
phone           VARCHAR(20) UNIQUE NOT NULL
password_hash   VARCHAR(255) NOT NULL
type            ENUM('B2C', 'B2B', 'ADMIN', 'SALES', 'WAREHOUSE', 'DELIVERY')
status          ENUM('PENDING', 'ACTIVE', 'SUSPENDED', 'DELETED')
-- B2B Fields
business_name   VARCHAR(255)
credit_limit    DECIMAL(12,2) DEFAULT 0
credit_used     DECIMAL(12,2) DEFAULT 0
payment_terms   INTEGER DEFAULT 0  -- days
```

#### 2. products
```sql
id              UUID PRIMARY KEY
category_id     UUID FK
brand_id        UUID FK
slug            VARCHAR(100) UNIQUE
name_fr         VARCHAR(200) NOT NULL
name_ar         VARCHAR(200) NOT NULL
description_fr  TEXT
description_ar  TEXT
meat_type       ENUM('BEEF', 'CHICKEN', 'TURKEY', 'MIXED', 'OTHER')
images          JSONB  -- [{url, alt, order}]
nutritional_info JSONB
is_halal        BOOLEAN DEFAULT TRUE
is_active       BOOLEAN DEFAULT TRUE
is_featured     BOOLEAN DEFAULT FALSE
```

#### 3. product_variants
```sql
id                  UUID PRIMARY KEY
product_id          UUID FK
sku                 VARCHAR(50) UNIQUE
weight              INTEGER  -- grams
retail_price        DECIMAL(12,2)
b2b_price           DECIMAL(12,2)
stock_quantity      INTEGER DEFAULT 0
reserved_quantity   INTEGER DEFAULT 0
low_stock_threshold INTEGER DEFAULT 10
-- Computed: available_stock = stock_quantity - reserved_quantity
```

#### 4. orders
```sql
id                  UUID PRIMARY KEY
order_number        VARCHAR(20) UNIQUE  -- BLT-YYYYMMDD-XXXXX
user_id             UUID FK
status              ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'READY',
                         'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'FAILED')
payment_method      ENUM('COD', 'INVOICE')
payment_status      ENUM('PENDING', 'COLLECTED', 'INVOICED', 'PAID')
delivery_address    JSONB
delivery_date       DATE NOT NULL
delivery_slot       ENUM('MORNING', 'AFTERNOON', 'EVENING')
delivery_zone_id    UUID FK
assigned_driver_id  UUID FK (nullable)
subtotal            DECIMAL(12,2)
delivery_fee        DECIMAL(12,2)
slot_surcharge      DECIMAL(12,2) DEFAULT 0
total               DECIMAL(12,2)
```

#### 5. categories (15 from bellat.net)
```sql
id              UUID PRIMARY KEY
slug            VARCHAR(100) UNIQUE
name_fr         VARCHAR(200)
name_ar         VARCHAR(200)
image_url       VARCHAR(500)
display_order   INTEGER DEFAULT 0
is_active       BOOLEAN DEFAULT TRUE
```

#### 6. delivery_zones
```sql
id                  UUID PRIMARY KEY
name                VARCHAR(200)
wilaya              VARCHAR(100)
communes            JSONB  -- Array of commune names
delivery_fee        DECIMAL(12,2)
evening_surcharge   DECIMAL(12,2) DEFAULT 0
max_orders_per_slot INTEGER DEFAULT 50
min_order_amount    DECIMAL(12,2) DEFAULT 1500
morning_available   BOOLEAN DEFAULT TRUE
afternoon_available BOOLEAN DEFAULT TRUE
evening_available   BOOLEAN DEFAULT TRUE
is_active           BOOLEAN DEFAULT TRUE
```

#### 7. recipes
```sql
id                  UUID PRIMARY KEY
slug                VARCHAR(100) UNIQUE
title_fr            VARCHAR(200)
title_ar            VARCHAR(200)
image_url           VARCHAR(500)
prep_time_minutes   INTEGER
servings            INTEGER
difficulty          ENUM('EASY', 'MEDIUM', 'HARD')
instructions_fr     JSONB  -- Array of steps
instructions_ar     JSONB
category            ENUM('STARTER', 'MAIN', 'QUICK', 'DESSERT')
is_featured         BOOLEAN DEFAULT FALSE
```

#### 8. recipe_products (Join Table)
```sql
id              UUID PRIMARY KEY
recipe_id       UUID FK
product_id      UUID FK
quantity        INTEGER
unit            VARCHAR(50)
```

### Supporting Tables
- addresses (user delivery addresses)
- order_items (line items)
- brands
- sessions (Redis + DB fallback)
- audit_logs
- notifications

### Indexes Strategy
```sql
-- Unique constraints
CREATE UNIQUE INDEX idx_users_phone ON users(phone);
CREATE UNIQUE INDEX idx_products_slug ON products(slug);
CREATE UNIQUE INDEX idx_orders_number ON orders(order_number);

-- Foreign keys
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);

-- Query optimization
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;

-- Full-text search
CREATE INDEX idx_products_search_fr ON products
    USING GIN (to_tsvector('french', name_fr || ' ' || COALESCE(description_fr, '')));
CREATE INDEX idx_products_search_ar ON products
    USING GIN (to_tsvector('arabic', name_ar || ' ' || COALESCE(description_ar, '')));
```

---

## API Structure

### Base URL Pattern
```
Production:  https://api.bellat.net/v1/
Staging:     https://api.staging.bellat.net/v1/
Development: http://localhost:3000/api/v1/
```

### Authentication Endpoints
```
POST   /auth/register          Register new user
POST   /auth/login             Login (email/phone + password)
POST   /auth/logout            Logout
POST   /auth/refresh           Refresh access token
POST   /auth/otp/send          Send OTP verification
POST   /auth/otp/verify        Verify OTP code
POST   /auth/password/reset    Request password reset
POST   /auth/password/confirm  Confirm password reset
GET    /auth/me                Get current user profile
PATCH  /auth/me                Update user profile
```

### Product Endpoints
```
GET    /products                   List products (paginated)
GET    /products/:slug             Product details
GET    /products/search            Search products
GET    /categories                 List categories
GET    /categories/:slug/products  Category products
GET    /brands                     List brands
GET    /brands/:id/products        Brand products
```

### Order Endpoints
```
GET    /cart                  Get current cart
POST   /cart/items            Add item to cart
PATCH  /cart/items/:id        Update cart item quantity
DELETE /cart/items/:id        Remove cart item
DELETE /cart                  Clear cart

POST   /orders                Place order
GET    /orders                List user orders
GET    /orders/:id            Order details
PATCH  /orders/:id/cancel     Cancel order (if allowed)
```

### Admin Endpoints
```
GET    /admin/orders                All orders (filtered)
PATCH  /admin/orders/:id/status     Update order status
GET    /admin/products              All products
POST   /admin/products              Create product
PUT    /admin/products/:id          Update product
DELETE /admin/products/:id          Delete product
PATCH  /admin/products/:id/stock    Update stock

GET    /admin/customers             All customers
PATCH  /admin/customers/:id/approve Approve B2B customer
PATCH  /admin/customers/:id/credit  Update credit limit

GET    /admin/zones                 Delivery zones
POST   /admin/zones                 Create zone
PUT    /admin/zones/:id             Update zone

GET    /admin/reports/sales         Sales report
GET    /admin/reports/inventory     Inventory report
GET    /admin/dashboard             Dashboard KPIs
```

### Delivery Endpoints (External API - for future Driver app)
```
Note: These endpoints are for the separate Driver app (external to this project)
GET    /delivery/today          Today's assigned deliveries
GET    /delivery/orders/:id     Delivery order details
PATCH  /delivery/orders/:id     Update delivery status
POST   /delivery/proof          Upload delivery proof (photo)
POST   /delivery/issue          Report delivery issue

Admin will manually update delivery statuses in Phase 1
```

---

## Business Rules Reference

### Pricing Rules
- **PR-001:** B2C customers see `retail_price`
- **PR-002:** B2B customers see `b2b_price`
- **PR-003:** B2B with `default_discount` get additional % off
- **PR-004:** All prices are TTC (includes VAT)

### Inventory Rules
- **INV-001:** `available_stock = stock_quantity - reserved_quantity`
- **INV-002:** "En stock" when `available_stock > low_stock_threshold`
- **INV-003:** "Stock limité" when `0 < available_stock ≤ threshold`
- **INV-004:** "Rupture de stock" when `available_stock = 0`
- **INV-005:** Order placement increments `reserved_quantity`
- **INV-006:** Order cancellation decrements `reserved_quantity`
- **INV-007:** Order delivery decrements both quantities

### Order Rules
- **ORD-001:** Minimum order amount per zone (default 1,500 DZD)
- **ORD-002:** Order number format: `BLT-{YYYYMMDD}-{5-digit-seq}`
- **ORD-003:** Delivery date ≥ tomorrow
- **ORD-004:** Maximum advance booking: 7 days
- **ORD-005:** Cancel allowed only in PENDING status
- **ORD-008:** Evening slot adds `zone.evening_surcharge`

### B2B Credit Rules
- **B2B-001:** B2B accounts require admin approval
- **B2B-002:** `credit_used` increases when INVOICE order placed
- **B2B-003:** `credit_used` decreases when order marked PAID
- **B2B-004:** Reject if `(credit_used + order_total) > credit_limit`

### Authentication Rules
- **AUTH-001:** OTP valid for 10 minutes
- **AUTH-002:** Max 3 OTP requests per phone per hour
- **AUTH-003:** Account locked after 5 failed logins (15-min lockout)
- **AUTH-004:** Password ≥ 8 chars with complexity
- **AUTH-005:** Session expires after 24h inactivity
- **AUTH-006:** "Remember me" extends to 30 days

---

## Development Roadmap (Phased)

### Phase 0: Foundation & Infrastructure ✓ Ready
- [ ] Cloud environment setup (Docker/Kubernetes)
- [ ] CI/CD pipeline (GitHub Actions/GitLab CI)
- [ ] PostgreSQL schema migration
- [ ] Redis cluster configuration
- [ ] i18next localization framework
- [ ] Security baseline (JWT, bcrypt, rate limiting)

### Phase 1: Core Backend Development
**Auth Service:**
- [ ] Phone/OTP integration (Algerian gateway)
- [ ] Social login (Google/Facebook)
- [ ] B2B registration workflow
- [ ] Password recovery flow
- [ ] Session management

**Product Service:**
- [ ] CRUD for 15 categories
- [ ] Full-text search with pg_trgm
- [ ] Variant management
- [ ] Stock tracking
- [ ] Image upload (S3-compatible)

**Order Service:**
- [ ] Cart management (Redis-backed)
- [ ] Checkout flow
- [ ] Order state machine
- [ ] Unique ID generator
- [ ] Stock reservation logic

**Inventory Service:**
- [ ] CSV/Excel batch import
- [ ] Manual adjustment interface
- [ ] Low stock alerts
- [ ] Audit logging

### Phase 2: Frontend & PWA Experience
**UI/UX Design:**
- [ ] Figma mockups (RTL/LTR layouts)
- [ ] Arabic font selection (Noto Sans Arabic)
- [ ] Recipe-to-cart interface
- [ ] Component library (Button, Input, Modal, etc.)

**PWA Implementation:**
- [ ] Service worker (Workbox)
- [ ] IndexedDB offline storage
- [ ] Offline order queue
- [ ] Background sync
- [ ] Install prompt

**Customer Dashboard:**
- [ ] Profile management
- [ ] Multi-address CRUD (max 10)
- [ ] Order history with filters
- [ ] Favorites list
- [ ] Notification preferences

**Checkout Flow:**
- [ ] Zone-based fee calculator
- [ ] Delivery slot availability
- [ ] B2B credit validation
- [ ] Payment method selection
- [ ] Order confirmation page

### Phase 3: Admin & Operations Dashboard
- [ ] Real-time order dashboard
- [ ] Order status management (manual delivery status updates)
- [ ] Product CRUD with image upload
- [ ] B2B approval queue
- [ ] Customer management
- [ ] Delivery zone configuration
- [ ] Order-to-driver assignment (manual assignment only)
- [ ] Analytics & reporting
- [ ] Sales heatmaps
- [ ] Inventory reports

Note: Driver mobile app is OUT OF SCOPE (Bellat handles separately)

### Phase 4: Notifications & Integrations
- [ ] Firebase Cloud Messaging (FCM)
- [ ] SMS gateway integration (Algerian provider)
- [ ] Email templates (SendGrid)
- [ ] Push notification templates
- [ ] Recipe migration from bellat.net
- [ ] Recipe-product linking

### Phase 5: QA & Launch Readiness
- [ ] Load testing (5,000 concurrent users)
- [ ] UAT with Bellat staff
- [ ] Security audit (OWASP Top 10)
- [ ] Penetration testing
- [ ] Bilingual QA (native speakers)
- [ ] Accessibility testing (WCAG 2.1 AA)
- [ ] 3G connectivity testing
- [ ] Performance benchmarking

### Phase 6: Post-Launch & Maintenance
- [ ] Monitoring setup (Prometheus + Grafana)
- [ ] ELK stack for logging
- [ ] Error tracking (Sentry)
- [ ] Database backup verification
- [ ] Weekly retrospectives
- [ ] User feedback collection
- [ ] Phase 2 planning (CIB/Dahabia payments)

---

## Critical Success Factors

### Technical Excellence
- **Code Quality:** TypeScript strict mode, ESLint, Prettier
- **Test Coverage:** Minimum 80% for backend services
- **Documentation:** OpenAPI 3.0 spec for all APIs
- **Performance:** Meet all NFRs (< 2s FCP on 4G)
- **Security:** Pass penetration testing with no critical findings

### User Experience
- **Arabic RTL:** Flawless layout and font rendering
- **Offline Mode:** Reliable queue and sync mechanism
- **Mobile-First:** Touch-optimized, 44px minimum tap targets
- **Accessibility:** WCAG 2.1 Level AA compliance
- **Error Handling:** Clear, actionable messages in AR/FR

### Business Alignment
- **B2B Workflow:** Smooth approval and credit management
- **Inventory Accuracy:** Stock sync reliability
- **Delivery Efficiency:** Zone optimization and driver app usability
- **Payment Collection:** Accurate COD tracking
- **Customer Satisfaction:** NPS > 40 (first 6 months)

### Operational Readiness
- **Admin Training:** Complete documentation and walkthroughs
- **Support System:** Help desk setup with FAQs
- **Rollback Plan:** Tested disaster recovery procedures
- **Monitoring:** 24/7 alerting (PagerDuty/similar)
- **Backup Verification:** Regular restore testing

---

## Risk Mitigation Strategy

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Offline mode failures | High | High | Extensive 3G testing, IndexedDB fallback |
| Arabic RTL issues | High | Medium | Native speaker QA, established i18n libraries |
| Inventory sync failures | Medium | High | Retry queues, manual override, dual validation |
| B2B credit abuse | Medium | High | Credit limit enforcement, approval workflows |
| Peak load (Ramadan/Eid) | Medium | High | Load testing, auto-scaling, CDN |
| Delivery coordination | Medium | Medium | SMS fallback, manual dispatch capability |
| Payment disputes (COD) | Low | Medium | Photo proof, signature capture |

---

## Next Steps (Post-Initialization)

### Immediate Actions
1. **Environment Setup:** Provision cloud resources (staging + prod)
2. **Repository Structure:** Initialize monorepo with Nx/Turborepo
3. **Database Initialization:** Run Prisma migrations
4. **Secrets Management:** Configure vault for API keys
5. **Team Onboarding:** Share documentation, assign roles

### Week 1 Milestones
- [ ] Backend scaffolding (all 6 microservices)
- [ ] Database schema deployment
- [ ] CI/CD pipeline functional
- [ ] Development environment running locally
- [ ] Frontend boilerplate (Next.js + Tailwind)

### Week 2 Milestones
- [ ] Auth service functional (login/register)
- [ ] Product catalog API endpoints
- [ ] Basic product listing UI
- [ ] Admin dashboard scaffolding

---

## Team Structure Recommendations

| Role | Responsibilities | Skills |
|------|------------------|--------|
| **Tech Lead** | Architecture, code review, decisions | Full-stack, DevOps |
| **Backend Dev (×2)** | NestJS services, database | Node.js, PostgreSQL |
| **Frontend Dev (×2)** | PWA, admin dashboard | React, Next.js, i18n |
| **DevOps Engineer** | K8s, CI/CD, monitoring | Docker, Kubernetes |
| **QA Engineer** | Testing, UAT coordination | Selenium, load testing |
| **UI/UX Designer** | Mockups, RTL layouts | Figma, Arabic design |
| **Product Manager** | Requirements, stakeholder liaison | Agile, business domain |

Note: Mobile Developer for Delivery App NOT needed (separate Bellat project)

---

## Compliance & Standards

### Security Standards
- [ ] OWASP Top 10 compliance
- [ ] TLS 1.3 enforcement
- [ ] Input validation (all endpoints)
- [ ] SQL injection prevention (Prisma ORM)
- [ ] XSS prevention (CSP headers)
- [ ] CSRF protection (double-submit)
- [ ] Rate limiting (100 req/min public)

### Data Protection
- [ ] Algerian data residency compliance
- [ ] User data export capability (GDPR-style)
- [ ] Account deletion functionality
- [ ] Audit logs (2-year retention)
- [ ] PII encryption at rest (AES-256)

### Accessibility
- [ ] WCAG 2.1 Level AA
- [ ] Screen reader compatibility
- [ ] Keyboard navigation
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Touch targets ≥ 44×44 pixels

---

## Success Metrics (First 6 Months)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Registered Users | 5,000 | Analytics |
| Monthly Active Users | 2,000 | Analytics |
| Orders per Month | 1,000 | Database |
| B2B Accounts | 100 | Database |
| Customer Satisfaction (NPS) | > 40 | Survey |
| Order Fulfillment Rate | > 95% | Operations |
| System Uptime | > 99.5% | Monitoring |
| Page Load (4G, FCP) | < 2s | Lighthouse |
| API Response (P95) | < 500ms | APM |

---

## Documentation Artifacts

### Completed ✓
- [x] Software Requirements Specification (SRS v2.0)
- [x] Functional Specification Document (FSD v1.0)
- [x] Software Product Specification (SPS v1.0)
- [x] Project Roadmap (TODO.md)

### Pending
- [ ] API Documentation (OpenAPI 3.0 spec)
- [ ] Database Schema Documentation (auto-generated from Prisma)
- [ ] Component Storybook (UI library)
- [ ] Deployment Runbook
- [ ] Incident Response Playbook
- [ ] User Manual (Admin Dashboard)
- [ ] User Manual (Customer PWA)
- [ ] Driver App Guide

---

## Contact & Stakeholders

**Bellat Group (CVA)**
Location: Tessala-El-Merdja, Algeria
Company: Conserverie de Viandes d'Algérie
Website: https://bellat.net
Social: @bellatalgerie (Facebook), @bellat_el_djazair (Instagram)

**Project Duration:** Phase 1 target: Q2 2026
**Budget Consideration:** Cost-effective VPS + Kubernetes deployment
**Language Priority:** Arabic (primary), French (secondary)

---

## Appendix: Key Design Decisions

### Why PWA over Native Apps?
- **Offline Support:** Service workers provide robust offline experience
- **Single Codebase:** Reduce development cost/time
- **No App Store:** Direct deployment, instant updates
- **Algeria Market:** High mobile usage, app install friction
- **Phase 2:** Native apps for advanced features (GPS tracking)

### Why Microservices?
- **Scalability:** Independent scaling of high-load services (orders, products)
- **Team Autonomy:** Separate teams can work on different services
- **Technology Flexibility:** Can use different databases per service
- **Fault Isolation:** Failure in one service doesn't crash entire system
- **Deployment:** Independent deployment cycles

### Why PostgreSQL over MongoDB?
- **Relational Data:** Orders, products, inventory are highly relational
- **ACID Compliance:** Critical for financial transactions (B2B credit)
- **Full-Text Search:** Built-in with pg_trgm (no Elasticsearch needed)
- **Mature Ecosystem:** Excellent tooling, backup, replication
- **Cost:** Open-source, no licensing fees

### Why NestJS?
- **TypeScript Native:** Type safety across stack
- **Enterprise-Ready:** Built-in modules for auth, validation, ORM
- **Microservices Support:** Transport-agnostic messaging
- **Testability:** Dependency injection, easy mocking
- **Team Familiarity:** Similar to Angular (if team knows Angular)

### Why Next.js 14?
- **Server-Side Rendering:** SEO critical for product catalog
- **App Router:** Modern React paradigm with layouts
- **Image Optimization:** Automatic image optimization
- **Route Handlers:** API routes for server functions
- **Static Generation:** Pre-render product pages

---

**Document Status:** INITIALIZATION COMPLETE - READY FOR KICKOFF

**Last Updated:** January 8, 2026
**Version:** 1.0
**Next Review:** Upon kickoff approval
