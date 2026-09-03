# Mogen WaaS — Product Intent

**Document status:** Authoritative  
**Product:** Mogen WaaS (Website-as-a-Service)  
**Repository:** `mogen-waas`  
**Document purpose:** Define why the product exists, what it is, what it is not, and the principles AI agents must preserve.

---

## 1. The Core Intent

Mogen WaaS exists to let a small business obtain a professional website without having to become a website builder.

The customer is **not building a website**.

The customer is **providing the information required to generate their website**.

Mogen owns the technical complexity. The customer experiences simplicity.

This distinction is the foundation of the product and must survive every implementation decision.

The product should make a non-technical South African SMME owner feel that they are completing a guided business-information process, not configuring software.

---

## 2. The Problem We Are Solving

Traditional website builders expose the customer to too much complexity:

- layout decisions
- responsive design
- components
- plugins
- hosting
- databases
- SEO configuration
- themes
- technical settings
- custom code
- integrations
- maintenance

Mogen WaaS deliberately hides that complexity.

The customer should primarily need to answer questions such as:

- What is your business called?
- What does your business do?
- What services or products do you offer?
- Where are you located?
- How can customers contact you?
- What images represent your business?
- Which design should represent your business?

The system converts that information into a finished website.

---

## 3. Product Positioning

Mogen WaaS is a **managed website-generation and publishing system**, not a general-purpose website builder.

It is intentionally different from:

- Wix
- Squarespace
- Framer
- Elementor
- WordPress
- Shopify
- generic page builders
- visual drag-and-drop editors

The customer should not need:

- a visual editor
- a canvas
- arbitrary component placement
- custom CSS
- custom JavaScript
- plugin management
- hosting configuration
- a WordPress-style administration system

Mogen WaaS sells the **outcome**, not the toolbox.

---

## 4. Target Customer

The initial target market is South African small businesses and SMMEs.

The primary customer may be:

- non-technical
- unfamiliar with web development
- uncomfortable with hosting
- unfamiliar with DNS
- unfamiliar with SEO
- operating with limited budgets
- primarily interested in getting a credible online presence

The system must therefore optimize for:

1. simplicity
2. clarity
3. trust
4. speed
5. affordability
6. professional output
7. maintainability

---

## 5. The Customer Experience

The intended high-level journey is:

1. Register
2. Enter the dashboard
3. Create a website
4. Select a package
5. Select an industry
6. Select a template
7. Provide business information
8. Provide services/products
9. Provide contact/location information
10. Upload/select images
11. Preview the website internally
12. See the price
13. Pay
14. Deploy
15. Review the deployed preview
16. Approve
17. Publish
18. Connect/use a domain
19. Return later to edit and republish

The customer should never need to understand the internal renderer, database, deployment system, or infrastructure.

---

## 6. MVP Definition

The MVP is intentionally narrow.

### The initial website package contains exactly five pages

1. Home
2. About
3. Services OR Products
4. Contact
5. FAQ

FAQ is preferred over Blog for the initial product.

The system may later support repeatable detail pages such as:

- `/services/plumbing`
- `/services/electrical`
- `/products/product-name`

These are future extensions and are not required for the initial five-page package.

---

## 7. Free Account Rules

A free account may:

- register
- create a website
- select an industry
- select a template
- enter content
- upload/select supported images
- generate an internal preview
- see the price

A free account must **not** receive a publicly accessible deployed website merely by creating an account.

Public deployment/public preview/subdomain access is part of the paid workflow.

The exact commercial rules can evolve, but the MVP must preserve the distinction between configuring a website and publishing a website.

---

## 8. What Mogen WaaS Is Not

The following are explicitly outside the MVP:

- drag-and-drop website builder
- visual page editor
- arbitrary page builder
- unlimited pages
- 20-page packages
- unlimited website generation
- e-commerce
- shopping carts
- checkout systems
- booking systems
- CRM
- newsletter platform
- marketing automation
- blog platform
- social network
- full analytics platform
- full SEO platform
- custom code editor
- custom CSS editor
- custom JavaScript editor
- multilingual content management
- plugin marketplace
- hosting control panel
- general-purpose domain registrar
- AI content-generation company
- agency management platform

These may become separate products or future capabilities. They must not silently enter the MVP.

---

## 9. Industry vs Template

An industry is classification.

A template is presentation.

They are not the same thing.

