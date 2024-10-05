<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom mb-3 pb-3">
          {{ view.title }} <small class="text-muted ms-1">{{ view.subtitle }}</small>
        </h3>
      </div>
    </div>
  </div>
  <DeviceTypeParameterCreateForm :parameterCategory="parameterCategory" />
</template>

<script setup lang="ts">
import DeviceTypeParameterCreateForm from "@/modules/service/components/forms/parameter/device-type/DeviceTypeParameterCreateForm.vue"
import { ParameterCategories } from "@/modules/service/store/enums/StoreEnums"
import { ParameterCategoryHelper } from "@/modules/service/api/helpers/ParameterHelper"

defineProps({
  parameterCategory: { type: String, required: true }
})
const view = {
  title: 'Nowy parametr',
  subtitle: ParameterCategoryHelper.getParameterCategoryName(ParameterCategories.Device)
}

</script>