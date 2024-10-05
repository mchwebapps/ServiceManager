<template>
  <div class="container" id="business-client-form">
    <div class="d-flex">
      <button class="btn btn-sm btn-success" @click="addInputs()"><i class="bi bi-plus"></i> Dodaj czynność</button>
    </div>
    <hr>
    <div class="row align-bottom bg-light border rounded m-0 mb-3 py-3 px-2" v-for="(input, index) in inputs" :key="index">
      <div class="col-12 col-lg-6 mb-3">
        <label class="form-label">Nazwa czynności:</label>
        <input type="text" ref="action" class="form-control" placeholder="Wpisz nazwę czynności" v-model="input.name" autocomplete="off">
      </div>
      <div class="col-12 col-lg-6 mb-3">
        <label class="form-label">Stawka domyślna:</label>
        <div class="input-group">
          <input type="number" class="form-control" placeholder="Wpisz stawkę" v-model="input.defaultRate" autocomplete="off">
          <span class="input-group-text">zł</span>
        </div>
      </div>
      <div>
        <button class="btn btn-sm btn-danger" @click="removeInputs(index)" v-show="index || !index && inputs.length > 1">Usuń</button>
        <button class="btn btn-sm btn-warning ms-2" @click="clearInputs(index)" v-show="index || !index && inputs.length > 1">Wyczyść</button>
      </div>
    </div>
    <hr>
    <div class="d-flex justify-content-between mb-5">
      <RouterLink :to="{ name: 'action-list' }" class="btn btn-secondary">Zamknij</RouterLink>
      <button class="btn btn-primary" @click="createAction()" :disabled="submitBtnLock">Dodaj</button>
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
import type { ActionDTO } from "@/modules/service/api/dtos/action/ActionDTO"

import ValidationError from "@/core/errors/ValidationError"
import AppErrorItems from "@/components/AppErrorItems.vue"

const router = useRouter()
const action = ref<HTMLInputElement[]>([])
const inputs = ref<ActionDTO[]>([{ id: 0, name: '', defaultRate: 0 }])

const actionService = container.resolve('IActionService') as IActionService
const actions = ref<ActionDTO[]>([])

const submitBtnLock = ref(false)
let validationErrors = ref<{key: string, errorMessage: string}[]>([])

const addInputs = () => {
  inputs.value.unshift({ id: 0, name: '', defaultRate: 0 })
  action.value[0].focus()
}
const removeInputs = (index: number) => { inputs.value.splice(index, 1) }
const clearInputs = (index: number) => {
  inputs.value[index].name = ''
  inputs.value[index].defaultRate = 0
  action.value[index].focus()
}
const createAction = async () => {
  try {
    submitBtnLock.value = true
    validationErrors.value = []

    await actionService.createActions(
      inputs.value as ActionDTO[]
    )

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Czynności utworzone',
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false,
    }).then(() => {
      actions.value = []
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