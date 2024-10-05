<template>
  <div class="container">
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12">
        <h4 class="border-bottom mb-3 pb-3">Nazwa</h4>
      </div>
      <div class="col-12 mb-3">
        <input type="text" class="form-control" placeholder="Wpisz nazwę sposobu dostawy" v-model="deliveryMethod.name" autocomplete="off">
      </div>
    </div>
    <hr>
    <div class="d-flex justify-content-between mb-5">
      <RouterLink :to="{ name: 'management-global-delivery-list' }" class="btn btn-secondary">Zamknij</RouterLink>
      <button class="btn btn-primary" @click="createDeliveryMethod()" :disabled="submitBtnLock">Dodaj</button>
    </div>
    <AppErrorItems :errors="validationErrors"></AppErrorItems>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import Swal from "sweetalert2"

import { container } from "tsyringe"
import type { IDeliveryMethodService } from "@/modules/management/api/services/delivery-method/DeliveryMethodService"
import { DeliveryMethodDTO } from "@/modules/management/api/dtos/delivery-method/DeliveryMethodDTO"

import ValidationError from "@/core/errors/ValidationError"
import AppErrorItems from "@/components/AppErrorItems.vue"

const router = useRouter()
const deliveryMethodService = container.resolve('IDeliveryMethodService') as IDeliveryMethodService
const deliveryMethod = ref<DeliveryMethodDTO>(new DeliveryMethodDTO())

const submitBtnLock = ref(false)
let validationErrors = ref<{key: string, errorMessage: string}[]>([])

const createDeliveryMethod = async () => {
  try {
    submitBtnLock.value = true
    validationErrors.value = []

    await deliveryMethodService.createDeliveryMethod(deliveryMethod.value as DeliveryMethodDTO)

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Sposób dostawy utworzony',
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false,
    }).then(() => {
      router.push('/management/global/delivery')
      submitBtnLock.value = false
      deliveryMethod.value = new DeliveryMethodDTO
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