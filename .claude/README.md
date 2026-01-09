# .claude Directory - Project Documentation

**Bellat Digital Ordering Platform**
**Status:** Initialization Complete - Ready for Kickoff
**Date:** January 8, 2026

---

## What's in This Directory?

This `.claude` directory contains all project initialization documentation created during the planning phase. These documents serve as the foundation for development and should be referenced throughout the project lifecycle.

---

## Document Index

### 1. **project-initialization.md** (Primary Document)
**Purpose:** Complete project initialization guide
**Audience:** All team members, stakeholders
**Contents:**
- Executive summary
- Architecture overview (diagrams, components, tech stack)
- Core functional requirements (FR-AUTH, FR-CAT, FR-CART, FR-ORD, etc.)
- Database schema overview (18 tables, ERD)
- API structure (endpoints, authentication, RBAC)
- Business rules reference (pricing, inventory, orders, B2B, auth)
- Development roadmap (6 phases)
- Non-functional requirements (performance, security, availability)
- Risk mitigation strategy
- Team structure recommendations
- Success metrics (first 6 months)

**When to Use:** Starting point for any team member joining the project

---

### 2. **SUMMARY.md** (Quick Reference)
**Purpose:** High-level overview and quick reference
**Audience:** New team members, stakeholders needing overview
**Contents:**
- What we analyzed (4 specification documents)
- Key findings & decisions (in/out of scope)
- Architecture summary
- Critical features (bilingual, offline, B2B, inventory, delivery)
- Business rules quick reference
- Performance targets
- Security requirements
- Success metrics
- Next steps (when kickoff begins)
- Questions & clarifications needed

**When to Use:** Need a quick refresher or overview for stakeholders

---

### 3. **QUICKSTART.md** (Developer Onboarding)
**Purpose:** Get developers up and running quickly
**Audience:** Developers joining the project
**Contents:**
- Prerequisites (software, tools, extensions)
- Initial setup instructions (clone, install, env vars)
- Docker Compose configuration
- Database setup (Prisma migrations, seeding)
- Start development servers
- Project structure walkthrough
- Common development commands
- Coding standards (TypeScript, React, naming conventions)
- Testing strategy (unit, E2E, coverage goals)
- Git workflow (branching, commits, PRs)
- Debugging tips (backend, frontend, database, Redis)
- Performance optimization
- Localization (i18n usage)
- Security checklist
- Troubleshooting common issues

**When to Use:** Day 1 for any developer joining the team

---

### 4. **TECH-DECISIONS.md** (Technology Rationale)
**Purpose:** Document why technologies were chosen
**Audience:** Technical team, future maintainers, architects
**Contents:**
- Decision framework (evaluation criteria)
- Frontend decisions (Next.js, Tailwind, Zustand, i18next, Workbox)
- Backend decisions (NestJS, Prisma, PostgreSQL, Redis)
- Infrastructure decisions (Docker, Kubernetes, Cloudflare)
- Integration decisions (FCM, SendGrid, SMS gateway)
- Security decisions (bcrypt, JWT)
- Monitoring decisions (Prometheus, Grafana, ELK)
- CI/CD decisions (GitHub Actions)
- Development tools (VS Code, ESLint, Prettier)
- Rejected technologies & why
- Technology versions (locked)
- Future considerations (Phase 2/3)
- Configuration checklist
- Cost estimates

**When to Use:** Need to understand or justify technology choices

---

## Source Documentation (Read & Analyzed)

These are the original specification documents that informed our initialization:

### **../web/Documents/Bellat_Digital_Platform_Enhanced_SRS.md**
- Software Requirements Specification v2.0
- 848 lines of comprehensive requirements
- Assessment of original SRS (68/100 score)
- Gap analysis and enhancements
- Complete functional and non-functional requirements

### **../web/Documents/Bellat_Digital_Platform_Functional_Spec.md**
- Functional Specification Document v1.0
- 1,202 lines of detailed specifications
- User roles, personas, UI/UX specs
- Data models, business rules
- Error handling, localization guidelines

### **../web/Documents/TODO.md**
- Project Roadmap
- 74 lines of phased development plan
- 6 phases from Foundation to Post-Launch

### **../web/Documents/Bellat_Software_Product_Specification.md**
- Software Product Specification v1.0
- 943 lines of technical documentation
- System architecture, component specs
- Database design with ERD
- API specifications, source code examples

---

## How to Use This Documentation

### For Project Managers
1. Start with **SUMMARY.md** for overview
2. Reference **project-initialization.md** for detailed scope
3. Use roadmap in project-initialization.md for planning

### For Developers
1. Begin with **QUICKSTART.md** for setup
2. Reference **project-initialization.md** for architecture
3. Consult **TECH-DECISIONS.md** when questioning technology choices

### For DevOps Engineers
1. Review **project-initialization.md** § 2.4 (Deployment Architecture)
2. Check **QUICKSTART.md** for Docker Compose setup
3. Reference **TECH-DECISIONS.md** for infrastructure choices

