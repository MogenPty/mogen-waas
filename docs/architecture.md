# Mogen WaaS — Technical Architecture

**Document status:** Authoritative architecture baseline  
**Repository:** `mogen-waas`  
**Primary runtime:** Next.js 16  
**Language:** TypeScript  
**CSS:** Tailwind CSS 4  
**ORM:** Drizzle ORM  
**Authentication:** Neon Auth, subject to the validation described below  
**Database:** PostgreSQL / Neon  
**Package manager:** pnpm  
**Architecture style:** Feature-based + layered boundaries + adapter pattern  
**Source directory:** NONE — do not use `/src`

---

# 1. Architecture Goals

The architecture must optimize for:

1. correctness of the template/content/renderer system
2. simple customer workflows
3. maintainability
4. testability
5. provider portability
6. low infrastructure cost
7. AI-assisted development without architectural drift
8. future versioning
9. future A/B testing
10. future reuse of core rendering capabilities

The database is not the heart of the product.

The **content → contract → template → renderer pipeline is the heart of the product.**

---

# 2. Technology Baseline

The project must use:

- Next.js 16
- TypeScript
- Tailwind CSS 4
- Drizzle ORM
- PostgreSQL
- Neon
- pnpm
- Vercel for initial application deployment where appropriate
- Cloudflare for applicable DNS/storage/edge services
- shadcn/ui as the preferred dashboard component system

Other packages should use the newest stable versions that are compatible with the locked Next.js 16 and Tailwind CSS 4 baseline.

Do not downgrade the baseline to accommodate an old package.

If a package requires an incompatible version, find a maintained alternative before weakening the baseline.

---

# 3. No `/src`

The repository must NOT use:

```text
/src
```

Next.js application code lives from the repository root.

Preferred high-level structure:

```text
mogen-waas/
├── app/
├── components/
├── config/
├── db/
├── domain/
├── features/
├── infrastructure/
├── lib/
├── templates/
├── public/
├── tests/
├── docs/
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.*
├── postcss.config.*
└── ...
```

The exact structure may evolve, but `/src` is prohibited.

---

# 4. Feature-Based Architecture

Organize application behavior around business capabilities.

Possible features include:

```text
features/
├── authentication/
├── accounts/
├── websites/
├── onboarding/
├── content/
├── templates/
├── previews/
├── versions/
├── publishing/
├── deployments/
├── domains/
├── billing/
└── assets/
```

Do not create dozens of arbitrary folders merely to demonstrate architecture.

A feature may contain its own:

```text
components/
actions/
queries/
schemas/
services/
types/
```

when those pieces belong specifically to that feature.

Shared code belongs in shared locations only when it is genuinely shared.

---

# 5. Layer Boundaries

The conceptual architecture is:

```text
UI / Next.js
       ↓
Feature Application Logic
       ↓
Domain
       ↓
Ports / Interfaces
       ↓
Adapters / Infrastructure
       ↓
External Providers
```

Examples:

```text
Dashboard UI
    ↓
Website Application Service
    ↓
Website Domain
    ↓
DeploymentProvider
    ↓
Vercel Adapter
```

The domain should not import Vercel SDKs.

The domain should not import Neon SDKs.

The domain should not import payment-provider SDKs.

---

# 6. Adapter Pattern

External systems must be isolated behind application-owned interfaces.

Examples:

```ts
interface PaymentProvider {
  createCheckout(...): Promise<...>
  verifyPayment(...): Promise<...>
}

interface StorageProvider {
  upload(...): Promise<...>
  delete(...): Promise<...>
  getUrl(...): Promise<...>
}

interface DeploymentProvider {
  createPreview(...): Promise<...>
  deploy(...): Promise<...>
  getDeployment(...): Promise<...>
}

interface DomainProvider {
  search(...): Promise<...>
  register(...): Promise<...>
  configure(...): Promise<...>
}
```

These are examples, not permission to prematurely implement every provider.

Adapters belong in infrastructure/provider-specific locations.

Business logic must depend on interfaces/ports, not vendor implementations.

---

# 7. The Core Rendering Architecture

The most important system is:

```text
Canonical Content
       ↓
Template Contract
       ↓
Template Definition
       ↓
Renderer
       ↓
Rendered Website
```

Do not reverse this relationship.

Templates consume canonical content.

Canonical content must not be shaped around one template.

---

# 8. Canonical Content

Canonical content is presentation-independent business information.

The conceptual model includes:

```text
business
branding
services[]
products[]
locations[]
addresses[]
phoneNumbers[]
emailAddresses[]
socialLinks[]
testimonials[]
faqs[]
```

Potential fields include:

```text
business.name
business.description
business.tagline
business.logo
```

The actual schema should be finalized during the canonical-content milestone.

