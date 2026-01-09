# Bellat Platform - Claude Development Instructions

> **Project-specific instructions for Claude Code across all development sessions**

## 🎯 Critical Requirements

### Code Comments Policy
**IMPORTANT**: Add comments when needed throughout the codebase:

- **Business Logic**: Explain WHY, not WHAT. Document business rules, especially Algerian market specifics
- **Complex Algorithms**: Break down multi-step processes (e.g., delivery zone calculations, B2B credit checks)
- **Non-Obvious Code**: When the purpose isn't immediately clear from variable/function names
- **Bilingual Context**: Explain RTL/LTR handling, Arabic text processing
- **Security Considerations**: Document security decisions (JWT validation, rate limiting logic)
- **API Integrations**: Explain external service interactions (SMS gateway, payment providers)
- **Performance Optimizations**: Why we chose a specific approach for performance

**Comment Format**:
```typescript
// Business Rule: B2B customers get 30-day credit terms (per Bellat policy)
// See: Functional Spec Section 4.2.3

/**
 * Calculates delivery fee based on wilaya and order total
 *
 * @param wilaya - Algerian wilaya code (1-48)
 * @param orderTotal - Order total in DZD
 * @returns Delivery fee in DZD
 *
 * Business Rules:
 * - Free delivery for orders > 10,000 DZD
 * - Algiers (wilaya 16): 300 DZD base fee
 * - Other wilayas: 500-1000 DZD based on zone
 */
```

**Don't Over-Comment**: Skip comments for self-evident code like simple getters/setters

---

## 🏗️ Architecture Guidelines

### Monorepo Structure
```
/apps/
  /api/          - NestJS backend (microservices)
  /frontend/     - Next.js customer PWA
  /admin/        - Next.js admin dashboard
/libs/
  /shared/       - Shared TypeScript types, utilities
  /ui/           - Shared React components
```

### Key Technology Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript 5, Tailwind CSS 3
- **Backend**: NestJS 10, Prisma 5, PostgreSQL 15, Redis 7
- **Infrastructure**: Docker, Kubernetes, Cloudflare (CDN + WAF)
- **i18n**: next-i18next (Arabic RTL + French LTR)

---

## 🇩🇿 Algerian Market Specifics

### Always Consider:
1. **Phone Numbers**: +213 format with 10 digits (e.g., +213 555 123 456)
2. **Wilayas**: 48 administrative divisions (use codes 1-48)
3. **Cash on Delivery**: Primary payment method (~80% of orders)
4. **Currency**: DZD (Algerian Dinar) - no decimal places needed
5. **Language**: Arabic primary (RTL), French secondary (LTR)
6. **Business Hours**: Saturday-Thursday (Friday off for most)
7. **Delivery**: Urban vs remote wilaya differences (cost + time)

### Localization
- All user-facing text must be in i18n keys (never hardcode)
- Date/time formatting: Use `Intl.DateTimeFormat` with `ar-DZ` / `fr-DZ`
- Numbers: Arabic-Indic numerals (٠-٩) for Arabic, Western (0-9) for French

---

## 🔒 Security Standards

1. **Passwords**: bcrypt with cost factor 12
2. **JWT**: RS256 algorithm, 15-min access tokens, 7-day refresh tokens
3. **API Rate Limiting**: 100 req/min per IP (adjust per endpoint)
4. **Input Validation**: Zod schemas for all API inputs
5. **SQL Injection**: Always use Prisma (never raw SQL unless necessary)
6. **XSS Protection**: Sanitize user inputs, use Next.js automatic escaping
7. **CORS**: Whitelist only production domains
8. **Secrets**: Never commit `.env` files (use `.env.example` as template)

---

## 📊 Database Schema

**18 Core Tables**:
- `users`, `user_addresses`, `user_sessions`
- `products`, `product_variants`, `product_images`
- `categories`, `recipes`, `recipe_ingredients`
- `orders`, `order_items`, `order_tracking`
- `cart_items`
- `delivery_zones`, `delivery_schedules`
- `notifications`, `sms_logs`, `audit_logs`

**Reference**: See `.claude/project-initialization.md` Section 6 for full ERD

---

## 🎨 Frontend Standards

### Component Structure
```typescript
// 1. Imports
import { useState } from 'react'
import { useTranslation } from 'next-i18next'

// 2. Types/Interfaces
interface ProductCardProps {
  product: Product
  onAddToCart: (id: string) => void
}

// 3. Component
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { t } = useTranslation('common')
  // ...
}

// 4. Exports
export default ProductCard
```

