<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          {{ title }}
        </h3>
      </div>
    </div>
    <div class="row justify-content-between">
      <div class="col-10 col-md-8 col-lg-4">
        <input type="text" class="form-control form-control-sm my-3" placeholder="Wyszukaj">
      </div>
      <div class="col-2 col-md-4 col-lg-4">
        <RouterLink :to="{ name: 'service-status-create'}" class="btn btn-sm btn-primary float-end my-3 ms-auto">Dodaj</RouterLink>
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
              <tr v-for="(status, index) in statuses" :key="index">
                <td>
                  <RouterLink :to="{ name: 'service-status-view', params: { id: status.id } }" class="text-decoration-none">
                    {{ status.name }}
                  </RouterLink>
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-sm me-2"
                    :class="(index == statuses.length-1) ? 'btn-secondary' : 'btn-primary'"
                    @click="moveDown(status, index)"
                    :disabled="index == statuses.length-1"
                  >
                    <i class="bi bi-arrow-down"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm"
                    :class="(index == 0) ? 'btn-secondary' : 'btn-primary'"
                    @click="moveUp(status, index)"
                    :disabled="index == 0"
                  >
                    <i class="bi bi-arrow-up"></i>
                  </button>
                  <!-- {{ status.order }} {{ index + 1 }} -->
                </td>
                <td>
                  <button
                    type="button" 
                    class="btn btn-sm btn-danger"
                    @click="deleteStatus(status.id)"
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot v-if="JSON.stringify(statuses) !== JSON.stringify(statusesOriginal)">
              <tr>
                 <td></td>
                 <td>
                  <button 
                    type="button"
                    class="btn btn-sm btn-primary"
                  >
                    Zapisz kolejność
                  </button>
                 </td>
                 <td></td>
              </tr>
            </tfoot>
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
  
</template>

<script setup lang="ts">
import { ref } from "vue"
import Swal from "sweetalert2"
import { container } from "tsyringe"
import type { IServiceStatusService } from "@/modules/service/api/services/status/ServiceStatusService"
import type { ServiceStatusDTO } from "@/modules/service/api/dtos/status/ServiceStatusDTO"

const title = 'Lista statusów'
const cols = ['Usługa', 'Kolejność', 'Akcje']

const statusService = container.resolve('IServiceStatusService') as IServiceStatusService
const statuses = ref<ServiceStatusDTO[]>([])
const statusesOriginal = ref<ServiceStatusDTO[]>([])

statuses.value = await statusService.getStatuses()
statusesOriginal.value = await statusService.getStatuses()

// statuses.value.sort((a, b) => a.order - b.order)

const moveDown = (item: ServiceStatusDTO, index: number) => {
      
      let tmp = item // save clicked item in temporary variable
      
      statuses.value[index] = statuses.value[index + 1] // move the following item to the clicked element
      
      statuses.value[index + 1] = tmp // move clicked item to destination
    }
const moveUp = (item: ServiceStatusDTO, index: number) => {
       
  let tmp = item // save clicked item in temporary variable
  
  statuses.value[index] = statuses.value[index - 1] // move the following item to the clicked element
  
  statuses.value[index - 1] = tmp // move clicked item to destination 
}


const refreshStatuses = async () => {
  statuses.value = await statusService.getStatuses()
}

const deleteStatus = (statusId: number) => {
  try {
    Swal.fire({
      icon: 'question',
      html: 'Czy na pewno chcesz usunąć ten status?',
      showCancelButton: true,
      cancelButtonText: 'Nie',
      cancelButtonColor: '#adb5bd', 
      showConfirmButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Tak',
      reverseButtons: true
    })
    .then(
      async (result) => {
        if (result.isConfirmed) {
          await statusService.deleteStatus(statusId)

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Status usunięty',
            timer: 1000,
            showConfirmButton: false,
            showCloseButton: false,
          }).then(() => {
            refreshStatuses()
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
      console.log(error)
    })
  }
}

</script>