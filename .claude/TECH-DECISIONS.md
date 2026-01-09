# Technology Decision Rationale
## Bellat Digital Ordering Platform

**Purpose:** Document why specific technologies were chosen
**Audience:** Technical team, stakeholders, future maintainers
**Date:** January 8, 2026

---

## Decision Framework

All technology choices were evaluated against these criteria:

1. **Business Alignment:** Supports project requirements (bilingual, offline, B2B/B2C)
2. **Performance:** Meets NFRs (< 2s FCP, 1,000+ concurrent users)
3. **Developer Experience:** Strong TypeScript support, good documentation
4. **Community & Ecosystem:** Active maintenance, large community
5. **Cost:** Open-source preferred, reasonable licensing
6. **Team Expertise:** Reasonable learning curve
7. **Scalability:** Handles future growth (Phase 2/3)
8. **Algeria Context:** Works with intermittent connectivity, mobile-first

---

## Frontend Technology Decisions

### ✅ Next.js 14 (React Framework)

**Why Next.js:**
- ✅ **Server-Side Rendering (SSR):** Critical for SEO (product catalog indexing)
- ✅ **App Router:** Modern file-based routing with layouts
- ✅ **Image Optimization:** Automatic optimization + lazy loading
- ✅ **PWA Support:** Excellent service worker integration
- ✅ **TypeScript Native:** First-class TypeScript support
- ✅ **API Routes:** Backend-for-frontend patterns
- ✅ **Static Generation:** Pre-render product pages for performance
- ✅ **i18n Support:** Built-in internationalization routing

**Alternatives Considered:**
- ❌ **Create React App:** No SSR, deprecated
- ❌ **Gatsby:** Overkill for e-commerce, complex build times
- ❌ **Remix:** Newer, smaller ecosystem
- ❌ **Vue/Nuxt:** Team less familiar with Vue

**Decision:** Next.js 14 with App Router

---

### ✅ Tailwind CSS 3 (Styling)

**Why Tailwind:**
- ✅ **Utility-First:** Rapid development, consistent design
- ✅ **RTL Support:** Built-in RTL plugin for Arabic
- ✅ **Tree-Shaking:** Unused styles removed in production
- ✅ **Responsive:** Mobile-first breakpoints
- ✅ **Customization:** Easy theme customization (Bellat colors)
- ✅ **Small Bundle:** Optimized production builds
- ✅ **No CSS-in-JS Runtime:** Zero runtime overhead

**Alternatives Considered:**
- ❌ **Bootstrap:** Less customizable, larger bundle
- ❌ **Material-UI:** Heavy, opinionated, slow
- ❌ **Emotion/Styled-Components:** Runtime CSS-in-JS overhead
- ❌ **Vanilla CSS:** Too manual, inconsistent

**Decision:** Tailwind CSS 3 with RTL plugin

---

### ✅ Zustand 4 (State Management)

**Why Zustand:**
- ✅ **Lightweight:** ~1KB bundle size
- ✅ **Simple API:** Minimal boilerplate vs Redux
- ✅ **TypeScript:** Excellent type inference
- ✅ **No Provider:** Direct hook usage
- ✅ **Persist Middleware:** Built-in localStorage persistence
- ✅ **DevTools:** Redux DevTools integration

**Alternatives Considered:**
- ❌ **Redux Toolkit:** Overkill for this project, larger bundle
- ❌ **Jotai/Recoil:** Atomic state more complex than needed
- ❌ **Context API:** Performance issues with frequent updates
- ❌ **Valtio:** Less mature, proxy-based (debugging harder)

**Decision:** Zustand 4 for cart, auth, UI state

---

### ✅ i18next (Internationalization)

**Why i18next:**
- ✅ **Mature:** Industry standard for React i18n
- ✅ **RTL Support:** Excellent Arabic RTL handling
- ✅ **Pluralization:** Arabic plural rules support
- ✅ **Lazy Loading:** Load translations on-demand
- ✅ **Interpolation:** Variable substitution in strings
- ✅ **Next.js Integration:** next-i18next official package

**Alternatives Considered:**
- ❌ **React Intl:** More verbose API
- ❌ **LinguiJS:** Smaller community
- ❌ **Custom Solution:** Reinventing the wheel

**Decision:** i18next with next-i18next

---

### ✅ Workbox (Service Worker)