Repeated concepts must be arrays.

Repeated records should have stable identifiers and explicit ordering.

---

# 9. Content Ownership

Content belongs to a website/business configuration.

Templates must not own content.

For example, this is correct:

```text
website.content.services[]
```

This is incorrect:

```text
templateA.services[]
templateB.services[]
```

unless a template-specific field is genuinely required and deliberately declared by its contract.

---

# 10. Template Contract

Each template must declare its content requirements.

Conceptually:

```text
Template
 ├── metadata
 ├── version
 ├── supported pages
 ├── required content
 ├── optional content
 └── rendering configuration
```

The contract determines which information the customer must provide.

The UI should be able to use the contract to determine what information needs to be collected.

Do not hard-code the onboarding form independently for every template.

---

# 11. Template-Specific Content

Templates may require information that another template does not use.

Example:

```text
Template A
    testimonials required

Template B
    projects required
```

When switching:

```text
Existing content
       ↓
Compatibility/mapping
       ↓
New template requirements
```

Unused content is preserved.

Content must never be deleted merely because a template no longer uses it.

---

# 12. Two-Template Proof

Before implementing the complete database or customer workflow, the system must prove that:

1. two substantially different templates exist
2. both use the same canonical content
3. both render correctly
4. template-specific requirements work
5. switching templates does not destroy unused content

This is an architecture gate.

If the architecture cannot support two genuinely different templates cleanly, do not proceed to database-heavy implementation.

---

# 13. Renderer Design

The renderer should use controlled composition.

Avoid arbitrary:

```text
JSON → eval()
JSON → arbitrary React component
JSON → arbitrary HTML
```

The system should use known components and known template contracts.

Conceptually:

```text
TemplateDefinition
      ↓
Section definitions
      ↓
Known renderer registry
      ↓
React components
```

The exact implementation can be refined after the two-template proof.

---

# 14. Shared vs Template-Specific Components

Shared components may include things such as:

- navigation primitives
- buttons
- typography primitives
- SEO helpers
- image helpers
- accessibility utilities
- known content renderers

Template-specific components may include:

- hero layouts
- service grids
- testimonial compositions
- navigation arrangements
- footer designs
- visual sections

Do not force all templates into one visual design system.

The templates should genuinely look different.

---

# 15. Dashboard UI

The dashboard is an application interface.

Preferred UI stack:

- Tailwind CSS 4
- shadcn/ui
- accessible primitives

If a maintained component library offers substantially useful functionality beyond shadcn/ui, it may be evaluated.

However:

> A larger component library is not automatically a better architecture.

Any additional UI library requires justification.

Do not install component libraries merely because an AI agent finds them convenient.

Public website templates are separate.

A public template may use whatever presentation system the template requires.

Do not force shadcn/ui into public templates.

---

# 16. Database Architecture

Database technology:

```text
PostgreSQL
     ↓
Neon
     ↓
Drizzle ORM
```

The database primarily facilitates:

- authentication relationships
- account data
- websites
- content/configuration
- templates
- versions
- assets
- domains
- deployments
- billing state

Do not make the database schema the conceptual center of the product.

The domain/content model comes first.

---

# 17. Core Domain Entities

Expected entities include:

```text
User
Account
Website
Industry
Template
TemplateVersion
WebsiteContent
WebsiteVersion
Asset
Domain
Deployment
Plan
Subscription
Payment
```

The exact relational schema must be derived from the approved domain model and canonical content model.

Do not blindly create all tables before proving the rendering architecture.

---

# 18. Authentication — Neon Auth

Neon Auth is the selected authentication direction.

Current Neon Auth is built on Better Auth and stores authentication data in Neon. Neon documents server and client SDKs for Next.js, including user creation/sign-in/session functionality. Neon also documents users, roles, and organizations as part of the managed auth model.

Neon states that creating a user, creating the first business record, and assigning roles can be handled as part of the same database-oriented identity architecture.

The current Neon Auth SDK provides a Next.js server integration and client library.

**Important:** Neon Auth is not the same thing as installing and self-hosting Better Auth. Do not install the standalone Better Auth server unless an approved architecture decision requires it.

### Role policy

Application authorization roles must be treated separately from infrastructure/database roles.

Initial application roles should be kept intentionally small, for example:

```text
customer
admin
```

Additional roles require product justification.

Role assignment must be controlled by trusted server-side application code and/or approved administrative flows.

Do not allow a browser/client to arbitrarily assign itself an elevated role.

Before implementing role-management APIs, verify the current Neon Auth SDK/API documentation for the exact supported role-management operations. Do not rely on old examples.

Reference material reviewed for this architecture:

- Neon Auth architecture and Better Auth foundation:
  https://neon.com/blog/meet-the-new-neon-auth-branchable-identity-in-your-database
