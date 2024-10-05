import { OrganizationUserRoles } from '@/modules/subscription/api/enums/StoreEnums'

export class OrganizationUserHelper {
  static getOrganizationUserRoleName(type: OrganizationUserRoles) {
    switch (type) {
      case OrganizationUserRoles.Owner:
        return 'Właściciel'
      case OrganizationUserRoles.Belonger:
        return 'Uczestnik'
      default:
        return ''
    }
  }
}