**Why Workbox:**
- ✅ **Google-Backed:** Well-maintained, official PWA tool
- ✅ **Precaching:** Cache shell, assets, pages
- ✅ **Runtime Caching:** Network-first, cache-first strategies
- ✅ **Background Sync:** Offline order queueing
- ✅ **Next.js Plugin:** next-pwa integration
- ✅ **IndexedDB:** Offline data storage

**Alternatives Considered:**
- ❌ **Custom Service Worker:** Too complex, error-prone
- ❌ **sw-precache:** Deprecated in favor of Workbox

**Decision:** Workbox via next-pwa plugin

---

## Backend Technology Decisions

### ✅ NestJS 10 (Node.js Framework)

**Why NestJS:**
- ✅ **TypeScript Native:** End-to-end type safety
- ✅ **Modular Architecture:** Microservices-ready
- ✅ **Dependency Injection:** Testable, maintainable code
- ✅ **Built-In Modules:** Auth, validation, ORM, WebSockets
- ✅ **Prisma Integration:** Official @nestjs/prisma package
- ✅ **Swagger/OpenAPI:** Auto-generated API docs
- ✅ **Middleware:** Express/Fastify compatible
- ✅ **Decorators:** Clean, declarative syntax

**Alternatives Considered:**
- ❌ **Express.js:** Too minimal, requires too many libraries
- ❌ **Fastify:** Less ecosystem, smaller community
- ❌ **Koa:** Minimal, less structure
- ❌ **Adonis.js:** Less popular, smaller community

**Decision:** NestJS 10 with Fastify adapter (performance)

---

### ✅ Prisma 5 (ORM & Database Toolkit)

**Why Prisma:**
- ✅ **Type Safety:** Auto-generated TypeScript types
- ✅ **Schema-First:** Single source of truth (schema.prisma)
- ✅ **Migrations:** Version-controlled schema changes
- ✅ **Prisma Studio:** Built-in database GUI
- ✅ **Query Builder:** Type-safe, autocomplete queries
- ✅ **N+1 Prevention:** Optimized includes/selects
- ✅ **PostgreSQL Support:** Excellent PostgreSQL integration
- ✅ **Full-Text Search:** Native PostgreSQL FTS support

**Alternatives Considered:**
- ❌ **TypeORM:** Less type-safe, ActiveRecord pattern
- ❌ **Sequelize:** Outdated, poor TypeScript support
- ❌ **Knex.js:** Too low-level, manual migrations
- ❌ **MikroORM:** Smaller community

**Decision:** Prisma 5 with PostgreSQL

---

### ✅ PostgreSQL 15 (Primary Database)

**Why PostgreSQL:**
- ✅ **Relational:** Orders, products, inventory are highly relational
- ✅ **ACID Compliance:** Critical for financial transactions (B2B credit)
- ✅ **Full-Text Search:** Built-in FTS with pg_trgm (fuzzy matching)
- ✅ **JSONB:** Flexible data (images, nutritional info, addresses)
- ✅ **Mature:** 25+ years of development
- ✅ **Performance:** Excellent query optimization
- ✅ **Extensions:** pg_trgm for fuzzy search, trigram similarity
- ✅ **Open Source:** No licensing costs
- ✅ **Scalability:** Read replicas, partitioning

**Alternatives Considered:**
- ❌ **MongoDB:** Not ideal for relational data, eventual consistency
- ❌ **MySQL:** Weaker full-text search, no JSONB
- ❌ **SQLite:** Not production-ready for multi-user
- ❌ **MS SQL Server:** Licensing costs, less Linux-friendly

**Decision:** PostgreSQL 15 with pg_trgm extension

---

### ✅ Redis 7 (Cache & Session Store)

**Why Redis:**
- ✅ **In-Memory:** Sub-millisecond latency
- ✅ **Data Structures:** Strings, hashes, lists, sets, sorted sets
- ✅ **Pub/Sub:** Real-time messaging between services
- ✅ **TTL:** Automatic expiration (sessions, OTP)
- ✅ **Persistence:** RDB + AOF for durability
- ✅ **Clustering:** Horizontal scaling
- ✅ **Lua Scripts:** Atomic operations
- ✅ **NestJS Integration:** @nestjs/cache-manager

**Alternatives Considered:**
- ❌ **Memcached:** Less features, no persistence
- ❌ **In-Memory Store:** Not distributed, lost on restart
- ❌ **PostgreSQL for sessions:** Slower, overkill

