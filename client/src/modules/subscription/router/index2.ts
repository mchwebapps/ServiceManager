import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from "@/store";
import { Mutations, Actions } from "@/store/enums/StoreEnums";
import AuthService from "@/core/services/AuthService";

store.getters.getUserProfile?.organizationId;
store.getters.getModules?.id;

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    // redirect: "/dashboard",
    component: () => import("@/layout/Layout.vue"),
    beforeEnter: async () => {
      if (!AuthService.IsAuthenticated) {
        await AuthService.Login();
      }
    },
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        beforeEnter: async (to, from, next) => {
          if (AuthService.hasRole("app-admin")) {
            next("/organizations");
            return;
          } else if (AuthService.hasRole("organization-owner")) {
            next("/organization");
            return;
          } else {
            next("/403");
          }
        },
      },
      {
        path: "/organizations",
        name: "organizations",
        component: () => import("@/views/organizations/OrganizationList.vue"),
        beforeEnter: (to, from, next) => {
          if (AuthService.hasRole("app-admin")) {
            next();
            return;
          } else if (AuthService.hasRole("organization-owner")) {
            next("/organization");
            return;
          } else {
            next("/403");
          }
        }
      },
      {
        path: "/organization/:organizationId",
        name: "organization-view",
        props: true,
        component: () => import("@/views/organizations/OrganizationView.vue"),
        beforeEnter: (to, from, next) => {
          if (AuthService.hasRole("app-admin")) {
            next();
            return;
          } else if (AuthService.hasRole("organization-owner")) {
            next("/organization");
            return;
          } else {
            next("/403");
          }
        }
      },
      {
        path: "/organization",
        name: "organization",
        props: () => ({
          organizationId: store.getters.getUserProfile?.id,
        }),
        component: () => import("@/views/organizations/OrganizationView.vue"),
        beforeEnter: (to, from, next) => {
          if (AuthService.hasRole("app-admin")) {
            next("/organizations");
            return;
          } else if (AuthService.hasRole("organization-owner")) {
            next();
            return;
          } else {
            next("/403");
          }
        }
      },
      {
        path: "/payments",
        name: "payments",
        component: () => import("@/views/payments/PaymentList.vue"),
        meta: { roles: ["app-admin", "organization-owner"] },
        beforeEnter: (to, from, next) => {
          if (to.meta.roles && (to.meta.roles as Array<string>).some(role => AuthService.hasRole(role))) {
            next();
            return;
          } else {
            next("/403");
          }
        }
      },
      {
        path: "/plans/:moduleKey",
        name: "module-plans",
        component: () => import("@/views/plans/PlanList.vue"),
        beforeEnter: (to, from, next) => {
          if (AuthService.hasRole("app-admin")) {
            next();
            return;
          } else if (AuthService.hasRole("organization-owner")) {
            next("/organization");
            return;
          } else {
            next("/403");
          }
        }
      },
      {
        path: "/roles/:moduleKey",
        name: "module-roles",
        component: () => import("@/views/roles/RoleList.vue"),
        meta: { roles: ["app-admin", "organization-owner"] },
        beforeEnter: (to, from, next) => {
          if (to.meta.roles && (to.meta.roles as Array<string>).some(role => AuthService.hasRole(role))) {
            next();
            return;
          } else {
            next("/403");
          }
        }
      },
      {
        path: "/subscriptions/:moduleKey",
        name: "subscriptions",
        component: () => import("@/views/subscriptions/SubscriptionList.vue"),
        beforeEnter: (to, from, next) => {
          if (AuthService.hasRole("app-admin")) {
            next();
            return;
          } else if (AuthService.hasRole("organization-owner")) {
            next("/organization");
            return;
          } else {
            next("/403");
          }
        }
      },
      {
        // the 404 route, when none of the above matches
        path: "/404",
        name: "404",
        component: () => import("@/views/errors/Error404.vue"),
      },
    ],
  },
  {
    // the 404 route, when none of the above matches
    path: "/403",
    name: "403",
    component: () => import("@/views/errors/Error404.vue"),
  },
  {
    // the 404 route, when none of the above matches
    path: "/404",
    name: "404",
    component: () => import("@/views/errors/Error404.vue"),
  },
  {
    path: "/500",
    name: "500",
    component: () => import("@/views/errors/Error500.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(() => {
  // reset config to initial state
  store.commit(Mutations.RESET_LAYOUT_CONFIG);

  // Scroll page to top on every route change
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
});

export default router;