### Naming Conventions
- **Components**: PascalCase (`ProductCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Utils**: camelCase (`formatPrice.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_CART_ITEMS`)
- **Types**: PascalCase with descriptive suffix (`ProductCardProps`, `OrderStatus`)

### Styling
- Use Tailwind CSS utility classes
- RTL support: Use `start`/`end` instead of `left`/`right`
- Mobile-first: Default to mobile, use `md:`, `lg:` for larger screens

---

## 🔧 Backend Standards

### NestJS Module Structure
```
/src/
  /auth/
    auth.controller.ts
    auth.service.ts
    auth.module.ts
    /dto/
      login.dto.ts
      register.dto.ts
    /guards/
      jwt-auth.guard.ts
```

### API Response Format
```typescript
// Success
{
  "success": true,
  "data": { /* payload */ },
  "message": "Operation successful"
}

// Error
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password incorrect",
    "details": { /* optional */ }
  }
}
```

### Error Handling
- Use NestJS built-in exceptions (`NotFoundException`, `BadRequestException`)
- Log all errors with context (user ID, request ID)
- Never expose stack traces in production
- Return user-friendly error messages in both languages

---

## 🧪 Testing Standards

### Coverage Targets
- **Unit Tests**: 80% coverage minimum
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user flows (registration, checkout, order placement)

### Testing Tools
- **Unit**: Jest + React Testing Library
- **E2E**: Playwright
- **API**: Supertest

### Test File Naming
- Unit: `*.spec.ts` (e.g., `auth.service.spec.ts`)
- E2E: `*.e2e-spec.ts` (e.g., `checkout.e2e-spec.ts`)

---

## 📝 Git Commit Standards

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding/updating tests
- `chore`: Build process, dependencies

### Examples
```
feat(auth): implement JWT refresh token rotation

- Add refresh token endpoint
- Store refresh tokens in Redis with 7-day TTL
- Implement automatic token rotation on refresh

Refs: FR-AUTH-002

---

fix(delivery): correct wilaya 48 delivery zone mapping

Wilaya 48 (Relizane) was incorrectly mapped to Zone 3.
Should be Zone 2 per Bellat delivery policy.

Fixes: #123
```

---

## 🚀 Performance Targets

### Frontend
- **First Contentful Paint**: < 1.8s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: > 90 (Performance, Accessibility, Best Practices, SEO)

### Backend
- **API Response Time**: < 200ms (P95)
- **Database Queries**: < 50ms (P95)
- **Concurrent Users**: 10,000 simultaneous

### PWA
- **Offline Support**: Cart, product browsing, order submission queue
- **Cache Strategy**: Stale-while-revalidate for products, network-first for orders
- **Service Worker**: Background sync for queued orders

---

## 🔄 Development Workflow

1. **Branch Naming**: `<type>/<short-description>` (e.g., `feat/jwt-auth`, `fix/wilaya-mapping`)
2. **Pull Requests**: Require code review + passing tests before merge
3. **Environments**:
   - `development`: Local (localhost:3000, localhost:4000)
   - `staging`: Pre-production (staging.bellat.dz)
   - `production`: Live (bellat.dz, www.bellat.dz)

---

## 📚 Documentation References

- **Full Specs**: `/web/Documents/` (Enhanced SRS, Functional Spec, Product Spec)
- **Claude Docs**: `/.claude/` (Initialization, Quickstart, Tech Decisions)
- **Roadmap**: `/TODO.md` (110 tasks across 6 phases)

---

## 🚨 Out of Scope

**Driver/Delivery Staff Mobile App**: This is a separate Bellat initiative, NOT part of this project.

For Phase 1, delivery status updates will be done manually via Admin Dashboard.

---

## 💡 General Development Principles

1. **Type Safety**: Prefer TypeScript strict mode, avoid `any`
2. **DRY**: Extract reusable logic into `libs/shared/`
3. **KISS**: Simple solutions over clever ones
4. **Accessibility**: WCAG 2.1 Level AA compliance (keyboard nav, ARIA labels, screen readers)
5. **Mobile-First**: Design for mobile, enhance for desktop
6. **Progressive Enhancement**: Core functionality works without JS
7. **Idempotency**: POST requests should be idempotent where possible (order creation, payments)
8. **Observability**: Log key events (order placed, payment received, delivery dispatched)

---

## 🎯 Session-to-Session Continuity

When starting a new session:
1. Check `/TODO.md` for current phase and pending tasks
2. Review recent git commits to understand latest changes
3. Check for open issues or blockers documented in code comments
4. Maintain consistency with existing patterns in the codebase

---

**Last Updated**: 2026-01-08 (Project Initialization)
**Version**: 1.0.0
