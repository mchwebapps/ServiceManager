<template>
  <ParameterMenu :parameterCategory="parameterCategory" :subtitle="subtitle" />
  <div class="container">
    <div class="row justify-content-between">
      <div class="col-10 col-md-8 col-lg-4">
        <input type="text" class="form-control form-control-sm my-3" placeholder="Wyszukaj">
      </div>
      <div class="col-2 col-md-4 col-lg-4">
        <RouterLink :to="{ name: 'device-type-parameter-create' }" class="btn btn-sm btn-primary float-end my-3 ms-auto">Dodaj</RouterLink>
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
              <tr v-for="parameter in parameters" :key="parameter.id">
                <td>
                  <RouterLink :to="{ name: 'device-type-parameter-view', params: { id: parameter.id } }" class="text-decoration-none">
                    {{ parameter.name }}
                  </RouterLink>
                </td>
                <td>{{ parameter.alias }}</td>
                <td>{{ ParameterTypeHelper.getParameterTypeName(parameter.type) }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-danger ms-1"
                    @click="deleteParameters(parameter.id)"
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
import type { IParameterService } from "@/modules/service/api/services/parameter/ParameterService"
import type { ParameterListDTO } from "@/modules/service/api/dtos/parameter/ParameterListDTO"
import { ParameterCategories } from "@/modules/service/store/enums/StoreEnums"
import { ParameterCategoryHelper, ParameterTypeHelper } from "@/modules/service/api/helpers/ParameterHelper"

import type { IParameterValueService } from "@/modules/service/api/services/parameter-value/ParameterValueService"

import ParameterMenu from "@/modules/service/views/parameter/ParameterMenu.vue"

const props = defineProps({
  parameterCategory: { type: String, required: true }
})
const cols = ['Nazwa', 'Alias', 'Rodzaj', 'Akcje']
const subtitle = ParameterCategoryHelper.getParameterCategoryName(ParameterCategories.Device)

const parameterService = container.resolve('IParameterService') as IParameterService
const parameterValueService = container.resolve('IParameterValueService') as IParameterValueService
const parameters = ref<ParameterListDTO[]>([])
parameters.value = await parameterService.getParameters(props.parameterCategory)

const refreshParameters = async () => {
  parameters.value = await parameterService.getParameters(props.parameterCategory)
}

const deleteParameters = (parameterId: number) => {
  try {
    Swal.fire({
      icon: 'question',
      html: 'Czy na pewno chcesz usunąć ten parametr?',
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
          await parameterService.deleteParameter(parameterId)
          await parameterValueService.deleteParameterValues(parameterId)

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Parametr usunięty',
            timer: 1000,
            showConfirmButton: false,
            showCloseButton: false,
          }).then(() => {
            refreshParameters()
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