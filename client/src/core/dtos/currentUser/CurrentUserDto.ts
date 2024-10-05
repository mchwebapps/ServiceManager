export class CurrentUserDTO {
  public userId?: string
  public organizationId?: string
  public email?: string
  public name?: string
  public hasActiveSubscription?: boolean
  public administrativeRoles?: string[]
}