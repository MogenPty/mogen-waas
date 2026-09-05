# Task Board — Mogen WaaS

**Status:** Active  
**Purpose:** Single source of truth for what to do next.  
**Rule:** Always work on `pending` tasks in ID order unless the human explicitly says otherwise.  
**Must read before starting any task, in order:**
1. `docs/MOGEN-WAAS-AGENTS.md`
2. `docs/intent.md`
3. `docs/architecture.md`
4. `docs/plan.md`
5. **`task.md` (this file)**

---

## Legend

### Type
- **AFK (Away From Keyboard)** — Agent can do without human. If ambiguity is encountered, flip to `HITL` and pause.
- **HITL (Human In The Loop)** — Requires human decision/credential/design/commercial input. Only a human may flip `HITL → AFK`.

### State
- `completed` — done and merged to `main`
- `in_progress` — active branch, work ongoing
- `in_review` — PR open, awaiting review/merge
- `pending` — queued, next up
- `blocked` — queued but blocked; see `Blocked By`
- `parked` — explicitly not MVP (future)

---

## Tasks

| ID | Phase | Task | Type | State | Blocked By | Notes |
|---|---|---|---|---|---|---|
| T-0 | Phase 0 | Repo Foundation (Next 16 + TS + Tailwind 4 + pnpm, no /src) | AFK | completed | — | scaffold merged |
| T-1 | Phase 1 | AI Governance (AGENTS.md/CLAUDE.md managed block + Mogen docs refs) | HITL | completed | — | you approved Next block merge |
| T-2 | Phase 2 | Domain Foundation (identifiers + Website/Account/Industry/Template/Domain/Deployment) | AFK | completed | — | merged phase/2 |
| T-2b | Phase 2b | Multi-Domain reconciliation (Website→Domains[] 0..N, isPrimary, status) | AFK | completed | — | PR #1/#2 |
| T-2c | Phase 2c | Deployment vs Domain doc fix (Deployment.url ≠ Domain) | AFK | completed | — | CodeRabbit doc fix merged |
| T-3 | Phase 3 | Canonical Content (zod schemas, SeoInfo, stable IDs, serialization) | AFK | completed | — | merged phase/3 aa2b71c |
| T-3b | Phase 3b | Content whitespace/transform fixes (trim before validation, serialize parsed) | AFK | completed | — | 95ac992 |
| T-4 | Phase 4 | Template Contract (TemplateContract + sections + capabilities + compatibility helpers) | AFK | completed | — | merged phase/4 c32c5ff + 20cd165 section-union fix |
| T-5 | Phase 5 | Two-Template Proof — 2 substantially different templates on same canonical content | HITL | pending | — | **next queued** — needs visual approval |
| T-6 | Phase 6 | Renderer (registry, section strategy, shared utils) | AFK | blocked | T-5 | — |
| T-7 | Phase 7 | Database (Drizzle/Neon, Websites/Domains partial index, versions, assets) | HITL | blocked | T-5 | needs Neon env creds |
| T-8 | Phase 8 | Neon Auth (SDK verify, roles customer\|admin, server-only assignment) | HITL | blocked | T-7 | Neon creds/role verification |
| T-9 | Phase 9 | Dashboard (shadcn/ui) | HITL | blocked | T-7, T-8 | design decision |
| T-10 | Phase 10 | Creation Workflow (industry→template→content→preview) | HITL | blocked | T-5, T-6 | — |
| T-11 | Phase 11 | Assets (R2/Cloudinary adapter) | AFK | blocked | T-7 | — |
| T-12 | Phase 12 | Versioning (draft→preview→approved→published→archived, immutability) | AFK | blocked | T-5 | — |
| T-13 | Phase 13 | Deployment (Vercel adapter, Deployment.url) | HITL | blocked | T-12 | Vercel creds |
| T-14 | Phase 14 | Pricing/Payment (provider Yoco/Paystack/PayFast selection + webhook) | HITL | pending | — | commercial decision; remains pending not blocked |
| T-15 | Phase 15 | Mogen Subdomain (*.mogen.co.za, resolve Hostname→Domain→Website) | AFK | blocked | T-7 | — |
| T-16 | Phase 16 | Custom Domains (verify, hostname unique, primary) | AFK | pending | — | model done, UI future scope |
| T-17 | Phase 17 | SEO Foundation | AFK | blocked | T-6 | — |
| T-18 | Phase 18 | Hardening (auth, validation, webhooks, rate limit, observability) | AFK | blocked | T-13, T-14 | — |
| T-F | Future | AI gen, A/B, analytics, directory, blog, ecom, etc. | — | parked | — | not MVP |

---

## Rules
1. Agent always picks next `pending` (lowest ID) unless human overrides.
2. AFK encountering ambiguity → flip to `HITL`, pause, ask human.
3. Only human may flip `HITL → AFK`.
4. `blocked` must list blocking `ID(s)`; when blocker completes, state becomes `pending`.
5. Update this file when state changes; keep `docs/plan.md` §27 in sync for milestones.
