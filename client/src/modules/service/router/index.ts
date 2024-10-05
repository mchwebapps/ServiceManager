import type { RouteRecordRaw } from "vue-router"
import { ParameterCategories } from "@/modules/service/store/enums/StoreEnums"

import ServiceApp from "@/modules/service/ServiceApp.vue"

import ServiceList from "@/modules/service/views/service/ServiceList.vue"
import ServiceView from "@/modules/service/views/service/ServiceView.vue"
import ServiceCreate from "@/modules/service/views/service/ServiceCreate.vue"

import ActionList from "@/modules/service/views/action/ActionList.vue"
import ActionView from "@/modules/service/views/action/ActionView.vue"
import ActionCreate from "@/modules/service/views/action/ActionCreate.vue"

import DeviceTypeList from "@/modules/service/views/device-type/DeviceTypeList.vue"
import DeviceTypeView from "@/modules/service/views/device-type/DeviceTypeView.vue"
import DeviceTypeCreate from "@/modules/service/views/device-type/DeviceTypeCreate.vue"

import ServiceStatusList from "@/modules/service/views/status/ServiceStatusList.vue"
import ServiceStatusView from "@/modules/service/views/status/ServiceStatusView.vue"
import ServiceStatusCreate from "@/modules/service/views/status/ServiceStatusCreate.vue"

import DeviceTypeParameterList from "@/modules/service/views/parameter/device-type/DeviceTypeParameterList.vue"
import DeviceTypeParameterView from "@/modules/service/views/parameter/device-type/DeviceTypeParameterView.vue"
import DeviceTypeParameterCreate from "@/modules/service/views/parameter/device-type/DeviceTypeParameterCreate.vue"

import ServiceParameterList from "@/modules/service/views/parameter/service/ServiceParameterList.vue"
import ServiceParameterView from "@/modules/service/views/parameter/service/ServiceParameterView.vue"
import ServiceParameterCreate from "@/modules/service/views/parameter/service/ServiceParameterCreate.vue"

import OrderList from "@/modules/service/views/order/OrderList.vue"
import OrderView from "@/modules/service/views/order/OrderView.vue"
import OrderCreate from "@/modules/service/views/order/OrderCreate.vue"

import WorkerList from "@/modules/service/views/worker/WorkerList.vue"
import WorkerView from "@/modules/service/views/worker/WorkerView.vue"
import WorkerCreate from "@/modules/service/views/worker/WorkerCreate.vue"

import WorkPositionList from "@/modules/service/views/work-position/WorkPositionList.vue"
import WorkPositionView from "@/modules/service/views/work-position/WorkPositionView.vue"
import WorkPositionCreate from "@/modules/service/views/work-position/WorkPositionCreate.vue"

import { useCurrentUser } from "@/store/user"
import { container } from "tsyringe"
import type { IServiceApiService } from "@/modules/service/services/IServiceApiService"
import { CurrentUserService } from "@/core/services/CurrentUserService"

const routes = <RouteRecordRaw[]>[
  {
    path: '/service',
    name: 'service',
    component: ServiceApp,
    children: [
      {
        path: 'services',
        name: 'service-list',
        component: ServiceList,
        meta: 'nav'
      },
      {
        path: 'services/:id',
        name: 'service-view',
        component: ServiceView
      },
      {
        path: 'services/create',
        name: 'service-create',
        component: ServiceCreate
      },
          {
            path: 'actions',
            name: 'action-list',
            component: ActionList,
            meta: 'nav'
          },
          {
            path: 'actions/:id',
            name: 'action-view',
            component: ActionView
          },
          {
            path: 'actions/create',
            name: 'action-create',
            component: ActionCreate
          },
      {
        path: 'device-types',
        name: 'device-type-list',
        component: DeviceTypeList
      },
      {
        path: 'device-types/:id',
        name: 'device-type-view',
        component: DeviceTypeView
      },
      {
        path: 'device-types/create',
        name: 'device-type-create',
        component: DeviceTypeCreate
      },
          {
            path: 'statuses',
            name: 'service-status-list',
            component: ServiceStatusList
          },
          {
            path: 'statuses/:id',
            name: 'service-status-view',
            component: ServiceStatusView
          },
          {
            path: 'statuses/create',
            name: 'service-status-create',
            component: ServiceStatusCreate
          },
      {
        path: 'device-type/parameters',
        name: 'device-type-parameter-list',
        component: DeviceTypeParameterList,
        props: { parameterCategory: ParameterCategories.Device }
      },
      {
        path: 'device-type/parameters/:id',
        name: 'device-type-parameter-view',
        component: DeviceTypeParameterView,
        props: { parameterCategory: ParameterCategories.Device }
      },
      {
        path: 'device-type/parameters/create',
        name: 'device-type-parameter-create',
        component: DeviceTypeParameterCreate,
        props: { parameterCategory: ParameterCategories.Device }
      },
          {
            path: 'service/parameters',
            name: 'service-parameter-list',
            component: ServiceParameterList,
            props: { parameterCategory: ParameterCategories.Service }
          },
          {
            path: 'service/parameters/:id',
            name: 'service-parameter-view',
            component: ServiceParameterView,
            props: { parameterCategory: ParameterCategories.Service }
          },
          {
            path: 'service/parameters/create',
            name: 'service-parameter-create',
            component: ServiceParameterCreate,
            props: { parameterCategory: ParameterCategories.Service }
          },
      {
        path: 'orders',
        name: 'order-list',
        component: OrderList
      },
      {
        path: 'orders/:id',
        name: 'order-view',
        component: OrderView
      },
      {
        path: 'orders/create',
        name: 'order-create',
        component: OrderCreate
      },
          {
            path: 'workers',
            name: 'worker-list',
            component: WorkerList
          },
          {
            path: 'workers/:id',
            name: 'worker-view',
            component: WorkerView
          },
          {
            path: 'workers/create',
            name: 'worker-create',
            component: WorkerCreate
          },
      {
        path: 'work-positions',
        name: 'work-position-list',
        component: WorkPositionList
      },
      {
        path: 'work-positions/:id',
        name: 'work-position-view',
        component: WorkPositionView
      },
      {
        path: 'work-positions/create',
        name: 'work-position-create',
        component: WorkPositionCreate
      },
          {
            path: "/404",
            name: "404",
            component: () => import("@/views/errors/Error404.vue"),
          },
    ]
  }
]

export default routes
