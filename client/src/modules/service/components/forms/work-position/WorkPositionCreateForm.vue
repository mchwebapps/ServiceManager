<template>
  <div class="container">
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12">
        <h4 class="border-bottom mb-3 pb-3">Nazwa</h4>
      </div>
      <div class="col-12 mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Wpisz nazwę stanowiska"
          autocomplete="off"
          v-model="workPosition.name"
        >
      </div>
    </div>
    <hr>
    <div class="d-flex justify-content-between mb-5">
      <RouterLink :to="{ name: 'work-position-list' }" class="btn btn-secondary">Zamknij</RouterLink>
      <button class="btn btn-primary" @click="createWorkPosition()" :disabled="submitBtnLock">Dodaj</button>
    </div>
    <AppErrorItems :errors="validationErrors"></AppErrorItems>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import Swal from "sweetalert2"

import { container } from "tsyringe"
import type { IWorkPositionService } from "@/modules/service/api/services/work-position/WorkPositionService"
import { WorkPositionDTO } from "@/modules/service/api/dtos/work-position/WorkPositionDTO"

import ValidationError from "@/core/errors/ValidationError"
import AppErrorItems from "@/components/AppErrorItems.vue"

const router = useRouter()
const workPositionService = container.resolve('IWorkPositionService') as IWorkPositionService
const workPosition = ref<WorkPositionDTO>(new WorkPositionDTO())

const submitBtnLock = ref(false)
let validationErrors = ref<{key: string, errorMessage: string}[]>([])
  
const createWorkPosition = async () => {
  try {
    submitBtnLock.value = true
    validationErrors.value = []

    await workPositionService.createWorkPosition(workPosition.value as WorkPositionDTO)

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Stanowisko utworzone',
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false,
    }).then(() => {
      router.push('/service/work-positions')
      submitBtnLock.value = false
      workPosition.value = new WorkPositionDTO
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