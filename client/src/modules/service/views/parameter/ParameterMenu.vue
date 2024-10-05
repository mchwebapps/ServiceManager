<template>
  <div class="container mt-5 mb-3">
    <div class="row">
      <div class="col-12 mb-2">
        <h3 class="border-bottom pb-3">
          {{ title }} <small class="text-muted ms-1">{{ subtitle }}</small>
        </h3>
      </div>
    </div>
    <RouterLink
      :to="{ name: 'device-type-parameter-list' }"
      class="btn btn-outline-primary me-2"
      :class="{ 'active': parameterCategory == ParameterCategories.Device }"
      @click="activateButton()"
    >
      Typ urządzenia
    </RouterLink>
    <RouterLink
      :to="{ name: 'service-parameter-list' }"
      class="btn btn-outline-primary"
      :class="{ 'active': parameterCategory == ParameterCategories.Service }"
      @click="activateButton()"
    >
      Usługa
    </RouterLink>
    <hr>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ParameterCategories } from '@/modules/service/store/enums/StoreEnums'

defineProps({
  parameterCategory: { type: String, required: true },
  subtitle: { type: String, required: true }
})
const title = 'Lista parametrów'
const isDeviceTypeBtnActive = ref<boolean>(true)
const isServiceTypeBtnActive = ref<boolean>(false)

const activateButton = () => {
  isDeviceTypeBtnActive.value = !isDeviceTypeBtnActive.value
  isServiceTypeBtnActive.value = !isServiceTypeBtnActive.value
}

</script>