import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseCanonicalContent } from "../domain/website-content.schema";
import { areContractsCompatible, getMissingRequiredContent, isContentCompatible, type TemplateContract } from "../domain/template";
import { templateContractSchema, templateVersionSchema } from "../domain/template.schema";

const baseContent = parseCanonicalContent({
  business: { name: "ABC Plumbing", description: "Reliable plumbing services for homes and businesses across Gauteng.", tagline: null },
  branding: { logoAssetId: null, primaryColor: null },
  seo: { metaTitle: null, metaDescription: null },
  services: [{ id: "svc-1", sortOrder: 0, title: "Emergency", description: "24/7 emergency plumbing repairs for leaks.", imageAssetId: null }],
  products: [],
  locations: [],
  addresses: [],
  phoneNumbers: [{ id: "ph-1", sortOrder: 0, label: null, number: "+27 11 123 4567" }],
  emailAddresses: [{ id: "em-1", sortOrder: 0, label: null, email: "hello@abc.co.za" }],
  socialLinks: [],
  testimonials: [{ id: "te-1", sortOrder: 0, quote: "Great service, arrived within an hour and fixed the leak perfectly!", author: "Thandi N.", role: null }],
  faqs: [],
});

describe("template contract — schema", () => {
  it("valid contract parses", () => {
    const c = templateContractSchema.parse({
      requiredContent: ["business.name", "services"],
      optionalContent: ["testimonials"],
      capabilities: ["testimonials"],
      sections: [{ key: "hero", title: "Hero", requiredContent: ["business.name"], optionalContent: [], component: "HeroA" }],
    });
    assert.equal(c.requiredContent.length, 2);
  });

  it("rejects overlap between required and optional", () => {
    const r = templateContractSchema.safeParse({
      requiredContent: ["services"],
      optionalContent: ["services"],
      capabilities: [],
      sections: [],
    });
    assert.equal(r.success, false);
  });

  it("rejects section requiredContent not declared in contract", () => {
    const r = templateContractSchema.safeParse({
      requiredContent: ["business.name"],
      optionalContent: [],
      capabilities: [],
      sections: [{ key: "s", title: "S", requiredContent: ["testimonials"], optionalContent: [], component: "C" }],
    });
    assert.equal(r.success, false);
  });

  it("rejects undeclared optionalContent in section", () => {
    const r = templateContractSchema.safeParse({
      requiredContent: ["business.name"],
      optionalContent: [],
      capabilities: [],
      sections: [{ key: "s", title: "S", requiredContent: [], optionalContent: ["testimonials"], component: "C" }],
    });
    assert.equal(r.success, false);
  });

  it("rejects overlap within section required and optional", () => {
    const r = templateContractSchema.safeParse({
      requiredContent: ["services", "testimonials"],
      optionalContent: [],
      capabilities: [],
      sections: [{ key: "s", title: "S", requiredContent: ["services"], optionalContent: ["services"], component: "C" }],
    });
    assert.equal(r.success, false);
  });

  it("templateVersion requires supportedPages and semver", () => {
    const ok = templateVersionSchema.safeParse({
      id: "tv-1",
      templateId: "t-1",
      version: "1.0.0",
      supportedPages: ["home", "about", "services", "contact", "faq"],
      contract: { requiredContent: [], optionalContent: [], capabilities: [], sections: [] },
      createdAt: new Date(),
    });
    assert.equal(ok.success, true);
    const bad = templateVersionSchema.safeParse({
      id: "tv-1",
      templateId: "t-1",
      version: "1",
      supportedPages: [],
      contract: { requiredContent: [], optionalContent: [], capabilities: [], sections: [] },
      createdAt: new Date(),
    });
    assert.equal(bad.success, false);
  });
});

describe("template contract — compatibility", () => {
  it("getMissingRequiredContent detects missing testimonials/services", () => {
    const contract: TemplateContract = {
      requiredContent: ["business.name", "testimonials", "services"],
      optionalContent: [],
      capabilities: [],
      sections: [],
    };
    const missing = getMissingRequiredContent(baseContent, contract);
    assert.deepEqual(missing, []); // baseContent has all three
    const contract2: TemplateContract = {
      requiredContent: ["projects"],
      optionalContent: [],
      capabilities: [],
      sections: [],
    };
    assert.deepEqual(getMissingRequiredContent(baseContent, contract2), ["projects"]);
  });

  it("isContentCompatible true when all required satisfied", () => {
    const c: TemplateContract = { requiredContent: ["business.name", "emailAddresses"], optionalContent: [], capabilities: [], sections: [] };
    assert.equal(isContentCompatible(baseContent, c), true);
    const c2: TemplateContract = { requiredContent: ["products"], optionalContent: [], capabilities: [], sections: [] };
    assert.equal(isContentCompatible(baseContent, c2), false);
  });

  it("areContractsCompatible reports added/removed required", () => {
    const oldC: TemplateContract = { requiredContent: ["business.name"], optionalContent: [], capabilities: [], sections: [] };
    const newC: TemplateContract = { requiredContent: ["business.name", "testimonials"], optionalContent: [], capabilities: [], sections: [] };
    const { addedRequired, removedRequired } = areContractsCompatible(oldC, newC);
    assert.deepEqual(addedRequired, ["testimonials"]);
    assert.deepEqual(removedRequired, []);
  });

  it("unused content preserved — switching does not delete testimonials", () => {
    const contractA: TemplateContract = { requiredContent: ["testimonials"], optionalContent: [], capabilities: ["testimonials"], sections: [] };
    const contractB: TemplateContract = { requiredContent: ["services"], optionalContent: [], capabilities: [], sections: [] };
    // content has testimonials for A; switching to B still keeps them in canonical content
    assert.equal(isContentCompatible(baseContent, contractA), true);
    assert.equal(isContentCompatible(baseContent, contractB), true);
    // baseContent still has testimonials array intact even though B doesn't require it
    assert.equal(baseContent.testimonials.length, 1);
  });
});
