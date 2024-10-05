import type { SubscriptionTypes, PaymentMethods, PaymentStatuses } from "@/modules/subscription/api/enums/StoreEnums";

export class Payment {
  id!: number;
  moduleId!: number;
  subscriptionType!: SubscriptionTypes;
  invoiceId!: number;
  date!: string;
  price!: number;
  currency!: string;
  billing!: PaymentMethods;
  status!: PaymentStatuses;
}
