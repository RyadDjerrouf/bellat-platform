# Functional Specification Document
## Bellat Digital Ordering Platform

---

**Document Version:** 1.0  
**Date:** January 2026  
**Status:** Draft for Review  
**Prepared For:** Bellat Group (CVA - Conserverie de Viandes d'Algérie)  
**Location:** Tessala-El-Merdja, Algeria

---

# Table of Contents

1. Introduction
2. User Roles & Personas
3. Customer-Facing Application (PWA)
4. Admin Dashboard
5. Delivery Staff Application
6. System Integrations
7. Data Models
8. Business Rules
9. Error Handling
10. Appendices

---

# 1. Introduction

## 1.1 Purpose

This Functional Specification Document (FSD) provides a complete, detailed description of all features, user interfaces, workflows, and business logic for the Bellat Digital Ordering Platform. It serves as the primary reference for development, QA testing, and user acceptance validation.

## 1.2 Scope

This document covers the complete Phase 1 implementation:
- Customer-facing Progressive Web Application (PWA)
- Administrative back-office dashboard
- Delivery staff mobile interface
- Backend API and integrations

## 1.3 Audience

- Product Managers
- UI/UX Designers
- Frontend & Backend Developers
- QA Engineers
- Business Stakeholders
- Operations Team

## 1.4 Document Conventions

| Convention | Meaning |
|------------|---------|
| **SHALL** | Mandatory requirement |
| **SHOULD** | Recommended but not mandatory |
| **MAY** | Optional feature |
| [FIELD] | User input field |
| {VARIABLE} | System-generated value |
| → | Navigation or state transition |

---

# 2. User Roles & Personas

## 2.1 Role Definitions

### 2.1.1 Guest User
- **Access Level:** Public (no authentication)
- **Capabilities:** Browse catalog, view prices, view recipes, access contact information
- **Restrictions:** Cannot add to cart, cannot place orders, cannot view B2B pricing

### 2.1.2 B2C Customer (Retail)
- **Access Level:** Authenticated standard user
- **Capabilities:** Full ordering capabilities, order tracking, profile management, favorites
- **Pricing:** Retail prices displayed
- **Payment:** Cash on Delivery only

### 2.1.3 B2B Customer (Wholesale)
- **Access Level:** Authenticated with B2B approval
- **Capabilities:** Bulk ordering, credit-based payment, invoice access, order history export
- **Pricing:** Wholesale/tiered pricing displayed
- **Payment:** Cash on Delivery or Invoice (credit-based)
- **Special:** Assigned credit limit, dedicated account manager

### 2.1.4 Sales Staff
- **Access Level:** Internal staff authentication
- **Capabilities:** Place orders on behalf of customers, view customer profiles, access sales reports
- **Dashboard Access:** Limited admin panel

### 2.1.5 Warehouse Staff
- **Access Level:** Internal staff authentication
- **Capabilities:** View orders for fulfillment, update inventory, mark orders as prepared
- **Dashboard Access:** Warehouse module only

### 2.1.6 Delivery Staff
- **Access Level:** Mobile app authentication
- **Capabilities:** View assigned deliveries, update delivery status, collect payments, report issues
- **Dashboard Access:** Delivery mobile interface only

### 2.1.7 Administrator
- **Access Level:** Full system access
- **Capabilities:** All functions including user management, system configuration, reporting
- **Dashboard Access:** Complete admin panel

## 2.2 User Personas

### Persona 1: Fatima (B2C Customer)
- **Age:** 35
- **Location:** Algiers suburbs
- **Device:** Android smartphone (mid-range)
- **Connectivity:** 4G, occasionally drops to 3G
- **Language:** Arabic (primary), French (secondary)
- **Goals:** Order quality meat products for family, save time vs. visiting store
- **Pain Points:** Unreliable delivery times, unclear product freshness information
- **Behavior:** Orders weekly, prefers morning delivery, pays cash

### Persona 2: Karim (B2B Customer)
- **Age:** 45
- **Business:** Restaurant owner in Blida
- **Device:** Tablet and desktop computer
- **Language:** French (primary), Arabic (secondary)
- **Goals:** Reliable bulk supply, competitive pricing, credit terms for cash flow
- **Pain Points:** Running out of stock, invoice management, order tracking
- **Behavior:** Orders 2-3 times per week, large quantities, needs delivery scheduling

### Persona 3: Ahmed (Delivery Driver)
- **Age:** 28
- **Device:** Budget Android smartphone
- **Connectivity:** Variable (urban 4G, rural 3G/2G)
- **Language:** Arabic
- **Goals:** Complete deliveries efficiently, accurate navigation, easy payment recording
- **Pain Points:** Incorrect addresses, customer unavailability, app complexity

---

# 3. Customer-Facing Application (PWA)

## 3.1 Application Structure

### 3.1.1 Navigation Architecture

```
Home
├── Categories
│   └── Category Detail
│       └── Product Detail
├── Brands
│   └── Brand Products
├── Recipes
│   └── Recipe Detail
├── Search
│   └── Search Results
├── Cart
│   └── Checkout
│       └── Order Confirmation
├── My Account (authenticated)
│   ├── Profile
│   ├── Addresses
│   ├── Orders
│   │   └── Order Detail
│   ├── Favorites
│   └── Settings
└── Contact
```

### 3.1.2 Bottom Navigation Bar (Mobile)

| Icon | Label (FR) | Label (AR) | Destination |
|------|-----------|------------|-------------|
| 🏠 | Accueil | الرئيسية | Home |
| 📂 | Catégories | التصنيفات | Categories |
| 🔍 | Recherche | بحث | Search |
| 🛒 | Panier | السلة | Cart (with badge count) |
| 👤 | Compte | حسابي | Account / Login |

## 3.2 Home Screen

### 3.2.1 Layout Specification

```
┌─────────────────────────────────────┐
│ [Logo]              [🔍] [🛒] [🌐]  │ ← Header
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │      PROMOTIONAL BANNER         │ │ ← Carousel (auto-rotate 5s)
│ │      (swipeable, 3-5 slides)    │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Catégories                    Voir+ │ ← Section Header
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │
│ │ 🥩  │ │ 🍖  │ │ 🥫  │ │ 🌭  │    │ ← Horizontal scroll
│ │Kachir│ │Rôtis │ │Cons.│ │HotDog│   │
│ └─────┘ └─────┘ └─────┘ └─────┘    │
├─────────────────────────────────────┤
│ Produits Populaires           Voir+ │
│ ┌───────────┐ ┌───────────┐        │
│ │   [IMG]   │ │   [IMG]   │        │ ← Product cards
│ │ Prod Name │ │ Prod Name │        │
│ │ 450 DZD   │ │ 380 DZD   │        │
│ │  [+ADD]   │ │  [+ADD]   │        │
│ └───────────┘ └───────────┘        │
├─────────────────────────────────────┤
│ Nos Recettes                  Voir+ │
│ ┌─────────────────────────────────┐ │
│ │ [Recipe Image]                  │ │
│ │ Recipe Title        ⏱️ 30 min  │ │
│ │ Ajouter les ingrédients →       │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 🏠  📂  🔍  🛒  👤                  │ ← Bottom Nav
└─────────────────────────────────────┘
```

### 3.2.2 Home Screen Elements

#### Header Bar
| Element | Behavior |
|---------|----------|
| Logo | Tap → Return to home |
| Search Icon | Tap → Open search overlay |
| Cart Icon | Tap → Navigate to cart; Badge shows item count |
| Language Toggle | Tap → Switch between AR/FR; Refresh content |

#### Promotional Banner Carousel
- **Slides:** 3-5 promotional images managed by admin
- **Auto-rotation:** Every 5 seconds
- **Manual:** Swipe left/right to navigate
- **Indicators:** Dots showing current position
- **Tap Action:** Navigate to linked category, product, or external URL

#### Categories Section
- **Display:** Horizontal scrollable row
- **Items:** Category image + name (localized)
- **Tap Action:** Navigate to category page
- **"Voir+":** Navigate to all categories grid

#### Popular Products Section
- **Display:** 2-column grid, 4-6 products
- **Sorting:** By sales volume (last 30 days)
- **Product Card Contents:**
  - Product image (1:1 ratio)
  - Product name (truncate at 2 lines)
  - Price (retail for guests/B2C, wholesale for B2B)
  - "Add" button (quick-add default variant)

## 3.3 Product Catalog

### 3.3.1 Categories List (from bellat.net)
1. Chawarma
2. Luncheon
3. Conserves
4. Pâtés
5. Kachir
6. Enfant
7. Slices
8. Salami
9. Les délices
10. Mortadella
11. Rôtis
12. Hot Dog
13. Jambon
14. Galantine
15. Autres produits

### 3.3.2 Filter Options

| Filter | Options | Behavior |
|--------|---------|----------|
| Meat Type | Boeuf, Poulet, Dinde, Autres, Tout | Single or multi-select |
| Brand | List of available brands | Single or multi-select |
| Price Range | Slider (min-max) | Real-time filter |
| Availability | En stock only | Toggle |

### 3.3.3 Sort Options

| Option (FR) | Option (AR) | Logic |
|-------------|-------------|-------|
| Populaire | الأكثر شعبية | By sales count (desc) |
| Prix croissant | السعر: من الأقل | Price low to high |
| Prix décroissant | السعر: من الأعلى | Price high to low |
| Nouveautés | الأحدث | By created date (desc) |
| Nom A-Z | الاسم أ-ي | Alphabetical |

### 3.3.4 Product Card States

| State | Visual Indicator |
|-------|------------------|
| In Stock | Green bar (80-100% filled) |
| Low Stock | Yellow bar (20-50% filled) + "Stock limité" |
| Out of Stock | Red bar + "Rupture de stock" + disabled Add button |

### 3.3.5 Product Detail Interactions

| Action | Behavior |
|--------|----------|
| Swipe images | Navigate product gallery |
| Tap image | Open full-screen image viewer with zoom |
| Tap variant | Update displayed price, stock, add-to-cart amount |
| Tap +/- | Increment/decrement quantity (min: 1, max: 99 or stock) |
| Tap "Add to cart" | Add product with selected variant & quantity; Show toast |
| Tap ♡ (heart) | Add/remove from favorites; Requires login |
| Tap 🔗 (share) | Open native share sheet with product URL |

## 3.4 Search

### 3.4.1 Search Behavior

| Feature | Specification |
|---------|---------------|
| Minimum characters | 2 characters to trigger search |
| Debounce | 300ms after typing stops |
| Fuzzy matching | Levenshtein distance ≤ 2 |
| Arabic transliteration | "kachir" matches "كاشير" |
| Franco-Arab support | "kachir", "kashir", "cachir" all match |
| Search scope | Product name (AR/FR), description, category, brand |
| Results limit | 50 products per page |
| No results | Display "Aucun résultat" with suggestions |

## 3.5 Shopping Cart

### 3.5.1 Cart Interactions

| Action | Behavior |
|--------|----------|
| Tap +/- | Update quantity; Recalculate totals |
| Tap 🗑️ | Show confirmation → Remove item |
| Quantity > stock | Cap at available stock; Show warning |
| Quantity = 0 | Remove item from cart |
| Swipe left on item | Reveal delete button |
| Tap product name/image | Navigate to product detail |
| Tap "Passer la commande" | Proceed to checkout (or login if guest) |

### 3.5.2 Cart Validation Messages

| Condition | Message (FR) | Message (AR) |
|-----------|--------------|--------------|
| Below minimum | "Minimum de commande: {min} DZD. Ajoutez {diff} DZD." | "الحد الأدنى للطلب: {min} د.ج. أضف {diff} د.ج." |
| Item out of stock | "Produit indisponible. Veuillez le retirer." | "المنتج غير متوفر. يرجى إزالته." |
| Stock reduced | "Quantité ajustée à {qty} (stock disponible)" | "تم تعديل الكمية إلى {qty} (المخزون المتاح)" |
| Empty cart | "Votre panier est vide" | "سلتك فارغة" |

## 3.6 Checkout Flow

### 3.6.1 Step 1: Delivery Address
- Select from saved addresses
- Add new address option
- Required fields: Name, Phone, Wilaya, Commune, Full Address
- Optional: Delivery instructions

### 3.6.2 Step 2: Delivery Schedule
- Date selector (tomorrow + 7 days)
- Time slots: Morning (8h-12h), Afternoon (12h-17h), Evening (17h-21h)
- Evening slot may have surcharge (+200 DZD typical)
- Slot availability based on zone capacity

### 3.6.3 Step 3: Payment & Confirmation
- Payment method: COD (default), Invoice (B2B only)
- Order summary with all costs
- Terms acceptance checkbox
- Confirm button with total amount

### 3.6.4 Order Confirmation
- Order number displayed (format: BLT-YYYYMMDD-XXXXX)
- SMS and email confirmation sent
- Delivery date/time/location summary
- Track order and return home buttons

## 3.7 User Account

### 3.7.1 Account Menu Items
- Profile (view/edit personal info)
- Addresses (manage delivery addresses)
- Orders (order history with filters)
- Favorites (saved products)
- Notifications (settings)
- Language (AR/FR toggle)
- Help & Contact
- Logout

### 3.7.2 Order Status Definitions

| Status | FR | AR | Color | Description |
|--------|----|----|-------|-------------|
| PENDING | En attente | قيد الانتظار | 🟡 Yellow | Order placed, awaiting confirmation |
| CONFIRMED | Confirmée | مؤكدة | 🔵 Blue | Order confirmed by Bellat |
| PREPARING | En préparation | قيد التحضير | 🟢 Green | Being prepared in warehouse |
| READY | Prête | جاهزة | 🟢 Green | Ready for dispatch |
| OUT_FOR_DELIVERY | En livraison | قيد التوصيل | 🟣 Purple | With delivery driver |
| DELIVERED | Livrée | تم التوصيل | ✅ Green | Successfully delivered |
| CANCELLED | Annulée | ملغاة | 🔴 Red | Cancelled by user or admin |
| FAILED | Échec livraison | فشل التوصيل | 🔴 Red | Delivery failed |

## 3.8 Authentication

### 3.8.1 Login Methods
- Phone number + password
- Email + password
- Google OAuth
- Facebook OAuth

### 3.8.2 Registration Types
- B2C (Particulier): Standard registration
- B2B (Professionnel): Requires additional business info and approval

### 3.8.3 B2B Registration Fields
- Business name (Raison sociale)
- Tax ID (NIF)
- Trade register (RC)
- Business type (Restaurant, Hotel, Distributor, Grocery, Institution, Other)
- Document uploads (RC, NIF, Attestation)
- Note: Requires 24-48h approval

### 3.8.4 OTP Verification
- 6-digit code sent via SMS
- 10-minute validity
- Resend option after countdown (60s)
- Alternative: Voice call option

## 3.9 Recipes Section

### 3.9.1 Recipe Card Contents
- Recipe image (16:9 ratio)
- Recipe title (localized)
- Prep time
- Servings
- Difficulty level (Easy, Medium, Hard)

### 3.9.2 Recipe Detail Features
- Full instructions (step-by-step)
- Bellat product ingredients (with add-to-cart)
- Other ingredients list
- "Add all Bellat ingredients to cart" button

## 3.10 Offline Mode

### 3.10.1 Offline Capabilities

| Feature | Offline Behavior |
|---------|------------------|
| Browse catalog | ✅ Cached products displayed |
| View product details | ✅ If previously viewed |
| Search | ✅ Search within cached products |
| Add to cart | ✅ Cart stored locally |
| Place order | 🔄 Queued, submitted when online |
| View order history | ✅ Cached orders shown |
| Update order status | ❌ Requires connection |
| Login/Register | ❌ Requires connection |

### 3.10.2 Offline Indicator
- Yellow banner: "Mode hors ligne" displayed at top
- Orders queued with auto-submit on reconnection
---

# 4. Admin Dashboard

## 4.1 Dashboard Overview

### 4.1.1 Navigation Structure
- Dashboard (home)
- Orders (New, In Progress, Delivered, Cancelled)
- Products (Catalog, Categories, Stock)
- Customers (B2C, B2B, Approvals)
- Deliveries (Planning, Zones)
- Reports
- Settings

### 4.1.2 Dashboard KPIs
- New orders count (today)
- In-progress orders count
- Daily revenue (DZD)
- Monthly revenue (DZD)
- Recent orders list (last 10)
- Sales by category chart
- Peak hours chart

## 4.2 Order Management

### 4.2.1 Order List Features
- Tab filters (All, New, In Progress, Delivered, Cancelled)
- Search by order number or customer
- Date range filter
- Zone filter
- Bulk actions (Confirm, Assign driver, Export)
- Pagination

### 4.2.2 Order Detail (Admin View)
- Customer information (name, type, contact)
- Delivery address with map link
- Order items with quantities and prices
- Payment status and method
- Status change dropdown
- Driver assignment dropdown
- Internal notes field
- Order history/timeline
- Print invoice button

### 4.2.3 Order Actions by Status

| Current Status | Available Actions |
|----------------|-------------------|
| PENDING | Confirm, Cancel |
| CONFIRMED | Start Preparation, Cancel |
| PREPARING | Mark Ready, Cancel |
| READY | Assign Driver, Dispatch |
| OUT_FOR_DELIVERY | Mark Delivered, Mark Failed |
| DELIVERED | (No actions) |
| CANCELLED | (No actions) |
| FAILED | Reschedule, Refund |

## 4.3 Product Management

### 4.3.1 Product List Features
- Search by name or SKU
- Filter by category
- Filter by stock status
- Toggle active/inactive
- Bulk import/export (CSV)

### 4.3.2 Product Edit Form Fields
- Name (French) *
- Name (Arabic) *
- Description (French)
- Description (Arabic)
- Category *
- Brand *
- Meat type
- Images (multiple, drag to reorder)
- Variants table (weight, SKU, retail price, B2B price, stock)
- Nutritional info (per 100g)
- Halal certification toggle
- Active toggle
- Featured toggle

## 4.4 Customer Management

### 4.4.1 Customer List Features
- Filter by type (B2C, B2B)
- Filter by status (Active, Pending, Suspended)
- Search by name, email, phone
- View order history
- Edit customer details

### 4.4.2 B2B Approval Queue
- List of pending B2B applications
- Document viewer (RC, NIF, Attestation)
- Approval dialog with:
  - Credit limit assignment
  - Payment terms (Net 15, Net 30)
  - Default discount percentage
  - Assigned sales rep
  - Notes
- Approve / Reject / Request More Info actions

### 4.4.3 B2B Customer Details
- Business information
- Credit limit and usage
- Payment terms
- Order history
- Outstanding invoices
- Credit adjustment controls

## 4.5 Delivery Management

### 4.5.1 Delivery Zones Configuration
- Zone name
- Wilaya
- Communes (multi-select)
- Delivery fee
- Slot availability toggles (morning, afternoon, evening)
- Evening surcharge
- Max orders per slot
- Minimum order amount
- Active toggle

### 4.5.2 Driver Assignment
- List of available drivers
- Assign orders to drivers
- View driver's current route
- Route optimization (future)

## 4.6 Analytics & Reports

### 4.6.1 Sales Report
- Date range selector
- Revenue chart (daily/weekly/monthly)
- Orders count
- Average order value
- Top products (by revenue and quantity)
- Sales by category
- B2C vs B2B breakdown
- Export to PDF/Excel

### 4.6.2 Customer Report
- New registrations
- Active customers
- B2B conversion rate
- Customer retention
- Geographic distribution

### 4.6.3 Inventory Report
- Stock levels by product
- Low stock alerts
- Stock movement history
- Reorder recommendations

---

# 5. Delivery Staff Application

## 5.1 Delivery App Screens

### 5.1.1 Today's Deliveries
- Summary: To deliver count, Delivered count, Estimated time
- List of assigned deliveries sorted by route
- Each card shows:
  - Order number
  - Customer name and phone
  - Location (commune)
  - Amount to collect (with payment method)
  - Time slot
  - Start/Details button

### 5.1.2 Active Delivery Screen
- Order number
- Customer name and phone (with call button)
- Full address with delivery instructions
- Navigate button (opens Google Maps)
- Items list
- Amount to collect and payment method
- Mark as Delivered button
- Report Problem button

### 5.1.3 Delivery Confirmation
- Amount collected input (pre-filled)
- Photo capture (proof of delivery)
- Optional notes
- Confirm button

### 5.1.4 Problem Report
- Problem type selection:
  - Customer absent
  - Incorrect address
  - Customer refused
  - Product damaged
  - Other
- Description field
- Action selection:
  - Reschedule delivery
  - Return to depot
  - Partial delivery
- Submit button

## 5.2 Driver App Features

| Feature | Description |
|---------|-------------|
| Offline support | View assigned deliveries offline |
| GPS tracking | Location shared with admin (optional) |
| Call customer | One-tap call from delivery screen |
| Navigation | Open address in Google Maps |
| Photo proof | Camera capture for delivery confirmation |
| Cash recording | Record COD payment amount |
| Problem reporting | Report issues with predefined categories |

---

# 6. System Integrations

## 6.1 SMS Gateway

### 6.1.1 Provider Options
- Primary: Local Algerian provider (Mobilis, Djezzy, Ooredoo business API)
- Fallback: Twilio (international)

### 6.1.2 SMS Templates

| Event | Template (FR) |
|-------|---------------|
| OTP | "Votre code Bellat: {code}. Valide 10 min." |
| Order Confirmed | "Commande {order_id} confirmée! Livraison: {date} {slot}. Bellat" |
| Out for Delivery | "Votre commande {order_id} est en cours de livraison. Livreur: {driver}" |
| Delivered | "Commande {order_id} livrée. Merci! Bellat" |
| Password Reset | "Code de réinitialisation Bellat: {code}. Valide 1h." |

## 6.2 Push Notifications (FCM)

### 6.2.1 Notification Types

| Type | Title | Body | Action |
|------|-------|------|--------|
| order_confirmed | "Commande confirmée ✓" | "Votre commande #{id} est confirmée" | Open order |
| order_preparing | "Préparation en cours" | "Votre commande est en préparation" | Open order |
| order_delivering | "Livreur en route 🚚" | "{driver} arrive dans ~{eta} min" | Open tracking |
| order_delivered | "Livraison effectuée ✓" | "Votre commande a été livrée" | Open order |
| promotion | "{title}" | "{description}" | Open promo |
| back_in_stock | "De retour en stock!" | "{product} est disponible" | Open product |

## 6.3 Email Integration

### 6.3.1 Email Templates

| Template | Subject | Trigger |
|----------|---------|---------|
| welcome | "Bienvenue chez Bellat! 🎉" | Registration |
| order_confirmation | "Confirmation #{order_id}" | Order placed |
| order_invoice | "Facture #{order_id}" | Delivered |
| b2b_approved | "Compte professionnel activé" | B2B approval |
| b2b_rejected | "Information demande B2B" | B2B rejection |
| password_reset | "Réinitialisation mot de passe" | Password reset |
| monthly_statement | "Relevé {month} {year}" | B2B monthly |

## 6.4 Inventory Sync

### 6.4.1 Sync Methods
- Method 1: CSV/Excel batch import (manual)
- Method 2: SFTP file drop (automated daily)
- Method 3: REST API (real-time, Phase 3)

### 6.4.2 CSV Format
```csv
sku,product_name,variant,stock_quantity,last_updated
KCH-BF-200,Kachir Boeuf,200g,145,2026-01-07T08:00:00Z
KCH-BF-400,Kachir Boeuf,400g,89,2026-01-07T08:00:00Z
```

### 6.4.3 Sync Schedule
- Frequency: Daily at 06:00 local time
- Fallback: Manual upload via admin
- Conflict Resolution: External system takes precedence

## 6.5 Payment Gateway (Phase 2)

### 6.5.1 Planned Integrations
- CIB (Carte Interbancaire): Algerian debit cards
- EDAHABIA: Algérie Poste electronic payment
- Dahabia: Mobile payment solution

---

# 7. Data Models

## 7.1 User Entity

```
User {
  id: UUID (PK)
  email: String (unique, nullable)
  phone: String (unique, +213 format)
  password_hash: String (bcrypt)
  full_name: String
  language: Enum (AR, FR) default FR
  avatar_url: String (nullable)
  type: Enum (B2C, B2B, SALES_STAFF, WAREHOUSE_STAFF, DELIVERY_STAFF, ADMIN)
  status: Enum (PENDING, ACTIVE, SUSPENDED, DELETED)
  
  // B2B Specific
  business_name: String (nullable)
  tax_id: String (nullable)
  trade_register: String (nullable)
  business_type: Enum (RESTAURANT, HOTEL, DISTRIBUTOR, GROCERY, INSTITUTION, OTHER)
  credit_limit: Decimal (default 0)
  credit_used: Decimal (default 0)
  payment_terms: Integer (days, default 0)
  default_discount: Decimal (percentage, default 0)
  
  created_at: Timestamp
  updated_at: Timestamp
  last_login_at: Timestamp
}
```

## 7.2 Address Entity

```
Address {
  id: UUID (PK)
  user_id: UUID (FK → User)
  label: String
  recipient_name: String
  phone: String
  wilaya: String
  commune: String
  address_line: String
  postal_code: String (nullable)
  latitude: Decimal (nullable)
  longitude: Decimal (nullable)
  is_default: Boolean (default false)
  created_at: Timestamp
  updated_at: Timestamp
}
```

## 7.3 Product Entity

```
Product {
  id: UUID (PK)
  slug: String (unique)
  name_fr: String
  name_ar: String
  description_fr: Text
  description_ar: Text
  category_id: UUID (FK → Category)
  brand_id: UUID (FK → Brand)
  meat_type: Enum (BEEF, CHICKEN, TURKEY, MIXED, OTHER, NONE)
  images: JSON Array [{url, alt, order}]
  nutritional_info: JSON {energy_kcal, protein_g, fat_g, carbs_g, salt_g}
  is_halal: Boolean (default true)
  is_active: Boolean (default true)
  is_featured: Boolean (default false)
  created_at: Timestamp
  updated_at: Timestamp
}
```

## 7.4 Product Variant Entity

```
ProductVariant {
  id: UUID (PK)
  product_id: UUID (FK → Product)
  sku: String (unique)
  weight: Integer (grams)
  unit: String
  pack_size: Integer (nullable)
  retail_price: Decimal (DZD)
  b2b_price: Decimal (DZD)
  stock_quantity: Integer (default 0)
  reserved_quantity: Integer (default 0)
  low_stock_threshold: Integer (default 10)
  is_active: Boolean (default true)
  created_at: Timestamp
  updated_at: Timestamp
}
// Computed: available_stock = stock_quantity - reserved_quantity
```

## 7.5 Order Entity

```
Order {
  id: UUID (PK)
  order_number: String (unique, format: BLT-YYYYMMDD-XXXXX)
  user_id: UUID (FK → User)
  status: Enum (PENDING, CONFIRMED, PREPARING, READY, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, FAILED)
  payment_method: Enum (COD, INVOICE)
  payment_status: Enum (PENDING, COLLECTED, INVOICED, PAID)
  delivery_address: JSON {recipient_name, phone, wilaya, commune, address_line, postal_code, instructions}
  delivery_date: Date
  delivery_slot: Enum (MORNING, AFTERNOON, EVENING)
  delivery_zone_id: UUID (FK → DeliveryZone)
  assigned_driver_id: UUID (FK → User, nullable)
  subtotal: Decimal
  delivery_fee: Decimal
  slot_surcharge: Decimal (default 0)
  discount_amount: Decimal (default 0)
  total: Decimal
  customer_notes: Text (nullable)
  internal_notes: Text (nullable)
  delivery_photo_url: String (nullable)
  created_at: Timestamp
  confirmed_at: Timestamp (nullable)
  prepared_at: Timestamp (nullable)
  dispatched_at: Timestamp (nullable)
  delivered_at: Timestamp (nullable)
  cancelled_at: Timestamp (nullable)
  cancellation_reason: String (nullable)
}
```

## 7.6 Order Item Entity

```
OrderItem {
  id: UUID (PK)
  order_id: UUID (FK → Order)
  variant_id: UUID (FK → ProductVariant)
  product_name: String (snapshot)
  variant_description: String (snapshot)
  quantity: Integer
  unit_price: Decimal
  total_price: Decimal
  created_at: Timestamp
}
```

## 7.7 Category Entity

```
Category {
  id: UUID (PK)
  slug: String (unique)
  name_fr: String
  name_ar: String
  description_fr: Text (nullable)
  description_ar: Text (nullable)
  image_url: String (nullable)
  display_order: Integer (default 0)
  is_active: Boolean (default true)
  created_at: Timestamp
  updated_at: Timestamp
}
```

## 7.8 Recipe Entity

```
Recipe {
  id: UUID (PK)
  slug: String (unique)
  title_fr: String
  title_ar: String
  description_fr: Text
  description_ar: Text
  image_url: String
  video_url: String (nullable)
  prep_time_minutes: Integer
  cook_time_minutes: Integer
  servings: Integer
  difficulty: Enum (EASY, MEDIUM, HARD)
  instructions_fr: JSON Array
  instructions_ar: JSON Array
  other_ingredients_fr: Text
  other_ingredients_ar: Text
  category: Enum (STARTER, MAIN, QUICK, DESSERT)
  is_featured: Boolean (default false)
  is_active: Boolean (default true)
  created_at: Timestamp
  updated_at: Timestamp
}
```

## 7.9 Delivery Zone Entity

```
DeliveryZone {
  id: UUID (PK)
  name: String
  wilaya: String
  communes: JSON Array [String]
  delivery_fee: Decimal
  morning_available: Boolean (default true)
  afternoon_available: Boolean (default true)
  evening_available: Boolean (default true)
  evening_surcharge: Decimal (default 0)
  max_orders_per_slot: Integer (default 50)
  min_order_amount: Decimal (default 1500)
  is_active: Boolean (default true)
  created_at: Timestamp
  updated_at: Timestamp
}
```
---

# 8. Business Rules

## 8.1 Pricing Rules

| Rule ID | Rule Description |
|---------|------------------|
| PR-001 | B2C customers see retail_price for all products |
| PR-002 | B2B customers see b2b_price for all products |
| PR-003 | B2B customers with default_discount > 0 see discounted b2b_price |
| PR-004 | Price displayed always includes VAT (TTC) |
| PR-005 | Price per kg calculated as: (price / weight_grams) × 1000 |

## 8.2 Inventory Rules

| Rule ID | Rule Description |
|---------|------------------|
| INV-001 | available_stock = stock_quantity - reserved_quantity |
| INV-002 | Product shows "En stock" when available_stock > low_stock_threshold |
| INV-003 | Product shows "Stock limité" when 0 < available_stock ≤ low_stock_threshold |
| INV-004 | Product shows "Rupture de stock" when available_stock = 0 |
| INV-005 | Order placement reserves stock (increases reserved_quantity) |
| INV-006 | Order cancellation releases stock (decreases reserved_quantity) |
| INV-007 | Order delivery confirms stock reduction (decreases both quantities) |
| INV-008 | Cannot add more items to cart than available_stock |

## 8.3 Order Rules

| Rule ID | Rule Description |
|---------|------------------|
| ORD-001 | Minimum order amount enforced per delivery zone (default 1,500 DZD) |
| ORD-002 | Order number format: BLT-{YYYYMMDD}-{5-digit-sequence} |
| ORD-003 | Orders can only be placed for delivery dates ≥ tomorrow |
| ORD-004 | Maximum advance booking: 7 days |
| ORD-005 | Customer can cancel order only in PENDING status |
| ORD-006 | Customer can request cancellation in CONFIRMED status (requires admin approval) |
| ORD-007 | Orders in PREPARING or later cannot be cancelled by customer |
| ORD-008 | Evening slot (17h-21h) adds surcharge defined by zone |

## 8.4 B2B Credit Rules

| Rule ID | Rule Description |
|---------|------------------|
| B2B-001 | B2B accounts require admin approval before activation |
| B2B-002 | credit_used increases when INVOICE order is placed |
| B2B-003 | credit_used decreases when INVOICE order is marked PAID |
| B2B-004 | Cannot place INVOICE order if (credit_used + order_total) > credit_limit |
| B2B-005 | Credit terms define payment due date (delivery_date + payment_terms days) |
| B2B-006 | Monthly statement generated on 1st of each month for B2B with credit_used > 0 |

## 8.5 Delivery Rules

| Rule ID | Rule Description |
|---------|------------------|
| DEL-001 | Delivery slots: Morning (8h-12h), Afternoon (12h-17h), Evening (17h-21h) |
| DEL-002 | Slot availability determined by zone configuration |
| DEL-003 | Slot disabled when orders_count ≥ max_orders_per_slot |
| DEL-004 | Delivery fee determined by zone (delivery_zone.delivery_fee) |
| DEL-005 | Driver must record payment amount for COD orders |
| DEL-006 | Driver must capture photo proof for all deliveries |
| DEL-007 | Failed delivery requires reason code and rescheduling decision |

## 8.6 Authentication Rules

| Rule ID | Rule Description |
|---------|------------------|
| AUTH-001 | OTP valid for 10 minutes |
| AUTH-002 | Maximum 3 OTP requests per phone per hour |
| AUTH-003 | Account locked after 5 failed login attempts (15-minute lockout) |
| AUTH-004 | Password must be ≥ 8 characters with complexity requirements |
| AUTH-005 | Session token expires after 24 hours of inactivity |
| AUTH-006 | "Remember me" extends session to 30 days |
| AUTH-007 | Password reset link valid for 1 hour |

## 8.7 Cart Rules

| Rule ID | Rule Description |
|---------|------------------|
| CART-001 | Guest cart persisted in localStorage (30-day expiry) |
| CART-002 | Authenticated cart persisted in database |
| CART-003 | Guest cart merged into user cart on login (quantities summed) |
| CART-004 | Cart item quantity capped at available_stock |
| CART-005 | Out-of-stock items flagged but not auto-removed |
| CART-006 | Price changes reflected on cart refresh |
| CART-007 | Cart cleared after successful order placement |

---

# 9. Error Handling

## 9.1 User-Facing Error Messages

| Code | Condition | Message (FR) | Message (AR) |
|------|-----------|--------------|--------------|
| E001 | Invalid credentials | "Email/téléphone ou mot de passe incorrect" | "البريد/الهاتف أو كلمة المرور غير صحيحة" |
| E002 | Account locked | "Compte temporairement bloqué. Réessayez dans 15 min." | "الحساب مغلق. حاول بعد 15 دقيقة." |
| E003 | OTP expired | "Code expiré. Demandez un nouveau code." | "انتهت صلاحية الرمز. اطلب رمزاً جديداً." |
| E004 | OTP invalid | "Code incorrect. Vérifiez et réessayez." | "الرمز غير صحيح. تحقق وحاول مرة أخرى." |
| E005 | Email exists | "Cette adresse email est déjà utilisée" | "البريد الإلكتروني مستخدم بالفعل" |
| E006 | Phone exists | "Ce numéro est déjà enregistré" | "هذا الرقم مسجل بالفعل" |
| E007 | Out of stock | "Produit en rupture de stock" | "المنتج غير متوفر" |
| E008 | Insufficient stock | "Stock insuffisant. Maximum: {qty}" | "المخزون غير كافٍ. الحد الأقصى: {qty}" |
| E009 | Below minimum | "Minimum de commande: {min} DZD" | "الحد الأدنى للطلب: {min} د.ج" |
| E010 | Zone unavailable | "Livraison non disponible dans cette zone" | "التوصيل غير متاح في هذه المنطقة" |
| E011 | Slot full | "Ce créneau n'est plus disponible" | "هذا الموعد لم يعد متاحاً" |
| E012 | Credit exceeded | "Limite de crédit dépassée. Disponible: {available} DZD" | "تم تجاوز حد الائتمان. المتاح: {available} د.ج" |
| E013 | Session expired | "Session expirée. Veuillez vous reconnecter." | "انتهت الجلسة. يرجى تسجيل الدخول." |
| E014 | Network error | "Erreur de connexion. Vérifiez votre internet." | "خطأ في الاتصال. تحقق من الإنترنت." |
| E015 | Server error | "Une erreur est survenue. Réessayez plus tard." | "حدث خطأ. حاول لاحقاً." |

## 9.2 Empty States

| Screen | Icon | Message | Action |
|--------|------|---------|--------|
| Empty cart | 🛒 | "Votre panier est vide" | "Parcourir les produits" |
| No orders | 📦 | "Aucune commande" | "Commencer mes achats" |
| No favorites | ❤️ | "Aucun favori" | "Découvrir les produits" |
| No search results | 🔍 | "Aucun résultat pour '{query}'" | "Modifier la recherche" |
| No addresses | 📍 | "Aucune adresse enregistrée" | "Ajouter une adresse" |

## 9.3 Form Validation

| Field | Validation | Error Message |
|-------|------------|---------------|
| Email | Valid format | "Format d'email invalide" |
| Phone | +213 + 9 digits | "Numéro de téléphone invalide" |
| Password | Min 8 chars, complexity | "Le mot de passe ne respecte pas les critères" |
| Confirm Password | Match | "Les mots de passe ne correspondent pas" |
| Required field | Not empty | "Ce champ est obligatoire" |
| Quantity | Integer > 0 | "Quantité invalide" |

---

# 10. Appendices

## 10.1 Algerian Wilayas (Provinces)

```
01 - Adrar           17 - Djelfa          33 - Illizi
02 - Chlef           18 - Jijel           34 - Bordj Bou Arréridj
03 - Laghouat        19 - Sétif           35 - Boumerdès
04 - Oum El Bouaghi  20 - Saïda           36 - El Tarf
05 - Batna           21 - Skikda          37 - Tindouf
06 - Béjaïa          22 - Sidi Bel Abbès  38 - Tissemsilt
07 - Biskra          23 - Annaba          39 - El Oued
08 - Béchar          24 - Guelma          40 - Khenchela
09 - Blida           25 - Constantine     41 - Souk Ahras
10 - Bouira          26 - Médéa           42 - Tipaza
11 - Tamanrasset     27 - Mostaganem      43 - Mila
12 - Tébessa         28 - M'Sila          44 - Aïn Defla
13 - Tlemcen         29 - Mascara         45 - Naâma
14 - Tiaret          30 - Ouargla         46 - Aïn Témouchent
15 - Tizi Ouzou      31 - Oran            47 - Ghardaïa
16 - Alger           32 - El Bayadh       48 - Relizane
```

## 10.2 Delivery Time Slots

| Slot ID | Name (FR) | Name (AR) | Hours | Default Surcharge |
|---------|-----------|-----------|-------|-------------------|
| MORNING | Matin | صباحاً | 08:00 - 12:00 | 0 DZD |
| AFTERNOON | Après-midi | بعد الظهر | 12:00 - 17:00 | 0 DZD |
| EVENING | Soir | مساءً | 17:00 - 21:00 | 200 DZD |

## 10.3 Order Status Flow

```
PENDING → CONFIRMED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED
    ↓          ↓                                      ↓
CANCELLED  CANCELLED                               FAILED
```

## 10.4 API Response Codes

| HTTP Code | Meaning | Usage |
|-----------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable Entity | Business rule violation |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 503 | Service Unavailable | Maintenance mode |

## 10.5 Localization Guidelines

### Arabic (AR)
- **Direction:** Right-to-Left (RTL)
- **Font:** Noto Sans Arabic, Tahoma, Arial
- **Numbers:** Support Arabic-Indic (٠١٢٣٤٥٦٧٨٩) and Western (0123456789)
- **Currency:** "د.ج" after amount (e.g., "1,500 د.ج")
- **Date format:** DD/MM/YYYY
- **Decimal separator:** Comma (,)
- **Thousands separator:** Space or period

### French (FR)
- **Direction:** Left-to-Right (LTR)
- **Font:** Inter, Arial, Helvetica
- **Numbers:** Western numerals
- **Currency:** "DZD" after amount (e.g., "1 500 DZD")
- **Date format:** DD/MM/YYYY
- **Decimal separator:** Comma (,)
- **Thousands separator:** Space

## 10.6 Performance Budgets

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint (4G) | < 1.5s | Lighthouse |
| First Contentful Paint (3G) | < 3.0s | Lighthouse |
| Time to Interactive (4G) | < 3.0s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| JavaScript bundle size | < 200KB | Gzipped |
| Total page weight | < 1MB | Initial load |
| API response time (P95) | < 500ms | Server metrics |

## 10.7 Accessibility Checklist

- [ ] All images have alt text
- [ ] Form inputs have associated labels
- [ ] Color contrast ratio ≥ 4.5:1 (text), ≥ 3:1 (large text)
- [ ] Focus indicators visible on interactive elements
- [ ] Keyboard navigation works for all features
- [ ] Touch targets ≥ 44×44 pixels
- [ ] Error messages announced to screen readers
- [ ] Page language declared in HTML
- [ ] Headings follow logical hierarchy (H1 → H2 → H3)
- [ ] Skip navigation link provided

---

# Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 2026 | — | Initial functional specification |

---

**End of Functional Specification Document**
