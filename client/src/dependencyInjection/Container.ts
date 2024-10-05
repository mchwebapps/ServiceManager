import type { IDependencyContainer } from "@/dependencyInjection/IDependencyContainer"
import { CustomerDependencyContainer } from "@/modules/customer/CustomerDependencyContainer"
import { ServiceDependencyContainer } from "@/modules/service/ServiceDependencyContainer"
import { SubscriptionDependencyContainer } from "@/modules/subscription/SubscriptionDependencyContainer"
import { ManagementDependencyContainer } from "@/modules/management/ManagementDependencyContainer"
import { SettlementDependencyContainer } from "@/modules/settlement/SettlementDependencyContainer"
import { container } from "tsyringe"

import { CommonCustomerBillingService } from "@/core/services/customer/CommonCustomerBillingService"
import { CommonCustomerContactService } from "@/core/services/customer/CommonCustomerContactService"
import { CommonCustomerShippingService } from "@/core/services/customer/CommonCustomerShippingService"
import { CommonCustomerService } from "@/core/services/customer/CommonCustomerService"

import { CommonDeliveryMethodService } from "@/core/services/management/delivery-method/CommonDeliveryMethodService"
import { CommonDocumentTypeService } from "@/core/services/management/document-type/CommonDocumentTypeService"
import { CommonShippingMethodService } from "@/core/services/management/shipping-method/CommonShippingMethodService"
import { CommonPaymentMethodService } from "@/core/services/management/payment-method/CommonPaymentMethodService"
import { CommonDepartmentService } from "@/core/services/management/department/CommonDepartmentService"

export function createContainer(): void {
    const containers: IDependencyContainer[] = [
        new SubscriptionDependencyContainer(),
        new CustomerDependencyContainer(),
        new ServiceDependencyContainer(),
        new ManagementDependencyContainer(),
        new SettlementDependencyContainer()
    ]

    for (const c of containers) {
        c.registerTypes()
    }

    container.register('ICommonCustomerContactService', { useClass: CommonCustomerContactService })
    container.register('ICommonCustomerService', { useClass: CommonCustomerService })
    container.register('ICommonCustomerShippingService', { useClass: CommonCustomerShippingService })
    container.register('ICommonCustomerBillingService', { useClass: CommonCustomerBillingService })

    container.register('ICommonDeliveryMethodService', { useClass: CommonDeliveryMethodService })
    container.register('ICommonDocumentTypeService', { useClass: CommonDocumentTypeService })
    container.register('ICommonShippingMethodService', { useClass: CommonShippingMethodService })
    container.register('ICommonPaymentMethodService', { useClass: CommonPaymentMethodService })
    container.register('ICommonDepartmentService', { useClass: CommonDepartmentService })
}