import type { RouteRecordRaw } from "vue-router"
import ManagementApp from "@/modules/management/ManagementApp.vue"

import { useCurrentUser } from "@/store/user"
import type { IManagementApiService } from "@/modules/management/services/IManagementApiService"
import { container } from "tsyringe"
import { CurrentUserService } from "@/core/services/CurrentUserService"

import DeliveryList from "@/modules/management/views/delivery-method/DeliveryList.vue"
import DeliveryView from "@/modules/management/views/delivery-method/DeliveryView.vue"
import DeliveryCreate from "@/modules/management/views/delivery-method/DeliveryCreate.vue"
import DepartmentList from "@/modules/management/views/department/DepartmentList.vue"
import DepartmentView from "@/modules/management/views/department/DepartmentView.vue"
import DepartmentCreate from "@/modules/management/views/department/DepartmentCreate.vue"
import DocumentList from "@/modules/management/views/document-type/DocumentList.vue"
import DocumentView from "@/modules/management/views/document-type/DocumentView.vue"
import DocumentCreate from "@/modules/management/views/document-type/DocumentCreate.vue"
import PaymentList from "@/modules/management/views/payment-method/PaymentList.vue"
import PaymentView from "@/modules/management/views/payment-method/PaymentView.vue"
import PaymentCreate from "@/modules/management/views/payment-method/PaymentCreate.vue"
import ShippingList from "@/modules/management/views/shipping-method/ShippingList.vue"
import ShippingView from "@/modules/management/views/shipping-method/ShippingView.vue"
import ShippingCreate from "@/modules/management/views/shipping-method/ShippingCreate.vue"

const routes = <RouteRecordRaw[]>[
  {
    path: '/management',
    name: 'management',
    // redirect: '/customers/customer-list',
    component: ManagementApp,
    children: [
      {
        path: 'global/delivery',
        name: 'management-global-delivery-list',
        component: DeliveryList
      },
      {
        path: 'global/delivery/:id',
        name: 'management-global-delivery-view',
        component: DeliveryView
      },
      {
        path: 'global/delivery/create',
        name: 'management-global-delivery-create',
        component: DeliveryCreate
      },
      {
        path: 'global/department',
        name: 'management-global-department-list',
        component: DepartmentList
      },
      {
        path: 'global/department/:id',
        name: 'management-global-department-view',
        component: DepartmentView
      },
      {
        path: 'global/department/create',
        name: 'management-global-department-create',
        component: DepartmentCreate
      },
      {
        path: 'global/document',
        name: 'management-global-document-list',
        component: DocumentList
      },
      {
        path: 'global/document/:id',
        name: 'management-global-document-view',
        component: DocumentView
      },
      {
        path: 'global/document/create',
        name: 'management-global-document-create',
        component: DocumentCreate
      },
      {
        path: 'global/payment',
        name: 'management-global-payment-list',
        component: PaymentList
      },
      {
        path: 'global/payment/:id',
        name: 'management-global-payment-view',
        component: PaymentView
      },
      {
        path: 'global/payment/create',
        name: 'management-global-payment-create',
        component: PaymentCreate
      },
      {
        path: 'global/shipping',
        name: 'management-global-shipping-list',
        component: ShippingList
      },
      {
        path: 'global/shipping/:id',
        name: 'management-global-shipping-view',
        component: ShippingView
      },
      {
        path: 'global/shipping/create',
        name: 'management-global-shipping-create',
        component: ShippingCreate
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
