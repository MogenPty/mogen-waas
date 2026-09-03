/**
 * Stable branded identifiers for domain entities.
 * Branding prevents accidental assignment between different entity IDs
 * while remaining plain strings at runtime (no vendor coupling).
 */

export type Brand<T, B extends string> = T & { readonly __brand: B };

export type UserId = Brand<string, "UserId">;
export type AccountId = Brand<string, "AccountId">;
export type WebsiteId = Brand<string, "WebsiteId">;
export type WebsiteVersionId = Brand<string, "WebsiteVersionId">;
export type IndustryId = Brand<string, "IndustryId">;
export type TemplateId = Brand<string, "TemplateId">;
export type TemplateVersionId = Brand<string, "TemplateVersionId">;
export type AssetId = Brand<string, "AssetId">;
export type DomainId = Brand<string, "DomainId">;
export type DeploymentId = Brand<string, "DeploymentId">;
export type PlanId = Brand<string, "PlanId">;
export type SubscriptionId = Brand<string, "SubscriptionId">;
export type PaymentId = Brand<string, "PaymentId">;

/**
 * Repeatable content records (services, faqs, etc.) need stable IDs
 * for ordering and preservation across template switches.
 */
export type ContentRecordId = Brand<string, "ContentRecordId">;

export function createId<B extends string>(): Brand<string, B> {
  // crypto.randomUUID is available in Node 20+ and Edge runtimes
  return crypto.randomUUID() as Brand<string, B>;
}
