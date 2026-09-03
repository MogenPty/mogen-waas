import type { AccountId, IndustryId, TemplateId, WebsiteId, WebsiteVersionId } from "./identifiers";

/**
 * Package is the 5-page product. MVP is one package only.
 * See intent.md §6.
 */
export type WebsitePackage = "starter-5-page";

export type WebsiteStatus = "draft" | "ready_for_preview" | "published" | "archived";

export interface Website {
  readonly id: WebsiteId;
  readonly accountId: AccountId;
  readonly slug: string;
  readonly package: WebsitePackage;
  readonly industryId: IndustryId | null;
  readonly templateId: TemplateId | null;
  readonly status: WebsiteStatus;
  readonly activePublishedVersionId: WebsiteVersionId | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
