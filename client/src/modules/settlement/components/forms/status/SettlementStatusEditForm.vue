<template>
  <div class="container">
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12">
        <h4 class="border-bottom mb-3 pb-3">Nazwa</h4>
      </div>
      <div class="col-12 mb-3">
        <input type="text" class="form-control" placeholder="Wpisz nazwę usługi" v-model="statusEdit.name" autocomplete="off">
      </div>
    </div>
    <hr>
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12">
        <h4 class="border-bottom mb-3 pb-3">E-mail</h4>
      </div>
      <div class="col-12 mb-3">
        <textarea
          class="form-control h-150 min-h-150 max-h-300"
          placeholder="Wpisz wiadomość e-mail, która zostanie wysłana do klienta po zmianie statusu"
          autocomplete="off"
          v-model="statusEdit.emailMessage"
        ></textarea>
      </div>
    </div>
    <hr>
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12">
        <h4 class="border-bottom mb-3 pb-3">SMS</h4>
      </div>
      <div class="col-12 mb-3">
        <textarea
          class="form-control h-150 min-h-150 max-h-300"
          placeholder="Wpisz wiadomość SMS, która zostanie wysłana do klienta po zmianie statusu"
          autocomplete="off"
          v-model="statusEdit.smsMessage"
        ></textarea>
      </div>
    </div>
    <hr>
    <div class="d-flex justify-content-between mb-5">
      <RouterLink :to="{ name: 'settlement-status-list' }" class="btn btn-secondary">Zamknij</RouterLink>
      <button class="btn btn-warning" @click="updateStatus()" :disabled="submitBtnLock">Zapisz</button>
    </div>
    <AppErrorItems :errors="validationErrors"></AppErrorItems>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import Swal from "sweetalert2"

import { container } from "tsyringe"
import type { ISettlementStatusService } from "@/modules/settlement/api/services/status/SettlementStatusService"
import { SettlementStatusDTO } from "@/modules/settlement/api/dtos/status/SettlementStatusDTO"

import ValidationError from "@/core/errors/ValidationError"
import AppErrorItems from "@/components/AppErrorItems.vue"

const props = defineProps({
  status: { type: SettlementStatusDTO, required: true }
})
const router = useRouter()
const statusEdit = ref<SettlementStatusDTO>({...props.status})
const statusService = container.resolve('ISettlementStatusService') as ISettlementStatusService

const submitBtnLock = ref(false)
let validationErrors = ref<{key: string, errorMessage: string}[]>([])

const updateStatus = async () => {
  try {
    submitBtnLock.value = true
    validationErrors.value = []

    await statusService.updateStatus(props.status.id, statusEdit.value)

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Status zapisany',
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false,
    }).then(() => {
      router.push('/settlement/statuses')
      submitBtnLock.value = false
      statusEdit.value = new SettlementStatusDTO
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

<style scoped>
.h-150 { height: 150px }
.min-h-150 { min-height: 150px }
.max-h-300 { max-height: 300px }
</style>