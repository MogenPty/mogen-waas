# Mogen WaaS — AI Agent Governance

**Purpose:** Operational rules for AI coding agents working on the Mogen WaaS repository.

This file is the project-specific AI rulebook.

The authoritative product and architecture documents are:

- `docs/intent.md`
- `docs/architecture.md`
- `docs/plan.md`
- `task.md` — task board with pending/complete states and AFK/HITL types (always work on pending unless human says otherwise)

Read all five documents before making substantial changes.

---

# 1. You Are an Implementer, Not the Product Owner

You may:

- implement approved requirements
- improve local code quality
- refactor within the approved architecture
- fix bugs
- write tests
- suggest better approaches

You may not silently:

- redefine the product
- expand MVP scope
- replace the architecture
- replace the technology stack
- introduce a new major service
- replace a provider
- redesign canonical content
- redesign the template system

When an architectural change is required, stop and ask.

---

# 2. Mandatory Technology

The project uses:

- Next.js 16
- TypeScript
- Tailwind CSS 4
- Drizzle ORM
- PostgreSQL
- Neon
- Neon Auth
- pnpm

Use current stable package versions compatible with this baseline.

Do not downgrade the core stack to support an outdated dependency.

---

# 3. Absolutely No `/src`

Do not create:

```text
/src
```

Application code belongs at repository root.

---

# 4. Architecture Rules

Always follow:

- feature-based architecture
- SOLID
- DRY
- separation of concerns
- adapter pattern
- dependency inversion
- explicit boundaries

External services must not leak into domain logic.

---

# 5. Core Architecture Rule

Never forget:

```text
Canonical Content
        ↓
Template Contract
        ↓
Template
        ↓
Renderer
        ↓
Website
```

Content is not owned by templates.

Templates are not copies of complete websites.

Do not duplicate entire applications for each template.

---

# 6. Template Rule

Before adding a new template:

1. verify the canonical content model
2. verify the template contract
3. determine reusable components
4. determine genuinely template-specific components
5. verify that the template can coexist with existing templates

A template must be genuinely independent in presentation.

---

# 7. Two-Template Rule

The architecture must remain capable of supporting at least two substantially different templates from the same canonical content.

If a proposed change makes this difficult, stop and report it.

---

# 8. Database Rule

Do not start with the database merely because it is familiar.

The database is persistence infrastructure.

The core system is the content/template/renderer relationship.

Do not add tables until the corresponding domain concept is understood.

---

# 9. Dependency Rule

Never install a dependency because:

- a tutorial uses it
- another AI suggested it
- it looks convenient
- it solves a problem that existing tools already solve
- it is popular

Before adding one, establish:

- exact problem
- alternatives
- current maintenance
- compatibility
- security
- cost
- lock-in
- MVP necessity

If a dependency is not necessary, do not add it.

---

# 10. Old Plugin / Deprecated Technology Rule

Do not use old:

- plugins
- packages
- APIs
- tutorials
- SDK examples
- configuration formats
- authentication integrations
- Tailwind instructions
- Next.js patterns

without verifying that they apply to the versions actually installed.

Particular caution areas:

- Next.js 16
- Tailwind CSS 4
- Neon Auth
- Drizzle
- shadcn/ui

Prefer current official documentation.

---

# 11. Neon Auth Rule

Neon Auth is the selected authentication solution.

Do not install standalone Better Auth server infrastructure unless explicitly approved.

Neon Auth uses Better Auth technology internally, but that does not mean the project should duplicate the Better Auth server implementation.

Always verify current Neon Auth APIs before coding authentication features.

Never allow client-side code to assign privileged roles.

---

# 12. Dashboard UI Rule

Prefer:

- Tailwind CSS 4
- shadcn/ui

A different maintained component library may be proposed if it provides meaningful functionality that the project genuinely needs.

Do not install multiple UI libraries without justification.

Do not force dashboard UI libraries into public templates.

---

# 13. Public Template Rule

Public websites are presentation systems.

A public template may use:

- bespoke components
- its own visual language
- its own layout
- template-specific styling

Do not force shadcn/ui or the dashboard design system onto the public website.

---

# 14. No Monorepo

Do not introduce a monorepo for the MVP.

Do not create:

```text
apps/
packages/
```

unless a human-approved architecture change explicitly requires it.

---

# 15. No Microservices

Do not introduce:

- microservices
- Kubernetes
- message buses
- complex queues
- separate rendering servers

unless an actual requirement justifies them and the architecture is approved.

---

# 16. Adapter Rule

Use adapters for external providers.

Examples:

```text
PaymentProvider
StorageProvider
DeploymentProvider
DomainProvider
EmailProvider
```

Application code should depend on application-owned interfaces.

Provider-specific SDKs belong behind those interfaces.

---

# 17. Security Rule

Never trust:

- client-supplied ownership
- client-supplied roles
- client-supplied prices
- client-supplied payment state
- client-supplied deployment state

Validate and authorize on the server.

Never expose secrets.

Validate uploaded files.

Verify webhooks.

---

# 18. Versioning Rule

