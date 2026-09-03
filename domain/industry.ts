import type { IndustryId } from "./identifiers";

/**
 * Industry is classification, not presentation.
 * See intent.md §9.
 */
export interface Industry {
  readonly id: IndustryId;
  readonly slug: string;
  readonly name: string;
  readonly description: string | null;
  readonly sortOrder: number;
  readonly isActive: boolean;
}
