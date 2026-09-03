import type { DomainId, WebsiteId } from "./identifiers";

/**
 * Domain is owned by Website (Account → Website → Domains[]).
 * A website has 0..N domains; at most one is primary/canonical.
 * See intent.md §14-§15 and architecture.md §23.
 *
 * Preview/deployment hostnames (e.g. 8tjd9g5.mogen.co.za) are NOT Domain rows —
 * they are Deployment.url values that point at a specific WebsiteVersion.
 * Public hostnames (abc.mogen.co.za, abc.co.za) ARE Domain rows.
 *
 * Provider operations behind DomainProvider adapter (architecture.md §6).
 */
export type DomainKind = "mogen_subdomain" | "custom";

export type DomainStatus = "pending" | "verified" | "active" | "disabled";

export interface SiteDomain {
  readonly id: DomainId;
  readonly websiteId: WebsiteId;
  readonly kind: DomainKind;
  readonly hostname: string;
  readonly status: DomainStatus;
  readonly isPrimary: boolean;
  readonly verifiedAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/** Alias per spec §6 — Domain is the canonical name, SiteDomain is the file name. */
export type Domain = SiteDomain;

/**
 * DomainProvider is provider-abstracted (Cloudflare, etc.).
 * Registration/verification is future scope for MVP — interface exists so
 * domain management does not leak provider SDKs into domain/application logic.
 */
export interface DomainProvider {
  search(query: string): Promise<string[]>;
  register(args: { websiteId: WebsiteId; hostname: string; kind: DomainKind }): Promise<SiteDomain>;
  configure(args: { domainId: DomainId }): Promise<void>;
  verify(args: { domainId: DomainId }): Promise<DomainStatus>;
}

/**
 * Domain invariants — smallest enforceable rules.
 * DB must enforce: UNIQUE partial index on (websiteId) WHERE isPrimary = true
 * plus application-level guard.
 */
export function isPrimaryDomain(domain: SiteDomain): boolean {
  return domain.isPrimary;
}

export function canBePrimary(domain: SiteDomain): boolean {
  return domain.status !== "disabled";
}

/**
 * Resolution helper: normalize hostname for lookup (lowercase, trim, no trailing dot).
 * Pure function, no IO — used by application service before DB lookup.
 */
export function normalizeHostname(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/\.$/, "");
}

/**
 * Validate that at most one primary exists per website.
 * Returns the primary or null; caller should enforce uniqueness.
 */
export function findPrimaryDomain(domains: readonly SiteDomain[]): SiteDomain | null {
  const primaries = domains.filter((d) => d.isPrimary);
  if (primaries.length > 1) {
    throw new Error(
      `Invariant violated: website has ${primaries.length} primary domains (expected at most 1)`
    );
  }
  return primaries[0] ?? null;
}

/**
 * SEO helper: canonical hostname for a website is the primary active domain,
 * else first active domain, else null.
 */
export function getCanonicalHostname(domains: readonly SiteDomain[]): string | null {
  const primary = findPrimaryDomain(domains.filter((d) => d.status === "active"));
  if (primary) return primary.hostname;
  const active = domains.find((d) => d.status === "active");
  return active?.hostname ?? null;
}
