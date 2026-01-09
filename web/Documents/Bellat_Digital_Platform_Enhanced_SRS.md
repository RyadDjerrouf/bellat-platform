# Software Requirements Specification
## Assessment & Enhanced Version

---

# Bellat Digital Ordering Platform
### (Web & Progressive Web Application)

**Version 2.0**

**Prepared For:** Bellat Group (CVA - Conserverie de Viandes d'Algérie)  
**Location:** Tessala-El-Merdja, Algeria  
**Date:** January 2026

---

# Part 1: Assessment of Original SRS

## 1.1 Executive Summary

The original SRS v1.0 provides a competent foundation for the Bellat Digital Ordering Platform. It demonstrates solid understanding of the business context, target users, and core functional requirements. The document correctly identifies key constraints specific to the Algerian market, including intermittent connectivity, Cash on Delivery preference, and bilingual requirements (Arabic/French).

However, several critical areas require enhancement to ensure successful implementation. This assessment identifies gaps in technical specifications, missing user stories, security considerations, and Algeria-specific integrations that must be addressed before development begins.

**Overall Assessment Score: 68/100** — Good foundation, requires significant enhancement.

---

## 1.2 Strengths of Original Document

1. **Clear Business Context:** Accurately captures Bellat's 50+ year history and market position as a reference player in Algeria's agro-food sector.

2. **Appropriate Scope:** PWA approach is well-suited for Algeria's mobile-first market with varying connectivity.

3. **Realistic Constraints:** Correctly identifies Cash on Delivery requirement, partial manual inventory, and bilingual needs.

4. **Dual-Channel Strategy:** B2C and B2B ordering with appropriate differentiation (bulk pricing, credit terms, manual approval).

5. **Phased Approach:** Wisely defers GPS tracking and online payments to Phase 2.

6. **Sound Tech Stack:** React/Next.js + Node.js/NestJS + PostgreSQL is a proven, scalable combination.

7. **Recipe Integration:** Smart feature that leverages existing content for cart upselling.

8. **Role-Based Access:** Well-defined permission matrix covering all user types.

---

## 1.3 Gaps & Areas Requiring Enhancement

| Category | Gap Identified | Priority | Impact |
|----------|---------------|----------|--------|
| **Offline Support** | PWA offline capabilities not defined despite intermittent connectivity constraint | 🔴 Critical | Users unable to browse/order during network outages |
| **Authentication** | No social login (Google/Facebook), no password recovery flow, no session management | 🔴 High | Poor UX, security vulnerabilities |
| **Notifications** | No push notification system for order updates, promotions, delivery alerts | 🔴 High | Missed customer engagement opportunities |
| **Search & Discovery** | Basic search mentioned but no fuzzy search, Arabic transliteration, or autocomplete | 🟡 Medium | Poor product discoverability |
| **Payment Gateway** | No specification for future CIB/Dahabia integration (Algeria's payment systems) | 🟡 Medium | Delayed Phase 2 implementation |
| **API Documentation** | No API versioning strategy, rate limiting, or documentation requirements | 🔴 High | Integration difficulties, security risks |
| **Data Privacy** | No mention of Algerian data residency requirements or privacy compliance | 🔴 High | Legal/compliance risks |
| **Testing Strategy** | No acceptance criteria, test coverage requirements, or UAT process | 🔴 High | Quality assurance gaps |
| **Accessibility** | No WCAG compliance requirements for users with disabilities | 🟡 Medium | Exclusion of user segments |
| **Error Handling** | No error states, retry logic, or user feedback mechanisms defined | 🔴 High | Poor UX during failures |
| **Performance Metrics** | Vague "< 2 seconds" without specifying conditions, percentiles, or measurement | 🟡 Medium | Unmeasurable SLAs |
| **Localization** | Arabic/French mentioned but no RTL layout specs, date/currency formats | 🔴 High | Poor Arabic UX |

---

## 1.4 Current Website Analysis (bellat.net)

Analysis of the existing Bellat website reveals the current digital presence and integration opportunities:

### Existing Product Taxonomy (15 Categories)
The following categories exist and should be preserved in the new platform:
- Chawarma
- Luncheon
- Conserves
- Pâtés
- Kachir
- Enfant (Children's products)
- Slices
- Salami
- Les délices
- Mortadella
- Rôtis
- Hot Dog
- Jambon
- Galantine
- Autres produits

### Key Observations

1. **Brand Architecture:** Multiple brand families exist under Bellat umbrella — platform should support brand-level filtering and showcase.

2. **Recipe Content:** Existing recipe section with product linkage — valuable asset for "Add recipe ingredients to cart" feature.

3. **Product Filtering:** Current site supports filtering by meat type (Boeuf, Poulet, Dinde, Autres) — this should be enhanced with additional attributes.

4. **Contact Infrastructure:** Form exists but lacks CRM integration — opportunity for unified customer data.

5. **Social Presence:** Active on Facebook (@bellatalgerie), YouTube, and Instagram (@bellat_el_djazair) — social login and sharing features are relevant.

6. **Arabic Tagline:** "غذاؤك ترعاه أياد أمينة" (Your food is cared for by trustworthy hands) — bilingual content strategy is already established.

7. **Technical Issue:** Current site has localhost references in navigation links — indicates development/staging configuration leak.

---

## 1.5 Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Offline mode not working reliably | High | High | Implement service workers with IndexedDB; extensive testing on 3G |
| Arabic RTL layout issues | High | Medium | Use established i18n libraries; native Arabic speaker QA |
| Inventory sync failures | Medium | High | Implement retry queues; manual override capabilities |
| B2B credit abuse | Medium | High | Credit limit enforcement; manager approval workflows |
| Peak load failures (Ramadan/Eid) | Medium | High | Load testing; auto-scaling infrastructure |
| Delivery coordination failures | Medium | Medium | SMS fallback; manual dispatch capabilities |

---

# Part 2: Enhanced Software Requirements Specification

## 2.1 Introduction

### 2.1.1 Purpose

This enhanced SRS defines complete functional and non-functional requirements for the Bellat Digital Ordering Platform. It serves as the definitive reference for all stakeholders including business sponsors, product management, development teams, QA, operations, and third-party integrators.

### 2.1.2 Product Vision

Transform Bellat's customer ordering experience through a modern, mobile-first digital platform that honors the company's 50+ year legacy of quality while embracing digital innovation. The platform will serve as the foundation for Bellat's digital transformation, enabling direct customer relationships, data-driven decision making, and operational efficiency.

### 2.1.3 Scope

**In Scope (Phase 1):**
- Customer-facing Progressive Web Application (PWA) with offline capabilities
- Admin dashboard for order, inventory, and customer management
- RESTful API backend with real-time WebSocket capabilities
- Integration layer for inventory synchronization
- Bilingual support (Arabic RTL / French LTR)
- Cash on Delivery and Invoice payment methods
- Push notification system
- Recipe-to-cart functionality

**Out of Scope (Future Phases):**
- Online payment integration (CIB/Dahabia) — Phase 2
- Native mobile applications (iOS/Android) — Phase 2
- Real-time GPS delivery tracking — Phase 2
- Loyalty/rewards program — Phase 2
- ERP real-time integration — Phase 3
- AI-based demand forecasting — Phase 3

### 2.1.4 Target Users

| User Type | Description | Primary Goals |
|-----------|-------------|---------------|
| **Guest User** | Unregistered visitor browsing products | Explore catalog, view prices, understand offerings |
| **B2C Customer** | Individual retail consumer (households) | Quick ordering, track deliveries, reorder favorites |
| **B2B Customer** | Distributors, restaurants, institutions | Bulk orders, credit terms, volume pricing, invoicing |
| **Sales Staff** | Bellat field sales representatives | Place orders for clients, view customer history |
| **Warehouse Staff** | Inventory and fulfillment team | Pick/pack orders, update stock, manage inventory |
| **Delivery Staff** | Drivers and delivery personnel | View route, update delivery status, collect payment |
| **Administrator** | System administrators and managers | Full system access, analytics, user management |

### 2.1.5 Assumptions & Constraints

**Assumptions:**
- Users have smartphones with modern browsers (Chrome, Safari, Firefox)
- Minimum 3G connectivity available (with offline fallback)
- Bellat has existing inventory data in exportable format
- Delivery zones are pre-defined and static for Phase 1
- Product pricing is managed centrally

**Constraints:**
- Internet connectivity may be intermittent in rural areas
- Online payment adoption is limited; Cash on Delivery is mandatory
- Inventory systems may be partially manual; daily batch sync acceptable
- Must support Android 8+ and iOS 12+ browsers
- Must comply with Algerian data residency requirements

---

## 2.2 Functional Requirements

### 2.2.1 User Authentication & Profile Management

#### FR-AUTH-001: Registration
| ID | Requirement |
|----|-------------|
| FR-AUTH-001.1 | System SHALL support registration via phone number with OTP verification |
| FR-AUTH-001.2 | System SHALL support registration via email and password |
| FR-AUTH-001.3 | System SHALL support social login via Google OAuth 2.0 |
| FR-AUTH-001.4 | System SHALL support social login via Facebook Login |
| FR-AUTH-001.5 | System SHALL validate phone numbers as Algerian format (+213) |
| FR-AUTH-001.6 | System SHALL require minimum 8-character passwords with complexity rules |
| FR-AUTH-001.7 | System SHALL send welcome notification upon successful registration |

#### FR-AUTH-002: Login & Session Management
| ID | Requirement |
|----|-------------|
| FR-AUTH-002.1 | System SHALL support login via phone/OTP or email/password |
| FR-AUTH-002.2 | System SHALL implement "Remember Me" functionality (30-day token) |
| FR-AUTH-002.3 | System SHALL support biometric login on compatible devices |
| FR-AUTH-002.4 | System SHALL invalidate sessions after 24 hours of inactivity |
| FR-AUTH-002.5 | System SHALL allow users to view and terminate active sessions |
| FR-AUTH-002.6 | System SHALL lock accounts after 5 failed login attempts (15-min lockout) |

#### FR-AUTH-003: Password Recovery
| ID | Requirement |
|----|-------------|
| FR-AUTH-003.1 | System SHALL send password reset link via email (valid 1 hour) |
| FR-AUTH-003.2 | System SHALL send password reset OTP via SMS |
| FR-AUTH-003.3 | System SHALL invalidate all sessions upon password change |

#### FR-AUTH-004: Profile Management
| ID | Requirement |
|----|-------------|
| FR-AUTH-004.1 | Users SHALL manage multiple delivery addresses (max 10) |
| FR-AUTH-004.2 | Users SHALL set a default delivery address |
| FR-AUTH-004.3 | Users SHALL update contact details (phone, email) |
| FR-AUTH-004.4 | Users SHALL view complete order history |
| FR-AUTH-004.5 | Users SHALL set language preference (Arabic/French) |
| FR-AUTH-004.6 | Users SHALL manage notification preferences |
| FR-AUTH-004.7 | Users SHALL request account deletion (GDPR-style) |

#### FR-AUTH-005: B2B Account Management
| ID | Requirement |
|----|-------------|
| FR-AUTH-005.1 | B2B registration SHALL require business documentation upload |
| FR-AUTH-005.2 | B2B accounts SHALL require manual approval by administrator |
| FR-AUTH-005.3 | System SHALL notify applicant of approval status via SMS/email |
| FR-AUTH-005.4 | Approved B2B accounts SHALL have assigned credit limits |
| FR-AUTH-005.5 | System SHALL display B2B-specific pricing upon login |

---

### 2.2.2 Product Catalog

#### FR-CAT-001: Product Display
| ID | Requirement |
|----|-------------|
| FR-CAT-001.1 | System SHALL display products organized by category (15 existing categories) |
| FR-CAT-001.2 | System SHALL display products organized by brand |
| FR-CAT-001.3 | Each product SHALL display: name (AR/FR), description, images (min 2), weight/pack options |
| FR-CAT-001.4 | Each product SHALL display price (retail for B2C, wholesale for B2B) |
| FR-CAT-001.5 | Each product SHALL display nutritional information |
| FR-CAT-001.6 | Each product SHALL display Halal certification badge |
| FR-CAT-001.7 | System SHALL indicate stock availability (In Stock, Low Stock, Out of Stock) |
| FR-CAT-001.8 | System SHALL support product image zoom and gallery view |

#### FR-CAT-002: Search & Filtering
| ID | Requirement |
|----|-------------|
| FR-CAT-002.1 | System SHALL provide full-text search across product names and descriptions |
| FR-CAT-002.2 | System SHALL support fuzzy search (typo tolerance) |
| FR-CAT-002.3 | System SHALL support Arabic-to-Franco-Arab transliteration (e.g., "kachir" finds "كاشير") |
| FR-CAT-002.4 | System SHALL provide autocomplete suggestions (top 5) |
| FR-CAT-002.5 | System SHALL filter by category, brand, meat type, price range |
| FR-CAT-002.6 | System SHALL sort by: relevance, price (low-high, high-low), popularity, newest |
| FR-CAT-002.7 | System SHALL remember user's last filter preferences |

#### FR-CAT-003: Product Variants
| ID | Requirement |
|----|-------------|
| FR-CAT-003.1 | System SHALL support multiple weight/pack variants per product |
| FR-CAT-003.2 | Each variant SHALL have independent pricing and stock levels |
| FR-CAT-003.3 | System SHALL display price-per-kg for comparison |

---

### 2.2.3 Shopping Cart & Checkout

#### FR-CART-001: Cart Management
| ID | Requirement |
|----|-------------|
| FR-CART-001.1 | Users SHALL add products to cart with quantity selection |
| FR-CART-001.2 | Users SHALL update quantities or remove items from cart |
| FR-CART-001.3 | System SHALL persist cart across sessions (logged-in users) |
| FR-CART-001.4 | System SHALL persist cart in local storage (guest users) |
| FR-CART-001.5 | System SHALL merge guest cart with user cart upon login |
| FR-CART-001.6 | System SHALL display running total with itemized breakdown |
| FR-CART-001.7 | System SHALL validate stock availability before checkout |
| FR-CART-001.8 | System SHALL notify user if item becomes unavailable |

#### FR-CART-002: Checkout Process
| ID | Requirement |
|----|-------------|
| FR-CART-002.1 | System SHALL require login/registration before checkout |
| FR-CART-002.2 | Users SHALL select or add delivery address |
| FR-CART-002.3 | Users SHALL select delivery date from available slots |
| FR-CART-002.4 | Users SHALL select delivery time window (morning, afternoon, evening) |
| FR-CART-002.5 | System SHALL calculate delivery fee based on zone |
| FR-CART-002.6 | Users SHALL optionally select pickup from Bellat location |
| FR-CART-002.7 | Users SHALL add order notes/special instructions |
| FR-CART-002.8 | System SHALL display order summary before confirmation |

#### FR-CART-003: Payment Options (Phase 1)
| ID | Requirement |
|----|-------------|
| FR-CART-003.1 | System SHALL support Cash on Delivery (COD) for all customers |
| FR-CART-003.2 | System SHALL support Invoice on Delivery for approved B2B customers |
| FR-CART-003.3 | B2B invoice orders SHALL check against available credit limit |
| FR-CART-003.4 | System SHALL reject B2B orders exceeding credit limit |

#### FR-CART-004: Minimum Order & Delivery Zones
| ID | Requirement |
|----|-------------|
| FR-CART-004.1 | System SHALL enforce minimum order value (configurable by admin) |
| FR-CART-004.2 | System SHALL define delivery zones with associated fees |
| FR-CART-004.3 | System SHALL restrict delivery to supported zones only |
| FR-CART-004.4 | System SHALL display "delivery not available" for unsupported addresses |

---

### 2.2.4 Order Management

#### FR-ORD-001: Order Creation
| ID | Requirement |
|----|-------------|
| FR-ORD-001.1 | System SHALL generate unique order ID (format: BLT-YYYYMMDD-XXXXX) |
| FR-ORD-001.2 | System SHALL capture complete order snapshot (prices, quantities, addresses) |
| FR-ORD-001.3 | System SHALL send order confirmation via SMS and email |
| FR-ORD-001.4 | System SHALL send push notification upon order placement |
| FR-ORD-001.5 | System SHALL reserve inventory upon order confirmation |

#### FR-ORD-002: Order Status Lifecycle
| ID | Requirement |
|----|-------------|
| FR-ORD-002.1 | Orders SHALL follow status progression: Pending → Confirmed → Preparing → Ready → Out for Delivery → Delivered |
| FR-ORD-002.2 | System SHALL support status: Cancelled (with reason) |
| FR-ORD-002.3 | System SHALL support status: Partially Delivered (with notes) |
| FR-ORD-002.4 | System SHALL support status: Failed Delivery (with reason and retry scheduling) |
| FR-ORD-002.5 | System SHALL notify customer on each status change |
| FR-ORD-002.6 | System SHALL log timestamp and user for each status change |

#### FR-ORD-003: Order Tracking
| ID | Requirement |
|----|-------------|
| FR-ORD-003.1 | Users SHALL view real-time order status |
| FR-ORD-003.2 | Users SHALL view estimated delivery time |
| FR-ORD-003.3 | Users SHALL view delivery driver name and contact (when Out for Delivery) |
| FR-ORD-003.4 | Users SHALL contact support directly from order details |

#### FR-ORD-004: Order Modification & Cancellation
| ID | Requirement |
|----|-------------|
| FR-ORD-004.1 | Users MAY cancel orders in "Pending" status without penalty |
| FR-ORD-004.2 | Users MAY request cancellation of "Confirmed" orders (requires approval) |
| FR-ORD-004.3 | Orders in "Preparing" or later status SHALL NOT be cancellable by user |
| FR-ORD-004.4 | Admin MAY cancel any order with documented reason |

#### FR-ORD-005: Reordering
| ID | Requirement |
|----|-------------|
| FR-ORD-005.1 | Users SHALL reorder from previous order with one click |
| FR-ORD-005.2 | System SHALL check availability and notify of unavailable items |
| FR-ORD-005.3 | System SHALL update prices to current pricing |

---

### 2.2.5 Inventory Management

#### FR-INV-001: Stock Management
| ID | Requirement |
|----|-------------|
| FR-INV-001.1 | System SHALL maintain real-time stock levels per product variant |
| FR-INV-001.2 | System SHALL support batch import of inventory data (CSV/Excel) |
| FR-INV-001.3 | System SHALL sync with warehouse data (daily batch minimum) |
| FR-INV-001.4 | System SHALL reserve stock upon order placement |
| FR-INV-001.5 | System SHALL release reserved stock upon cancellation |
| FR-INV-001.6 | Admin SHALL manually adjust stock with documented reason |

#### FR-INV-002: Stock Alerts
| ID | Requirement |
|----|-------------|
| FR-INV-002.1 | System SHALL alert when stock falls below threshold (configurable) |
| FR-INV-002.2 | System SHALL auto-hide products when stock reaches zero |
| FR-INV-002.3 | System SHALL support "notify me when available" for out-of-stock items |

---

### 2.2.6 Delivery & Logistics

#### FR-DEL-001: Delivery Assignment
| ID | Requirement |
|----|-------------|
| FR-DEL-001.1 | Admin SHALL assign orders to delivery routes/drivers |
| FR-DEL-001.2 | System SHALL group orders by zone for route optimization |
| FR-DEL-001.3 | Drivers SHALL view assigned deliveries in mobile-optimized interface |
| FR-DEL-001.4 | System SHALL display delivery sequence and navigation links |

#### FR-DEL-002: Delivery Execution
| ID | Requirement |
|----|-------------|
| FR-DEL-002.1 | Drivers SHALL update order status upon delivery |
| FR-DEL-002.2 | Drivers SHALL capture delivery confirmation (signature or photo) |
| FR-DEL-002.3 | Drivers SHALL record payment collected (COD orders) |
| FR-DEL-002.4 | Drivers SHALL report delivery issues with reason codes |

#### FR-DEL-003: Delivery Scheduling
| ID | Requirement |
|----|-------------|
| FR-DEL-003.1 | Admin SHALL configure available delivery slots per zone |
| FR-DEL-003.2 | System SHALL enforce maximum orders per slot |
| FR-DEL-003.3 | System SHALL block fully-booked slots from selection |

---

### 2.2.7 Recipe Integration

#### FR-REC-001: Recipe Display
| ID | Requirement |
|----|-------------|
| FR-REC-001.1 | System SHALL display recipes featuring Bellat products |
| FR-REC-001.2 | Each recipe SHALL list required Bellat products with quantities |
| FR-REC-001.3 | Recipes SHALL include preparation instructions and cooking time |
| FR-REC-001.4 | Recipes SHALL include photos/video links |

#### FR-REC-002: Recipe-to-Cart
| ID | Requirement |
|----|-------------|
| FR-REC-002.1 | Users SHALL add all recipe ingredients to cart with one click |
| FR-REC-002.2 | System SHALL adjust quantities based on serving size selection |
| FR-REC-002.3 | System SHALL indicate which ingredients are available/unavailable |

---

### 2.2.8 Notifications

#### FR-NOT-001: Push Notifications
| ID | Requirement |
|----|-------------|
| FR-NOT-001.1 | System SHALL request push notification permission on first visit |
| FR-NOT-001.2 | System SHALL send order status updates via push notification |
| FR-NOT-001.3 | System SHALL send delivery arrival notification |
| FR-NOT-001.4 | Admin SHALL send promotional notifications to opted-in users |
| FR-NOT-001.5 | Users SHALL manage notification preferences in profile |

#### FR-NOT-002: SMS Notifications
| ID | Requirement |
|----|-------------|
| FR-NOT-002.1 | System SHALL send SMS for critical updates (order confirmed, out for delivery) |
| FR-NOT-002.2 | System SHALL send SMS for OTP verification |
| FR-NOT-002.3 | System SHALL use Algerian SMS gateway provider |

#### FR-NOT-003: Email Notifications
| ID | Requirement |
|----|-------------|
| FR-NOT-003.1 | System SHALL send order confirmation email with details |
| FR-NOT-003.2 | System SHALL send invoice/receipt email upon delivery |
| FR-NOT-003.3 | B2B customers SHALL receive monthly statement emails |

---

### 2.2.9 Offline Capabilities (PWA)

#### FR-OFF-001: Offline Browsing
| ID | Requirement |
|----|-------------|
| FR-OFF-001.1 | System SHALL cache product catalog for offline browsing |
| FR-OFF-001.2 | System SHALL cache product images (compressed) |
| FR-OFF-001.3 | System SHALL display "offline mode" indicator |
| FR-OFF-001.4 | System SHALL sync cart when connection restored |

#### FR-OFF-002: Offline Ordering
| ID | Requirement |
|----|-------------|
| FR-OFF-002.1 | Users SHALL add items to cart while offline |
| FR-OFF-002.2 | System SHALL queue orders placed offline |
| FR-OFF-002.3 | System SHALL submit queued orders when connection restored |
| FR-OFF-002.4 | System SHALL notify user of successful submission |

---

## 2.3 Admin & Back-Office Requirements

### 2.3.1 Order Dashboard

| ID | Requirement |
|----|-------------|
| FR-ADM-001.1 | Admin SHALL view all orders with filtering (status, date, customer, zone) |
| FR-ADM-001.2 | Admin SHALL update order status with notes |
| FR-ADM-001.3 | Admin SHALL print invoices and delivery slips |
| FR-ADM-001.4 | Admin SHALL export orders to CSV/Excel |
| FR-ADM-001.5 | Dashboard SHALL display real-time order count by status |
| FR-ADM-001.6 | Dashboard SHALL highlight urgent orders (same-day delivery) |

### 2.3.2 Product & Pricing Management

| ID | Requirement |
|----|-------------|
| FR-ADM-002.1 | Admin SHALL create/edit/delete products |
| FR-ADM-002.2 | Admin SHALL manage product categories and brands |
| FR-ADM-002.3 | Admin SHALL upload multiple product images |
| FR-ADM-002.4 | Admin SHALL define retail and B2B price tiers |
| FR-ADM-002.5 | Admin SHALL enable/disable products (soft delete) |
| FR-ADM-002.6 | Admin SHALL schedule price changes (effective date) |
| FR-ADM-002.7 | Admin SHALL bulk import/export products (CSV) |

### 2.3.3 Customer Management

| ID | Requirement |
|----|-------------|
| FR-ADM-003.1 | Admin SHALL view all registered customers |
| FR-ADM-003.2 | Admin SHALL approve/reject B2B applications |
| FR-ADM-003.3 | Admin SHALL set/modify B2B credit limits |
| FR-ADM-003.4 | Admin SHALL view customer order history and spending |
| FR-ADM-003.5 | Admin SHALL add notes to customer profiles |
| FR-ADM-003.6 | Admin SHALL disable/enable customer accounts |

### 2.3.4 Analytics & Reporting

| ID | Requirement |
|----|-------------|
| FR-ADM-004.1 | Dashboard SHALL display daily/weekly/monthly sales summary |
| FR-ADM-004.2 | Dashboard SHALL display top-selling products |
| FR-ADM-004.3 | Dashboard SHALL display sales by category/brand |
| FR-ADM-004.4 | Dashboard SHALL display peak ordering times (hourly heatmap) |
| FR-ADM-004.5 | Dashboard SHALL display customer acquisition metrics |
| FR-ADM-004.6 | Dashboard SHALL display delivery performance metrics |
| FR-ADM-004.7 | Admin SHALL export reports to PDF/Excel |

### 2.3.5 System Configuration

| ID | Requirement |
|----|-------------|
| FR-ADM-005.1 | Admin SHALL configure delivery zones and fees |
| FR-ADM-005.2 | Admin SHALL configure delivery time slots |
| FR-ADM-005.3 | Admin SHALL configure minimum order values |
| FR-ADM-005.4 | Admin SHALL manage promotional banners |
| FR-ADM-005.5 | Admin SHALL configure stock alert thresholds |
| FR-ADM-005.6 | Admin SHALL manage user roles and permissions |

---

## 2.4 Non-Functional Requirements

### 2.4.1 Performance

| ID | Requirement | Metric |
|----|-------------|--------|
| NFR-PERF-001 | Page load time (first contentful paint) | < 2 seconds on 4G |
| NFR-PERF-002 | Page load time (first contentful paint) | < 4 seconds on 3G |
| NFR-PERF-003 | Time to interactive | < 3 seconds on 4G |
| NFR-PERF-004 | API response time (95th percentile) | < 500ms |
| NFR-PERF-005 | Search results returned | < 300ms |
| NFR-PERF-006 | Concurrent users supported | 1,000 minimum |
| NFR-PERF-007 | Peak load capacity (Ramadan/Eid) | 5,000 concurrent users |

### 2.4.2 Scalability

| ID | Requirement |
|----|-------------|
| NFR-SCAL-001 | System SHALL support horizontal scaling of API servers |
| NFR-SCAL-002 | Database SHALL support read replicas for scaling |
| NFR-SCAL-003 | Static assets SHALL be served via CDN |
| NFR-SCAL-004 | System SHALL auto-scale based on load metrics |

### 2.4.3 Security

| ID | Requirement |
|----|-------------|
| NFR-SEC-001 | All data transmission SHALL use TLS 1.3 |
| NFR-SEC-002 | Passwords SHALL be hashed using bcrypt (cost factor 12) |
| NFR-SEC-003 | API SHALL use JWT tokens with 24-hour expiry |
| NFR-SEC-004 | System SHALL implement CSRF protection |
| NFR-SEC-005 | System SHALL implement rate limiting (100 requests/minute/IP) |
| NFR-SEC-006 | Admin actions SHALL be logged in audit trail |
| NFR-SEC-007 | PII data SHALL be encrypted at rest (AES-256) |
| NFR-SEC-008 | System SHALL comply with OWASP Top 10 guidelines |
| NFR-SEC-009 | Penetration testing SHALL be conducted before launch |

### 2.4.4 Availability & Reliability

| ID | Requirement | Metric |
|----|-------------|--------|
| NFR-AVAIL-001 | System uptime | 99.5% (excluding planned maintenance) |
| NFR-AVAIL-002 | Planned maintenance window | Sundays 02:00-06:00 local time |
| NFR-AVAIL-003 | Recovery Time Objective (RTO) | < 4 hours |
| NFR-AVAIL-004 | Recovery Point Objective (RPO) | < 1 hour |
| NFR-AVAIL-005 | Database backup frequency | Every 6 hours |
| NFR-AVAIL-006 | Backup retention | 30 days |

### 2.4.5 Usability

| ID | Requirement |
|----|-------------|
| NFR-USE-001 | Interface SHALL be responsive (mobile, tablet, desktop) |
| NFR-USE-002 | Arabic interface SHALL use proper RTL layout |
| NFR-USE-003 | System SHALL support language switching without page reload |
| NFR-USE-004 | Navigation SHALL require maximum 3 clicks to any product |
| NFR-USE-005 | Checkout SHALL be completable in under 2 minutes |
| NFR-USE-006 | Error messages SHALL be clear and actionable |
| NFR-USE-007 | System SHALL support WCAG 2.1 Level AA accessibility |

### 2.4.6 Localization

| ID | Requirement |
|----|-------------|
| NFR-LOC-001 | All UI text SHALL be available in Arabic and French |
| NFR-LOC-002 | Arabic interface SHALL use RTL layout direction |
| NFR-LOC-003 | Dates SHALL display in user's locale format |
| NFR-LOC-004 | Currency SHALL display as DZD (Algerian Dinar) |
| NFR-LOC-005 | Phone numbers SHALL accept Algerian format (+213) |
| NFR-LOC-006 | System SHALL support Arabic numerals (٠١٢٣٤٥٦٧٨٩) |

### 2.4.7 Compliance

| ID | Requirement |
|----|-------------|
| NFR-COMP-001 | User data SHALL be stored in Algeria or compliant jurisdiction |
| NFR-COMP-002 | System SHALL provide data export upon user request |
| NFR-COMP-003 | System SHALL support account deletion requests |
| NFR-COMP-004 | System SHALL maintain audit logs for 2 years |

---

## 2.5 Technical Architecture

### 2.5.1 System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   PWA (React)   │  Admin Dashboard │   Delivery App (PWA)       │
│   Next.js SSR   │    (React)       │                            │
└────────┬────────┴────────┬────────┴──────────┬──────────────────┘
         │                 │                    │
         └────────────────┬┴───────────────────┘
                          │ HTTPS/WSS
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY                                 │
│              (Rate Limiting, Auth, Logging)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND SERVICES                              │
├─────────────────┬─────────────────┬─────────────────────────────┤
│  Order Service  │ Product Service │  User Service               │
│                 │                 │                              │
├─────────────────┼─────────────────┼─────────────────────────────┤
│ Inventory Svc   │ Delivery Svc    │  Notification Service       │
│                 │                 │  (Push, SMS, Email)         │
└────────┬────────┴────────┬────────┴──────────┬──────────────────┘
         │                 │                    │
         └────────────────┬┴───────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ PostgreSQL  │  │    Redis    │  │   S3/Minio  │
│  (Primary)  │  │   (Cache)   │  │  (Assets)   │
└─────────────┘  └─────────────┘  └─────────────┘
```

### 2.5.2 Technology Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Frontend (PWA)** | Next.js 14 + React 18 | SSR for SEO, excellent PWA support |
| **Admin Dashboard** | React + Ant Design | Comprehensive component library |
| **Backend API** | NestJS (Node.js) | TypeScript, modular architecture |
| **Database** | PostgreSQL 15 | Reliable, JSON support, full-text search |
| **Cache** | Redis 7 | Session storage, cart caching, pub/sub |
| **Search** | PostgreSQL FTS + pg_trgm | Fuzzy search, avoid external dependency |
| **File Storage** | S3-compatible (Minio) | Product images, documents |
| **Push Notifications** | Firebase Cloud Messaging | Cross-platform support |
| **SMS Gateway** | Twilio or local provider | OTP, order notifications |
| **Email** | SendGrid or Mailgun | Transactional emails |
| **Hosting** | VPS + Docker + Kubernetes | Scalable, cost-effective |
| **CDN** | Cloudflare | Global edge caching, DDoS protection |
| **Monitoring** | Prometheus + Grafana | Metrics and alerting |
| **Logging** | ELK Stack | Centralized log management |

### 2.5.3 API Design

- RESTful API following OpenAPI 3.0 specification
- Versioned endpoints: `/api/v1/...`
- JSON request/response format
- WebSocket for real-time order status updates
- Rate limiting: 100 requests/minute for public, 1000 for authenticated
- Authentication: JWT Bearer tokens

### 2.5.4 Database Schema (Key Entities)

```
users
├── id (UUID)
├── phone, email, password_hash
├── type (B2C, B2B, STAFF, ADMIN)
├── status (PENDING, ACTIVE, SUSPENDED)
├── language_preference
├── created_at, updated_at

products
├── id (UUID)
├── name_ar, name_fr
├── description_ar, description_fr
├── category_id, brand_id
├── images (JSONB)
├── nutritional_info (JSONB)
├── is_active, is_halal
├── created_at, updated_at

product_variants
├── id (UUID)
├── product_id (FK)
├── sku, weight, unit
├── retail_price, b2b_price
├── stock_quantity, reserved_quantity
├── low_stock_threshold

orders
├── id (UUID)
├── order_number (BLT-YYYYMMDD-XXXXX)
├── user_id (FK)
├── status, payment_method, payment_status
├── delivery_address (JSONB)
├── delivery_date, delivery_slot
├── subtotal, delivery_fee, total
├── notes
├── created_at, updated_at

order_items
├── id (UUID)
├── order_id (FK)
├── variant_id (FK)
├── quantity, unit_price, total_price
```

---

## 2.6 Deployment & Maintenance

### 2.6.1 Environments

| Environment | Purpose | URL Pattern |
|-------------|---------|-------------|
| Development | Developer testing | dev.bellat.net |
| Staging | QA and UAT | staging.bellat.net |
| Production | Live system | bellat.net, app.bellat.net |

### 2.6.2 CI/CD Pipeline

1. Code push triggers automated build
2. Unit tests executed (minimum 80% coverage)
3. Integration tests executed
4. Security scan (SAST)
5. Build Docker images
6. Deploy to staging (automatic)
7. Deploy to production (manual approval)

### 2.6.3 Monitoring & Alerting

| Metric | Alert Threshold |
|--------|-----------------|
| API Error Rate | > 1% for 5 minutes |
| Response Time (P95) | > 1 second for 5 minutes |
| CPU Utilization | > 80% for 10 minutes |
| Memory Utilization | > 85% for 10 minutes |
| Database Connections | > 80% of pool |
| Failed Logins | > 100/hour from single IP |

---

## 2.7 Future Enhancements (Roadmap)

### Phase 2 (Q3 2026)
- Online payment integration (CIB/Dahabia/EDAHABIA)
- Real-time GPS delivery tracking
- Native mobile apps (iOS/Android)
- Loyalty/rewards program
- Promotional codes and discounts

### Phase 3 (Q1 2027)
- ERP real-time integration
- AI-based demand forecasting
- Personalized product recommendations
- Voice ordering (Arabic/French)
- WhatsApp Business integration

---

## 2.8 Acceptance Criteria

### 2.8.1 Launch Readiness Checklist

- [ ] All Phase 1 functional requirements implemented
- [ ] Performance benchmarks met (load testing passed)
- [ ] Security audit completed with no critical findings
- [ ] UAT sign-off from business stakeholders
- [ ] Arabic RTL layout reviewed by native speakers
- [ ] Offline mode tested on 3G/intermittent connectivity
- [ ] Admin training completed
- [ ] Support documentation prepared
- [ ] Rollback procedure tested
- [ ] Monitoring and alerting configured

### 2.8.2 Success Metrics (First 6 Months)

| Metric | Target |
|--------|--------|
| Registered users | 5,000 |
| Monthly active users | 2,000 |
| Orders per month | 1,000 |
| B2B accounts | 100 |
| Customer satisfaction (NPS) | > 40 |
| Order fulfillment rate | > 95% |
| System uptime | > 99.5% |

---

## 2.9 Appendices

### Appendix A: Glossary

| Term | Definition |
|------|------------|
| B2B | Business-to-Business customer (distributors, restaurants) |
| B2C | Business-to-Consumer customer (retail households) |
| COD | Cash on Delivery payment method |
| DZD | Algerian Dinar (currency) |
| PWA | Progressive Web Application |
| RTL | Right-to-Left (Arabic text direction) |
| SKU | Stock Keeping Unit (product variant identifier) |
| OTP | One-Time Password |

### Appendix B: References

- Original SRS v1.0 (Bellat Digital Ordering Platform)
- Bellat corporate website: https://bellat.net
- Algeria e-payment regulations (Banque d'Algérie)
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/

### Appendix C: Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 2025 | Original | Initial SRS |
| 2.0 | Jan 2026 | Enhanced | Assessment + comprehensive enhancements |

---

**End of Document**