Never let editing a draft accidentally modify the published website.

Published versions must be treated as immutable artifacts.

Any implementation that threatens this rule requires review.

---

# 18b. Domain Rule — Multiple Domains per Website

A Website may have **multiple Domains** (`Website → Domains[]`, 0..N). Domain identity and website content are separate concerns — domains resolve to a website but never own content.

Must enforce:

- `Domain` belongs to one `Website` (`domain.websiteId` FK, not `accountId`)
- `hostname` is normalized (`normalizeHostname`) and unique
- At most one `Domain` per `Website` may have `isPrimary = true` (partial unique index `UNIQUE (websiteId) WHERE isPrimary = true` + application invariant `findPrimaryDomain`/`getCanonicalHostname`)
- `Domain.kind` is `mogen_subdomain` | `custom`
- `Domain.status` is `pending` | `verified` | `active` | `disabled`
- Preview/deployment hostnames (e.g. `8tjd9g5.mogen.co.za`) are `Deployment.url` with `kind=preview`, not `Domain` rows
- Hostname → Domain → Website → Published Version → Renderer is the resolution flow; changing a domain does not create a version, changing content does not create a domain
- Aliases must not duplicate content — primary domain is canonical for SEO (see `architecture.md §23`)

Agents must not collapse the relationship into `Website → one Domain` without explicit human approval. Do not introduce registrar/DNS management or domain purchasing unless separately approved.

---

# 19. Feature-Based Rule

Prefer:

```text
features/websites/
features/templates/
features/content/
features/versions/
features/deployments/
```

over giant generic folders containing unrelated business logic.

Shared code must actually be shared.

Do not move code into `lib/` merely because you cannot decide where it belongs.

---

# 20. DRY Rule

Do not duplicate:

- business rules
- template logic
- validation
- deployment logic
- payment logic
- authorization
- SEO logic

If duplication appears, identify the correct abstraction.

However:

> DRY does not mean "one giant generic function."

Prefer clear abstractions over clever abstractions.

---

# 21. SOLID Rule

Apply SOLID pragmatically.

Do not create interfaces and factories solely to demonstrate SOLID.

Abstractions should exist because there is a meaningful boundary, especially around external providers and business capabilities.

---

# 22. Current-Documentation Rule

When an API may have changed:

1. check current official documentation
2. check current package version
3. check current changelog when relevant
4. implement against the current API
5. test it

Never confidently reproduce an API from memory.

---

# 23. Search Rule

When research is needed:

Prefer:

1. official documentation
2. official GitHub repository/release notes
3. reputable technical documentation
4. community material only when necessary

Do not treat old Stack Overflow answers, blog posts, generated snippets, or tutorials as authoritative.

---

# 24. Testing Rule

Before reporting completion:

- run type checking
- run linting
- run relevant tests
- manually verify important UI behavior
- verify no accidental dependency changes
- inspect the Git diff

Do not say "tested" if only the code was generated.

---

# 25. Scope Rule

If a task exposes an attractive future feature, do not implement it automatically.

Examples:

- "We could easily add a blog."
- "Let's add analytics while we're here."
- "Let's add AI copy generation."
- "Let's add an admin CMS."
- "Let's add a plugin system."

Record it as future work if useful.

Do not implement it.

---

# 26. Stop and Ask Rule

Stop and ask for human direction when:

- requirements conflict
- architecture must change
- a core technology must change
- canonical content needs a breaking change
- template contracts need a breaking change
- a new major provider is required
- a new major dependency is required
- MVP scope needs expansion
- security implications are unclear
- payment behavior is ambiguous
- publishing/versioning behavior is ambiguous

---

# 27. Smallest Correct Change

When implementing a task:

1. understand the existing architecture
2. identify the smallest correct change
3. implement it
4. test it
5. avoid unrelated refactoring

Do not rewrite large parts of the system merely because an AI agent prefers another style.

---

# 28. Do Not Copy Old Mogen Projects Blindly

Previous Mogen experiments, including old website/template systems, may contain useful ideas.

They are not automatically architectural authorities.

If code is reused:

1. inspect it
2. identify its assumptions
3. compare it with `intent.md`
4. compare it with `architecture.md`
5. extract only what remains valid
6. do not import obsolete patterns

The previous `landing.mogen.co.za` / `clients.mogen.co.za` style architecture is specifically not to be treated as a template for the new system without review.

---

# 29. Documentation Rule

If an approved architectural decision changes:

- update `architecture.md`
- update `plan.md`
- record why the decision changed

Do not let code become the only place where an architectural decision exists.

---

# 30. Completion Report

At the end of a meaningful task, report:

```text
Implemented:
- ...

Verified:
- ...

Tests:
- ...

Dependencies changed:
- ...

Architecture impact:
- None / ...

Documentation updated:
- ...

Concerns / decisions needed:
- None / ...
```

Do not hide uncertainty.

---

# 31. Golden Rule

When in doubt:

> Preserve the product intent, preserve the architecture, prefer the simplest correct implementation, verify current documentation, and ask before making a decision that changes the system's direction.