For example, several templates may serve construction businesses:

- construction-template-a
- construction-template-b
- construction-template-c

The templates can have substantially different layouts while consuming the same canonical business information.

Industry selection should help discovery/filtering.

Template selection should determine presentation.

AI agents must never couple templates directly to industries unless there is an explicit product reason.

---

## 10. Canonical Content Principle

Content belongs to the business.

Presentation belongs to the template.

Therefore:

```text
Business Information
        ↓
Canonical Content
        ↓
Template Contract
        ↓
Renderer
        ↓
Website
```

A template must not become the owner of the business data.

This separation is fundamental because it enables:

- template switching
- versioning
- future A/B testing
- future AI assistance
- future reuse of content
- consistent SEO metadata
- multiple presentations of the same business

---

## 11. Repeatable Data

The system must support repeatable information from the beginning.

Examples:

- multiple services
- multiple products
- multiple locations
- multiple addresses
- multiple phone numbers
- multiple email addresses
- multiple social links
- multiple testimonials
- multiple FAQs

Do not design a single-value field today and plan to "make it an array later."

Where the business concept is naturally repeatable, model it as repeatable data from day one.

---

## 12. Template Switching

Template switching must not destroy content.

Example:

Template A uses:

- testimonials

Template B uses:

- projects

If the customer switches from A to B:

- testimonials remain stored
- projects can be requested if required
- existing content is not deleted

If the customer later switches back to A, the testimonials can be rendered again.

Unused content is preserved.

---

## 13. Versioning Intent

Editing a website must not overwrite the currently published website.

The system needs a distinction between:

- editable/current content
- preview state
- approved state
- published state
- archived versions

The exact state machine is an architectural concern, but the business intent is non-negotiable:

> A customer must be able to work on the next version without accidentally changing the live website.

Versioning must also leave room for future A/B testing.

---

## 14. Deployment Intent

The public website should point to an explicitly selected published version.

Conceptually (deployment / preview):

```text
Website
   ↓
Published Version
   ↓
Deployment
   ↓
Deployment.url   (e.g. https://8tjd9g5.mogen.co.za — preview host, not a Domain row)
```

A deployment should be traceable to a specific website version.

Preview deployments should be immutable where practical.

Hash-like preview URLs (e.g. `8tjd9g5.mogen.co.za`) are **deployment URLs** — they live as `Deployment.url` and are not `Domain` rows. Public hostnames are modelled separately as `Domain` rows accessed via `Domain → Website → Published Version → Renderer` (see §15).

Public Mogen subdomains may eventually use business-friendly identifiers such as:

`businessname.mogen.co.za`

---

## 15. Domains

A website is the owner of content/configuration; a domain is where that website is accessed. The relationship is:

```text
Account
  ↓
Website
  ↓
Domains[]   (0..N per website)
```

A website has **one identity/content configuration but may have multiple domains**, for example:

```text
Website: ABC Plumbing
Domains:
  ├── abcplumbing.mogen.co.za  (mogen_subdomain, primary)
  ├── abcplumbing.co.za        (custom, alias)
  └── abcplumbing.com          (custom, alias)
```

All resolve to the same website and the same published version — they do not duplicate content or versions, and changing the primary domain does not create a new version.

Distinguish three hostname types:

- **Mogen subdomain** — Mogen-controlled public domain for the website (e.g. `abcplumbing.mogen.co.za`)
- **Customer custom domain** — customer-controlled domain connected to the website (e.g. `abcplumbing.co.za`, `abcplumbing.com`)
- **Preview/deployment hostname** — hash-like hostname tied to a specific deployment/version (e.g. `8tjd9g5.mogen.co.za`), not a website alias

A website may have at most **one primary domain** — the preferred public/canonical hostname used for canonical URLs and SEO. Aliases should be treated as aliases (eventual redirects, canonical handling) rather than duplicate content. At this stage the primary domain is a data-model invariant, not a full redirect system.

The long-term intent is to make domain acquisition part of the Mogen experience.

The customer should eventually be able to search for and register suitable domains such as:

- `.co.za`
- `.com`
- other supported extensions

Existing customer domains should eventually be supported.

Domain registration must be implemented behind a provider abstraction (`DomainProvider`) so that Mogen does not become permanently coupled to a single registrar. DNS management, registrar integration, and marketplace features are not MVP.