**Decision:** Redis 7 for cache, sessions, queues

---

## Infrastructure Decisions

### ✅ Docker + Kubernetes

**Why Docker:**
- ✅ **Consistency:** Same environment dev → staging → prod
- ✅ **Isolation:** Services don't conflict
- ✅ **Portability:** Deploy anywhere
- ✅ **CI/CD:** Easy automated builds

**Why Kubernetes:**
- ✅ **Auto-Scaling:** Handle Ramadan/Eid traffic spikes
- ✅ **Self-Healing:** Auto-restart failed containers
- ✅ **Load Balancing:** Distribute traffic across replicas
- ✅ **Rolling Updates:** Zero-downtime deployments
- ✅ **Declarative:** Infrastructure as code (YAML)

**Alternatives Considered:**
- ❌ **VM-Based Deployment:** Inefficient, harder to scale
- ❌ **Docker Swarm:** Less ecosystem than Kubernetes
- ❌ **Serverless (Lambda):** Cold starts, vendor lock-in
- ❌ **Heroku/PaaS:** Higher cost, less control

**Decision:** Docker + Kubernetes (self-hosted)

---

### ✅ Cloudflare (CDN & WAF)

**Why Cloudflare:**
- ✅ **Global CDN:** Cache static assets worldwide
- ✅ **DDoS Protection:** Free tier includes mitigation
- ✅ **WAF:** Web Application Firewall
- ✅ **SSL/TLS:** Free certificates
- ✅ **Analytics:** Traffic insights
- ✅ **Algeria Support:** Good MENA presence
- ✅ **Cost:** Free tier sufficient for Phase 1

**Alternatives Considered:**
- ❌ **AWS CloudFront:** More expensive
- ❌ **Akamai:** Enterprise pricing
- ❌ **No CDN:** Slow for Algeria users

**Decision:** Cloudflare Free/Pro tier

---

## Integration Decisions

### ✅ Firebase Cloud Messaging (Push Notifications)

**Why FCM:**
- ✅ **Cross-Platform:** Web, Android, iOS (future)
- ✅ **Free:** No cost for push notifications
- ✅ **Reliable:** Google infrastructure
- ✅ **Topic Subscriptions:** Segment users
- ✅ **Analytics:** Delivery metrics

**Alternatives Considered:**
- ❌ **OneSignal:** Third-party dependency
- ❌ **Pusher:** Paid service
- ❌ **Custom WebSocket:** Complex, reinventing wheel

**Decision:** Firebase Cloud Messaging (FCM)

---

### ✅ SendGrid (Transactional Email)

**Why SendGrid:**
- ✅ **Reliability:** 99.99% uptime SLA
- ✅ **Free Tier:** 100 emails/day (sufficient for dev/staging)
- ✅ **Templates:** Dynamic email templates
- ✅ **Analytics:** Open rates, click tracking
- ✅ **API:** Simple REST API
- ✅ **Localization:** Support for Arabic/French

**Alternatives Considered:**
- ❌ **Mailgun:** Similar pricing, less analytics
- ❌ **AWS SES:** More complex setup
- ❌ **SMTP Server:** Deliverability issues, maintenance

**Decision:** SendGrid (starting with free tier)

---

### ✅ Local Algerian SMS Gateway

**Why Local Provider:**
- ✅ **Better Delivery:** Local carriers (Mobilis, Djezzy, Ooredoo)
- ✅ **Lower Cost:** International gateways charge more for Algeria
- ✅ **Compliance:** Algerian regulations
- ✅ **Reliability:** Direct carrier integration

**Fallback:**
- Twilio for development/testing (international numbers)

**Alternatives Considered:**
- ❌ **Twilio Only:** Higher cost for Algeria, worse delivery
- ❌ **African SMS Providers:** Less Algeria focus

**Decision:** Local Algerian SMS gateway (TBD) with Twilio fallback

---

## Security Decisions

### ✅ bcrypt (Password Hashing)

**Why bcrypt:**
- ✅ **Adaptive:** Configurable cost factor (12)
- ✅ **Salted:** Automatic salt generation
- ✅ **Slow:** Resistant to brute-force
- ✅ **Battle-Tested:** Industry standard

**Alternatives Considered:**
- ❌ **SHA-256:** Too fast, not designed for passwords
- ❌ **MD5:** Broken, insecure
- ❌ **Argon2:** Newer, less ecosystem support

