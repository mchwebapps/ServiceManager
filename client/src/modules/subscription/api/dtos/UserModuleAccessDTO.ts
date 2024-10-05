import type { ModuleRoleDTO } from '@/modules/subscription/api/dtos/ModuleRoleDTO'

export class UserModuleAccessDTO {
  moduleKey!: string
  moduleName!: string
  roles!: ModuleRoleDTO[]
  activeRoleId!:string
  hasUserAccess!: boolean
}
