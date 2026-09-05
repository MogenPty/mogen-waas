import type { TemplateId, TemplateVersionId } from "./identifiers";
import type { CanonicalContent } from "./website-content";
import type { CanonicalContentParsed } from "./website-content.schema";

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

export type TemplateCapability =
  | "testimonials"
  | "projects"
  | "heroImage"
  | "gallery"
  | "servicesGrid"
  | "productsGrid"
  | "darkMode"
  | "stickyHeader";

export interface TemplateSection {
  readonly key: string;
  readonly title: string;
  readonly requiredContent: readonly ContentRequirement[];
  readonly optionalContent: readonly ContentRequirement[];
  readonly component: string;
}

/**
 * Contract declares what canonical content a template requires/optionally uses.
 * Renderer + UI use this to determine what to collect and what to preserve.
 * Sections declare component-level contracts for controlled composition.
 */
export interface TemplateContract {
  readonly requiredContent: readonly ContentRequirement[];
  readonly optionalContent: readonly ContentRequirement[];
  readonly capabilities: readonly TemplateCapability[];
  readonly sections: readonly TemplateSection[];
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

// --- Compatibility helpers (no DB, pure domain logic) ---

function isRequirementSatisfied(content: CanonicalContent | CanonicalContentParsed, req: ContentRequirement): boolean {
  switch (req) {
    case "business.name":
      return content.business.name.trim().length >= 2;
    case "business.description":
      return content.business.description.trim().length >= 10;
    case "business.tagline":
      return content.business.tagline !== null && content.business.tagline.trim().length > 0;
    case "branding.logo":
      return content.branding.logoAssetId !== null;
    case "services":
      return content.services.length > 0;
    case "products":
      return content.products.length > 0;
    case "locations":
      return content.locations.length > 0;
    case "addresses":
      return content.addresses.length > 0;
    case "phoneNumbers":
      return content.phoneNumbers.length > 0;
    case "emailAddresses":
      return content.emailAddresses.length > 0;
    case "socialLinks":
      return content.socialLinks.length > 0;
    case "testimonials":
      return content.testimonials.length > 0;
    case "faqs":
      return content.faqs.length > 0;
    case "projects":
    case "heroImage":
    case "gallery":
      // Template-specific placeholders — not part of canonical yet; treat as unsatisfied unless present via capabilities
      return false;
    default:
      return false;
  }
}

export function getMissingRequiredContent(
  content: CanonicalContent | CanonicalContentParsed,
  contract: TemplateContract
): readonly ContentRequirement[] {
  return contract.requiredContent.filter((req) => !isRequirementSatisfied(content, req));
}

export function isContentCompatible(
  content: CanonicalContent | CanonicalContentParsed,
  contract: TemplateContract
): boolean {
  return getMissingRequiredContent(content, contract).length === 0;
}

export function areContractsCompatible(
  oldContract: TemplateContract,
  newContract: TemplateContract
): { addedRequired: readonly ContentRequirement[]; removedRequired: readonly ContentRequirement[] } {
  const addedRequired = newContract.requiredContent.filter((r) => !oldContract.requiredContent.includes(r));
  const removedRequired = oldContract.requiredContent.filter((r) => !newContract.requiredContent.includes(r));
  return { addedRequired, removedRequired };
}
