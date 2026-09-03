import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  canonicalContentSchema,
  createEmptyCanonicalContent,
  deserializeCanonicalContent,
  normalizeSortOrder,
  parseCanonicalContent,
  safeParseCanonicalContent,
  serializeCanonicalContent,
} from "../domain/website-content.schema";

const validContent = {
  business: { name: "ABC Plumbing", description: "Reliable plumbing services for homes and businesses across Gauteng.", tagline: "Fixing pipes fast" },
  branding: { logoAssetId: null, primaryColor: "#0ea5e9" },
  seo: { metaTitle: "ABC Plumbing — Reliable Plumbers in Gauteng", metaDescription: "ABC Plumbing offers 24/7 emergency plumbing, installations and maintenance across Gauteng. Call today." },
  services: [
    { id: "svc-1", sortOrder: 0, title: "Emergency Repairs", description: "24/7 emergency plumbing repairs for leaks and burst pipes.", imageAssetId: null },
  ],
  products: [],
  locations: [{ id: "loc-1", sortOrder: 0, label: "Johannesburg", addressId: "addr-1" }],
  addresses: [{ id: "addr-1", sortOrder: 0, line1: "123 Main Rd", line2: null, city: "Johannesburg", province: "Gauteng", postalCode: "2000", country: "South Africa" }],
  phoneNumbers: [{ id: "ph-1", sortOrder: 0, label: "Office", number: "+27 11 123 4567" }],
  emailAddresses: [{ id: "em-1", sortOrder: 0, label: null, email: "hello@abcplumbing.co.za" }],
  socialLinks: [{ id: "so-1", sortOrder: 0, platform: "facebook", url: "https://facebook.com/abcplumbing" }],
  testimonials: [{ id: "te-1", sortOrder: 0, quote: "Great service, arrived within an hour!", author: "Thandi N.", role: "Homeowner" }],
  faqs: [{ id: "faq-1", sortOrder: 0, question: "Do you offer after-hours service?", answer: "Yes, we offer 24/7 emergency call-outs across Gauteng." }],
};

describe("canonical content — validation", () => {
  it("valid content parses", () => {
    const parsed = parseCanonicalContent(validContent);
    assert.equal(parsed.business.name, "ABC Plumbing");
  });

  it("business name required 2-100", () => {
    const r = safeParseCanonicalContent({ ...validContent, business: { ...validContent.business, name: "A" } });
    assert.equal(r.success, false);
  });

  it("business description required 10-1000", () => {
    const r = safeParseCanonicalContent({ ...validContent, business: { ...validContent.business, description: "short" } });
    assert.equal(r.success, false);
  });

  it("tagline nullable, max 100", () => {
    assert.equal(safeParseCanonicalContent({ ...validContent, business: { ...validContent.business, tagline: null } }).success, true);
    assert.equal(safeParseCanonicalContent({ ...validContent, business: { ...validContent.business, tagline: "a".repeat(101) } }).success, false);
  });

  it("whitespace-only business name rejected (trim before length)", () => {
    assert.equal(safeParseCanonicalContent({ ...validContent, business: { ...validContent.business, name: "  " } }).success, false);
    assert.equal(safeParseCanonicalContent({ ...validContent, business: { ...validContent.business, name: "   AB   " } }).success, true);
  });

  it("whitespace-only description rejected (trim before length)", () => {
    assert.equal(safeParseCanonicalContent({ ...validContent, business: { ...validContent.business, description: "          " } }).success, false);
    assert.equal(safeParseCanonicalContent({ ...validContent, business: { ...validContent.business, description: "   Valid description long enough   " } }).success, true);
  });
});

