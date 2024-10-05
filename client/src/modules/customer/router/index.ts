import type { RouteRecordRaw } from "vue-router"
import CustomerApp from "@/modules/customer/CustomerApp.vue"
import CustomerList from "@/modules/customer/views/customer/CustomerList.vue"
import CustomerCreate from "@/views/CustomerCreate.vue"
import CustomerView from "@/modules/customer/views/customer/CustomerView.vue"
import { useCurrentUser } from "@/store/user"
import type { ICustomerApiService } from "@/modules/customer/services/ICustomerApiService"
import { container } from "tsyringe"
import { CurrentUserService } from "@/core/services/CurrentUserService"

const routes = <RouteRecordRaw[]>[
  {
    path: '/customers',
    //name: 'customers',
    redirect: '/customers/customer-list',
    component: CustomerApp,
    children: [
      {
        path: '',
        name: 'customer-list',
        component: CustomerList,
        beforeEnter(to, from, next) {
          const userStore = useCurrentUser()
          const apiService = container.resolve("ICustomerApiService") as ICustomerApiService
          container.register("ICurrentUserService", { useValue: new CurrentUserService(apiService) })
    
          userStore.loadUserProfile().then(() => {
            if(userStore.getCurrentUser.userId)
              userStore.getCurrentUser.administrativeRoles = ['app-admin']
              console.log(userStore.getCurrentUser.administrativeRoles)
              next()
          })
        }
      },
      {
        path: 'create',
        name: 'customer-create',
        component: CustomerCreate
      },
      {
        path: ':id',
        name: 'customer-view',
        component: CustomerView
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
