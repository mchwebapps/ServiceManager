import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import customerAppRoutes from "@/modules/customer/router/index"
import subscriptionRoutes from "@/modules/subscription/router/index"
import serviceRoutes from "@/modules/service/router/index"
import managementRoutes from "@/modules/management/router/index"
import settlementRoutes from "@/modules/settlement/router/index"
import HomeView from "@/views/HomeView.vue"
import AboutView from "@/views/AboutView.vue"
import Dashboard from "@/components/Dashboard.vue"
import { useCurrentUser } from "@/store/user"
import { container } from "tsyringe"
import type { IApiService } from '@/core/services/ApiService'
import { CurrentUserService } from "@/core/services/CurrentUserService"
import LoginSuccess from "@/views/LoginSuccess.vue"

const appRoutes = <RouteRecordRaw[]>[
  {
    path: '/',
    component: HomeView,
    children: [
      {
        path: '',
        name: 'home',
        component: Dashboard
      },
      {
        path: 'about',
        name: 'about',
        component: AboutView
      },
      {
        path: 'login-success',
        name: 'login-success',
        component: LoginSuccess
      }
    ]
  },
]

console.log('appRoutes', appRoutes)

let routes: any = <RouteRecordRaw[]>[]

if (
  customerAppRoutes ||
  subscriptionRoutes ||
  serviceRoutes ||
  managementRoutes ||
  settlementRoutes
) {

  routes = appRoutes.concat(
    customerAppRoutes,
    subscriptionRoutes,
    serviceRoutes,
    managementRoutes,
    settlementRoutes
  )

  // routes = appRoutes[0].children?.push(
  //   customerAppRoutes[0],
  //   subscriptionRoutes[0],
  //   serviceRoutes[0],
  //   managementRoutes[0],
  //   settlementRoutes[0]
  // )

} else {
  routes = appRoutes
}

console.log('routes', routes)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