describe("canonical content — repeatable stable IDs + ordering", () => {
  it("repeatable records require id and sortOrder", () => {
    const bad = { ...validContent, services: [{ sortOrder: 0, title: "X", description: "Valid description for service", imageAssetId: null } as unknown as never] };
    assert.equal(safeParseCanonicalContent(bad).success, false);
  });

  it("normalizeSortOrder makes sequential", () => {
    const records = [
      { id: "a", sortOrder: 5 },
      { id: "b", sortOrder: 1 },
      { id: "c", sortOrder: 10 },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any[];
    const norm = normalizeSortOrder(records);
    assert.deepEqual(norm.map((r) => r.sortOrder), [0, 1, 2]);
  });

  it("stable IDs preserved across reorders — id unchanged, sortOrder normalized", () => {
    const a = { id: "svc-1", sortOrder: 2, title: "A", description: "Valid description for service A", imageAssetId: null };
    const b = { id: "svc-2", sortOrder: 0, title: "B", description: "Valid description for service B", imageAssetId: null };
    const content = { ...validContent, services: [a, b] };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normServices = normalizeSortOrder(content.services as any) as any[];
    assert.equal(normServices[0].id, "svc-2");
    assert.equal(normServices[1].id, "svc-1");
  });
});

describe("canonical content — optional vs required", () => {
  it("empty content fails business required, but optional arrays empty passes for those", () => {
    const empty = createEmptyCanonicalContent();
    const r = safeParseCanonicalContent(empty);
    assert.equal(r.success, false); // business name/description empty
    // but if business filled, empty repeatables are valid
    const withBusiness = { ...empty, business: validContent.business };
    assert.equal(safeParseCanonicalContent(withBusiness).success, true);
  });

  it("branding and seo nullable fields", () => {
    const c = { ...validContent, branding: { logoAssetId: null, primaryColor: null }, seo: { metaTitle: null, metaDescription: null } };
    assert.equal(safeParseCanonicalContent(c).success, true);
  });
});

describe("canonical content — asset references", () => {
  it("logoAssetId nullable string, primaryColor hex", () => {
    assert.equal(safeParseCanonicalContent({ ...validContent, branding: { logoAssetId: "asset-1", primaryColor: "#fff" } }).success, true);
    assert.equal(safeParseCanonicalContent({ ...validContent, branding: { logoAssetId: "asset-1", primaryColor: "red" } }).success, false);
  });

  it("service imageAssetId nullable", () => {
    const c = { ...validContent, services: [{ id: "svc-1", sortOrder: 0, title: "T", description: "Valid description long enough", imageAssetId: "asset-99" }] };
    assert.equal(safeParseCanonicalContent(c).success, false); // title too short -> fails
    const c2 = { ...validContent, services: [{ id: "svc-1", sortOrder: 0, title: "Emergency", description: "Valid description long enough", imageAssetId: "asset-99" }] };
    assert.equal(safeParseCanonicalContent(c2).success, true);
  });
});

describe("canonical content — SEO", () => {
  it("seo metaTitle 5-60, metaDescription 20-160, nullable", () => {
    assert.equal(canonicalContentSchema.shape.seo.parse({ metaTitle: "Short", metaDescription: "Valid description that is long enough for SEO" }).metaTitle, "Short");
    assert.equal(safeParseCanonicalContent({ ...validContent, seo: { metaTitle: "Hi", metaDescription: "Valid description that is long enough for SEO" } }).success, false);
    assert.equal(safeParseCanonicalContent({ ...validContent, seo: { metaTitle: "Valid title", metaDescription: "short" } }).success, false);
  });
});

describe("canonical content — contact/location", () => {
  it("phoneNumbers require number, label optional", () => {
    const ok = safeParseCanonicalContent({
      ...validContent,
      phoneNumbers: [{ id: "ph-1", sortOrder: 0, label: null, number: "+27 82 123 4567" }],
    });
    assert.equal(ok.success, true);
    const bad = safeParseCanonicalContent({
      ...validContent,
      phoneNumbers: [{ id: "ph-1", sortOrder: 0, label: null, number: "not-a-phone" }],
    });
    assert.equal(bad.success, false);
  });

  it("whitespace-only phone number rejected (trim before length/regex)", () => {
    assert.equal(safeParseCanonicalContent({ ...validContent, phoneNumbers: [{ id: "ph-1", sortOrder: 0, label: null, number: "        " }] }).success, false);
    assert.equal(safeParseCanonicalContent({ ...validContent, phoneNumbers: [{ id: "ph-1", sortOrder: 0, label: null, number: "  +27 82 123 4567  " }] }).success, true);
  });

  it("emailAddresses require valid email, label optional, normalized lowercase", () => {
    const parsed = parseCanonicalContent({
      ...validContent,
      emailAddresses: [{ id: "em-1", sortOrder: 0, label: "Info", email: "HELLO@Example.CO.ZA" }],
    });
    assert.equal(parsed.emailAddresses[0].email, "hello@example.co.za");
  });

  it("addresses require line1/city/country, postalCode SA 4 digits nullable", () => {
    const ok = safeParseCanonicalContent({
      ...validContent,
      addresses: [{ id: "addr-2", sortOrder: 1, line1: "456 Oak Ave", line2: null, city: "Cape Town", province: "Western Cape", postalCode: "8001", country: "South Africa" }],
    });
    assert.equal(ok.success, true);
    const bad = safeParseCanonicalContent({
      ...validContent,
      addresses: [{ id: "addr-2", sortOrder: 1, line1: "456 Oak Ave", line2: null, city: "Cape Town", province: "Western Cape", postalCode: "800", country: "South Africa" }],
    });
    assert.equal(bad.success, false);
  });

  it("socialLinks require url", () => {
    assert.equal(safeParseCanonicalContent({ ...validContent, socialLinks: [{ id: "so-1", sortOrder: 0, platform: "instagram", url: "not-a-url" }] }).success, false);
  });
});

describe("canonical content — serialization", () => {
  it("serialize/deserialize round-trip", () => {
    const json = serializeCanonicalContent(validContent);
    const parsed = deserializeCanonicalContent(json);
    assert.deepEqual(parsed, validContent);
  });

  it("deserialize validates", () => {
    const json = JSON.stringify({ ...validContent, business: { name: "A", description: "short", tagline: null } });
    assert.throws(() => deserializeCanonicalContent(json));
  });

  it("createEmptyCanonicalContent has all arrays and nullables", () => {
    const empty = createEmptyCanonicalContent();
    assert.deepEqual(empty.services, []);
    assert.equal(empty.business.name, "");
    assert.equal(empty.branding.logoAssetId, null);
    assert.equal(empty.seo.metaTitle, null);
  });
});
