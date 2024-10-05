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
        <RouterLink :to="{ name: 'settlement-status-create'}" class="btn btn-sm btn-primary float-end my-3 ms-auto">Dodaj</RouterLink>
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
              <tr v-for="status in statuses" :key="status.id">
                <td>
                  <RouterLink :to="{ name: 'settlement-status-view', params: { id: status.id } }" class="text-decoration-none">
                    {{ status.name }}
                  </RouterLink>
                </td>
                <td>
                  <button
                    class="btn btn-sm btn-danger ms-1"
                    @click="deleteStatus(status.id)"
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
  
</template>

<script setup lang="ts">
import { ref } from "vue"
import Swal from "sweetalert2"
import { container } from "tsyringe"
import type { ISettlementStatusService } from "@/modules/settlement/api/services/status/SettlementStatusService"
import type { SettlementStatusDTO } from "@/modules/settlement/api/dtos/status/SettlementStatusDTO"

const title = 'Lista statusów'
const cols = ['Usługa', 'Akcje']

const statusService = container.resolve('ISettlementStatusService') as ISettlementStatusService
const statuses = ref<SettlementStatusDTO[]>([])
statuses.value = await statusService.getStatuses()

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