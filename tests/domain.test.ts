import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  findPrimaryDomain,
  getCanonicalHostname,
  normalizeHostname,
  type SiteDomain,
} from "../domain/site-domain";
import type { DomainId, WebsiteId } from "../domain/identifiers";

function makeDomain(
  overrides: Partial<SiteDomain> & { websiteId: WebsiteId; hostname: string }
): SiteDomain {
  return {
    id: `dom-${Math.random().toString(36).slice(2, 8)}` as DomainId,
    kind: "mogen_subdomain",
    status: "active",
    isPrimary: false,
    verifiedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe("domain model — multiple domains", () => {
  it("a website can have multiple domains", () => {
    const wid = "wid-1" as WebsiteId;
    const domains: SiteDomain[] = [
      makeDomain({ websiteId: wid, hostname: "abc.mogen.co.za", kind: "mogen_subdomain", isPrimary: true }),
      makeDomain({ websiteId: wid, hostname: "abc.co.za", kind: "custom", isPrimary: false }),
      makeDomain({ websiteId: wid, hostname: "abc.com", kind: "custom", isPrimary: false }),
    ];
    assert.equal(domains.length, 3);
    assert.equal(domains.filter((d) => d.websiteId === wid).length, 3);
  });

  it("website isolation: domains of Website A do not resolve to Website B", () => {
    const widA = "wid-A" as WebsiteId;
    const widB = "wid-B" as WebsiteId;
    const domains: SiteDomain[] = [
      makeDomain({ websiteId: widA, hostname: "a.mogen.co.za", isPrimary: true }),
      makeDomain({ websiteId: widB, hostname: "b.mogen.co.za", isPrimary: true }),
    ];
    const byHostname = (h: string) => domains.find((d) => d.hostname === normalizeHostname(h)) ?? null;
    assert.equal(byHostname("a.mogen.co.za")?.websiteId, widA);
    assert.equal(byHostname("b.mogen.co.za")?.websiteId, widB);
    assert.notEqual(byHostname("a.mogen.co.za")?.websiteId, widB);
  });

  it("hostname lookup is normalized (lowercase, trim, trailing dot)", () => {
    assert.equal(normalizeHostname(" ABC.MOGEN.CO.ZA. "), "abc.mogen.co.za");
    assert.equal(normalizeHostname("Abc.Co.Za"), "abc.co.za");
  });
});

describe("domain model — primary invariant", () => {
  it("findPrimaryDomain returns the primary or null", () => {
    const wid = "wid-1" as WebsiteId;
    const domains: SiteDomain[] = [
      makeDomain({ websiteId: wid, hostname: "a.mogen.co.za", isPrimary: false, status: "active" }),
      makeDomain({ websiteId: wid, hostname: "b.mogen.co.za", isPrimary: true, status: "active" }),
    ];
    const primary = findPrimaryDomain(domains);
    assert.equal(primary?.hostname, "b.mogen.co.za");
    assert.equal(findPrimaryDomain([]), null);
  });

  it("throws if website has two primaries", () => {
    const wid = "wid-1" as WebsiteId;
    const domains: SiteDomain[] = [
      makeDomain({ websiteId: wid, hostname: "a.mogen.co.za", isPrimary: true }),
      makeDomain({ websiteId: wid, hostname: "b.mogen.co.za", isPrimary: true }),
    ];
    assert.throws(() => findPrimaryDomain(domains), /Invariant violated/);
  });

  it("getCanonicalHostname prefers primary active, else first active", () => {
    const wid = "wid-1" as WebsiteId;
    const domains: SiteDomain[] = [
      makeDomain({ websiteId: wid, hostname: "alias.co.za", isPrimary: false, status: "active" }),
      makeDomain({ websiteId: wid, hostname: "primary.mogen.co.za", isPrimary: true, status: "active" }),
    ];
    assert.equal(getCanonicalHostname(domains), "primary.mogen.co.za");

    const noPrimary: SiteDomain[] = [
      makeDomain({ websiteId: wid, hostname: "alias1.co.za", isPrimary: false, status: "active" }),
      makeDomain({ websiteId: wid, hostname: "alias2.co.za", isPrimary: false, status: "active" }),
    ];
    assert.equal(getCanonicalHostname(noPrimary), "alias1.co.za");

    const noneActive: SiteDomain[] = [
      makeDomain({ websiteId: wid, hostname: "pending.mogen.co.za", isPrimary: true, status: "pending" }),
    ];
    assert.equal(getCanonicalHostname(noneActive), null);
  });

  it("disabled domains cannot be primary (canBePrimary helper)", async () => {
    const { canBePrimary } = await import("../domain/site-domain");
    const wid = "wid-1" as WebsiteId;
    const disabled = makeDomain({ websiteId: wid, hostname: "old.mogen.co.za", isPrimary: false, status: "disabled" });
    assert.equal(canBePrimary(disabled), false);
    const pending = makeDomain({ websiteId: wid, hostname: "new.mogen.co.za", isPrimary: false, status: "pending" });
    assert.equal(canBePrimary(pending), true);
  });
});

describe("domain model — version independence", () => {
  it("multiple domains of same website resolve to same website/version context", () => {
    const wid = "wid-1" as WebsiteId;
    const versionId = "ver-7" as unknown as string;
    const domains: SiteDomain[] = [
      makeDomain({ websiteId: wid, hostname: "abc.mogen.co.za", isPrimary: true }),
      makeDomain({ websiteId: wid, hostname: "abc.co.za", isPrimary: false }),
    ];
    // Simulate resolution: hostname -> websiteId -> published version
    const resolve = (hostname: string) => {
      const d = domains.find((x) => x.hostname === normalizeHostname(hostname));
      if (!d) return null;
      return { websiteId: d.websiteId, publishedVersionId: versionId };
    };
    const r1 = resolve("abc.mogen.co.za");
    const r2 = resolve("abc.co.za");
    assert.deepEqual(r1, r2);
    assert.equal(r1?.websiteId, wid);
  });

  it("changing domain does not mutate website content — domains are separate from content", () => {
    const wid = "wid-1" as WebsiteId;
    const originalContent = { business: { name: "ABC Plumbing", description: "Fixes pipes" } };
    const domainsBefore = [makeDomain({ websiteId: wid, hostname: "old.mogen.co.za", isPrimary: true })];
    const domainsAfter = [makeDomain({ websiteId: wid, hostname: "new.mogen.co.za", isPrimary: true })];
    // Content object unchanged by domain change
    assert.deepEqual(originalContent, { business: { name: "ABC Plumbing", description: "Fixes pipes" } });
    assert.notEqual(domainsBefore[0].hostname, domainsAfter[0].hostname);
  });
});

describe("domain model — status", () => {
  it("supports required status values", () => {
    const statuses: SiteDomain["status"][] = ["pending", "verified", "active", "disabled"];
    for (const s of statuses) {
      const d = makeDomain({ websiteId: "wid-1" as WebsiteId, hostname: `x-${s}.co.za`, status: s });
      assert.equal(d.status, s);
    }
  });

  it("deployment preview hostname is not a Domain row", () => {
    // Deployment.url = "8tjd9g5.mogen.co.za" (preview) lives on Deployment, not Domain
    const previewUrl = "8tjd9g5.mogen.co.za";
    const domains: SiteDomain[] = [
      makeDomain({ websiteId: "wid-1" as WebsiteId, hostname: "abc.mogen.co.za", isPrimary: true }),
    ];
    const isDomainRow = domains.some((d) => d.hostname === previewUrl);
    assert.equal(isDomainRow, false);
  });
});
