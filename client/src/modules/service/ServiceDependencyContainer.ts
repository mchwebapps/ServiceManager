import ApiService from "@/core/services/ApiService"
import type { IServiceApiService } from "@/modules/service/services/IServiceApiService"
import type { IDependencyContainer } from "@/dependencyInjection/IDependencyContainer"
import { container } from "tsyringe"

import { ActionService } from "@/modules/service/api/services/action/ActionService"
import { DeviceTypeService } from "@/modules/service/api/services/device-type/DeviceTypeService"

import { OrderCreateService } from "@/modules/service/api/services/order/OrderCreateService"
import { OrderListService } from "@/modules/service/api/services/order/OrderListService"
import { OrderViewService } from "@/modules/service/api/services/order/OrderViewService"

import { ParameterService } from "@/modules/service/api/services/parameter/ParameterService"
import { ParameterValueService } from "@/modules/service/api/services/parameter-value/ParameterValueService"

import { ServiceStatusService } from "@/modules/service/api/services/status/ServiceStatusService"
import { ServiceActionService } from "@/modules/service/api/services/service-action/ServiceActionService"
import { ServiceService } from "@/modules/service/api/services/service/ServiceService"
import { WorkerService } from "@/modules/service/api/services/worker/WorkerService"
import { WorkPositionService } from "@/modules/service/api/services/work-position/WorkPositionService"

/**
 * Module dependency registration container
 */
export class ServiceDependencyContainer implements IDependencyContainer {
    /**
    * @inheritdoc
    */
    registerTypes(): void {
        container.register('IServiceApiService', { useValue: new ApiService(import.meta.env.VITE_IADMIN_SUBSCRIPTION_BASE_URL) as IServiceApiService })

        container.register('IActionService', { useClass: ActionService })
        container.register('IDeviceTypeService', { useClass: DeviceTypeService })
        container.register('IOrderCreateService', { useClass: OrderCreateService })
        container.register('IOrderListService', { useClass: OrderListService })
        container.register('IOrderViewService', { useClass: OrderViewService })
        container.register('IParameterService', { useClass: ParameterService })
        container.register('IParameterValueService', { useClass: ParameterValueService })
        container.register('IServiceStatusService', { useClass: ServiceStatusService })
        container.register('IServiceActionService', { useClass: ServiceActionService })
        container.register('IServiceService', { useClass: ServiceService })
        container.register('IWorkerService', { useClass: WorkerService })
        container.register('IWorkPositionService', { useClass: WorkPositionService })
    }
}