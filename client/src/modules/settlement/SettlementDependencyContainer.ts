import ApiService from "@/core/services/ApiService"
import type { ISettlementApiService } from "@/modules/settlement/services/ISettlementApiService"
import type { IDependencyContainer } from "@/dependencyInjection/IDependencyContainer"
import { container } from "tsyringe"
import { SettlementOrderListService } from "@/modules/settlement/api/services/order/SettlementOrderListService"
import { SettlementStatusService } from "@/modules/settlement/api/services/status/SettlementStatusService"



/**
 * Module dependency registration container
 */
export class SettlementDependencyContainer implements IDependencyContainer {
    /**
    * @inheritdoc
    */
    registerTypes(): void {
        // container.register('ISettlementApiService', { useValue: new ApiService(import.meta.env.VITE_IADMIN_SUBSCRIPTION_BASE_URL) as ISettlementApiService })
        container.register('ISettlementApiService', { useValue: new ApiService("http://localhost:3000") as ISettlementApiService })

        container.register('ISettlementOrderListService', { useClass: SettlementOrderListService })
        container.register('ISettlementStatusService', { useClass: SettlementStatusService })
    }
}