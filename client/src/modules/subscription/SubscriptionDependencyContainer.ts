import ApiService from '@/core/services/ApiService'
import type { ISubscriptionApiService } from '@/modules/subscription/services/ISubscriptionApiService'
import type { IDependencyContainer } from '@/dependencyInjection/IDependencyContainer'
import { container } from 'tsyringe'
import { ModulePermissionService } from '@/modules/subscription/api/services/ModulePermissionService'
import { ModulePlanPermissionService } from '@/modules/subscription/api/services/ModulePlanPermissionService'
import { ModulePlanService } from '@/modules/subscription/api/services/ModulePlanService'
import { ModuleRolePermissionService } from '@/modules/subscription/api/services/ModuleRolePermissionService'
import { ModuleRoleService } from '@/modules/subscription/api/services/ModuleRoleService'
import { ModuleService } from '@/modules/subscription/api/services/ModuleService'
import { ModuleSubscriptionService } from '@/modules/subscription/api/services/ModuleSubscriptionService'
import { OrganizationContactService } from '@/modules/subscription/api/services/OrganizationContactService'
import { OrganizationService } from '@/modules/subscription/api/services/OrganizationService'
import { OrganizationSubscriptionService } from '@/modules/subscription/api/services/OrganizationSubscriptionService'
import { OrganizationUserService } from '@/modules/subscription/api/services/OrganizationUserService'
import { PaymentService } from '@/modules/subscription/api/services/PaymentService'
import { UserAccessService } from '@/modules/subscription/api/services/UserAccessService'


/**
 * Module dependency registration container
 */
export class SubscriptionDependencyContainer implements IDependencyContainer {
    /**
    * @inheritdoc
    */
    registerTypes(): void {
        container.register('ISubscriptionApiService', { useValue: new ApiService(import.meta.env.VITE_IADMIN_SUBSCRIPTION_BASE_URL) as ISubscriptionApiService })

        container.register('IModulePermissionService', { useClass: ModulePermissionService })
        container.register('IModulePlanPermissionService', { useClass: ModulePlanPermissionService })
        container.register('IModulePlanService', { useClass: ModulePlanService })
        container.register('IModuleRolePermissionService', { useClass: ModuleRolePermissionService })
        container.register('IModuleRoleService', { useClass: ModuleRoleService })
        container.register('IModuleService', { useClass: ModuleService })
        container.register('IModuleSubscriptionService', { useClass: ModuleSubscriptionService })
        container.register('IOrganizationContactService', { useClass: OrganizationContactService })
        container.register('IOrganizationService', { useClass: OrganizationService })
        container.register('IOrganizationSubscriptionService', { useClass: OrganizationSubscriptionService })
        container.register('IOrganizationUserService', { useClass: OrganizationUserService })
        container.register('IPaymentService', { useClass: PaymentService })
        container.register('IUserAccessService', { useClass: UserAccessService })
    }
}