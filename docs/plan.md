# Mogen WaaS — Implementation Plan

**Status:** Active  
**Product:** Mogen WaaS  
**Repository:** `mogen-waas`  
**Primary goal:** Build the MVP incrementally without architectural drift.

---

# 1. Planning Philosophy

This project will be built in deliberate stages.

We will not:

- create the entire database first
- build the dashboard before proving the renderer
- copy complete websites for every template
- install large numbers of plugins
- add future features prematurely
- let AI agents redefine the architecture

The most important early risk is the relationship between:

```text
Canonical Content
        ↓
Template Contract
        ↓
Template
        ↓
Renderer
```

Therefore this relationship must be proven before the application grows around it.

---

# 2. Definition of Done

A task is not complete merely because code has been written.

A task is complete when:

- implementation exists
- types are correct
- relevant validation exists
- relevant tests exist
- lint/type checks pass
- behavior has been manually verified where appropriate
- documentation is updated if architecture changed
- no unapproved dependency was introduced
- no MVP scope was expanded
- the implementation respects `intent.md`
- the implementation respects `architecture.md`

AI must not report "done" when it means "code was generated."

---

# 3. Phase 0 — Repository Foundation

## Objectives

Create a clean Next.js 16 application using:

- TypeScript
- App Router
- Tailwind CSS 4
- pnpm
- no `/src`
- single repository

### Required root structure

```text
app/
components/
config/
db/
domain/
features/
infrastructure/
lib/
templates/
public/
tests/
docs/
```

The exact structure may be refined.

### Tasks

- [ ] Create Next.js 16 application
- [ ] Confirm no `/src` directory
- [ ] Confirm Tailwind CSS 4
- [ ] Confirm TypeScript
- [ ] Confirm pnpm
- [ ] Confirm App Router
- [ ] Configure linting
- [ ] Configure formatting if required
- [ ] Establish environment variable conventions
- [ ] Establish basic Git ignore rules
- [ ] Add project documentation
- [ ] Preserve/merge Next-generated AI instructions rather than replacing them blindly

### Gate

The application starts successfully and the baseline tooling passes.

---

# 4. Phase 1 — AI Governance

Create:

```text
docs/
├── intent.md
├── architecture.md
├── plan.md
└── MOGEN-WAAS-AGENTS.md
```

Next.js may generate root:

```text
AGENTS.md
CLAUDE.md
```

Do not allow generated files to replace Mogen's project rules.

After initialization:

1. inspect generated `AGENTS.md`
2. retain useful Next.js instructions
3. append/merge the approved Mogen rules
4. make the root `AGENTS.md` explicitly point to:
   - `docs/MOGEN-WAAS-AGENTS.md`
   - `docs/intent.md`
   - `docs/architecture.md`
   - `docs/plan.md`

The project documentation is authoritative.

---

# 5. Phase 2 — Domain Foundation

Before database implementation, define the domain concepts in TypeScript.

Potential concepts:

```text
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

### Tasks

- [ ] Define stable domain identifiers
- [ ] Define basic domain types
- [ ] Define website lifecycle concepts
- [ ] Define version concepts
- [ ] Define template concepts
- [ ] Avoid coupling domain types to database schemas
- [ ] Avoid coupling domain types to vendor SDKs

### Gate

Domain concepts can be understood without looking at database tables.

---

# 6. Phase 3 — Canonical Content Model

This is one of the highest-priority phases.

Define canonical business information.

Initial conceptual structure:

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

### Tasks

- [ ] Define TypeScript content types
- [ ] Define validation schemas
- [ ] Define stable IDs for repeatable records
- [ ] Define ordering
- [ ] Define optional vs required information
- [ ] Define image/asset references
- [ ] Define SEO-related content
- [ ] Define contact/location structures
- [ ] Define serialization rules
- [ ] Add tests

### Gate

A complete business can be represented without referencing any template.

---

# 7. Phase 4 — Template Contract

Define the contract between canonical content and templates.

### Tasks

- [ ] Define template metadata
- [ ] Define template version
- [ ] Define supported pages
- [ ] Define required content
- [ ] Define optional content
- [ ] Define template capabilities
- [ ] Define section/component contracts
- [ ] Define compatibility rules

### Gate

A template can declare what information it requires without owning the underlying content.

---

# 8. Phase 5 — Template Proof

Build two substantially different templates.

They must:

- use the same canonical content
- have different visual structures
- have different component arrangements
- demonstrate optional content
- demonstrate template-specific requirements

Example:

```text
Template A
- traditional corporate layout
- testimonials
- service cards

