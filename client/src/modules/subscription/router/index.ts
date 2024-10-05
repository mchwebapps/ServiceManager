import type { RouteRecordRaw } from "vue-router"
import SubscriptionApp from "@/modules/subscription/SubscriptionApp.vue"
import SubscriptionList from "@/modules/subscription/views/subscriptions/SubscriptionList.vue"
import OrganizationList from "@/modules/subscription/views/organizations/OrganizationList.vue"
import OrganizationView from "@/modules/subscription/views/organizations/OrganizationView.vue"
import PlanList from "@/modules/subscription/views/plans/PlanList.vue"
import RoleList from "@/modules/subscription/views/roles/RoleList.vue"
import PaymentList from "@/modules/subscription/views/payments/PaymentList.vue"
import { useCurrentUser } from "@/store/user"
import { container } from "tsyringe"
import type { ISubscriptionApiService } from "@/modules/subscription/services/ISubscriptionApiService"
import { CurrentUserService } from "@/core/services/CurrentUserService"

const routes = <RouteRecordRaw[]>[
  {
    path: '/subscriptions',
    name: 'subscriptions',
    redirect: '/subscriptions/organizations',
    component: SubscriptionApp,
    children: [
      {
        path: 'subscriptions/:moduleKey',
        name: 'subscription-list',
        component: SubscriptionList,
        beforeEnter(to, from, next) {
          const userStore = useCurrentUser()
          const apiService = container.resolve("ISubscriptionApiService") as ISubscriptionApiService
          container.register("ICurrentUserService", { useValue: new CurrentUserService(apiService) })
          
          userStore.loadUserProfile().then(() => {
            if(userStore.getCurrentUser.administrativeRoles?.includes('app-admin')) {
              next()
            }
            if(userStore.getCurrentUser.administrativeRoles?.includes('organization-owner')) {
              next('/404')
            }
          })
        }
      },
      // {
      //   path: 'subscription-list/:moduleId',
      //   name: 'module-subscription-list',
      //   component: {}
      // },
      {
        path: 'organizations',
        name: 'organization-list',
        component: OrganizationList,
        beforeEnter(to, from, next) {
          const userStore = useCurrentUser()
          const apiService = container.resolve("ISubscriptionApiService") as ISubscriptionApiService
          container.register("ICurrentUserService", { useValue: new CurrentUserService(apiService) })
          
          userStore.loadUserProfile().then(() => {
            if(userStore.getCurrentUser.administrativeRoles?.includes('app-admin')) {
              next()
            }
            if(userStore.getCurrentUser.administrativeRoles?.includes('organization-owner')) {
              next('/subscriptions/organization')
            }
          })
        }
      },
      {
        path: "organization/:organizationId",
        name: "organization-view",
        component: OrganizationView
      },
      {
        path: 'organization',
        name: 'organization',
        component: OrganizationView,
        beforeEnter(to, from, next) {
          const userStore = useCurrentUser()
          const apiService = container.resolve("ISubscriptionApiService") as ISubscriptionApiService
          container.register("ICurrentUserService", { useValue: new CurrentUserService(apiService) })
          userStore.loadUserProfile().then(() => {
            if(userStore.getCurrentUser.administrativeRoles?.includes('app-admin')) {
              next()
            }
            if(userStore.getCurrentUser.administrativeRoles?.includes('organization-owner')) {
              next()
            }
          })
        }
      },
      {
        path: 'plans/:moduleKey',
        name: 'plan-list',
        component: PlanList,
        beforeEnter(to, from, next) {
          const userStore = useCurrentUser()
          const apiService = container.resolve("ISubscriptionApiService") as ISubscriptionApiService
          container.register("ICurrentUserService", { useValue: new CurrentUserService(apiService) })
          userStore.loadUserProfile().then(() => {
            if(userStore.getCurrentUser.administrativeRoles?.includes('app-admin')) {
              next()
            }
            if(userStore.getCurrentUser.administrativeRoles?.includes('organization-owner')) {
              next('/404')
            }
          })
        }
      },
      {
        path: 'roles/:moduleKey',
        name: 'role-list',
        component: RoleList,
        beforeEnter(to, from, next) {
          const userStore = useCurrentUser()
          const apiService = container.resolve("ISubscriptionApiService") as ISubscriptionApiService
          container.register("ICurrentUserService", { useValue: new CurrentUserService(apiService) })
          userStore.loadUserProfile().then(() => {
            if(userStore.getCurrentUser.administrativeRoles?.includes('app-admin')) {
              next()
            }
            if(userStore.getCurrentUser.administrativeRoles?.includes('organization-owner')) {
              next()
            }
          })
        }
      },
      {
        path: 'payments',
        name: 'payment-list',
        component: PaymentList
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
