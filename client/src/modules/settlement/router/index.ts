import type { RouteRecordRaw } from "vue-router"
import SettlementApp from "@/modules/settlement/SettlementApp.vue"

import { useCurrentUser } from "@/store/user"
import type { ISettlementApiService } from "@/modules/settlement/services/ISettlementApiService"
import { container } from "tsyringe"
import { CurrentUserService } from "@/core/services/CurrentUserService"

import SettlementStatusList from "@/modules/settlement/views/status/SettlementStatusList.vue"
import SettlementStatusView from "@/modules/settlement/views/status/SettlementStatusView.vue"
import SettlementStatusCreate from "@/modules/settlement/views/status/SettlementStatusCreate.vue"
import SettlementOrderListVue from "@/modules/settlement/views/order/SettlementOrderList.vue"


const routes = <RouteRecordRaw[]>[
  {
    path: '/settlement',
    name: 'settlement',
    // redirect: '/customers/customer-list',
    component: SettlementApp,
    children: [
      {
        path: 'statuses',
        name: 'settlement-status-list',
        component: SettlementStatusList
      },
      {
        path: 'statuses/:id',
        name: 'settlement-status-view',
        component: SettlementStatusView
      },
      {
        path: 'statuses/create',
        name: 'settlement-status-create',
        component: SettlementStatusCreate
      },
      {
        path: 'orders',
        name: 'settlement-order-list',
        component: SettlementOrderListVue
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
