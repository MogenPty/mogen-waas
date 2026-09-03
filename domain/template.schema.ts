import { z } from "zod";

export const supportedPageSchema = z.enum(["home", "about", "services", "products", "contact", "faq"]);

export const contentRequirementSchema = z.enum([
  "business.name",
  "business.description",
  "business.tagline",
  "branding.logo",
  "services",
  "products",
  "locations",
  "addresses",
  "phoneNumbers",
  "emailAddresses",
  "socialLinks",
  "testimonials",
  "faqs",
  "projects",
  "heroImage",
  "gallery",
]);

export const templateCapabilitySchema = z.enum([
  "testimonials",
  "projects",
  "heroImage",
  "gallery",
  "servicesGrid",
  "productsGrid",
  "darkMode",
  "stickyHeader",
]);

export const templateSectionSchema = z.object({
  key: z.string().min(2).max(40).trim(),
  title: z.string().min(2).max(60).trim(),
  requiredContent: z.array(contentRequirementSchema).max(20),
  optionalContent: z.array(contentRequirementSchema).max(20),
  component: z.string().min(2).max(60).trim(),
});

export const templateContractSchema = z
  .object({
    requiredContent: z.array(contentRequirementSchema).max(20),
    optionalContent: z.array(contentRequirementSchema).max(20),
    capabilities: z.array(templateCapabilitySchema).max(20),
    sections: z.array(templateSectionSchema).max(20).default([]),
  })
  .superRefine((data, ctx) => {
    const overlap = data.requiredContent.filter((r) => data.optionalContent.includes(r));
    if (overlap.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `requiredContent and optionalContent overlap: ${overlap.join(", ")}`,
        path: ["requiredContent"],
      });
    }
    // Section content must be subset of contract's declared content
    for (const section of data.sections) {
      const allDeclared = [...data.requiredContent, ...data.optionalContent];
      for (const req of section.requiredContent) {
        if (!allDeclared.includes(req)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `section ${section.key} requiredContent ${req} not declared in contract`,
            path: ["sections"],
          });
        }
      }
    }
  });

export const templateSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(80).trim(),
  description: z.string().max(500).trim().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const templateVersionSchema = z.object({
  id: z.string().min(1),
  templateId: z.string().min(1),
  version: z.string().min(1).max(20).regex(/^\d+\.\d+\.\d+$/),
  supportedPages: z.array(supportedPageSchema).min(1).max(10),
  contract: templateContractSchema,
  createdAt: z.date(),
});
