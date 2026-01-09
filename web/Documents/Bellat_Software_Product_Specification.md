# SOFTWARE PRODUCT SPECIFICATION
## Bellat Digital Ordering Platform

---

**Document Version:** 1.0  
**Date:** January 2026  
**Status:** Draft for Review  
**Classification:** Confidential  
**Prepared For:** Bellat Group (CVA - Conserverie de Viandes d'Algérie)

---

## Document Contents

This comprehensive specification includes:
- **Part 1:** Top-Level Design Document (System Architecture)
- **Part 2:** Detailed Design Document (Component Specifications)
- **Part 3:** Database Design Document (Schema & ERD)
- **Part 4:** Interface Design Document (API Specifications)
- **Part 5:** Source Code Listings (Key Implementation Examples)

---

# TABLE OF CONTENTS

1. [Document Overview](#1-document-overview)
2. [Top-Level Design Document](#2-top-level-design-document)
3. [Detailed Design Document](#3-detailed-design-document)
4. [Database Design Document](#4-database-design-document)
5. [Interface Design Document](#5-interface-design-document)
6. [Source Code Listings](#6-source-code-listings)
7. [Appendices](#7-appendices)

---

# 1. DOCUMENT OVERVIEW

## 1.1 Purpose and Scope

This Software Product Specification (SPS) provides comprehensive technical documentation for the Bellat Digital Ordering Platform. It serves as the primary reference for the development team, system architects, database administrators, and quality assurance engineers throughout the software development lifecycle.

The platform is a Progressive Web Application (PWA) designed to enable Bellat's customers to browse products, place orders, and track deliveries. It supports both B2C (retail) and B2B (wholesale) customer segments with differentiated pricing, credit management, and specialized workflows.

### 1.1.1 Scope Matrix

| Aspect | In Scope | Out of Scope |
|--------|----------|--------------|
| Frontend | PWA (Next.js), Admin Dashboard (React) | Native iOS/Android apps |
| Backend | REST API, Authentication, Order Processing | ERP Integration (Phase 3) |
| Database | PostgreSQL schema, Redis caching | Data warehouse, Analytics DB |
| Integrations | SMS, Email, Push Notifications | Online Payment (Phase 2) |
| Users | B2C, B2B, Admin, Delivery Staff | Supplier Portal |

## 1.2 Definitions and Acronyms

| Term | Definition |
|------|------------|
| API | Application Programming Interface |
| B2B | Business-to-Business (wholesale customers) |
| B2C | Business-to-Consumer (retail customers) |
| COD | Cash on Delivery |
| CRUD | Create, Read, Update, Delete operations |
| DZD | Algerian Dinar (currency) |
| ERD | Entity Relationship Diagram |
| FCM | Firebase Cloud Messaging |
| JWT | JSON Web Token |
| OTP | One-Time Password |
| PWA | Progressive Web Application |
| REST | Representational State Transfer |
| RTL | Right-to-Left (Arabic text direction) |
| SKU | Stock Keeping Unit |
| SSR | Server-Side Rendering |
| TLS | Transport Layer Security |

## 1.3 Related Documents

| Document | Version | Description |
|----------|---------|-------------|
| Bellat_Digital_Platform_Enhanced_SRS.md | 2.0 | Software Requirements Specification |
| Bellat_Digital_Platform_Functional_Spec.md | 1.0 | Functional Specification Document |
| bellat.net | - | Existing company website (reference) |

---

# 2. TOP-LEVEL DESIGN DOCUMENT

## 2.1 System Architecture Overview

The Bellat Digital Ordering Platform follows a modern microservices-oriented architecture with clear separation between the presentation layer, business logic layer, and data layer. The system is designed for scalability, maintainability, and resilience.

### 2.1.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────┬─────────────────┬─────────────────┬───────────────────────┤
│   Customer PWA  │  Admin Dashboard │  Delivery App   │    External Apps     │
│   (Next.js)     │    (React)       │   (React PWA)   │    (Future APIs)     │
└────────┬────────┴────────┬────────┴────────┬────────┴──────────┬────────────┘
         │                 │                 │                   │
         └─────────────────┴─────────────────┴───────────────────┘
                                    │
                                    ▼
                           ┌────────────────┐
                           │   CDN / WAF    │
                           │  (Cloudflare)  │
                           └────────┬───────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                            API GATEWAY LAYER                                   │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  Load Balancer (Nginx) → Rate Limiting → Authentication → Routing       │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────┬───────────────────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                          MICROSERVICES LAYER (NestJS)                          │
├─────────────┬─────────────┬─────────────┬─────────────┬───────────────────────┤
│    Auth     │   Product   │    Order    │  Delivery   │    Notification       │
│   Service   │   Service   │   Service   │   Service   │      Service          │
├─────────────┼─────────────┼─────────────┼─────────────┼───────────────────────┤
│  • Login    │  • Catalog  │  • Cart     │  • Zones    │  • SMS Gateway        │
│  • Register │  • Search   │  • Checkout │  • Routing  │  • Push (FCM)         │
│  • OAuth    │  • Stock    │  • Payments │  • Tracking │  • Email (SendGrid)   │
│  • Sessions │  • Pricing  │  • History  │  • Drivers  │  • Templates          │
└──────┬──────┴──────┬──────┴──────┬──────┴──────┬──────┴───────────┬───────────┘
       │             │             │             │                  │
       └─────────────┴─────────────┴─────────────┴──────────────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     │                             │
                     ▼                             ▼
              ┌─────────────┐              ┌───────────────┐
              │    Redis    │              │  PostgreSQL   │
              │   Cluster   │              │   Database    │
              ├─────────────┤              ├───────────────┤
              │  • Sessions │              │  • Users      │
              │  • Cache    │              │  • Products   │
              │  • Queues   │              │  • Orders     │
              │  • Pub/Sub  │              │  • Inventory  │
              └─────────────┘              └───────────────┘
```

### 2.1.2 Component Descriptions

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| Customer PWA | Customer-facing shopping experience | Next.js 14, React 18, Tailwind |
| Admin Dashboard | Back-office management interface | React 18, Ant Design |
| Delivery App | Driver mobile interface | React PWA, Capacitor |
| API Gateway | Request routing, rate limiting, auth | Nginx, NestJS |
| Auth Service | Authentication, authorization, sessions | NestJS, Passport, JWT |
| Product Service | Catalog, search, inventory management | NestJS, Prisma, PostgreSQL FTS |
| Order Service | Cart, checkout, order lifecycle | NestJS, Prisma, Redis |
| Delivery Service | Zones, scheduling, driver management | NestJS, Prisma |
| Notification Service | SMS, email, push notifications | NestJS, FCM, SendGrid |

## 2.2 Architecture Principles

| Principle | Description |
|-----------|-------------|
| **Separation of Concerns** | Each service handles a single domain with clear boundaries |
| **Stateless Services** | All backend services are stateless; session data stored in Redis |
| **API-First Design** | All functionality exposed through documented REST APIs |
| **Event-Driven Communication** | Asynchronous messaging via Redis pub/sub |
| **Defense in Depth** | Multiple security layers: WAF, API gateway, service-level auth |
| **Graceful Degradation** | System continues with reduced capability when services unavailable |
| **Offline-First PWA** | Customer app caches data locally and queues orders |

## 2.3 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend** | | | |
| Framework | Next.js | 14.x | React framework with SSR/SSG |
| UI Library | React | 18.x | Component-based UI |
| Styling | Tailwind CSS | 3.x | Utility-first CSS framework |
| State | Zustand | 4.x | Lightweight state management |
| **Backend** | | | |
| Framework | NestJS | 10.x | Node.js microservices framework |
| Language | TypeScript | 5.x | Type-safe JavaScript |
| ORM | Prisma | 5.x | Database toolkit and ORM |
| Auth | Passport.js | 0.7.x | Authentication middleware |
| **Database** | | | |
| Primary DB | PostgreSQL | 15.x | Relational database |
| Cache | Redis | 7.x | In-memory data store |
| Search | PostgreSQL FTS | 15.x | Full-text search with pg_trgm |
| **Infrastructure** | | | |
| Container | Docker | 24.x | Containerization |
| Orchestration | Kubernetes | 1.28 | Container orchestration |
| CDN/WAF | Cloudflare | - | DDoS protection, caching |
| **External Services** | | | |
| Push | Firebase FCM | - | Push notifications |
| Email | SendGrid | - | Transactional emails |
| SMS | Local Gateway | - | Algerian SMS provider |

## 2.4 Deployment Architecture

### 2.4.1 Environment Strategy

| Environment | Purpose | URL | Deployment |
|-------------|---------|-----|------------|
| Development | Feature testing | dev.bellat.net | Push to feature/* |
| Staging | QA/UAT | staging.bellat.net | Merge to develop |
| Production | Live system | bellat.net | Manual approval |

### 2.4.2 Kubernetes Resources

| Service | Replicas | CPU | Memory | HPA Max |
|---------|----------|-----|--------|---------|
| API Gateway | 3 | 500m | 512Mi | 10 |
| Auth Service | 2 | 250m | 256Mi | 5 |
| Product Service | 3 | 500m | 512Mi | 8 |
| Order Service | 3 | 500m | 512Mi | 10 |
| Delivery Service | 2 | 250m | 256Mi | 5 |
| Notification Service | 2 | 250m | 256Mi | 5 |
| Redis Cluster | 3 | 1000m | 2Gi | - |
| PostgreSQL | 1+2 | 2000m | 4Gi | - |

## 2.5 Security Architecture

### 2.5.1 Security Controls

| Control | Implementation | Layer |
|---------|----------------|-------|
| TLS Encryption | TLS 1.3 for all communications | Transport |
| Password Hashing | bcrypt with cost factor 12 | Application |
| JWT Signing | RS256 asymmetric algorithm | Application |
| CSRF Protection | Double-submit cookie pattern | Application |
| Rate Limiting | 100 requests/min per IP | API Gateway |
| SQL Injection | Parameterized queries via Prisma | Database |
| XSS Prevention | Content Security Policy headers | Frontend |
| Input Validation | class-validator decorators | Application |

### 2.5.2 Authentication Flow

```
1. Client sends credentials → Auth Service
2. Auth Service validates → Checks bcrypt hash, account status
3. Generates JWT tokens → Access (24h) + Refresh (30d)
4. Stores session in Redis → TTL 86400
5. Returns tokens to client
6. Client includes token in Authorization header
7. API Gateway validates JWT on each request
```

---

# 3. DETAILED DESIGN DOCUMENT

## 3.1 Frontend Application Structure

```
bellat-frontend/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── locales/               # i18n (ar.json, fr.json)
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/            # Auth routes (login, register)
│   │   ├── (shop)/            # Shop routes (products, cart)
│   │   ├── account/           # User account pages
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── ui/                # Button, Input, Modal, Toast
│   │   ├── product/           # ProductCard, ProductGrid
│   │   ├── cart/              # CartItem, CartSummary
│   │   └── layout/            # Header, Footer, BottomNav
│   ├── hooks/                 # useAuth, useCart, useOffline
│   ├── store/                 # Zustand stores
│   ├── services/              # API service layer
│   └── types/                 # TypeScript interfaces
└── package.json
```

## 3.2 Backend Services Structure

```
bellat-backend/
├── apps/
│   ├── api-gateway/           # Main entry, routing, middleware
│   ├── auth-service/          # Registration, login, OAuth
│   ├── product-service/       # Catalog, search, inventory
│   ├── order-service/         # Cart, checkout, order lifecycle
│   ├── delivery-service/      # Zones, scheduling, drivers
│   └── notification-service/  # SMS, email, push
├── libs/
│   ├── common/                # Shared decorators, guards
│   ├── database/              # Prisma schema, migrations
│   └── types/                 # Shared TypeScript types
└── package.json
```

## 3.3 Component Specifications

| Component | Props | Description |
|-----------|-------|-------------|
| `ProductCard` | product, variant?, onAddToCart? | Product display with add button |
| `ProductGrid` | products[], columns?, loading? | Responsive product grid |
| `VariantSelector` | variants[], selected, onChange | Weight/size selection |
| `QuantitySelector` | value, min?, max?, onChange | Quantity +/- input |
| `CartItem` | item, onQuantityChange, onRemove | Single cart item |
| `OrderStatus` | order, showTimeline? | Order progress tracker |

## 3.4 State Management

| Store | Responsibility | Persistence |
|-------|---------------|-------------|
| authStore | User auth, tokens, profile | localStorage (encrypted) |
| cartStore | Cart items, quantities, totals | localStorage + API sync |
| uiStore | Language, theme, modals | localStorage |

---

# 4. DATABASE DESIGN DOCUMENT

## 4.1 Database Overview

| Metric | Value |
|--------|-------|
| Database | PostgreSQL 15 |
| Total Tables | 18 |
| Primary Entities | 8 |
| Estimated Year-1 Size | ~5 GB |

## 4.2 Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Category   │         │    Brand     │         │DeliveryZone  │
│──────────────│         │──────────────│         │──────────────│
│ id (PK)      │         │ id (PK)      │         │ id (PK)      │
│ name_fr/ar   │         │ name         │         │ wilaya       │
│ slug         │         │ logo_url     │         │ communes[]   │
└──────┬───────┘         └──────┬───────┘         │ delivery_fee │
       │ 1:N                    │ 1:N             └──────┬───────┘
       │                        │                        │ 1:N
┌──────▼───────────────────────▼───────┐                │
│              Product                  │                │
│──────────────────────────────────────│                │
│ id (PK), category_id, brand_id       │                │
│ slug, name_fr, name_ar               │                │
│ images[], nutritional_info           │                │
│ is_halal, is_active, is_featured     │                │
└──────────────────┬───────────────────┘                │
                   │ 1:N                                │
┌──────────────────▼───────────────────┐                │
│          ProductVariant               │                │
│──────────────────────────────────────│                │
│ id (PK), product_id, sku             │                │
│ weight, retail_price, b2b_price      │                │
│ stock_quantity, reserved_quantity    │                │
└──────────────────┬───────────────────┘                │
                   │ N:M                                │
┌──────────────────┴───────────────────┐                │
│              OrderItem                │                │
│──────────────────────────────────────│                │
│ id, order_id, variant_id             │                │
│ quantity, unit_price, total_price    │                │
└──────────────────┬───────────────────┘                │
                   │ N:1                                │
┌──────────────────▼───────────────────────────────────▼──┐
│                       Order                              │
│─────────────────────────────────────────────────────────│
│ id (PK), user_id, delivery_zone_id, order_number        │
│ status, payment_method, payment_status                  │
│ delivery_address (JSONB), delivery_date, delivery_slot  │
│ subtotal, delivery_fee, total                           │
└──────────────────────────────────────────────────────────┘
                   ▲
                   │ 1:N
┌──────────────────┴───────────────────┐
│                User                   │
│──────────────────────────────────────│
│ id (PK), email, phone, password_hash │
│ type (B2C/B2B/ADMIN), status         │
│ business_name, credit_limit          │
└──────────────────────────────────────┘
```

## 4.3 Key Table Specifications

### 4.3.1 users Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| email | VARCHAR(255) | UNIQUE, NULL | Email (optional) |
| phone | VARCHAR(20) | UNIQUE, NOT NULL | Phone (+213) |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt hash |
| type | ENUM | DEFAULT 'B2C' | B2C, B2B, ADMIN |
| status | ENUM | DEFAULT 'PENDING' | Account status |
| credit_limit | DECIMAL(12,2) | DEFAULT 0 | B2B credit |

### 4.3.2 products Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| category_id | UUID | FK | Category reference |
| slug | VARCHAR(100) | UNIQUE | URL identifier |
| name_fr | VARCHAR(200) | NOT NULL | French name |
| name_ar | VARCHAR(200) | NOT NULL | Arabic name |
| images | JSONB | DEFAULT [] | Image array |
| is_active | BOOLEAN | DEFAULT TRUE | Visibility |

### 4.3.3 orders Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| user_id | UUID | FK | Customer |
| order_number | VARCHAR(20) | UNIQUE | BLT-YYYYMMDD-XXXXX |
| status | ENUM | NOT NULL | Order lifecycle |
| delivery_date | DATE | NOT NULL | Scheduled date |
| delivery_slot | ENUM | NOT NULL | Time slot |
| total | DECIMAL(12,2) | NOT NULL | Final amount |

## 4.4 Indexes

```sql
-- Unique Indexes
CREATE UNIQUE INDEX idx_users_phone ON users(phone);
CREATE UNIQUE INDEX idx_products_slug ON products(slug);
CREATE UNIQUE INDEX idx_orders_number ON orders(order_number);
CREATE UNIQUE INDEX idx_variants_sku ON product_variants(sku);

-- Foreign Key Indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Query Optimization
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;

-- Full-Text Search
CREATE INDEX idx_products_search ON products 
    USING GIN (to_tsvector('french', name_fr || ' ' || COALESCE(description_fr, '')));
```

---

# 5. INTERFACE DESIGN DOCUMENT

## 5.1 API Design Principles

| Principle | Description |
|-----------|-------------|
| RESTful | Resources via URIs, standard HTTP methods |
| JSON | All bodies use JSON with camelCase |
| Versioning | /api/v1/... for backward compatibility |
| Pagination | Cursor or offset-based for lists |
| Error Handling | Consistent format with codes |

## 5.2 REST API Endpoints

### 5.2.1 Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/v1/auth/register | Register user | None |
| POST | /api/v1/auth/login | Login | None |
| POST | /api/v1/auth/logout | Logout | Required |
| POST | /api/v1/auth/refresh | Refresh token | Refresh |
| POST | /api/v1/auth/otp/send | Send OTP | None |
| POST | /api/v1/auth/otp/verify | Verify OTP | None |

### 5.2.2 Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/v1/products | List products | None |
| GET | /api/v1/products/:slug | Product details | None |
| GET | /api/v1/products/search | Search | None |
| GET | /api/v1/categories | List categories | None |
| GET | /api/v1/categories/:slug/products | Category products | None |

### 5.2.3 Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/v1/cart | Get cart | Required |
| POST | /api/v1/cart/items | Add to cart | Required |
| PATCH | /api/v1/cart/items/:id | Update quantity | Required |
| DELETE | /api/v1/cart/items/:id | Remove item | Required |
| POST | /api/v1/orders | Place order | Required |
| GET | /api/v1/orders | List orders | Required |
| GET | /api/v1/orders/:id | Order details | Required |

### 5.2.4 Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/v1/admin/orders | All orders | Admin |
| PATCH | /api/v1/admin/orders/:id/status | Update status | Admin |
| POST | /api/v1/admin/products | Create product | Admin |
| PUT | /api/v1/admin/products/:id | Update product | Admin |
| PATCH | /api/v1/admin/products/:id/stock | Update stock | Admin |

## 5.3 Response Schemas

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "pagination": { "page": 1, "limit": 20, "total": 156 }
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [{ "field": "email", "message": "Invalid format" }]
  }
}
```

## 5.4 RBAC Matrix

| Resource | Guest | B2C | B2B | Driver | Admin |
|----------|-------|-----|-----|--------|-------|
| View Products | ✓ | ✓ | ✓ | — | ✓ |
| View B2B Prices | — | — | ✓ | — | ✓ |
| Place Orders | — | ✓ | ✓ | — | ✓ |
| Credit Payment | — | — | ✓ | — | ✓ |
| View Deliveries | — | — | — | ✓ | ✓ |
| Manage Products | — | — | — | — | ✓ |
| Manage Orders | — | — | — | — | ✓ |

---

# 6. SOURCE CODE LISTINGS

## 6.1 Project Structure

```
bellat-platform/
├── apps/
│   ├── frontend/              # Next.js PWA
│   ├── admin/                 # React Admin
│   ├── api-gateway/           # NestJS Gateway
│   ├── auth-service/          # Auth microservice
│   ├── product-service/       # Product microservice
│   ├── order-service/         # Order microservice
│   ├── delivery-service/      # Delivery microservice
│   └── notification-service/  # Notification microservice
├── libs/
│   ├── common/                # Shared utilities
│   ├── database/              # Prisma schema
│   └── types/                 # Shared types
├── docker/
│   └── docker-compose.yml
├── k8s/
│   ├── base/
│   └── overlays/
└── package.json
```

## 6.2 ProductCard Component

```typescript
// src/components/product/ProductCard.tsx
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Plus } from 'lucide-react';
import { Product, ProductVariant } from '@/types/product';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';
import { StockIndicator } from './StockIndicator';

interface ProductCardProps {
  product: Product;
  variant?: ProductVariant;
  showQuickAdd?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  variant = product.defaultVariant,
  showQuickAdd = true,
  className,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variant || variant.stock === 0) return;
    
    setIsAdding(true);
    try {
      await addItem(variant.id, 1);
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = !variant || variant.stock === 0;

  return (
    <Link href={`/products/${product.slug}`}>
      <div className={`group relative bg-white rounded-lg shadow-sm 
                       hover:shadow-md transition-shadow border ${className}`}>
        {/* Image */}
        <div className="relative aspect-square bg-gray-50">
          <Image
            src={product.images[0]?.url || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium px-3 py-1 bg-red-500 rounded">
                Rupture de stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
          {variant && <StockIndicator stock={variant.stock} />}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary-600">
              {formatPrice(variant?.price || 0)}
            </span>
          </div>
          {showQuickAdd && (
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              loading={isAdding}
              className="w-full mt-3"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
}
```

## 6.3 Cart Store (Zustand)

```typescript
// src/store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';
import { cartService } from '@/services/cart.service';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  
  // Computed
  get itemCount(): number;
  get subtotal(): number;
  
  // Actions
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      
      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      
      get subtotal() {
        return get().items.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity, 0
        );
      },
      
      addItem: async (variantId, quantity) => {
        set({ isLoading: true });
        try {
          const newItem = await cartService.addItem(variantId, quantity);
          set(state => ({ items: [...state.items, newItem], isLoading: false }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      updateQuantity: async (itemId, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(itemId);
          return;
        }
        await cartService.updateItem(itemId, quantity);
        set(state => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
        }));
      },
      
      removeItem: async (itemId) => {
        await cartService.removeItem(itemId);
        set(state => ({
          items: state.items.filter(item => item.id !== itemId)
        }));
      },
      
      clearCart: () => set({ items: [] })
    }),
    { name: 'bellat-cart', partialize: (state) => ({ items: state.items }) }
  )
);
```

## 6.4 Auth Service (NestJS)

```typescript
// apps/auth-service/src/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@bellat/database';
import { RedisService } from '@bellat/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private redis: RedisService,
  ) {}

  async register(dto: RegisterDto) {
    // Check existing user
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ phone: dto.phone }, { email: dto.email }] }
    });
    if (existing) throw new ConflictException('User already exists');

    // Create user
    const user = await this.prisma.user.create({
      data: {
        phone: dto.phone,
        email: dto.email,
        passwordHash: await bcrypt.hash(dto.password, 12),
        fullName: dto.fullName,
        type: dto.type || 'B2C',
        status: 'PENDING',
      }
    });

    await this.sendOtp(user.phone);
    return { user: this.sanitize(user), message: 'OTP sent' };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ phone: dto.identifier }, { email: dto.identifier }] }
    });
    
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);
    return { ...tokens, user: this.sanitize(user) };
  }

  async generateTokens(user: any) {
    const payload = { sub: user.id, type: user.type };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '24h' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '30d' }),
      expiresIn: 86400
    };
  }

  async sendOtp(phone: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redis.set(`otp:${phone}`, code, 600);
    // Send via SMS service
  }

  private sanitize(user: any) {
    const { passwordHash, ...safe } = user;
    return safe;
  }
}
```

## 6.5 Order Service (NestJS)

```typescript
// apps/order-service/src/order.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@bellat/database';
import { RedisService, EventEmitter } from '@bellat/common';
import { CreateOrderDto } from './dto';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private events: EventEmitter,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const cart = await this.getCart(userId);
    if (!cart?.items.length) throw new BadRequestException('Cart empty');

    const zone = await this.prisma.deliveryZone.findUnique({
      where: { id: dto.deliveryZoneId }
    });
    
    const subtotal = cart.items.reduce(
      (sum, i) => sum + i.unitPrice * i.quantity, 0
    );
    
    if (subtotal < zone.minOrderAmount) {
      throw new BadRequestException(`Minimum: ${zone.minOrderAmount} DZD`);
    }

    const orderNumber = await this.generateOrderNumber();
    const deliveryFee = zone.deliveryFee;
    const slotSurcharge = dto.deliverySlot === 'EVENING' ? zone.eveningSurcharge : 0;

    const order = await this.prisma.$transaction(async (tx) => {
      // Reserve stock
      for (const item of cart.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { reservedQuantity: { increment: item.quantity } }
        });
      }

      // Create order
      return tx.order.create({
        data: {
          userId, orderNumber, status: 'PENDING',
          paymentMethod: dto.paymentMethod,
          deliveryDate: new Date(dto.deliveryDate),
          deliverySlot: dto.deliverySlot,
          deliveryZoneId: zone.id,
          subtotal, deliveryFee, slotSurcharge,
          total: subtotal + deliveryFee + slotSurcharge,
          items: {
            create: cart.items.map(i => ({
              variantId: i.variantId,
              productName: i.productName,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              totalPrice: i.unitPrice * i.quantity
            }))
          }
        }
      });
    });

    this.events.emit('order.created', { orderId: order.id, userId });
    return order;
  }

  private async generateOrderNumber() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const seq = await this.redis.incr(`order_seq:${date}`);
    return `BLT-${date}-${seq.toString().padStart(5, '0')}`;
  }

  private async getCart(userId: string) {
    return this.prisma.cart.findFirst({
      where: { userId },
      include: { items: true }
    });
  }
}
```

---

# 7. APPENDICES

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| Bellat | Brand name of CVA meat products |
| Commune | Administrative subdivision within a Wilaya |
| CVA | Conserverie de Viandes d'Algérie |
| Halal | Food prepared per Islamic dietary laws |
| Kachir | Traditional Algerian processed meat |
| Wilaya | Province in Algeria (48 total) |

## Appendix B: References

| Document | Description |
|----------|-------------|
| Bellat_Digital_Platform_Enhanced_SRS.md | Requirements Specification |
| Bellat_Digital_Platform_Functional_Spec.md | Functional Specification |
| https://bellat.net | Company website |
| https://nextjs.org/docs | Next.js Documentation |
| https://docs.nestjs.com | NestJS Documentation |
| https://www.prisma.io/docs | Prisma Documentation |

## Appendix C: Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 2026 | Initial release |

---

**END OF SOFTWARE PRODUCT SPECIFICATION**