- Neon Auth Next.js SDK update:
  https://neon.com/docs/changelog/2026-01-30
- Neon Auth staging/branching:
  https://neon.com/blog/handling-auth-in-a-staging-environment

---

# 19. Authentication Portability

Although Neon Auth is selected, authentication access should be isolated behind application-facing helpers where useful.

The product should not scatter Neon Auth SDK calls throughout unrelated business features.

For example:

```text
features/authentication/
    server/
    client/
    permissions/
```

The application should ask:

```text
Who is the current user?
Does this user own this website?
Does this user have this permission?
```

rather than coupling every feature directly to Neon Auth internals.

---

# 20. Versioning

A website must support independent editing and publishing.

Conceptually:

```text
Website
 ├── current editable state
 ├── versions[]
 │     ├── draft
 │     ├── preview
 │     ├── approved
 │     ├── published
 │     └── archived
 └── active published version
```

The exact state model may be simplified during MVP implementation.

The critical rule is:

> Editing cannot unexpectedly alter the live website.

Versions should be immutable once they become a published/deployed artifact.

---

# 21. Deployment

Deployment must reference a specific website version.

Conceptually (deployment / preview):

```text
WebsiteVersion
      ↓
Deployment
      ↓
Deployment.url   (e.g. https://8tjd9g5.mogen.co.za — hash-like preview host)
```

`Deployment.url` is the URL exposed by that deployment. Public website domains are **not** `Deployment.url`; they are `Domain` rows that resolve via `Hostname → Domain → Website → Published Version → Renderer` (see §23).

The deployment provider should be abstracted.

Initial implementation may target Vercel.

Do not spread Vercel-specific logic throughout the application.

---

# 22. Preview Environments

The architecture should support:

- internal preview
- deployment preview
- published website

These are different concepts.

Internal preview does not necessarily mean publicly accessible.

A public deployment preview should be traceable to a specific version.

Future preview URLs may use immutable identifiers.

---

# 23. Domain Architecture

Domains are associated with websites (0..N per website).

Not templates.

Not users directly.

Conceptually:

```text
Account
  ↓
Website
  ↓
Domains[]   (0..N)
```

And for request handling:

```text
Incoming Request
       ↓
Hostname
       ↓
Domain Lookup (normalize → Domain)
       ↓
Website ID
       ↓
Published Version (Website.activePublishedVersionId)
       ↓
Renderer
       ↓
Response
```

A website has one identity/content configuration but may have multiple hostnames. All domains belonging to the same website resolve to the **same** published version — domains do not own content and do not create versions.

Distinguish three hostname types:

- **Mogen subdomain** (`mogen_subdomain`) — Mogen-controlled public domain (e.g. `abcplumbing.mogen.co.za`)
- **Customer custom domain** (`custom`) — customer-controlled domain connected to the website (e.g. `abcplumbing.co.za`)
- **Preview/deployment hostname** — hash-like hostname for a specific deployment/version (e.g. `8tjd9g5.mogen.co.za`), stored as `Deployment.url`, not as a `Domain` row

Domain types are modelled via `Domain.kind` (`mogen_subdomain` | `custom`).

### Primary domain

A website may have at most one primary domain (`Domain.isPrimary`). This is the preferred public/canonical hostname for canonical URLs and SEO (avoid duplicate content across aliases).

Invariants:

- `Domain` belongs to one `Website` (`domain.websiteId → website.id`, FK)
- `hostname` is unique (unique index, normalized lowercase via `normalizeHostname`)
- At most one `Domain` per `Website` may have `isPrimary = true` — enforce via partial unique index `UNIQUE (websiteId) WHERE isPrimary = true` plus application guard (`findPrimaryDomain`, `getCanonicalHostname`)

### Domain status

```text
DomainStatus = pending | verified | active | disabled
```

- `pending` — associated but not yet verified/active
- `verified` — ownership/configuration verified, not yet serving
- `active` — actively serving the website
- `disabled` — no longer active

Provider-specific domain operations belong behind `DomainProvider` (`search`, `register({websiteId, hostname, kind})`, `configure`, `verify`). Registration/DNS/registrar integration is future scope — the interface exists to avoid coupling.

### Version independence

```text
Website
 ├── Domains[]
 │    ├── abcplumbing.mogen.co.za (primary)
 │    └── abcplumbing.co.za (alias)
 └── Published Version
      └── Version 7
```

Changing the primary domain does not create a new `WebsiteVersion`. Changing content does not create a new `Domain`. `Deployment` references a `WebsiteVersion`, not merely a `Domain`.

### SEO / Canonical

The primary active domain is the canonical hostname (`getCanonicalHostname`). Aliases should eventually redirect to primary or emit canonical tags — data model must not prevent this, but a full redirect system is not MVP.

