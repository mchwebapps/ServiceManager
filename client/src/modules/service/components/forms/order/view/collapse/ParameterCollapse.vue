<template>
  <div class="collapse" id="parameter-collapse-form">
    <div class="container-fluid p-0">
      <div class="row">
        <div class="col-12">
          <hr>
          <div class="d-flex justify-content-between pt-2">
            <div class="">
              <h4>Parametry</h4>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div
          class="col-12"
          :class="{ 'col-lg-6 col-xl-3': parameter.type !== ParameterTypes.TextArea }"
          v-for="parameter in parameters"
          :key="parameter.id"
        >
          <div class="mb-3" v-if="parameter.type == ParameterTypes.SingularSelection">
            <label class="form-label">{{ parameter.name }}:</label>
            <select class="form-select" autocomplete="off" v-model="parameter.value">
              <option
                v-for="value in parameter.values"
                :key="value.id"
                :value="value.id"
              >
                {{ value.text }}
              </option>
            </select>
          </div>
          <div class="mb-3" v-if="parameter.type == ParameterTypes.TextInput">
            <label class="form-label">{{ parameter.name }}:</label>
            <input class="form-control" autocomplete="off" v-model="parameter.value">
          </div>
          <div class="mb-3" v-if="parameter.type == ParameterTypes.Special">
            <label class="form-label">{{ parameter.name }}:</label>
            <input class="form-control" autocomplete="off" v-model="parameter.value">
          </div>
          <div class="mb-3" v-if="parameter.type == ParameterTypes.TextArea">
            <label class="form-label">{{ parameter.name }}:</label>
            <textarea class="form-control" rows="1" autocomplete="off" v-model="(parameter.value as string)"></textarea>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-end mb-2">
        <button class="btn btn-sm btn-outline-primary" data-bs-toggle="collapse" href="#parameter-collapse-form">Zamknij</button>
        <button class="btn btn-sm btn-primary ms-2">Zapisz</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { OrderViewDeviceParameterDTO } from "@/modules/service/api/dtos/order/view/OrderViewDeviceParameterDTO"

import { ParameterTypes } from "@/modules/service/store/enums/StoreEnums"

const props = defineProps({
  parameters: { type: Array<OrderViewDeviceParameterDTO>, required: true }
})

const parameters = ref<OrderViewDeviceParameterDTO[]>([])
parameters.value = props.parameters

</script>