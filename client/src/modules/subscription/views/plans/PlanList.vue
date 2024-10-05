<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          {{ view.title }} <small class="text-muted ms-1">{{ module.name }}</small>
        </h3>
      </div>
    </div>
    <div class="row justify-content-between">
      <div class="col-10 col-md-8 col-lg-4">
        <input type="text" class="form-control form-control-sm my-3" placeholder="Wyszukaj">
      </div>
      <div class="col-2 col-md-4 col-lg-4">
        <!-- <RouterLink :to="{ name: 'customer-create'}" class="btn btn-sm btn-primary float-end my-3 ms-auto">Dodaj</RouterLink> -->
        <button
          class="btn btn-sm btn-success float-end my-3 ms-auto"
          data-bs-toggle="modal"
          data-bs-target="#CreatePlanModal"
        >
          Dodaj
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="table-responsive">
          <table class="table table-hover text-center align-middle fs-6">
            <thead class="bg-primary bg-opacity-10">
              <tr>
                <th scope="col" v-for="col in cols">{{ col }}</th>
              </tr>
            </thead>
            <tbody>
            <tr v-for="modulePlan in modulePlans" :key="modulePlan.id">
              <th scope="row">{{ modulePlan.name }}</th>
              <td>{{ modulePlan.description }}</td>
              <td>{{ PriceHelper.formatPrice(modulePlan.price) }}</td>
              <td>
                <button
                  class="btn btn-sm btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#ViewPlanPermissionsModal"
                  @click="getPlan(modulePlan.id)"
                >
                  Podgląd
                </button>
                <button
                  class="btn btn-sm btn-warning ms-1"
                  data-bs-toggle="modal"
                  data-bs-target="#EditPlanModal"
                  @click="getPlan(modulePlan.id)"
                >
                  Edytuj
                </button>
                <button
                  class="btn btn-sm btn-danger ms-1"
                  @click="deletePlan(moduleKey, modulePlan.id)"
                >
                  Usuń
                </button>
              </td>
            </tr>
            </tbody>
          </table>
          <nav aria-label="Page navigation example">
            <ul class="pagination pagination-sm justify-content-end">
              <li class="page-item disabled">
                <a class="page-link">&lt;</a>
              </li>
              <li class="page-item active"><a class="page-link" href="#">1</a></li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">3</a></li>
              <li class="page-item">
                <a class="page-link" href="#">&gt;</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>

  <CreatePlanModal :moduleKey="moduleKey" @refresh="refreshPlans()" />
  <ViewPlanPermissionsModal :moduleKey="moduleKey" :modulePlanId="modulePlanId" />
  <EditPlanModal :moduleKey="moduleKey" :modulePlanId="modulePlanId" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue"
import { useRoute } from "vue-router"
import Swal from "sweetalert2"

import type { ModulePlanDTO } from "@/modules/subscription/api/dtos/ModulePlanDTO"
import { ModuleDTO } from "@/modules/subscription/api/dtos/ModuleDTO"

import CreatePlanModal from "@/modules/subscription/components/modals/plans/CreatePlanModal.vue"
import ViewPlanPermissionsModal from "@/modules/subscription/components/modals/plans/ViewPlanPermissionsModal.vue"
import EditPlanModal from "@/modules/subscription/components/modals/plans/EditPlanModal.vue"

import { PriceHelper } from "@/modules/subscription/api/helpers/PriceHelper"

import { container } from "tsyringe"
import type { IModuleService } from "@/modules/subscription/api/services/ModuleService"
import type { IModulePlanService } from "@/modules/subscription/api/services/ModulePlanService"

const cols = ['Plan', 'Opis', 'Cena', 'Akcje']
const view = { title: 'Lista planów' }

const moduleService = container.resolve('IModuleService') as IModuleService
const modulePlanService = container.resolve('IModulePlanService') as IModulePlanService
const module = ref<ModuleDTO>(new ModuleDTO)
const modulePlans = ref<ModulePlanDTO[]>([])

const route = useRoute()
const moduleKey = route.params.moduleKey as string
const modulePlanId = ref('')
let errors = ref()

const refreshPlans = async () => {
  const refreshedPlans = await modulePlanService.getModulePlans(moduleKey)
  modulePlans.value = refreshedPlans
}

watch(
  () => moduleKey,
  async () => {
    modulePlans.value = await modulePlanService.getModulePlans(moduleKey)
    module.value = await moduleService.getModule(moduleKey)
  },
  { deep: true }
)

onMounted(async () => {
  modulePlans.value = await modulePlanService.getModulePlans(moduleKey)
  module.value = await moduleService.getModule(moduleKey)
})

const getPlan = async (planId: string) => {
  modulePlanId.value = planId
}

const deletePlan = (moduleKey: string, modulePlanId: string) => {
  try {
    Swal.fire({
      icon: 'question',
      html: 'Czy na pewno chcesz usunąć ten plan?',
      showCancelButton: true,
      cancelButtonText: 'Nie',
      cancelButtonColor: '#adb5bd', 
      showConfirmButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Tak',
      reverseButtons: true
    })
    .then(
      (result) => {
        if (result.isConfirmed) {
          modulePlanService.deleteModulePlan(moduleKey, modulePlanId)

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Plan usunięty',
            timer: 1000,
            showConfirmButton: false,
            showCloseButton: false,
          }).then(() => {
            refreshPlans()
          })
        }
      }
    )
  }
  catch (error: any) {
    Swal.fire({
      title: 'Wystąpił błąd!',
      text: 'Spróbuj ponownie za chwilę.',
      icon: 'error',
      showConfirmButton: true,
    }).then(() => {
      errors = error.response.data.errors
      console.log(errors)
      console.log(error)
    })
  }
}
</script>

<style scope>
  w-10 { width: 10% }
</style>
