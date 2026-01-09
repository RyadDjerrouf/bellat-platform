# 📋 Bellat Digital Ordering Platform - Project Roadmap

> **Project Goal:** Launch a robust, bilingual PWA for Bellat Group by Phase 1 deadline.
> **Current Status:** SRS v2.0 Finalized | **Next Step:** Infrastructure Setup

---

## 🏗️ Phase 0: Foundation & Infrastructure
- [ ] **Cloud Setup:** Configure production/staging environments (Docker/Kubernetes).
- [ ] **CI/CD Pipeline:** Set up GitHub Actions/GitLab CI for automated testing and deployment.
- [ ] **Database Schema Migration:** Initialize PostgreSQL with the schema defined in section 2.5.4.
- [ ] **Localization Framework:** Set up `i18next` or similar for AR/FR support and RTL CSS switching.
- [ ] **Security Baseline:** Implement JWT logic, Bcrypt hashing, and Rate Limiting middleware.

---

## 💻 Phase 1: Core Backend Development (NestJS)
- [ ] **Auth System (FR-AUTH):** - [ ] Phone/OTP integration (Algerian gateway).
    - [ ] Social Login (Google/Facebook).
    - [ ] B2B Registration & Approval workflow.
- [ ] **Catalog API (FR-CAT):**
    - [ ] CRUD for 15 primary categories.
    - [ ] Full-text search with `pg_trgm` for Arabic/French fuzzy matching.
- [ ] **Order Engine (FR-ORD):**
    - [ ] Unique ID generator (`BLT-YYYYMMDD-XXXXX`).
    - [ ] State machine for order status (Pending -> Delivered).
- [ ] **Inventory Sync (FR-INV):**
    - [ ] CSV/Excel batch import tool for warehouse staff.

---

## 📱 Phase 2: Frontend & PWA Experience (Next.js)
- [ ] **UI/UX Design:** - [ ] Create Figma mockups for RTL (Arabic) layouts.
    - [ ] Design the "Recipe-to-Cart" interface.
- [ ] **PWA Features (FR-OFF):**
    - [ ] Implement Service Workers for offline asset caching.
    - [ ] Build IndexedDB logic for "Offline Queue" order placement.
- [ ] **Customer Dashboard:**
    - [ ] Multi-address management (max 10).
    - [ ] Order history and real-time status tracking.
- [ ] **Checkout Flow:**
    - [ ] Zone-based delivery fee calculator.
    - [ ] B2B Credit Limit validation logic.

---

## 🛠️ Phase 3: Admin & Operations Dashboard
- [ ] **Order Control Center:** Real-time dashboard for "Preparing" and "Out for Delivery" orders.
- [ ] **Inventory Management:** Manual stock adjustment interface with audit logs.
- [ ] **Delivery App (Driver View):** Mobile-optimized view for drivers to update status and record COD collection.
- [ ] **Analytics (FR-ADM-004):** Implement sales heatmaps and top-product reporting.

---

## 🔔 Phase 4: Notifications & Integrations
- [ ] **Push Notifications:** Firebase Cloud Messaging (FCM) integration for order updates.
- [ ] **SMS/Email:** Transactional templates for OTP and Order Receipts.
- [ ] **Recipe Linkage:** Scrape/Migrate existing recipes from `bellat.net` into the new DB.

---

## 🧪 Phase 5: QA & Launch Readiness
- [ ] **Load Testing:** Simulate 5,000 concurrent users (Ramadan simulation).
- [ ] **UAT:** Conduct user acceptance testing with Bellat internal staff (Algeria location).
- [ ] **Security Audit:** OWASP Top 10 scan and penetration testing.
- [ ] **Bilingual QA:** Final sign-off on Arabic RTL layout and font rendering.

---

## 🚀 Phase 6: Post-Launch & Maintenance
- [ ] Monitor error rates via ELK/Grafana.
- [ ] Weekly database backups.
- [ ] Gather user feedback for Phase 2 (CIB/Dahabia payments).
