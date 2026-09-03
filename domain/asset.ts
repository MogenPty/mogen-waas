import type { AssetId, WebsiteId } from "./identifiers";

/**
 * Asset metadata — provider-agnostic.
 * Actual storage behind StorageProvider adapter (R2 / Cloudinary etc.).
 * See architecture.md §25.
 */
export type AssetKind = "image" | "logo" | "gallery";

export interface Asset {
  readonly id: AssetId;
  readonly websiteId: WebsiteId | null;
  readonly kind: AssetKind;
  readonly originalFilename: string;
  readonly mimeType: string;
  readonly byteSize: number;
  readonly provider: string;
  readonly providerKey: string;
  readonly url: string;
  readonly createdAt: Date;
}
