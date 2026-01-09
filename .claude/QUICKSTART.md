# Bellat Platform - Quick Start Guide

**For:** Development Team
**Purpose:** Rapid onboarding and environment setup
**Status:** Pre-kickoff preparation

---

## Prerequisites

### Required Software
```bash
Node.js >= 18.x          # JavaScript runtime
npm >= 9.x or pnpm >= 8.x # Package manager
Docker >= 24.x           # Containerization
Docker Compose >= 2.x    # Multi-container orchestration
Git >= 2.x               # Version control
PostgreSQL >= 15.x       # Database (local dev)
Redis >= 7.x             # Cache (local dev)
```

### Recommended Tools
```bash
VS Code                  # IDE
Postman/Insomnia        # API testing
TablePlus/DBeaver       # Database client
RedisInsight            # Redis GUI
kubectl                 # Kubernetes CLI
k9s                     # Kubernetes TUI
```

### VS Code Extensions
```
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- GitLens
- Arabic Language Support
- i18n Ally
- Docker
- Kubernetes
```

---

## Initial Setup (Once Kickoff Approved)

### 1. Clone Repository
```bash
git clone https://github.com/bellat/bellat-platform.git
cd bellat-platform
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Or using pnpm (recommended for monorepos)
pnpm install
```

### 3. Environment Variables
Create `.env` files in each app:

**apps/frontend/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_FCM_VAPID_KEY=your-fcm-vapid-key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
NEXT_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id
```

**apps/api-gateway/.env**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/bellat
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

**apps/auth-service/.env**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/bellat
REDIS_URL=redis://localhost:6379
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
SMS_GATEWAY_API_KEY=your-algerian-sms-api-key
SMS_GATEWAY_URL=https://api.sms-provider.dz
```

**apps/notification-service/.env**
```env
FCM_PROJECT_ID=your-firebase-project-id
FCM_PRIVATE_KEY=your-firebase-private-key
SENDGRID_API_KEY=your-sendgrid-api-key
SMS_GATEWAY_API_KEY=your-sms-api-key
```

### 4. Start Infrastructure (Docker Compose)
```bash
# Start PostgreSQL + Redis
docker-compose up -d

# Verify services are running
docker-compose ps
```

**docker-compose.yml** (to be created):
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: bellat
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 5. Database Setup
```bash
# Generate Prisma client
cd libs/database
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database (15 categories, sample products)
npx prisma db seed
```

### 6. Start Development Servers
```bash
# Terminal 1: API Gateway
cd apps/api-gateway
npm run dev

# Terminal 2: Frontend PWA
cd apps/frontend
npm run dev

# Terminal 3: Admin Dashboard
cd apps/admin
npm run dev

# Terminal 4: Microservices (in parallel)
cd apps
npm run dev:services  # Runs all microservices concurrently
```

### 7. Access Applications
- **Customer PWA:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3001
- **API Gateway:** http://localhost:3002/api/v1
- **API Docs (Swagger):** http://localhost:3002/api/docs

---

## Project Structure Walkthrough