### For UI/UX Designers
1. Read **SUMMARY.md** § Critical Features
2. Check **project-initialization.md** § Localization
3. Review source docs (Functional_Spec.md) for detailed UI specs

### For QA Engineers
1. Review **project-initialization.md** § Non-Functional Requirements
2. Check **QUICKSTART.md** § Testing Strategy
3. Reference **SUMMARY.md** § Performance Targets

---

## Project Scope Quick Reference

### ✅ **In Scope (Phase 1)**
- Customer PWA (Next.js, offline-first)
- Admin Dashboard (React, Ant Design)
- Backend Microservices (NestJS)
- PostgreSQL + Redis infrastructure
- Bilingual support (Arabic RTL / French LTR)
- B2C + B2B ordering
- Inventory management
- Delivery zone management (manual driver assignment)
- Notifications (SMS, Email, Push)
- Recipe-to-cart functionality

### ❌ **Out of Scope**
- Driver/Delivery Staff mobile app (separate Bellat project)
- Online payments (Phase 2)
- GPS tracking (Phase 2)
- Native mobile apps (Phase 2)
- ERP integration (Phase 3)
- AI features (Phase 3)

---

## Key Project Constraints

1. **Bilingual:** All UI in Arabic (RTL) and French (LTR)
2. **Offline-First:** Must work with intermittent connectivity (3G)
3. **Mobile-First:** Primary device is smartphone
4. **Cash on Delivery:** No online payments in Phase 1
5. **Algeria-Specific:** +213 phone format, 48 Wilayas, local SMS gateway
6. **B2B Features:** Credit management, wholesale pricing, approval workflow

---

## Success Criteria (First 6 Months)

| Metric | Target |
|--------|--------|
| Registered Users | 5,000 |
| Monthly Active Users | 2,000 |
| Orders per Month | 1,000 |
| B2B Accounts | 100 |
| NPS Score | > 40 |
| Order Fulfillment Rate | > 95% |
| System Uptime | > 99.5% |
| Page Load (4G) | < 2 seconds |
| API Response (P95) | < 500ms |

---

## Next Actions (When Kickoff Approved)

1. **Environment Setup**
   - [ ] Provision cloud resources (staging + production)
   - [ ] Configure Docker registry
   - [ ] Set up Kubernetes cluster
   - [ ] Initialize PostgreSQL + Redis

2. **Repository Initialization**
   - [ ] Create monorepo structure
   - [ ] Set up CI/CD pipeline (GitHub Actions)
   - [ ] Configure ESLint + Prettier
   - [ ] Initialize Git with branching strategy

3. **Backend Scaffolding**
   - [ ] NestJS microservices structure
   - [ ] Prisma schema definition
   - [ ] Database migrations
   - [ ] JWT authentication setup

4. **Frontend Scaffolding**
   - [ ] Next.js 14 App Router setup
   - [ ] i18next configuration (AR/FR)
   - [ ] Tailwind CSS + RTL plugin
   - [ ] Service worker (Workbox)

---

## Contact & Stakeholders

**Client:** Bellat Group (CVA - Conserverie de Viandes d'Algérie)
**Location:** Tessala-El-Merdja, Algeria
**Website:** https://bellat.net
**Social Media:**
- Facebook: @bellatalgerie
- Instagram: @bellat_el_djazair
**Tagline:** "غذاؤك ترعاه أياد أمينة" (Your food is cared for by trustworthy hands)

---

## Document Maintenance

- **Created:** January 8, 2026
- **Status:** ✅ Initialization Complete
- **Next Review:** Upon kickoff approval
- **Owner:** Project Manager (Ryad)
- **Update Frequency:** Major milestones or phase transitions

---

## Questions?

If you have questions about this documentation:

1. **Check the relevant document** (use the index above)
2. **Search for keywords** across all documents
3. **Ask in team chat** (Slack/Discord/Teams)
4. **Create GitHub discussion** for broader team input

---

## Document Hierarchy (Read in This Order)

For **new team members:**
```
1. README.md (this file)           ← You are here
2. SUMMARY.md                      ← Overview
3. QUICKSTART.md                   ← Setup
4. project-initialization.md       ← Deep dive
5. TECH-DECISIONS.md              ← Why we chose X
```

For **stakeholders:**
```
1. SUMMARY.md                      ← Quick overview
2. project-initialization.md       ← Detailed scope
```

For **developers:**
```
1. QUICKSTART.md                   ← Setup first!
2. project-initialization.md       ← Architecture
3. TECH-DECISIONS.md              ← When you have questions
```

---

**Status:** 🟢 READY FOR KICKOFF

All planning complete. Waiting for client approval to begin Phase 0 (Foundation & Infrastructure).

---

**Last Updated:** January 8, 2026
**Maintained By:** Ryad (Project Manager)
