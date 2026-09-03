import type { TemplateId, TemplateVersionId } from "./identifiers";

/**
 * Supported pages in the MVP package.
 * See intent.md §6 and architecture.md §10.
 */
export type SupportedPage = "home" | "about" | "services" | "products" | "contact" | "faq";

/**
 * Template metadata — presentation only, never content owner.
 * See architecture.md §7-§11 and intent.md §9-§12.
 */
export interface Template {
  readonly id: TemplateId;
  readonly slug: string;
  readonly name: string;
  readonly description: string | null;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface TemplateVersion {
  readonly id: TemplateVersionId;
  readonly templateId: TemplateId;
  readonly version: string;
  readonly supportedPages: readonly SupportedPage[];
  readonly contract: TemplateContract;
  readonly createdAt: Date;
}

/**
 * Contract declares what canonical content a template requires/optionally uses.
 * Renderer + UI use this to determine what to collect and what to preserve.
 */
export interface TemplateContract {
  readonly requiredContent: readonly ContentRequirement[];
  readonly optionalContent: readonly ContentRequirement[];
  readonly capabilities: readonly string[];
}

export type ContentRequirement =
  | "business.name"
  | "business.description"
  | "business.tagline"
  | "branding.logo"
  | "services"
  | "products"
  | "locations"
  | "addresses"
  | "phoneNumbers"
  | "emailAddresses"
  | "socialLinks"
  | "testimonials"
  | "faqs"
  | "projects"
  | "heroImage"
  | "gallery";