```
bellat-platform/
├── apps/
│   ├── frontend/              # Customer PWA (Next.js 14)
│   │   ├── src/
│   │   │   ├── app/           # App Router pages
│   │   │   ├── components/    # React components
│   │   │   ├── hooks/         # Custom hooks
│   │   │   ├── store/         # Zustand stores
│   │   │   ├── services/      # API service layer
│   │   │   └── types/         # TypeScript types
│   │   ├── public/
│   │   │   ├── locales/       # i18n translations (ar.json, fr.json)
│   │   │   ├── sw.js          # Service worker
│   │   │   └── manifest.json  # PWA manifest
│   │   └── next.config.js
│   │
│   ├── admin/                 # Admin Dashboard (React)
│   │   ├── src/
│   │   │   ├── pages/         # Admin pages
│   │   │   ├── components/    # Ant Design components
│   │   │   └── services/      # API calls
│   │   └── vite.config.js
│   │
│   ├── api-gateway/           # Main API entry (NestJS)
│   │   ├── src/
│   │   │   ├── auth/          # Auth guard, JWT strategy
│   │   │   ├── middleware/    # Rate limiting, logging
│   │   │   └── main.ts        # Bootstrap
│   │   └── nest-cli.json
│   │
│   ├── auth-service/          # Authentication microservice
│   │   ├── src/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/    # JWT, OAuth strategies
│   │   │   └── dto/           # Data transfer objects
│   │   └── nest-cli.json
│   │
│   ├── product-service/       # Product catalog microservice
│   │   ├── src/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── search/        # Full-text search
│   │   │   └── inventory/
│   │   └── nest-cli.json
│   │
│   ├── order-service/         # Order management microservice
│   │   ├── src/
│   │   │   ├── cart/
│   │   │   ├── orders/
│   │   │   ├── checkout/
│   │   │   └── events/        # Order events
│   │   └── nest-cli.json
│   │
│   ├── delivery-service/      # Delivery & logistics microservice
│   │   ├── src/
│   │   │   ├── zones/
│   │   │   ├── scheduling/
│   │   │   └── drivers/       # Driver assignment (manual)
│   │   └── nest-cli.json
│   │
│   └── notification-service/  # SMS, Email, Push notifications
│       ├── src/
│       │   ├── sms/           # SMS gateway integration
│       │   ├── email/         # SendGrid templates
│       │   ├── push/          # Firebase FCM
│       │   └── templates/     # Message templates
│       └── nest-cli.json
│
├── libs/
│   ├── common/                # Shared utilities
│   │   ├── src/
│   │   │   ├── decorators/    # Custom decorators
│   │   │   ├── guards/        # Auth guards
│   │   │   ├── pipes/         # Validation pipes
│   │   │   └── utils/         # Helper functions
│   │   └── tsconfig.lib.json
│   │
│   ├── database/              # Prisma ORM
│   │   ├── prisma/
│   │   │   ├── schema.prisma  # Database schema
│   │   │   ├── migrations/    # SQL migrations
│   │   │   └── seed.ts        # Seed script
│   │   └── src/
│   │       └── prisma.service.ts
│   │
│   └── types/                 # Shared TypeScript types
│       └── src/
│           ├── user.types.ts
│           ├── product.types.ts
│           ├── order.types.ts
│           └── index.ts
│
├── docker/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.admin
│   ├── Dockerfile.backend
│   └── docker-compose.yml
│
├── k8s/                       # Kubernetes manifests
│   ├── base/
│   │   ├── namespace.yaml
│   │   ├── postgres.yaml
│   │   ├── redis.yaml
│   │   └── services/
│   └── overlays/
│       ├── staging/
│       └── production/
│
├── .github/
│   └── workflows/
│       ├── ci.yml             # CI pipeline
│       └── cd.yml             # CD pipeline
│
├── .claude/                   # Project documentation
│   ├── project-initialization.md
│   ├── SUMMARY.md
│   └── QUICKSTART.md (this file)
│
├── .gitignore
├── package.json               # Root package.json (workspaces)
├── tsconfig.json              # Base TypeScript config
├── .eslintrc.js               # ESLint config
├── .prettierrc                # Prettier config
└── README.md                  # Main README
```

---

## Common Development Commands

### Frontend (Next.js)
```bash
cd apps/frontend

npm run dev           # Start dev server
npm run build         # Production build
npm run start         # Start production server
npm run lint          # Run ESLint
npm run type-check    # TypeScript check
```

### Backend (NestJS)
```bash
cd apps/api-gateway  # or any service

npm run dev           # Start dev with watch mode
npm run build         # Production build
npm run start:prod    # Start production server
npm run test          # Run unit tests
npm run test:e2e      # Run E2E tests
npm run lint          # Run ESLint
```

### Database (Prisma)
```bash
cd libs/database

npx prisma studio     # Open Prisma Studio (DB GUI)
npx prisma migrate dev --name <name>  # Create migration
npx prisma migrate deploy              # Apply migrations (prod)
npx prisma db push                     # Push schema (dev only)
npx prisma db seed                     # Run seed script
npx prisma format                      # Format schema.prisma
npx prisma generate                    # Generate Prisma Client
```

