import type { AccountId, UserId } from "./identifiers";

/**
 * Application roles — separate from Neon Auth infra roles.
 * Must be assigned only by trusted server-side code.
 * See architecture.md §18.
 */
export type ApplicationRole = "customer" | "admin";

export interface User {
  readonly id: UserId;
  readonly email: string;
  readonly name: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface Account {
  readonly id: AccountId;
  readonly ownerUserId: UserId;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface AccountMembership {
  readonly accountId: AccountId;
  readonly userId: UserId;
  readonly role: ApplicationRole;
  readonly createdAt: Date;
}
