<template>
  <div class="container">
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12">
        <h4 class="border-bottom mb-3 pb-3">Nazwa</h4>
      </div>
      <div class="col-12 mb-3">
        <input type="text" class="form-control" placeholder="Wpisz nazwę oddziału" v-model="department.name" autocomplete="off">
      </div>
    </div>
    <hr />
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12 mb-3">
        <label for="companyName" class="form-label">Firma:</label>
        <input type="text" class="form-control" id="companyName" placeholder="Wpisz nazwę firmy" v-model="department.companyName">
      </div>
      <div class="col-12 col-lg-6 col-xl-3 mb-3">
        <label for="firstName" class="form-label">Imię:</label>
        <input type="text" class="form-control" id="firstName" placeholder="Wpisz imię" v-model="department.firstName">
      </div>
      <div class="col-12 col-lg-6 col-xl-3 mb-3">
        <label for="lastName" class="form-label">Nazwisko:</label>
        <input type="text" class="form-control" id="lastName" placeholder="Wpisz nazwisko" v-model="department.lastName">
      </div>
      <div class="col-12 col-lg-6 col-xl-3 mb-3">
        <label for="phone" class="form-label">Nr telefonu:</label>
        <input type="text" class="form-control" id="phone" placeholder="Wpisz numer telefonu" v-model="department.phoneNumber">
      </div>
      <div class="col-12 col-lg-6 col-xl-3 mb-3">
        <label for="email" class="form-label">E-Mail:</label>
        <input type="text" class="form-control" id="email" placeholder="Wpisz adres mailowy" v-model="department.email">
      </div>
      <div class="col-12 col-xl-6 mb-3">
        <label for="companyStreet" class="form-label">Ulica:</label>
        <div class="input-group">
          <span class="input-group-text">ul.</span>
          <input type="text" class="form-control" id="companyStreet" placeholder="Wpisz nazwę ulicy" v-model="department.street">
        </div>
      </div>
      <div class="col-12 col-lg-6 col-xl-3 mb-3">
        <label for="companyBuildingNo" class="form-label">Nr budynku:</label>
        <input type="text" class="form-control" id="companyBuildingNo" placeholder="Wpisz nr budynku/domu" v-model="department.houseNo">
      </div>
      <div class="col-12 col-lg-6 col-xl-3 mb-3">
        <label for="companyHouseNo" class="form-label">Nr lokalu:</label>
        <input type="text" class="form-control" id="companyHouseNo" placeholder="Wpisz nr lokalu/mieszkania" v-model="department.flatNo">
      </div>
      <div class="col-12 col-lg-4 col-xl-4 mb-3">
        <label for="companyPostcode" class="form-label">Kod pocztowy:</label>
        <input type="text" class="form-control" id="companyPostcode" placeholder="Wpisz kod pocztowy" v-model="department.postCode">
      </div>
      <div class="col-12 col-lg-4 col-xl-4 mb-3">
        <label for="companyCity" class="form-label">Miejscowość:</label>
        <input type="text" class="form-control" id="companyCity" placeholder="Wpisz nazwę miejscowości" v-model="department.city">
      </div>
      <div class="col-12 col-lg-4 col-xl-4 mb-3">
        <label for="companyCountry" class="form-label">Kraj:</label>
        <input type="text" class="form-control" id="companyCountry" placeholder="Wpisz nazwę kraju" v-model="department.country">
      </div>
    </div>
    <hr />
    <div class="d-flex justify-content-between mb-5">
      <RouterLink :to="{ name: 'management-global-department-list' }" class="btn btn-secondary">Zamknij</RouterLink>
      <button class="btn btn-primary" @click="createDepartment()" :disabled="submitBtnLock">Dodaj</button>
    </div>
    <AppErrorItems :errors="validationErrors"></AppErrorItems>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import Swal from "sweetalert2"

import { container } from "tsyringe"
import type { IDepartmentService } from "@/modules/management/api/services/department/DepartmentService"
import { DepartmentDTO } from "@/modules/management/api/dtos/department/DepartmentDTO"

import ValidationError from "@/core/errors/ValidationError"
import AppErrorItems from "@/components/AppErrorItems.vue"

const router = useRouter()
const departmentService = container.resolve('IDepartmentService') as IDepartmentService
const department = ref<DepartmentDTO>(new DepartmentDTO())

const submitBtnLock = ref(false)
let validationErrors = ref<{key: string, errorMessage: string}[]>([])

const createDepartment = async () => {
  try {
    submitBtnLock.value = true
    validationErrors.value = []

    await departmentService.createDepartment(department.value as DepartmentDTO)

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Oddział utworzony',
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false,
    }).then(() => {
      router.push('/management/global/department')
      submitBtnLock.value = false
      department.value = new DepartmentDTO
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