### Docker
```bash
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose logs -f <service>  # View logs
docker-compose ps                 # List running containers
docker-compose exec postgres psql -U postgres -d bellat  # Access DB
docker-compose exec redis redis-cli                      # Access Redis
```

---

## Coding Standards

### TypeScript
```typescript
// ✅ GOOD: Explicit types, descriptive names
interface CreateProductDto {
  nameFr: string;
  nameAr: string;
  categoryId: string;
  brandId: string;
  isHalal: boolean;
}

async function createProduct(dto: CreateProductDto): Promise<Product> {
  return await this.prisma.product.create({ data: dto });
}

// ❌ BAD: Implicit any, unclear names
async function create(d) {
  return await this.prisma.product.create({ data: d });
}
```

### React Components
```tsx
// ✅ GOOD: TypeScript props, functional component, clear naming
interface ProductCardProps {
  product: Product;
  variant?: ProductVariant;
  onAddToCart?: (variantId: string) => void;
}

export function ProductCard({ product, variant, onAddToCart }: ProductCardProps) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      {/* ... */}
    </div>
  );
}

// ❌ BAD: No types, unclear prop destructuring
export default function Card({ p }) {
  return <div>{p.name}</div>;
}
```

### File Naming
```
✅ GOOD:
- product.service.ts (services)
- ProductCard.tsx (React components)
- user.types.ts (types)
- create-product.dto.ts (DTOs)
- product.controller.spec.ts (tests)

❌ BAD:
- Product_Service.ts
- productcard.tsx
- UserTypes.ts
- createProductDto.ts
```

### Import Order
```typescript
// 1. External dependencies
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@bellat/database';

// 2. Internal absolute imports
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '@bellat/types';

// 3. Relative imports
import { ProductMapper } from './product.mapper';
```

---

## Testing Strategy

### Unit Tests (Jest)
```typescript
// product.service.spec.ts
describe('ProductService', () => {
  let service: ProductService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ProductService, PrismaService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a product', async () => {
    const dto: CreateProductDto = { /* ... */ };
    const result = await service.create(dto);
    expect(result).toHaveProperty('id');
  });
});
```

### E2E Tests (Supertest)
```typescript
// auth.e2e-spec.ts
describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ phone: '+213555123456', password: 'password123' })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('accessToken');
      });
  });
});
```

### Test Coverage Goals
- **Backend:** Minimum 80% coverage
- **Frontend:** Minimum 70% coverage
- **Critical paths:** 100% coverage (auth, checkout, payment)

---

## Git Workflow

### Branch Naming
```
feature/<ticket>-<description>   # New features
bugfix/<ticket>-<description>    # Bug fixes
hotfix/<ticket>-<description>    # Production hotfixes
release/<version>                # Release branches

Examples:
feature/BLT-123-arabic-rtl-layout
bugfix/BLT-456-cart-quantity-overflow
hotfix/BLT-789-payment-validation
release/v1.0.0
```

### Commit Messages
```
<type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, test, chore
Scope: auth, products, orders, admin, frontend, backend

Examples:
feat(auth): add Google OAuth integration
fix(cart): prevent negative quantities
docs(readme): update setup instructions
style(frontend): format with Prettier
refactor(orders): extract validation logic
test(products): add unit tests for search
chore(deps): upgrade Next.js to 14.1
```

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added to complex code
- [ ] Documentation updated
- [ ] No new warnings
```

---

## Debugging Tips

### Backend Debugging (VS Code)
**.vscode/launch.json**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug API Gateway",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "cwd": "${workspaceFolder}/apps/api-gateway",
      "console": "integratedTerminal"
    }
  ]
}
```

### Frontend Debugging (Chrome DevTools)
1. Open Chrome DevTools
2. Sources > Filesystem > Add folder to workspace
3. Set breakpoints in TypeScript source
4. Refresh page to trigger breakpoints

### Database Debugging
```bash
# View query logs
docker-compose logs -f postgres

# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d bellat

# Useful queries
SELECT * FROM users LIMIT 10;
SELECT * FROM orders WHERE status = 'PENDING';
EXPLAIN ANALYZE SELECT * FROM products WHERE name_fr ILIKE '%kachir%';
```

