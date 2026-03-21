# Contributing to Bellat Platform

Thank you for contributing to the Bellat Digital Ordering Platform! This document provides guidelines for team members.

## Development Workflow

### 1. Getting Started

Read the [Quick Start Guide](.claude/QUICKSTART.md) for setup instructions.

### 2. Branch Naming

Use the following format:
```
feature/<ticket>-<description>   # New features
bugfix/<ticket>-<description>    # Bug fixes
hotfix/<ticket>-<description>    # Production hotfixes
release/<version>                # Release branches
```

Examples:
- `feature/BLT-123-arabic-rtl-layout`
- `bugfix/BLT-456-cart-quantity-overflow`
- `hotfix/BLT-789-payment-validation`

### 3. Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add Google OAuth integration
fix(cart): prevent negative quantities
docs(readme): update setup instructions
style(frontend): format with Prettier
refactor(orders): extract validation logic
test(products): add unit tests for search
chore(deps): upgrade Next.js to 14.1
```

### 4. Pull Request Process

1. **Create a feature branch** from `develop`
2. **Make your changes** following our coding standards
3. **Write/update tests** for your changes
4. **Run linting and tests** locally
   ```bash
   npm run lint
   npm run test
   npm run type-check
   ```
5. **Commit your changes** with meaningful commit messages
6. **Push to your branch**
7. **Create a Pull Request** with:
   - Descriptive title
   - Summary of changes
   - Screenshots (if UI changes)
   - Test instructions
   - Related issue/ticket number

### 5. Pull Request Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Related Issue
Closes #<issue-number>

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed
- [ ] All tests passing

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added to complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass locally
```

### 6. Code Review Guidelines

**For Reviewers:**
- Review within 24 hours
- Be constructive and respectful
- Check for:
  - Code quality and readability
  - Test coverage
  - Performance implications
  - Security concerns
  - Breaking changes

**For Authors:**
- Respond to feedback promptly
- Don't take criticism personally
- Explain your reasoning when disagreeing
- Update PR based on feedback

## Coding Standards

### TypeScript

- Use explicit types (avoid `any`)
- Use interfaces for object types
- Use enums for fixed sets of values
- Enable strict mode
- Write self-documenting code

**Good:**
```typescript
interface CreateProductDto {
  nameFr: string;
  nameAr: string;
  categoryId: string;
  isHalal: boolean;
}

async function createProduct(dto: CreateProductDto): Promise<Product> {
  return await prisma.product.create({ data: dto });
}
```

**Bad:**
```typescript
async function create(d: any) {
  return await prisma.product.create({ data: d });
}
```

### React Components

- Use functional components
- Use TypeScript props interfaces
- Extract complex logic to custom hooks
- Keep components small and focused
- Use meaningful names

**Good:**
```tsx
interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <button onClick={() => onAddToCart(product.id)}>
        Add to Cart
      </button>
    </div>
  );
}
```

### File Naming

- `PascalCase` for React components: `ProductCard.tsx`
- `camelCase` for utilities: `formatPrice.ts`
- `kebab-case` for pages: `product-detail.tsx`
- `snake_case` for test files: `product_card.test.tsx`

### Import Order

1. External dependencies
2. Internal absolute imports
3. Relative imports

```typescript
// 1. External
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@bellat/database';

// 2. Internal absolute
import { CreateProductDto } from './dto/create-product.dto';

// 3. Relative
import { ProductMapper } from './product.mapper';
```

## Testing

### Unit Tests

- Write tests for all business logic
- Aim for 80%+ coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

```typescript
describe('ProductService', () => {
  it('should create a product with valid data', async () => {
    // Arrange
    const dto: CreateProductDto = { /* ... */ };

    // Act
    const result = await service.create(dto);

    // Assert
    expect(result).toHaveProperty('id');
    expect(result.name).toBe(dto.name);
  });
});
```

### E2E Tests

- Test critical user journeys
- Focus on happy paths and edge cases
- Use realistic test data

## Localization

- All user-facing strings must be in `web/messages/fr.json` and `web/messages/ar.json`
- Use **next-intl** hooks — never i18next or next-i18next
- Support both Arabic (RTL) and French (LTR) — use `start`/`end` not `left`/`right` in Tailwind

```tsx
// ✅ Good
import { useTranslations } from 'next-intl';

export function ProductCard() {
  const t = useTranslations('Common');
  return <button>{t('AddToCart')}</button>;
}

// ❌ Bad — wrong library
import { useTranslation } from 'next-i18next';

// ❌ Bad — hardcoded string
export function ProductCard() {
  return <button>Add to Cart</button>;
}
```

## Performance

- Optimize images (use Next.js Image component)
- Lazy load components when appropriate
- Memoize expensive calculations
- Avoid unnecessary re-renders
- Paginate large lists

## Security

- Never commit secrets or API keys
- Validate all user inputs
- Sanitize data before rendering
- Use parameterized queries (Prisma handles this)
- Follow OWASP guidelines

## Git Best Practices

- Commit often, push regularly
- Keep commits atomic (one logical change per commit)
- Write meaningful commit messages
- Don't commit commented-out code
- Don't commit `console.log` statements
- Review your own changes before creating PR

## Questions?

- Check [CLAUDE.md](../CLAUDE.md) for architecture, patterns, and all commands
- Check [.claude/QUICKSTART.md](QUICKSTART.md) for setup
- Ask in the team chat
- Create a GitHub discussion

---

**Thank you for contributing to Bellat Platform!** 🎉
