import ApiService from '@/core/services/ApiService'
import type { ICustomerApiService } from './services/ICustomerApiService'
import type { IDependencyContainer } from '@/dependencyInjection/IDependencyContainer'
import { container } from 'tsyringe'

/**
 * Module dependency registration container
 */
export class CustomerDependencyContainer implements IDependencyContainer {

    /**
    * @inheritdoc
    */
    registerTypes(): void {
        container.register("ICustomerApiService", { useValue: new ApiService(import.meta.env.VITE_IADMIN_CUSTOMER_BASE_URL) as ICustomerApiService })

    }
}