### Redis Debugging
```bash
# Connect to Redis
docker-compose exec redis redis-cli

# Useful commands
KEYS *                    # List all keys
GET session:user123       # Get value
TTL session:user123       # Check TTL
FLUSHDB                   # Clear database (dev only!)
```

---

## Performance Optimization

### Frontend
- **Image Optimization:** Use Next.js `<Image>` component
- **Code Splitting:** Dynamic imports for large components
- **Bundle Analysis:** `npm run analyze` (to be configured)
- **Lazy Loading:** Use React.lazy() for routes
- **Memoization:** useMemo, useCallback for expensive operations

### Backend
- **Database Indexing:** Ensure all foreign keys and query fields indexed
- **Query Optimization:** Use Prisma's `select` to fetch only needed fields
- **Caching:** Cache frequent queries in Redis (products, categories)
- **Pagination:** Always paginate lists (default limit: 20)
- **N+1 Prevention:** Use Prisma's `include` carefully

---

## Localization (i18n)

### Translation Files
**public/locales/fr.json**
```json
{
  "common": {
    "welcome": "Bienvenue",
    "search": "Recherche",
    "cart": "Panier",
    "orders": "Commandes"
  },
  "products": {
    "addToCart": "Ajouter au panier",
    "outOfStock": "Rupture de stock",
    "lowStock": "Stock limité"
  }
}
```

**public/locales/ar.json** (RTL)
```json
{
  "common": {
    "welcome": "مرحباً",
    "search": "بحث",
    "cart": "السلة",
    "orders": "الطلبات"
  },
  "products": {
    "addToCart": "أضف إلى السلة",
    "outOfStock": "غير متوفر",
    "lowStock": "مخزون محدود"
  }
}
```

### Usage in Components
```tsx
import { useTranslation } from 'next-i18next';

export function ProductCard() {
  const { t } = useTranslation('products');

  return (
    <button>{t('addToCart')}</button>
  );
}
```

---

## Security Checklist

- [ ] **Environment variables** never committed (use `.env.example`)
- [ ] **API keys** stored securely (secrets management)
- [ ] **HTTPS** enforced in production
- [ ] **CORS** configured properly (whitelist origins)
- [ ] **Rate limiting** enabled on all endpoints
- [ ] **Input validation** on all user inputs
- [ ] **SQL injection** prevented (Prisma parameterized queries)
- [ ] **XSS** prevented (CSP headers, sanitized inputs)
- [ ] **CSRF** tokens implemented
- [ ] **JWT secrets** rotated regularly
- [ ] **Password hashing** with bcrypt (cost factor 12)
- [ ] **Sensitive logs** redacted (no passwords in logs)

---

## Troubleshooting

### "Prisma Client Not Found"
```bash
cd libs/database
npx prisma generate
```

### "Port Already in Use"
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### "Database Connection Failed"
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### "Module Not Found"
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Helpful Resources

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [Redis Docs](https://redis.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [i18next Docs](https://react.i18next.com)

### Algerian-Specific Resources
- [Algeria Wilayas List](https://en.wikipedia.org/wiki/Provinces_of_Algeria)
- [Algerian Phone Format](https://en.wikipedia.org/wiki/Telephone_numbers_in_Algeria) (+213)
- [Arabic Typography Best Practices](https://fonts.google.com/knowledge/introducing_type/arabic_type_basics)

---

## Support & Communication

### Getting Help
1. **Check documentation** (this file, SUMMARY.md, project-initialization.md)
2. **Search existing issues** on GitHub
3. **Ask in team chat** (Slack/Discord/Teams)
4. **Create GitHub issue** if bug or feature request

### Code Review Process
1. Create PR with descriptive title and description
2. Request review from at least 1 team member
3. Address review comments
4. Ensure CI passes (tests, linting)
5. Merge after approval

---

**Status:** Pre-kickoff - Ready for development team onboarding

**Last Updated:** January 8, 2026
**Maintained By:** Tech Lead
