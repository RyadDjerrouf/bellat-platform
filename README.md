# Bellat Digital Ordering Platform

**A modern, bilingual e-commerce platform for Algeria's premier meat products company**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

---

## 🌟 Project Overview

The Bellat Digital Ordering Platform is a comprehensive digital transformation initiative for **CVA (Conserverie de Viandes d'Algérie)**, a 50+ year legacy meat products company in Algeria. This platform delivers a modern, mobile-first ordering system supporting both retail (B2C) and wholesale (B2B) customer segments with full bilingual Arabic/French support.

### Key Features

- 🌍 **Bilingual Support:** Arabic (RTL) and French (LTR)
- 📱 **Progressive Web App:** Offline-first with service workers
- 🏪 **Dual Commerce:** B2C retail + B2B wholesale
- 📦 **15 Product Categories:** Complete meat products catalog
- 🚚 **Delivery Management:** 48 Algerian Wilayas coverage
- 💳 **Payment Methods:** Cash on Delivery + B2B credit/invoicing
- 🍳 **Recipe Integration:** Recipe-to-cart functionality
- 📊 **Admin Dashboard:** Complete back-office management

---

## 🏗️ Architecture

### Technology Stack

#### Frontend
- **Next.js 14** (App Router, SSR)
- **React 18** (UI Components)
- **Tailwind CSS 3** (Utility-first styling)
- **Zustand 4** (State management)
- **i18next** (Internationalization)
- **Workbox** (Service Worker/PWA)

#### Backend
- **NestJS 10** (Microservices framework)
- **TypeScript 5** (Type-safe language)
- **Prisma 5** (ORM and database toolkit)
- **PostgreSQL 15** (Primary database)
- **Redis 7** (Cache and session store)

#### Infrastructure
- **Docker** + **Kubernetes** (Container orchestration)
- **Cloudflare** (CDN/WAF/DDoS protection)
- **GitHub Actions** (CI/CD)
- **Prometheus + Grafana** (Monitoring)

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│              CLIENT LAYER                                │
├──────────────────┬──────────────────┬───────────────────┤
│  Customer PWA    │  Admin Dashboard │   Future Apps     │
│  (Next.js)       │    (React)       │                   │
└────────┬─────────┴────────┬─────────┴──────┬────────────┘
         │                  │                 │
         └──────────────────┴─────────────────┘
                           │
                           ▼
                   ┌───────────────┐
                   │  API Gateway  │
                   │   (NestJS)    │
                   └───────┬───────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐      ┌────▼────┐      ┌────▼────┐
    │  Auth   │      │ Product │      │  Order  │
    │ Service │      │ Service │      │ Service │
    └─────────┘      └─────────┘      └─────────┘
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
         ┌────▼─────┐            ┌─────▼────┐
         │PostgreSQL│            │  Redis   │
         └──────────┘            └──────────┘
```

---

## 📋 Project Status

**Current Phase:** Initialization Complete ✅
**Next Phase:** Foundation & Infrastructure Setup
**Target Launch:** Q2 2026

### Roadmap

- ✅ **Phase 0:** Foundation & Infrastructure (Planning complete)
- ⏳ **Phase 1:** Core Backend Development
- ⏳ **Phase 2:** Frontend & PWA Experience
- ⏳ **Phase 3:** Admin & Operations Dashboard
- ⏳ **Phase 4:** Notifications & Integrations
- ⏳ **Phase 5:** QA & Launch Readiness
- ⏳ **Phase 6:** Post-Launch & Maintenance

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x or pnpm >= 8.x
- Docker >= 24.x
- PostgreSQL >= 15.x
- Redis >= 7.x

### Installation

```bash
# Clone the repository
git clone https://github.com/rdjerrouf/bellat-platform.git
cd bellat-platform

# Install dependencies
npm install
# or
pnpm install

# Set up environment variables
cp .env.example .env.local

# Start infrastructure (Docker Compose)
docker-compose up -d

# Run database migrations
npx prisma migrate dev

# Start development servers
npm run dev
```

**Full setup instructions:** See [.claude/QUICKSTART.md](.claude/QUICKSTART.md)

---

## 📁 Project Structure

```
bellat-platform/
├── apps/                      # Applications (monorepo)
│   ├── frontend/              # Customer PWA (Next.js)
│   ├── admin/                 # Admin Dashboard (React)
│   ├── api-gateway/           # API Gateway (NestJS)
│   ├── auth-service/          # Authentication microservice
│   ├── product-service/       # Product catalog microservice
│   ├── order-service/         # Order management microservice
│   ├── delivery-service/      # Delivery & logistics microservice
│   └── notification-service/  # Notifications microservice
├── libs/                      # Shared libraries
│   ├── common/                # Shared utilities
│   ├── database/              # Prisma schema
│   └── types/                 # TypeScript types
├── docker/                    # Docker configurations
├── k8s/                       # Kubernetes manifests
├── web/                       # Legacy documentation
│   └── Documents/             # Original specification docs
├── .claude/                   # Project documentation
│   ├── README.md              # Documentation index
│   ├── SUMMARY.md             # Project summary
│   ├── QUICKSTART.md          # Developer onboarding
│   ├── project-initialization.md  # Complete initialization guide
│   └── TECH-DECISIONS.md      # Technology rationale
└── README.md                  # This file
```

---

## 📖 Documentation

### Essential Documents

1. **[Project Summary](.claude/SUMMARY.md)** - High-level overview and quick reference
2. **[Quick Start Guide](.claude/QUICKSTART.md)** - Developer onboarding and setup
3. **[Project Initialization](.claude/project-initialization.md)** - Complete technical specification
4. **[Technology Decisions](.claude/TECH-DECISIONS.md)** - Architecture and technology rationale

### Specification Documents

- **[Enhanced SRS v2.0](web/Documents/Bellat_Digital_Platform_Enhanced_SRS.md)** - Software Requirements Specification
- **[Functional Spec v1.0](web/Documents/Bellat_Digital_Platform_Functional_Spec.md)** - Functional Specification
- **[Product Spec v1.0](web/Documents/Bellat_Software_Product_Specification.md)** - Software Product Specification
- **[Roadmap](web/Documents/TODO.md)** - Project roadmap and milestones

---

## 🎯 Core Features

### Customer Experience (PWA)
- Browse 15 product categories
- Advanced search with Arabic transliteration
- Shopping cart with offline support
- Multi-address management
- Order tracking and history
- Recipe-to-cart functionality
- Bilingual interface (AR/FR)

### B2B Features
- Wholesale pricing
- Credit management
- Invoice payment terms
- Bulk ordering
- Approval workflow
- Monthly statements

### Admin Dashboard
- Order management
- Product catalog CRUD
- Customer management
- B2B approval queue
- Inventory management
- Delivery zone configuration
- Analytics and reporting

### Technical Features
- **Offline-First:** Service workers + IndexedDB
- **Real-Time:** WebSocket order updates
- **Search:** PostgreSQL full-text search with fuzzy matching
- **Security:** JWT authentication, bcrypt hashing, rate limiting
- **Performance:** < 2s page load (4G), < 500ms API response (P95)

---

## 🔒 Security

- TLS 1.3 encryption for all communications
- bcrypt password hashing (cost factor 12)
- JWT with RS256 asymmetric signing
- CSRF protection (double-submit cookie)
- Rate limiting (100 req/min public, 1,000 authenticated)
- SQL injection prevention (Prisma ORM)
- XSS prevention (CSP headers)
- OWASP Top 10 compliance

---

## 🌍 Localization

### Supported Languages
- **Arabic (AR):** Primary language with RTL layout
- **French (FR):** Secondary language with LTR layout

### Features
- Dynamic language switching
- RTL-aware layouts and components
- Locale-specific formatting (dates, currency, numbers)
- Arabic transliteration in search
- Culturally appropriate UI/UX

---

## 📊 Success Metrics (First 6 Months)

| Metric | Target |
|--------|--------|
| Registered Users | 5,000 |
| Monthly Active Users | 2,000 |
| Orders per Month | 1,000 |
| B2B Accounts | 100 |
| Customer Satisfaction (NPS) | > 40 |
| Order Fulfillment Rate | > 95% |
| System Uptime | > 99.5% |
| Page Load Time (4G) | < 2 seconds |

---

## 🤝 Contributing

This is a private project for Bellat Group. If you're a team member:

1. Read the [Quick Start Guide](.claude/QUICKSTART.md)
2. Follow the [Git Workflow](.claude/QUICKSTART.md#git-workflow)
3. Ensure all tests pass before creating PRs
4. Follow TypeScript and React best practices

---

## 📜 License

Copyright © 2026 Bellat Group (CVA - Conserverie de Viandes d'Algérie)

This project is proprietary and confidential. Unauthorized copying or distribution is strictly prohibited.

---

## 📞 Contact

**Client:** Bellat Group (CVA)
**Location:** Tessala-El-Merdja, Algeria
**Website:** https://bellat.net
**Social Media:**
- Facebook: [@bellatalgerie](https://facebook.com/bellatalgerie)
- Instagram: [@bellat_el_djazair](https://instagram.com/bellat_el_djazair)

**Tagline:** "غذاؤك ترعاه أياد أمينة" (Your food is cared for by trustworthy hands)

---

## 🙏 Acknowledgments

- **Bellat Group** for 50+ years of quality meat products
- **Development Team** for bringing this vision to life
- **Algeria's Tech Community** for support and inspiration

---

**Built with ❤️ for Algeria**

**Last Updated:** January 8, 2026
