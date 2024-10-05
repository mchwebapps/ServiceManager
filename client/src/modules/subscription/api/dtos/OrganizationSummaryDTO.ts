export class OrganizationSummaryDTO {
  id!: string;
  name!: string;
  userCount!: number;
  hasActiveSubscription!: boolean;
  ownerUserEmail!: string;
  ownerUserId!: string;
}
