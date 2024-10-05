import ApiService from '@/core/services/ApiService'
import type { IManagementApiService } from '@/modules/management/services/IManagementApiService'
import type { IDependencyContainer } from '@/dependencyInjection/IDependencyContainer'
import { container } from 'tsyringe'
import { DeliveryMethodService } from '@/modules/management/api/services/delivery-method/DeliveryMethodService'
import { DepartmentService } from '@/modules/management/api/services/department/DepartmentService'
import { DocumentTypeService } from '@/modules/management/api/services/document-type/DocumentTypeService'
import { ShippingMethodService } from '@/modules/management/api/services/shipping-method/ShippingMethodService'
import { PaymentMethodService } from '@/modules/management/api/services/payment-method/PaymentMethodService'


/**
 * Module dependency registration container
 */
export class ManagementDependencyContainer implements IDependencyContainer {
    /**
    * @inheritdoc
    */
    registerTypes(): void {
        container.register('IManagementApiService', { useValue: new ApiService(import.meta.env.VITE_IADMIN_SUBSCRIPTION_BASE_URL) as IManagementApiService })

        container.register('IDeliveryMethodService', { useClass: DeliveryMethodService })
        container.register('IDepartmentService', { useClass: DepartmentService })
        container.register('IDocumentTypeService', { useClass: DocumentTypeService })
        container.register('IShippingMethodService', { useClass: ShippingMethodService })
        container.register('IPaymentMethodService', { useClass: PaymentMethodService })
    }
}