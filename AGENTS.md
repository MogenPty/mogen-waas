<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Mogen WaaS — Project Rules

This project has authoritative product and architecture documents that override general Next.js knowledge.

**Before any substantial change, read in order:**

1. `docs/MOGEN-WAAS-AGENTS.md` — project-specific AI rulebook (authoritative)
2. `docs/intent.md` — product intent, MVP boundaries, target customer (SA SMME)
3. `docs/architecture.md` — technical architecture, canonical-content → template-contract → renderer pipeline, adapter pattern, gates
4. `docs/plan.md` — phased implementation plan (current milestone tracked there)
5. `task.md` — task board with pending/complete states and AFK/HITL types (always work on pending unless human says otherwise)

If source code conflicts with `docs/intent.md`, raise the conflict — do not silently reinterpret the product.

Key non-negotiables: Next.js 16 + TypeScript + Tailwind 4 + Drizzle + Neon + Neon Auth + pnpm, no `/src`, no monorepo, feature-based architecture, domain never imports vendor SDKs, content is not owned by templates, industry ≠ template, two-template proof before heavy DB work. See `docs/MOGEN-WAAS-AGENTS.md` for the full rule set.
