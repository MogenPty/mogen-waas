import type { ContentRecordId } from "./identifiers";

/**
 * Canonical content — presentation-independent business information.
 * Content belongs to the website/business, never to a template.
 * See intent.md §10-§11 and architecture.md §8-§9.
 *
 * Repeatable concepts are arrays with stable IDs + explicit ordering.
 * This file defines the shape; validation lives in Phase 3.
 */

export interface CanonicalContent {
  readonly business: BusinessInfo;
  readonly branding: Branding;
  readonly seo: SeoInfo;
  readonly services: readonly Service[];
  readonly products: readonly Product[];
  readonly locations: readonly Location[];
  readonly addresses: readonly Address[];
  readonly phoneNumbers: readonly PhoneNumber[];
  readonly emailAddresses: readonly EmailAddress[];
  readonly socialLinks: readonly SocialLink[];
  readonly testimonials: readonly Testimonial[];
  readonly faqs: readonly Faq[];
}

export interface SeoInfo {
  readonly metaTitle: string | null;
  readonly metaDescription: string | null;
}

export interface BusinessInfo {
  readonly name: string;
  readonly description: string;
  readonly tagline: string | null;
}

export interface Branding {
  readonly logoAssetId: string | null;
  readonly primaryColor: string | null;
}

export interface OrderedRecord {
  readonly id: ContentRecordId;
  readonly sortOrder: number;
}

export interface Service extends OrderedRecord {
  readonly title: string;
  readonly description: string;
  readonly imageAssetId: string | null;
}

export interface Product extends OrderedRecord {
  readonly title: string;
  readonly description: string;
  readonly imageAssetId: string | null;
}

export interface Location extends OrderedRecord {
  readonly label: string;
  readonly addressId: string | null;
}

export interface Address extends OrderedRecord {
  readonly line1: string;
  readonly line2: string | null;
  readonly city: string;
  readonly province: string | null;
  readonly postalCode: string | null;
  readonly country: string;
}

export interface PhoneNumber extends OrderedRecord {
  readonly label: string | null;
  readonly number: string;
}

export interface EmailAddress extends OrderedRecord {
  readonly label: string | null;
  readonly email: string;
}

export interface SocialLink extends OrderedRecord {
  readonly platform: string;
  readonly url: string;
}

export interface Testimonial extends OrderedRecord {
  readonly quote: string;
  readonly author: string;
  readonly role: string | null;
}

export interface Faq extends OrderedRecord {
  readonly question: string;
  readonly answer: string;
}
