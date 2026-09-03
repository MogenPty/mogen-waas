import type { AccountId, PaymentId, PlanId, SubscriptionId, WebsiteId } from "./identifiers";

/**
 * Payment state is separate from rendering.
 * See architecture.md §24. Provider behind PaymentProvider adapter.
 */
export interface Plan {
  readonly id: PlanId;
  readonly slug: string;
  readonly name: string;
  readonly priceCents: number;
  readonly currency: string;
  readonly interval: "month" | "year";
  readonly isActive: boolean;
}

export type SubscriptionStatus = "incomplete" | "active" | "past_due" | "canceled";

export interface Subscription {
  readonly id: SubscriptionId;
  readonly accountId: AccountId;
  readonly websiteId: WebsiteId | null;
  readonly planId: PlanId;
  readonly status: SubscriptionStatus;
  readonly currentPeriodEnd: Date | null;
  readonly createdAt: Date;
}

export type PaymentStatus = "pending" | "succeeded" | "failed";

export interface Payment {
  readonly id: PaymentId;
  readonly subscriptionId: SubscriptionId | null;
  readonly accountId: AccountId;
  readonly amountCents: number;
  readonly currency: string;
  readonly status: PaymentStatus;
  readonly provider: string;
  readonly providerPaymentId: string | null;
  readonly createdAt: Date;
}

export interface PaymentProvider {
  createCheckout(args: {
    accountId: AccountId;
    planId: PlanId;
    websiteId?: WebsiteId;
  }): Promise<{ url: string; paymentId: PaymentId }>;
  verifyPayment(paymentId: PaymentId): Promise<Payment>;
}