**Decision:** bcrypt with cost factor 12

---

### ✅ JWT (JSON Web Tokens)

**Why JWT:**
- ✅ **Stateless:** No server-side session storage (scales better)
- ✅ **Cross-Domain:** Works with multiple subdomains
- ✅ **Payload:** Embed user data (id, type, permissions)
- ✅ **Standard:** RFC 7519
- ✅ **Refresh Tokens:** Long-lived refresh + short access tokens

**Configuration:**
- **Algorithm:** RS256 (asymmetric, more secure than HS256)
- **Access Token TTL:** 24 hours
- **Refresh Token TTL:** 30 days
- **Storage:** httpOnly cookies (XSS protection)

**Alternatives Considered:**
- ❌ **Session Cookies:** Requires Redis/DB lookup on every request
- ❌ **OAuth2 Only:** Overkill for own users

**Decision:** JWT with RS256 signing

---

## Monitoring & Observability

### ✅ Prometheus + Grafana

**Why Prometheus:**
- ✅ **Metrics:** Time-series data for API latency, throughput
- ✅ **Alerting:** Alert on thresholds
- ✅ **Query Language:** PromQL for complex queries
- ✅ **Open Source:** No licensing

**Why Grafana:**
- ✅ **Visualization:** Beautiful dashboards
- ✅ **Multi-Source:** Can query Prometheus, PostgreSQL, etc.
- ✅ **Alerting:** Notification channels (Slack, email)

**Alternatives Considered:**
- ❌ **Datadog:** Expensive for startup
- ❌ **New Relic:** Paid, vendor lock-in
- ❌ **CloudWatch:** AWS-specific

**Decision:** Prometheus + Grafana (self-hosted)

---

### ✅ ELK Stack (Logging)

**Why ELK:**
- ✅ **Centralized Logs:** All services in one place
- ✅ **Search:** Elasticsearch for log search
- ✅ **Visualization:** Kibana dashboards
- ✅ **Open Source:** No licensing

**Components:**
- **Elasticsearch:** Log storage and search
- **Logstash:** Log aggregation and parsing
- **Kibana:** Visualization and dashboards

**Alternatives Considered:**
- ❌ **Splunk:** Enterprise pricing
- ❌ **Loggly:** SaaS, cost scales with volume
- ❌ **CloudWatch Logs:** AWS-specific

**Decision:** ELK Stack (or Loki as lighter alternative)

---

## CI/CD Decisions

### ✅ GitHub Actions

**Why GitHub Actions:**
- ✅ **Integrated:** Native GitHub integration
- ✅ **Free:** 2,000 minutes/month (private repos)
- ✅ **Marketplace:** Pre-built actions
- ✅ **Matrix Builds:** Test multiple Node.js versions
- ✅ **Secrets Management:** Encrypted secrets

**Alternatives Considered:**
- ❌ **GitLab CI:** Would require GitLab migration
- ❌ **Jenkins:** Self-hosted, more maintenance
- ❌ **CircleCI:** Paid for private repos

**Decision:** GitHub Actions for CI/CD

---

## Development Tools

### ✅ VS Code (IDE)

**Why VS Code:**
- ✅ **Free:** Open source
- ✅ **Extensions:** Massive extension marketplace
- ✅ **TypeScript:** Best-in-class TS support
- ✅ **Debugging:** Built-in Node.js debugger
- ✅ **Remote Dev:** SSH, Containers, WSL support

**Alternatives Considered:**
- ❌ **WebStorm:** Paid, heavier
- ❌ **Vim/Neovim:** Steeper learning curve
- ❌ **Sublime Text:** Less IDE features

**Recommendation:** VS Code (team can use others if preferred)

---

### ✅ ESLint + Prettier (Code Quality)

**Why ESLint:**
- ✅ **Linting:** Catch errors early
- ✅ **Customizable:** Extend rules
- ✅ **TypeScript:** @typescript-eslint/parser

**Why Prettier:**
- ✅ **Formatting:** Consistent code style
- ✅ **Auto-Fix:** Format on save
- ✅ **Opinionated:** Minimal configuration

