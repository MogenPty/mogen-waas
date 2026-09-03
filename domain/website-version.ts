import type { TemplateVersionId, WebsiteId, WebsiteVersionId } from "./identifiers";
import type { CanonicalContent } from "./website-content";

/**
 * Versioning intent: editing must not mutate the live website.
 * See intent.md §13 and architecture.md §20.
 *
 * Published versions are immutable artifacts. Deployment points at a version.
 */
export type WebsiteVersionStatus = "draft" | "preview" | "approved" | "published" | "archived";

export interface WebsiteVersion {
  readonly id: WebsiteVersionId;
  readonly websiteId: WebsiteId;
  readonly status: WebsiteVersionStatus;
  readonly templateVersionId: TemplateVersionId;
  readonly content: CanonicalContent;
  readonly contentHash: string;
  readonly createdAt: Date;
  readonly approvedAt: Date | null;
  readonly publishedAt: Date | null;
}

export function isMutableStatus(status: WebsiteVersionStatus): boolean {
  return status === "draft" || status === "preview";
}

export function isImmutableStatus(status: WebsiteVersionStatus): boolean {
  return status === "published" || status === "archived";
}
