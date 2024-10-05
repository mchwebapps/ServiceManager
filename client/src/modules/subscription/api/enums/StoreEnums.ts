enum AccountTypes {
  Personal = 0,
  Business = 1,
}

enum Modules {
  ServiceApp = 1,
  ShopApp = 2,
}

enum SubscriptionTypes {
  Basic = 1,
  Advance = 2,
  Pro = 3,
}

enum SubscriptionStatuses {
  Inactive = 1,
  Active = 2,
  Ended = 3,
}

enum PaymentMethods {
  BankTransfer = 1,
  Cash = 2,
}

enum PaymentStatuses {
  Paid = 1,
  Cancelled = 2,
}

enum OrganizationStatuses {
  Inactive = "false",
  Active = "true",
}

enum OrganizationUserRoles {
  Owner = 1,
  Belonger = 2,
}

export {
  AccountTypes,
  Modules,
  SubscriptionTypes,
  SubscriptionStatuses,
  PaymentMethods,
  PaymentStatuses,
  OrganizationStatuses,
  OrganizationUserRoles,
};
