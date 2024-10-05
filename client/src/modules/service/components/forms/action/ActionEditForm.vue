<template>
  <div class="container">
    <div class="row align-bottom bg-light border rounded m-0 mb-3 py-3 px-2">
      <div class="col mb-3">
        <label class="form-label">Nazwa czynności:</label>
        <input
          type="text"
          class="form-control"
          placeholder="Wpisz nazwę czynności" 
          autocomplete="off"
          v-model="action.name"
        >
      </div>
      <div class="col mb-3">
        <label class="form-label">Stawka domyślna:</label>
        <div class="input-group">
          <input
            type="number"
            class="form-control"
            placeholder="Wpisz stawkę"
            autocomplete="off"
            v-model="action.defaultRate"
          >
          <span class="input-group-text">zł</span>
        </div>
      </div>
    </div>
    <hr>
    <div class="d-flex justify-content-between mb-5">
      <RouterLink :to="{ name: 'action-list' }" class="btn btn-secondary">Zamknij</RouterLink>
      <button class="btn btn-warning" @click="updateAction()" :disabled="submitBtnLock">Zapisz</button>
    </div>
    <AppErrorItems :errors="validationErrors" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import Swal from "sweetalert2"

import { container } from "tsyringe"
import type { IActionService } from "@/modules/service/api/services/action/ActionService"
import { ActionDTO } from "@/modules/service/api/dtos/action/ActionDTO"

import ValidationError from "@/core/errors/ValidationError"
import AppErrorItems from "@/components/AppErrorItems.vue"

const props = defineProps({
  actionId: { type: Number, required: true}
})
const router = useRouter()

const actionService = container.resolve('IActionService') as IActionService
const action = ref<ActionDTO>(new ActionDTO)
action.value = await actionService.getAction(props.actionId)

const submitBtnLock = ref(false)
let validationErrors = ref<{key: string, errorMessage: string}[]>([])

const updateAction = async () => {
  try {
    submitBtnLock.value = true
    validationErrors.value = []

    await actionService.updateAction(
      props.actionId as number,
      action.value as ActionDTO
    )

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Czynność zapisana',
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false,
    }).then(() => {
      action.value = new ActionDTO
      submitBtnLock.value = false
      router.push('/service/actions')
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