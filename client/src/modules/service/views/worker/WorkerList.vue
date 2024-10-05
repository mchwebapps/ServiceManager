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
        <RouterLink :to="{ name: 'worker-create'}" class="btn btn-sm btn-primary float-end my-3 ms-auto">Dodaj</RouterLink>
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
              <tr v-for="worker in workers" :key="worker.id">
                <td>
                  <RouterLink :to="{ name: 'worker-view', params: { id: worker.id } }" class="text-decoration-none">
                    {{ worker.firstName }} {{ worker.lastName }}
                  </RouterLink>
                </td>
                <td>{{ worker.workPosition }}</td>
                <td>{{ worker.contractSince }}</td>
                <td>{{ worker.contractTo || 'czas nieokreślony' }}</td>
                <td>{{ String(worker.salaryNoTax).replace('.', ',') }} zł</td>
                <td>{{ String(worker.salaryWithTax).replace('.', ',') }} zł</td>
                <td>
                  <button
                    class="btn btn-sm btn-danger ms-1"
                    @click="deleteWorker(worker.id)"
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
import type { IWorkerService } from "@/modules/service/api/services/worker/WorkerService"
import type { WorkerDTO } from "@/modules/service/api/dtos/worker/WorkerDTO"

const title = 'Lista pracowników'
const cols = ['Imię i nazwisko', 'Stanowisko', 'Zatrudniony od', 'Umowa do', 'Pensja netto', 'Pensja brutto', 'Akcje']

const workerService = container.resolve('IWorkerService') as IWorkerService
const workers = ref<WorkerDTO[]>([])
workers.value = await workerService.getWorkers()

const refreshWorkers= async () => {
  workers.value = await workerService.getWorkers()
}

const deleteWorker = (workerId: number) => {
  try {
    Swal.fire({
      icon: 'question',
      html: 'Czy na pewno chcesz usunąć tego pracownika?',
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
          await workerService.deleteWorker(workerId)

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Pracownik usunięty',
            timer: 1000,
            showConfirmButton: false,
            showCloseButton: false,
          }).then(() => {
            refreshWorkers()
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