The architecture must eventually support:

- Mogen subdomains
- custom domains
- future domain registration
- DNS configuration
- domain verification

---

# 24. Payments

Payment state is separate from website rendering.

Conceptually:

```text
Account
  ↓
Subscription / Order
  ↓
Payment
```

Payment providers must be abstracted.

Potential providers may include:

- Yoco
- Paystack
- PayFast
- other South African-compatible providers

No provider is to be installed merely because an AI agent has an existing integration example.

The selected provider must be evaluated using current documentation, fees, South African support, API quality, and business requirements.

---

# 25. Storage

Assets must use a storage abstraction.

Possible infrastructure:

- Cloudflare R2
- Cloudinary
- other approved object storage

Do not couple the content model to a storage vendor.

Store stable asset metadata and provider references.

---

# 26. SEO Architecture

SEO metadata belongs to the website/page/content model where appropriate.

Rendering should generate:

- metadata
- canonical
- Open Graph
- sitemap
- robots
- structured data
- semantic headings

SEO logic should be reusable across templates.

A template may control presentation, but fundamental SEO behavior must not be duplicated per template.

---

# 27. A/B Testing Extension Point

A/B testing is not MVP.

However, publishing should be designed so that a future routing layer can choose between versions:

```text
Public Request
      ↓
Experiment Resolver
      ↓
Version A / Version B
      ↓
Renderer
```

Do not build the experiment engine now.

Do not design the database in a way that makes future version routing impossible.

---

# 28. Analytics Extension Point

Analytics is not MVP.

The rendering/request boundary should eventually permit event collection without embedding analytics logic throughout templates.

Do not add an analytics platform during MVP unless explicitly approved.

---

# 29. Dependency Policy

Every dependency must have a reason.

Before adding a dependency, determine:

1. What problem does it solve?
2. Is the problem already solved by Next.js, React, TypeScript, the standard library, or an existing dependency?
3. Is it actively maintained?
4. Does it support Next.js 16?
5. Does it support Tailwind CSS 4 where relevant?
6. Does it introduce unnecessary lock-in?
7. Does it increase bundle size?
8. Does it introduce security risk?
9. Does it create operational cost?
10. Is it required for MVP?

AI agents must not add dependencies merely because a tutorial uses them.

---

# 30. Deprecated/Old Technology Rule

Do not use:

- obsolete Next.js APIs
- deprecated React patterns
- Tailwind 3 configuration when Tailwind 4 is required
- old shadcn installation instructions
- obsolete Neon Auth SDK examples
- old Better Auth server examples
- abandoned packages
- unmaintained plugins
- copied architecture from old Mogen experiments without review

When documentation conflicts:

1. prefer official current documentation
2. check release/changelog information
3. verify installed package versions
4. test the API
5. do not guess

---

# 31. No Monorepo

The MVP repository is a single application.

Do not create:

```text
apps/
packages/
```

or a monorepo unless a later approved architecture decision demonstrates a real need.

The architecture should still use clean internal boundaries so extraction remains possible later.

---

# 32. No Premature Microservices

Do not introduce:

- separate rendering servers
- queue systems
- microservices
- event buses
- Kubernetes
- complex worker fleets

unless an actual product requirement requires them.

The MVP should be a coherent Next.js application with clean boundaries.

---

# 33. Security Principles

At minimum:

- validate all external input
- authorize server-side
- never trust client-provided ownership
- never trust client-provided role
- protect secrets
- never expose private provider credentials
- validate uploaded files
- constrain asset sizes
- sanitize/render user content safely
- verify webhook authenticity
- use least privilege
- log security-relevant events appropriately

Security decisions must not be simplified merely to make an AI implementation easier.

---

# 34. Testing Strategy

Testing should focus first on business-critical boundaries.

Priority:

1. canonical content validation
2. template contract validation
3. renderer behavior
4. template switching
5. version creation
6. publishing rules
7. ownership/authorization
8. payment state transitions
9. deployment state transitions

Do not chase arbitrary percentage-based test coverage.

Test the rules that would cause business damage if broken.

---

# 35. Architecture Change Rule

An AI agent may refactor implementation within the approved architecture.

An AI agent must ask for approval before changing:

- primary framework
- ORM
- authentication strategy
- database strategy
- template architecture
- canonical content model
- versioning model
- deployment architecture
- payment architecture
- domain architecture
- MVP scope
- repository architecture

If existing code makes the architecture difficult, do not silently redesign the architecture.

Raise the conflict.

---

# 36. Architecture Gate

The project must not progress merely because files compile.

Each major milestone must prove the relevant architectural property.

The first major gate is:

> Two substantially different templates successfully consume the same canonical content and render independently without duplicated application architecture.