Template B
- modern visual layout
- project showcase
- different navigation
```

These are examples only. The final designs can differ.

### Tasks

- [ ] Build Template A
- [ ] Build Template B
- [ ] Render both using identical canonical content
- [ ] Demonstrate different presentation
- [ ] Demonstrate unused content preservation
- [ ] Demonstrate required content detection
- [ ] Demonstrate template switching

### Architecture Gate

Do not proceed if the two templates require duplicated application logic or force canonical content to become template-specific.

---

# 9. Phase 6 — Renderer

Once the template proof works, formalize the renderer.

### Tasks

- [ ] Create renderer registry
- [ ] Create page rendering strategy
- [ ] Create section rendering strategy
- [ ] Create shared rendering utilities
- [ ] Add error handling for invalid template contracts
- [ ] Add tests
- [ ] Add accessibility checks where practical

### Gate

A website can be rendered from:

```text
website content
+
template
+
template contract
```

without hard-coded business data.

---

# 10. Phase 7 — Database

Only now build the persistence layer.

### Stack

```text
PostgreSQL
Neon
Drizzle ORM
```

### Tasks

- [ ] Configure Drizzle
- [ ] Configure local development database strategy
- [ ] Configure Neon environments
- [ ] Create migration strategy
- [ ] Create account tables
- [ ] Create website tables
- [ ] Create template tables
- [ ] Create content storage
- [ ] Create version storage
- [ ] Create asset metadata
- [ ] Create domain records — support `Website → Domains[]` (0..N), `isPrimary`, `kind` (`mogen_subdomain` | `custom`), `status` (`pending` | `verified` | `active` | `disabled`), unique `hostname` (normalized), partial unique index `UNIQUE (websiteId) WHERE isPrimary = true`
- [ ] Create deployment records — `Deployment` references `WebsiteVersion` (preview hostname is `Deployment.url`, not a `Domain` row)
- [ ] Create billing records
- [ ] Add indexes — `domain.hostname` unique, `domain.websiteId`, `domain.isPrimary` partial index
- [ ] Add ownership relationships — `Domain.websiteId → Website.id` (FK, cascade), `Website.accountId → Account.id`
- [ ] Add constraints — enforce at most one primary per website, hostname format, FK integrity, deletion behavior intentional

Do not duplicate the domain model merely because a relational schema needs tables.

---

# 11. Phase 8 — Authentication

Selected direction:

**Neon Auth**

### Tasks

- [ ] Enable/configure Neon Auth
- [ ] Verify current Neon Auth SDK for Next.js 16
- [ ] Configure server auth
- [ ] Configure client auth
- [ ] Build sign-up
- [ ] Build sign-in
- [ ] Build sign-out
- [ ] Build session retrieval
- [ ] Define application roles
- [ ] Define authorization checks
- [ ] Prevent client-controlled role escalation
- [ ] Test ownership boundaries

### Important

Do not copy an old Neon Auth tutorial.

Verify the current SDK/API.

Neon Auth has undergone SDK changes; current documentation must be consulted before implementation.

---

# 12. Phase 9 — Account and Website Dashboard

Build the application interface.

### Initial dashboard areas

```text
Dashboard
Websites
Create Website
Website Details
Content
Template
Preview
Settings
Billing
```

Do not create every future dashboard screen.

### UI

Prefer:

- Tailwind CSS 4
- shadcn/ui
- accessible primitives

Evaluate other maintained UI libraries only when they solve a real requirement better.

---

# 13. Phase 10 — Website Creation Workflow

Implement:

```text
Register
 ↓
Dashboard
 ↓
Add Website
 ↓
