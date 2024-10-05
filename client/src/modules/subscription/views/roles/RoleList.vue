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
        <button
          class="btn btn-sm btn-success float-end my-3 ms-auto"
          data-bs-toggle="modal"
          data-bs-target="#CreateRoleModal"
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
              <tr v-if="moduleRoles.length === 0">
                <td colspan="3">
                  <div class="mb-5 pt-5 text-center text-primary">
                    <div class="spinner-border" role="status">
                      <span class="sr-only">Wczytywanie...</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr  v-for="moduleRole in moduleRoles" :key="moduleRole.id" v-else>
                <th scope="row">
                  {{ moduleRole.name }}
                  <span 
                    class="badge badge-primary ms-3"
                    v-if="!checkOrganizationId(moduleRole.organizationId)"
                  >
                    System
                  </span>
                </th>
                <td>{{ moduleRole.description }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#ViewRolePermissionsModal"
                    @click="getRole(moduleRole.id)"
                  >
                    Podgląd
                  </button>
                  <button
                    class="btn btn-sm btn-warning ms-1"
                    data-bs-toggle="modal"
                    data-bs-target="#EditRoleModal"
                    @click="getRole(moduleRole.id)"
                    v-if="checkOrganizationId(moduleRole.organizationId)"
                  >
                    Edytuj
                  </button><!--v-if="moduleRole.organizationId"-->
                  <button
                    class="btn btn-sm btn-danger ms-1"
                    @click="deleteRole(moduleKey, moduleRole.id)"
                    v-if="checkOrganizationId(moduleRole.organizationId)"
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

  <CreateRoleModal :moduleKey="moduleKey" @refresh="refreshRoles()" />
  <ViewRolePermissionsModal :moduleKey="moduleKey" :moduleRoleId="moduleRoleId" />
  <EditRoleModal :moduleKey="moduleKey" :moduleRoleId="moduleRoleId" @refresh="refreshRoles()" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import { useCurrentUser } from "@/store/user"
import Swal from "sweetalert2"

import type { ModuleRoleDTO } from "@/modules/subscription/api/dtos/ModuleRoleDTO"
import { ModuleDTO } from "@/modules/subscription/api/dtos/ModuleDTO"

import CreateRoleModal from "@/modules/subscription/components/modals/roles/CreateRoleModal.vue"
import ViewRolePermissionsModal from "@/modules/subscription/components/modals/roles/ViewRolePermissionsModal.vue"
import EditRoleModal from "@/modules/subscription/components/modals/roles/EditRoleModal.vue"

import { container } from "tsyringe"
import type { IModuleService } from "@/modules/subscription/api/services/ModuleService"
import type { IModuleRoleService } from "@/modules/subscription/api/services/ModuleRoleService"

const props = defineProps({
  // 'organizationId': { type: String, required: false }
})

const emits = defineEmits(['delete-role-success','delete-role-error'])

const cols = ['Rola', 'Opis', 'Akcje']
const view = { title: 'Lista ról' }

const route = useRoute()
const moduleKey = route.params.moduleKey as string
const module = ref<ModuleDTO>(new ModuleDTO)
const moduleRoles = ref<ModuleRoleDTO[]>([])
const moduleService = container.resolve('IModuleService') as IModuleService
const moduleRoleService = container.resolve('IModuleRoleService') as IModuleRoleService
// module.value = await moduleService.getModule(moduleKey)
// moduleRoles.value = await moduleRoleService.getModuleRoles(moduleKey)

if (moduleKey) {
  moduleService.getModule(moduleKey).then(c => module.value = c)
  moduleRoleService.getModuleRoles(moduleKey).then(c => moduleRoles.value = c)
}

const moduleRoleId = ref()
let errors = ref()

const refreshRoles = async () => {
  const refreshedRoles = await moduleRoleService.getModuleRoles(moduleKey)
  moduleRoles.value = refreshedRoles
}

const getRole = async (roleId: string) => {
  moduleRoleId.value = roleId
}

const checkOrganizationId = (id: string) => {
  // if (AuthService.hasRole("organization-owner")) {
  //   const organizationId = store.getters.getUserProfile?.organizationId;
  //   return organizationId === id;
  // }
  // else if (AuthService.hasRole("app-admin")) {
  //   return true;
  // }
  return true
}

const deleteRole = async (moduleKey: string, moduleRoleId: string) => {
  
  try {
    Swal.fire({
      icon: 'question',
      html: 'Czy na pewno chcesz usunąć tę rolę?',
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
          moduleRoleService.deleteModuleRole(moduleKey, moduleRoleId)

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Rola usunięta',
            timer: 1000,
            showConfirmButton: false,
            showCloseButton: false,
          }).then(() => {
            refreshRoles()
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


// watch(
//   () => route.params.moduleKey,
//   async () => {
//     moduleRoles.value = await moduleRoleService.getModuleRoles(moduleKey)
//     module.value = await moduleService.getModule(moduleKey)
//   },
//   { deep: true }
// )

// onMounted(async () => {      
//   moduleRoles.value = await moduleRoleService.getModuleRoles(moduleKey)
//   module.value = await moduleService.getModule(moduleKey)
// })
</script>
