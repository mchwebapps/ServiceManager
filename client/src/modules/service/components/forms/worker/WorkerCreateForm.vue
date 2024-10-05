<template>
  <div class="container">
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12 col-xl-4 mb-3">
        <label class="form-label">Imię:</label>
        <input
          type="text"
          class="form-control"
          placeholder="Wpisz imię" 
          autocomplete="off"
          v-model="worker.firstName"
        >
      </div>
      <div class="col-12 col-xl-4 mb-3">
        <label class="form-label">Nazwisko:</label>
        <input
          type="text"
          class="form-control"
          placeholder="Wpisz nazwisko" 
          autocomplete="off"
          v-model="worker.lastName"
        >
      </div>
      <div class="col-12 col-xl-4 mb-3">
        <label class="form-label">Stanowisko:</label>
        <select
          class="form-select"
          autocomplete="off"
          v-model="worker.workPositionId"
        >
          <option value="0">Wybierz</option>
          <option
            v-for="workPosition in workPositions"
            :key="workPosition.id"
            :value="workPosition.id"
          >
            {{ workPosition.name }}
          </option>
        </select>
      </div>
    </div>
    <hr>
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12 col-xl-4 mb-3">
        <label class="form-label">Zatrudniony od:</label>
        <input
          type="date"
          class="form-control"
          autocomplete="off"
          v-model="worker.contractSince"
        >
      </div>
      <div class="col-12 col-xl-4 mb-3">
        <label class="form-label">Umowa do:</label>
        <input
          type="date"
          class="form-control"
          autocomplete="off"
          v-model="worker.contractTo"
          :disabled="worker.contractNoTerm"
        >
      </div>
      <div class="col-12 col-xl-4 mb-3">
        <label class="form-label">Na czas nieokreślony:</label>
        <div class="form-check mt-1">
          <input class="form-check-input" type="checkbox" v-model="worker.contractNoTerm">
        </div>
      </div>
    </div>
    <hr>
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12 col-xl-4 mb-3">
        <label class="form-label">Pensja netto:</label>
        <input
          type="number"
          class="form-control"
          autocomplete="off"
          v-model="worker.salaryNoTax"
        >
      </div>
      <div class="col-12 col-xl-4 mb-3">
        <label class="form-label">Pensja brutto:</label>
        <input
          type="number"
          class="form-control"
          autocomplete="off"
          v-model="worker.salaryWithTax"
        >
      </div>
    </div>
    <hr>
    <div class="d-flex justify-content-between mb-5">
      <RouterLink :to="{ name: 'worker-list' }" class="btn btn-secondary">Zamknij</RouterLink>
      <button class="btn btn-primary" @click="createWorker()" :disabled="submitBtnLock">Dodaj</button>
    </div>
    <AppErrorItems :errors="validationErrors"></AppErrorItems>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import Swal from "sweetalert2"

import { container } from "tsyringe"
import type { IWorkerService } from "@/modules/service/api/services/worker/WorkerService"
import type { IWorkPositionService } from "@/modules/service/api/services/work-position/WorkPositionService"
import { WorkerDTO } from "@/modules/service/api/dtos/worker/WorkerDTO"
import type { WorkPositionDTO } from "@/modules/service/api/dtos/work-position/WorkPositionDTO"

import ValidationError from "@/core/errors/ValidationError"
import AppErrorItems from "@/components/AppErrorItems.vue"

const router = useRouter()
const workerService = container.resolve('IWorkerService') as IWorkerService
const workPositionService = container.resolve('IWorkPositionService') as IWorkPositionService
const worker = ref<WorkerDTO>(new WorkerDTO)
const workPositions = ref<WorkPositionDTO[]>([])
workPositions.value = await workPositionService.getWorkPositions()

worker.value.workPositionId = 0
const submitBtnLock = ref(false)
let validationErrors = ref<{key: string, errorMessage: string}[]>([])
  
const createWorker = async () => {
  try {
    submitBtnLock.value = true
    validationErrors.value = []

    await workerService.createWorker(worker.value as WorkerDTO)

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Pracownik utworzony',
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false,
    }).then(() => {
      router.push('/service/workers')
      submitBtnLock.value = false
      worker.value = new WorkerDTO
    })
  }
  catch (error: any) {
    if (error instanceof ValidationError) {
      validationErrors.value = Object.keys(error.Errors).map(key => {
        const arr = error.Errors[key] as []
        return { key,errorMessage:arr.join(',') }
      })
      submitBtnLock.value = false
      return
    }
    Swal.fire({
      title: 'Błąd serwera!',
      html: 'Sprawdź szczegółowe komunikaty lub odśwież stronę i spróbuj ponownie.',
      icon: 'error',
      showConfirmButton: true,
    }).then(() => {
      submitBtnLock.value = false
    })
  }
}
</script>