Package
 ↓
Industry
 ↓
Template
 ↓
Business Information
 ↓
Services/Products
 ↓
Contact/Locations
 ↓
Images
 ↓
Preview
```

### Tasks

- [ ] Create website
- [ ] Select package
- [ ] Select industry
- [ ] Select template
- [ ] Load template contract
- [ ] Dynamically collect required content
- [ ] Preserve optional content
- [ ] Save progress
- [ ] Validate content
- [ ] Generate preview

---

# 14. Phase 11 — Asset Management

### MVP objectives

Support controlled image uploads.

Tasks:

- [ ] Upload image
- [ ] Validate file type
- [ ] Validate file size
- [ ] Store metadata
- [ ] Generate stable references
- [ ] Associate assets with content
- [ ] Delete/unlink assets safely

Provider abstraction must be used.

Do not permanently couple content records to Cloudflare R2 or Cloudinary.

---

# 15. Phase 12 — Website Versioning

Implement deliberate version creation.

Potential lifecycle:

```text
Draft
 ↓
Preview
 ↓
Approved
 ↓
Published
 ↓
Archived
```

The exact state machine may be simplified if the MVP does not require every state.

### Tasks

- [ ] Create draft
- [ ] Generate immutable preview snapshot
- [ ] Approve version
- [ ] Publish version
- [ ] Archive previous version
- [ ] Prevent editing of published snapshots
- [ ] Identify active published version

### Gate

Editing the next website version cannot modify the live version accidentally.

---

# 16. Phase 13 — Deployment

Initial deployment target:

**Vercel**

### Tasks

- [ ] Create deployment adapter
- [ ] Deploy preview
- [ ] Record deployment
- [ ] Associate deployment with website version
- [ ] Track deployment status
- [ ] Handle deployment failures
- [ ] Provide preview URL
- [ ] Publish approved version

Do not scatter Vercel-specific API calls through features.

---

# 17. Phase 14 — Pricing and Payment

The customer should:

1. configure website
2. see price
3. pay
4. unlock deployment/public access

### Tasks

- [ ] Define MVP pricing model
- [ ] Define plans
- [ ] Define order/subscription model
- [ ] Select payment provider
- [ ] Implement provider adapter
- [ ] Implement checkout
- [ ] Implement verification
- [ ] Implement webhook handling
- [ ] Record payment state
- [ ] Connect payment to website entitlement

Manual/EFT verification may be used if appropriate for MVP.

Do not build sophisticated billing before the commercial model is settled.

---

# 18. Phase 15 — Mogen Subdomain

Implement public identifiers such as:

```text
businessname.mogen.co.za
```

Data model already supports `Website → Domains[]` — this phase implements resolution for Mogen subdomains via the shared domain lookup.

### Tasks

- [ ] Define slug rules for `mogen_subdomain` kind
- [ ] Prevent collisions (`hostname` unique)
- [ ] Resolve website by hostname — `Hostname → Domain → Website → Published Version → Renderer` (via `normalizeHostname`, `findPrimaryDomain` / domain lookup service, not per-template logic)
- [ ] Resolve active published version
- [ ] Render published version (domains do not own content)
- [ ] Handle unavailable/unpublished websites
- [ ] Add SEO canonical behavior (use `getCanonicalHostname`/primary domain)

---

# 19. Phase 16 — Custom Domains

Later MVP/early production stage. Data model already supports `custom` kind — this phase adds verification and user-facing management.

### Tasks

- [ ] Define domain provider interface (`DomainProvider` already in `domain/site-domain.ts` — extend as needed)
- [ ] Domain verification (`pending` → `verified` → `active`, `disabled` for deactivation)
- [ ] DNS configuration guidance (not registrar integration)
- [ ] SSL considerations
- [ ] Domain status lifecycle
- [ ] Domain-to-website mapping — reuse `Website → Domains[]`, at most one `isPrimary`
- [ ] Existing domain support (connect custom domain to existing website; does not duplicate website/content)

Do not implement registrar-specific logic directly into website features. Domain purchasing/registration, DNS hosting, and marketplace features remain future scope — architecture support is already present.

---

# 20. Phase 17 — SEO Foundation

Before production:

- [ ] page titles
- [ ] descriptions
- [ ] canonical
- [ ] Open Graph
- [ ] Twitter/social metadata as appropriate
- [ ] sitemap
- [ ] robots.txt
- [ ] structured data
- [ ] semantic HTML
- [ ] image alt text
- [ ] clean URLs
- [ ] mobile responsiveness

This is foundational website functionality.

It is not the full Mogen SEO Audit product.

---

# 21. Phase 18 — Production Hardening

### Security

- [ ] authorization review
- [ ] input validation review
- [ ] file upload review
- [ ] webhook verification
- [ ] secret review
- [ ] dependency audit
- [ ] rate limiting where necessary
- [ ] abuse controls

### Reliability

- [ ] deployment failure handling
- [ ] payment failure handling
- [ ] domain failure handling
- [ ] missing-template handling
- [ ] invalid-content handling

### Observability

- [ ] structured logging
- [ ] meaningful error reporting
- [ ] operational diagnostics

---

# 22. Future Work — Explicitly Not MVP

The following must not be implemented unless separately approved:

- AI content generation
- A/B testing
- advanced analytics
- business directory
- blog system
- e-commerce
- booking
- CRM
- newsletter
- multilingual websites
- arbitrary custom code
- drag-and-drop builder
- plugin marketplace
- unlimited pages
- agency management features

These belong on the future roadmap, not the MVP backlog.

---

# 23. AI Coding Workflow

Every AI task should follow:

```text
1. Read docs/MOGEN-WAAS-AGENTS.md
2. Read docs/intent.md
3. Read docs/architecture.md
4. Read docs/plan.md
5. Read task.md — pick next pending task (unless human overrides); respect AFK/HITL types
6. Identify current milestone
7. Identify affected feature
8. Implement smallest correct change
9. Test
10. Type-check
11. Lint
12. Review dependency changes
13. Update task.md and plan if milestone progress changed
14. Report anything uncertain
```

---

# 24. AI Stop Conditions

The AI must stop and ask for human direction when:

- requirements conflict
- architecture must change
- a new major dependency is required
- a provider must be replaced
- MVP scope needs to expand
- canonical content needs a breaking change
- template contracts need a breaking change
- published-version behavior needs to change
- authentication architecture needs to change
- database ownership/security rules are unclear

The AI may make routine implementation decisions without asking when they do not alter the product or architecture.

---

# 25. Dependency Approval Checklist

Before adding a dependency:

```text
[ ] Problem clearly identified
[ ] Existing solution checked
[ ] Current package verified
[ ] Maintenance status checked
[ ] Next.js 16 compatibility checked
[ ] Tailwind 4 compatibility checked where relevant
[ ] Security implications checked
[ ] Bundle/runtime implications checked
[ ] License checked where relevant
[ ] Cost/vendor lock-in considered
[ ] MVP necessity confirmed
```

If these cannot be answered, do not install the package yet.

---

# 26. Progress Tracking

Use this document as the implementation roadmap.

When a phase is genuinely complete:

- mark its tasks
- record important decisions
- record unresolved issues
- update the current phase

Do not mark a phase complete merely because its files exist.

---

# 27. Current Starting Point

The first implementation target is:

**Phase 0 — Repository Foundation**

Then immediately:

**Phase 1 — AI Governance**

Then:

**Phase 2 — Domain Foundation**

Then:

**Phase 3 — Canonical Content Model**

The project should reach the **two-template proof** before substantial database/dashboard development.

---

# 28. Final MVP Acceptance Test

A non-technical user must be able to:

1. register
2. access the dashboard
3. create a website
4. select the package
5. select an industry
6. select a template
7. enter business information
8. enter services/products
9. enter contact information
10. add images
11. complete required content
12. preview the website
13. see the price
14. pay
15. receive a deployment
16. access the Mogen subdomain/preview
17. approve/publish
18. later edit the site
19. preview the next version
20. publish the next version without breaking the current live version

If the system can do these things reliably, the MVP has achieved its core purpose.
