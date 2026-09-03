import { z } from "zod";

// Stable ID — branded string, but at runtime validate as non-empty UUID-like string
const contentRecordIdSchema = z.string().min(1, "id required");

const sortOrderSchema = z.number().int().min(0).max(9999);

// Asset reference — nullable string (AssetId), no vendor coupling
const assetIdSchema = z.string().min(1).nullable();

// Optional vs required: many fields nullable to allow progressive onboarding
// Required fields have meaningful min lengths; optional fields allow null.

export const businessInfoSchema = z.object({
  name: z.string().min(2, "business name 2-100").max(100).trim(),
  description: z.string().min(10, "description 10-1000").max(1000).trim(),
  tagline: z.string().max(100).trim().nullable(),
});

export const brandingSchema = z.object({
  logoAssetId: assetIdSchema,
  primaryColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "hex color #RGB or #RRGGBB")
    .nullable(),
});

export const seoInfoSchema = z.object({
  metaTitle: z.string().min(5).max(60).trim().nullable(),
  metaDescription: z.string().min(20).max(160).trim().nullable(),
});

export const serviceSchema = z.object({
  id: contentRecordIdSchema,
  sortOrder: sortOrderSchema,
  title: z.string().min(2).max(80).trim(),
  description: z.string().min(10).max(500).trim(),
  imageAssetId: assetIdSchema,
});

export const productSchema = z.object({
  id: contentRecordIdSchema,
  sortOrder: sortOrderSchema,
  title: z.string().min(2).max(80).trim(),
  description: z.string().min(10).max(500).trim(),
  imageAssetId: assetIdSchema,
});

export const locationSchema = z.object({
  id: contentRecordIdSchema,
  sortOrder: sortOrderSchema,
  label: z.string().min(2).max(60).trim(),
  addressId: z.string().min(1).nullable(),
});

export const addressSchema = z.object({
  id: contentRecordIdSchema,
  sortOrder: sortOrderSchema,
  line1: z.string().min(2).max(100).trim(),
  line2: z.string().max(100).trim().nullable(),
  city: z.string().min(2).max(60).trim(),
  province: z.string().max(60).trim().nullable(),
  postalCode: z
    .string()
    .regex(/^\d{4}$/, "SA postal code 4 digits")
    .nullable()
    .or(z.literal("").transform(() => null)),
  country: z.string().min(2).max(60).trim(),
});

export const phoneNumberSchema = z.object({
  id: contentRecordIdSchema,
  sortOrder: sortOrderSchema,
  label: z.string().max(40).trim().nullable(),
  number: z
    .string()
    .min(8)
    .max(20)
    .regex(/^\+?[0-9\s\-()]+$/, "phone number")
    .trim(),
});

export const emailAddressSchema = z.object({
  id: contentRecordIdSchema,
  sortOrder: sortOrderSchema,
  label: z.string().max(40).trim().nullable(),
  email: z.string().email().trim().toLowerCase(),
});

export const socialLinkSchema = z.object({
  id: contentRecordIdSchema,
  sortOrder: sortOrderSchema,
  platform: z.string().min(2).max(30).trim(),
  url: z.string().url().trim(),
});

export const testimonialSchema = z.object({
  id: contentRecordIdSchema,
  sortOrder: sortOrderSchema,
  quote: z.string().min(10).max(500).trim(),
  author: z.string().min(2).max(60).trim(),
  role: z.string().max(60).trim().nullable(),
});

export const faqSchema = z.object({
  id: contentRecordIdSchema,
  sortOrder: sortOrderSchema,
  question: z.string().min(5).max(200).trim(),
  answer: z.string().min(10).max(1000).trim(),
});

export const canonicalContentSchema = z.object({
  business: businessInfoSchema,
  branding: brandingSchema,
  seo: seoInfoSchema,
  services: z.array(serviceSchema).max(50),
  products: z.array(productSchema).max(50),
  locations: z.array(locationSchema).max(20),
  addresses: z.array(addressSchema).max(20),
  phoneNumbers: z.array(phoneNumberSchema).max(10),
  emailAddresses: z.array(emailAddressSchema).max(10),
  socialLinks: z.array(socialLinkSchema).max(20),
  testimonials: z.array(testimonialSchema).max(20),
  faqs: z.array(faqSchema).max(50),
});

export type CanonicalContentInput = z.input<typeof canonicalContentSchema>;
export type CanonicalContentParsed = z.output<typeof canonicalContentSchema>;

// Serialization helpers — ensure content round-trips via JSON with validation
export function parseCanonicalContent(data: unknown) {
  return canonicalContentSchema.parse(data);
}

export function safeParseCanonicalContent(data: unknown) {
  return canonicalContentSchema.safeParse(data);
}

export function serializeCanonicalContent(content: CanonicalContentInput): string {
  // Validate before serializing to catch drift
  canonicalContentSchema.parse(content);
  return JSON.stringify(content);
}

export function deserializeCanonicalContent(json: string): CanonicalContentParsed {
  const parsed = JSON.parse(json);
  return canonicalContentSchema.parse(parsed);
}

// Factory for empty content (onboarding start)
export function createEmptyCanonicalContent(): CanonicalContentInput {
  return {
    business: { name: "", description: "", tagline: null },
    branding: { logoAssetId: null, primaryColor: null },
    seo: { metaTitle: null, metaDescription: null },
    services: [],
    products: [],
    locations: [],
    addresses: [],
    phoneNumbers: [],
    emailAddresses: [],
    socialLinks: [],
    testimonials: [],
    faqs: [],
  };
}

// Ordering helper — ensure sortOrder is sequential after mutations
export function normalizeSortOrder<T extends { sortOrder: number }>(records: readonly T[]): T[] {
  return [...records]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((r, idx) => ({ ...r, sortOrder: idx }));
}
