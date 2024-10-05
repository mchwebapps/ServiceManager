import type { AccountTypes } from "@/modules/subscription/api/enums/StoreEnums";

export class Organization {
  id!: string;
  ownerUserId!: string;
  name!: string;
  street!: string;
  city!: string;
  houseNo!: string;
  flatNo!: string;
  postCode!: string;
  voivodeship!: string;
  country!: string;
  taxNumber!: string;
  accountType!: AccountTypes;
  ownerAccountUsername!: string;
  ownerAccountEmail!: string;
}