**Configuration:**
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/explicit-function-return-type": "off"
  }
}
```

---

## Rejected Technologies & Why

### ❌ GraphQL

**Why Not:**
- Too complex for this project
- REST is sufficient for CRUD operations
- Smaller team, less familiarity
- Caching more complex with GraphQL

**When to Reconsider:**
- Phase 3 if mobile apps need flexible queries
- If overfetching becomes a performance issue

---

### ❌ NoSQL (MongoDB, DynamoDB)

**Why Not:**
- Data is highly relational (orders → items → products)
- ACID transactions critical for B2B credit
- PostgreSQL JSONB provides NoSQL flexibility when needed

**When to Reconsider:**
- If analytics workload requires separate data warehouse

---

### ❌ Native Mobile Apps (Phase 1)

**Why Not:**
- PWA sufficient for Phase 1 requirements
- Faster development (single codebase)
- Instant updates (no app store approval)
- Lower development cost

**When to Include:**
- Phase 2 for advanced features (GPS tracking, biometrics)

---

### ❌ Server-Sent Events (SSE) for Real-Time

**Why Not:**
- WebSockets more bidirectional
- Better browser support
- More mature libraries (Socket.IO)

**When to Reconsider:**
- If only need server → client updates (could simplify)

---

## Technology Versions (Locked)

| Technology | Version | Rationale |
|------------|---------|-----------|
| Node.js | 18 LTS | Long-term support, stable |
| Next.js | 14.x | Latest stable, App Router |
| React | 18.x | Concurrent features, Suspense |
| NestJS | 10.x | Latest stable |
| Prisma | 5.x | Latest stable, best PostgreSQL support |
| PostgreSQL | 15.x | Latest stable, excellent JSON support |
| Redis | 7.x | Latest stable |
| TypeScript | 5.x | Latest stable, better inference |
| Tailwind | 3.x | Latest stable, arbitrary values |

**Version Policy:**
- Minor updates: Allowed (security patches)
- Major updates: Requires team discussion
- Dependencies: Keep up-to-date (Dependabot)

---

## Future Technology Considerations

### Phase 2 Additions
- **CIB/Dahabia Payment SDK:** Algeria's payment gateways
- **Google Maps API:** GPS tracking, route optimization
- **React Native / Capacitor:** Native mobile apps

### Phase 3 Additions
- **TensorFlow.js:** AI demand forecasting
- **Apache Kafka:** Event streaming for ERP integration
- **Metabase / Redash:** Self-service analytics

---

## Configuration Checklist

### Pre-Deployment Checklist
- [ ] **Environment Variables:** All secrets in vault/encrypted
- [ ] **Database:** Backups configured (6-hour interval)
- [ ] **Redis:** Persistence enabled (RDB + AOF)
- [ ] **SSL/TLS:** Certificate valid, auto-renewal enabled
- [ ] **CORS:** Whitelist only allowed origins
- [ ] **Rate Limiting:** Enabled on all public endpoints
- [ ] **Monitoring:** Prometheus scraping metrics
- [ ] **Logging:** Centralized logging (ELK/Loki)
- [ ] **Alerts:** PagerDuty/email alerts configured
- [ ] **CDN:** Cloudflare DNS pointed correctly
- [ ] **Service Worker:** Cached assets configured
- [ ] **i18n:** All UI text translated (AR/FR)

---

## Cost Estimates (Phase 1)

| Service | Tier | Monthly Cost (USD) |
|---------|------|--------------------|
| Cloud VPS (Kubernetes) | 4 vCPU, 8GB RAM | $40-80 |
| PostgreSQL (Managed) | 2 vCPU, 4GB RAM | $20-40 |
| Redis (Managed) | 1GB RAM | $10-20 |
| Cloudflare | Pro | $20 |
| SendGrid | Free → Essentials | $0-15 |
| Firebase FCM | Free | $0 |
| SMS Gateway | Pay-as-you-go | ~$50 (1,000 SMS) |
| Domain + SSL | - | $15/year |
| **Total** | | **$100-$225/month** |

**Note:** Self-hosted Kubernetes can reduce costs to ~$80/month

---

## Conclusion

All technology decisions prioritize:
1. **Type Safety:** End-to-end TypeScript
2. **Performance:** Meets NFRs for Algeria's network conditions
3. **Developer Experience:** Modern tooling, good DX
4. **Open Source:** Minimize licensing costs
5. **Proven:** Battle-tested in production environments

**Review Cycle:** Every 6 months or before major phases

**Decision Authority:** Tech Lead with team input

---

**Last Updated:** January 8, 2026
**Next Review:** July 2026 (before Phase 2 kickoff)
