<template>
  <div class="sidebar-wrapper border-end bg-white" >
    <div class="sidebar-heading border-bottom text-bg-secondary">
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="24" height="24" /> iAdmin
    </div>
    <div class="list-group list-group-flush">
      <RouterLink 
        class="list-group-item list-group-item-action list-group-item-light p-3"
        :to="{ name: 'home' }"
      >
        Dashboard
      </RouterLink>
      <RouterLink
        class="list-group-item list-group-item-action list-group-item-light p-3"
        :to="{ name: 'about' }"
      >
        About
      </RouterLink>
      <RouterLink
        class="list-group-item list-group-item-action list-group-item-light fw-bold text-secondary p-3"
        :to="{ name: 'settlement' }"
        data-bs-toggle="collapse"
        data-bs-target="#settlement-collapse"
        aria-expanded="true"
      >
      <i class="bi bi-currency-dollar me-1"></i>
        Rozliczenia <i class="bi bi-reception-0 ms-1"></i>
      </RouterLink>
      <div class="collapse show" id="settlement-collapse">
        <ul class="btn-toggle-nav fw-normal pb-1 small mt-2 list-group list-group-flush">
          <RouterLink
            class="list-group-item list-group-item-action"
            :to="{ name: 'settlement-order-list' }"
          >
          <i class="bi bi-dash text-secondary"></i> Zamówienia
          </RouterLink>
          <RouterLink
            class="list-group-item list-group-item-action"
            :to="{ name: 'settlement-status-list' }"
          >
          <i class="bi bi-check text-success"></i> Statusy
          </RouterLink>
        </ul>
      </div>
      <RouterLink
        class="list-group-item list-group-item-action list-group-item-light fw-bold text-info p-3"
        :to="{ name: 'management' }"
        data-bs-toggle="collapse"
        data-bs-target="#management-collapse"
        aria-expanded="true"
      >
      <i class="bi bi-gear-fill me-1"></i>
        Ustawienia <i class="bi bi-reception-0 ms-1"></i>
      </RouterLink>
      <div class="collapse show" id="management-collapse">
        <ul class="btn-toggle-nav fw-normal pb-1 small mt-2 list-group list-group-flush">
          <li
            class="list-group-item list-group-item-action"
            data-bs-toggle="collapse"
            data-bs-target="#management-global-collapse"
            aria-expanded="true"
          >
            Ogólne
          </li>
        </ul>
        <div class="collapse show" id="management-global-collapse">
          <ul class="btn-toggle-nav fw-normal pb-1 small mt-2 list-group list-group-flush">
            <RouterLink
              class="list-group-item list-group-item-action ps-4"
              :to="{ name: 'management-global-department-list' }"
            >
              <i class="bi bi-dash text-secondary"></i> Oddziały
            </RouterLink>
            <RouterLink
              class="list-group-item list-group-item-action ps-4"
              :to="{ name: 'management-global-delivery-list' }"
            >
              <i class="bi bi-check text-success"></i> Sposoby dostawy
            </RouterLink>
            <RouterLink
              class="list-group-item list-group-item-action ps-4"
              :to="{ name: 'management-global-document-list' }"
            >
              <i class="bi bi-check text-success"></i> Rodzaje dokumentów
            </RouterLink>
            <RouterLink
              class="list-group-item list-group-item-action ps-4"
              :to="{ name: 'management-global-payment-list' }"
            >
              <i class="bi bi-check text-success"></i> Rodzaje płatności
            </RouterLink>
            <RouterLink
              class="list-group-item list-group-item-action ps-4"
              :to="{ name: 'management-global-shipping-list' }"
            >
              <i class="bi bi-check text-success"></i> Sposoby wysyłki
            </RouterLink>
          </ul>
        </div>
      </div>
      <RouterLink
        class="list-group-item list-group-item-action list-group-item-light fw-bold text-success p-3"
        :to="{ name: 'customer-list' }"
      >
        <i class="bi bi-people-fill me-1"></i>
        Klienci <i class="bi bi-reception-2 ms-1"></i>
      </RouterLink>
      <RouterLink
        class="list-group-item list-group-item-action list-group-item-light fw-bold text-danger p-3"
        :to="{ name: 'service' }"
        data-bs-toggle="collapse"
        data-bs-target="#service-collapse"
        aria-expanded="true"
      >
        <i class="bi bi-headset me-1"></i>
        Serwis <i class="bi bi-reception-0 ms-1"></i>
      </RouterLink>
      <div class="collapse show" id="service-collapse">
        <ul class="btn-toggle-nav fw-normal pb-1 small mt-2 list-group list-group-flush">
          <RouterLink
            class="list-group-item list-group-item-action"
            :to="{ name: 'device-type-list' }"
          >
          <i class="bi bi-check text-success"></i> Typy urządzeń
          </RouterLink>
          <RouterLink
            class="list-group-item list-group-item-action"
            :to="{ name: 'service-list' }"
          >
            <i class="bi bi-check text-success"></i> Usługi
          </RouterLink>
          <RouterLink
            class="list-group-item list-group-item-action"
            :to="{ name: 'action-list' }"
          >
            <i class="bi bi-check text-success"></i> Czynności
          </RouterLink>
          <RouterLink
            class="list-group-item list-group-item-action"
            :to="{ name: 'service-status-list' }"
          >
            <i class="bi bi-check text-success"></i> Statusy
          </RouterLink>
          <RouterLink
            class="list-group-item list-group-item-action"
            :to="{ name: 'device-type-parameter-list' }"
          >
          <i class="bi bi-check text-success"></i> Parametry
          </RouterLink>
          <RouterLink
            class="list-group-item list-group-item-action"
            :to="{ name: 'order-list' }"
          >
          <i class="bi bi-dash text-secondary"></i> Naprawy
          </RouterLink>
          <RouterLink
            class="list-group-item list-group-item-action"
            :to="{ name: 'worker-list' }"
          >
            <i class="bi bi-check text-success"></i> Pracownicy
          </RouterLink>
          <RouterLink
            class="list-group-item list-group-item-action"
            :to="{ name: 'work-position-list' }"
          >
            <i class="bi bi-check text-success"></i> Stanowiska
          </RouterLink>
        </ul>
      </div>
      <!-- <a href="#" class="list-group-item list-group-item-action list-group-item-light fw-bold text-danger p-3">
        <i class="bi bi-app-indicator me-1"></i>
        Serwis <i class="bi bi-x ms-1"></i>
      </a> -->
      <RouterLink
        class="list-group-item list-group-item-action list-group-item-light fw-bold text-warning p-3 collapsed"
        :to="{ name: 'subscriptions' }"
        data-bs-toggle="collapse"
        data-bs-target="#subscriptions-collapse"
        aria-expanded="false"
      >
        <i class="bi bi-app-indicator me-1"></i>
        Subskrypcje <i class="bi bi-reception-3 ms-1"></i>
      </RouterLink>
      <div class="collapse" id="subscriptions-collapse">
        <ul class="btn-toggle-nav fw-normal pb-1 small mt-2 list-group list-group-flush">
          <li class="list-group-item list-group-item-primary">ADMIN MENU</li>
          <RouterLink class="list-group-item list-group-item-action" :to="{ name: 'organization-list' }">Organizacje</RouterLink> <!-- /organizations -->
          <a class="list-group-item list-group-item-action" data-bs-toggle="collapse" href="#collapseSubscriptions">Subskrypcje</a>
          <ul class="collapse" id="collapseSubscriptions">
            <li v-for="mod in subscriptionModules" :key="mod.key">
              <RouterLink class="list-group-item list-group-item-action" :to="{ name: 'subscription-list', params: { moduleKey: mod.key } }">{{ mod.name }}</RouterLink>
            </li>
          </ul>
          <RouterLink class="list-group-item list-group-item-action" :to="{ name: 'payment-list' }">Historia płatności</RouterLink> <!-- /payments -->
          <a class="list-group-item list-group-item-action" data-bs-toggle="collapse" href="#collapsePlans">Plany</a>
          <ul class="collapse" id="collapsePlans">
            <li v-for="mod in planModules" :key="mod.key">
              <RouterLink class="list-group-item list-group-item-action" :to="{ name: 'plan-list', params: { moduleKey: mod.key } }">{{ mod.name }}</RouterLink>
            </li>
          </ul>
          <a class="list-group-item list-group-item-action" data-bs-toggle="collapse" href="#collapseRoles">Role</a>
          <ul class="collapse" id="collapseRoles">
            <li v-for="mod in roleModules" :key="mod.key">
              <RouterLink class="list-group-item list-group-item-action" :to="{ name: 'role-list', params: { moduleKey: mod.key } }">{{ mod.name }}</RouterLink>
            </li>
          </ul>
          <li class="list-group-item list-group-item-warning">OWNER MENU</li>
          <RouterLink
            class="list-group-item list-group-item-action"
            :to="{ name: 'organization' }"
          >
            Moje konto
          </RouterLink> <!-- /organization (param pod spodem) -->
          <RouterLink class="list-group-item list-group-item-action" to="/subscriptions/payments">Historia płatności</RouterLink> <!-- /payments -->
          <a class="list-group-item list-group-item-action" data-bs-toggle="collapse" href="#collapseOwnerRoles">Role</a>
          <ul class="collapse" id="collapseOwnerRoles">
            <li>
              <RouterLink class="list-group-item list-group-item-action" :to="{ name: 'role-list', params: { moduleKey: 'REPAIR_SERVICE'} }">Serwis</RouterLink>
            </li>
          </ul>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useCurrentUser } from "@/store/user"

import { container } from "tsyringe"
import type { IModuleService } from "@/modules/subscription/api/services/ModuleService"
import type { ModuleDTO } from "@/modules/subscription/api/dtos/ModuleDTO"

const userStore = useCurrentUser()

const moduleService = container.resolve('IModuleService') as IModuleService
const subscriptionType = 'SUBSCRIPTION'
const planType = 'SUBSCRIPTION'
const roleType = 'ROLE'

const subscriptionModules = ref<ModuleDTO[]>([])
const planModules = ref<ModuleDTO[]>([])
const roleModules = ref<ModuleDTO[]>([])

// subscriptionModules.value = await moduleService.getModules(subscriptionType)
// planModules.value = await moduleService.getModules(planType)
// roleModules.value = await moduleService.getModules(roleType)
</script>