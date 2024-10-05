export class OrganizationStatusHelper {
  static getOrganizationStatusName(status: boolean) {
    return status === false ? "Nieaktywne" : "Aktywne";
  }

  static getOrganizationStatusBadgeClass(status: boolean) {
    return status === false ? "badge bg-light" : "badge bg-success";
  }
}
