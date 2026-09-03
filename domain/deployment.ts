import type { DeploymentId, DomainId, WebsiteId, WebsiteVersionId } from "./identifiers";

/**
 * Deployment references an explicit WebsiteVersion — never the mutable draft.
 * A Deployment.url may be a preview hostname (e.g. 8tjd9g5.mogen.co.za) for kind=preview.
 * Public hostnames (abc.mogen.co.za, abc.co.za) are NOT deployment URLs — they are
 * Domain rows that resolve to a Website → Published Version → Renderer.
 * See intent.md §14 and architecture.md §21-§23.
 */
export type DeploymentStatus = "pending" | "ready" | "failed";

export type DeploymentKind = "preview" | "published";

export interface Deployment {
  readonly id: DeploymentId;
  readonly websiteId: WebsiteId;
  readonly websiteVersionId: WebsiteVersionId;
  readonly domainId: DomainId | null;
  readonly kind: DeploymentKind;
  readonly status: DeploymentStatus;
  readonly url: string | null;
  readonly provider: string;
  readonly providerDeploymentId: string | null;
  readonly createdAt: Date;
  readonly completedAt: Date | null;
}

/**
 * Provider abstraction — domain never imports Vercel SDK.
 * See architecture.md §6, §21.
 */
export interface DeploymentProvider {
  createPreview(args: {
    websiteId: WebsiteId;
    websiteVersionId: WebsiteVersionId;
  }): Promise<Deployment>;
  deploy(args: {
    websiteId: WebsiteId;
    websiteVersionId: WebsiteVersionId;
  }): Promise<Deployment>;
  getDeployment(id: DeploymentId): Promise<Deployment | null>;
}