Domains never own content — they resolve to a website, which resolves to its published version, which is rendered. The request flow is `Hostname → Domain → Website → Published Version → Renderer`.

---

## 16. SEO Intent

SEO fundamentals are built into the website-generation system.

They include:

- title
- meta description
- canonical URL
- Open Graph metadata
- semantic HTML
- proper heading structure
- image alt text
- sitemap
- robots.txt
- clean URLs
- mobile-friendly output
- structured data where appropriate
- local-business considerations

Mogen WaaS is **not** the SEO Audit product.

The Mogen SEO Audit product is responsible for extensive SEO auditing and reporting.

WaaS should provide sound SEO foundations, not become a full SEO platform.

---

## 17. Future AI Intent

AI is not an MVP dependency.

Future AI may assist with:

- generating missing copy
- improving supplied copy
- suggesting descriptions
- filling optional content
- transforming supplied business information into useful website copy

AI must work from canonical business information.

AI must not become the source of truth for business data.

Any AI feature must have explicit cost controls and must not create uncontrolled usage costs.

---

## 18. Future Analytics Intent

Analytics is not an MVP requirement.

Future analytics may include:

- visitors
- page views
- traffic sources
- conversions
- events
- A/B experiment metrics

Analytics must remain decoupled from the core content and rendering model.

---

## 19. Future Directory Intent

A future Mogen directory may exist at:

`sites.mogen.co.za`

The directory should become a useful South African business discovery service.

It must not become a low-quality SEO link farm.

Generated websites and directory entries should use proper metadata and structured data.

---

## 20. Business Model Intent

The product is designed around recurring revenue.

Commercial pricing is not yet considered permanently locked.

The eventual model may contain:

- setup/value component
- recurring monthly fee
- optional domain costs
- optional future services

Infrastructure costs must be considered when pricing.

The MVP should avoid sophisticated usage billing unless it is genuinely required.

---

## 21. Infrastructure Philosophy

Mogen is not positioning itself as a hosting company.

Vercel, Neon, Cloudflare, object storage providers, email providers, and payment providers are infrastructure.

The system should initially optimize for:

- low operating cost
- generous/free tiers where appropriate
- reliability
- portability
- simple operations
- clear provider boundaries

Free-tier limits must never be assumed to be permanent. Before production decisions, current provider limits and pricing must be verified.

---

## 22. Non-Negotiable Engineering Principles

The implementation must follow:

### SOLID

Especially:

- single responsibility
- dependency inversion
- separation of domain and infrastructure

### DRY

Do not duplicate:

- template logic
- content transformation
- deployment logic
- payment logic
- domain logic
- authentication integration

### Feature-based architecture

Code should be organized primarily around business capabilities/features, not arbitrary technical buckets.

### Adapter pattern

External providers must be isolated behind interfaces/adapters where practical.

Examples:

```text
PaymentProvider
DomainProvider
StorageProvider
DeploymentProvider
EmailProvider
```

The business logic should not depend directly on Stripe/Yoco/PayFast/Cloudflare/etc.

### Explicit dependencies

Dependencies should be injected or imported through deliberate boundaries.

Avoid hidden global magic.

---

## 23. AI Decision-Making Rules

AI agents are implementation assistants, not product owners.

An AI agent must:

- preserve this intent
- preserve the MVP boundaries
- read the governing documentation before making architectural changes
- challenge a bad technical decision
- explain trade-offs
- prefer current official documentation
- verify APIs that may have changed
- avoid deprecated packages
- avoid obsolete tutorials
- avoid hallucinated APIs
- avoid adding features because they are easy to build

An AI agent must not:

- redefine the product
- expand the MVP
- replace the architecture silently
- introduce a major dependency without approval
- change the database model merely for convenience
- replace Drizzle ORM
- replace Next.js 16
- downgrade Tailwind
- introduce a `/src` directory
- create a monorepo
- add unnecessary abstraction
- copy old Mogen project architecture without review

---

## 24. The Core Test

Whenever an implementation decision is proposed, ask:

> Does this make it easier for a non-technical business owner to provide their information and receive a professional website?

If the answer is no, the feature deserves scrutiny.

---

## 25. Authority

This document defines product intent.

If source code conflicts with this document, the conflict must be identified.

AI must not silently reinterpret the product to make existing code appear correct.

Changes to this document require deliberate human approval.
