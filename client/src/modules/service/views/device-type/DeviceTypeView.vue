<template>
  <div class="container mt-5 mb-2">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          {{ title }} <small class="text-muted ms-1">{{ deviceType.name }}</small>
        </h3>
      </div>
    </div>
  </div>
  <DeviceTypeEditForm :deviceTypeId="deviceTypeId" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import { container } from "tsyringe"
import type { IDeviceTypeService } from "@/modules/service/api/services/device-type/DeviceTypeService"
import  { DeviceTypeDTO } from "@/modules/service/api/dtos/device-type/DeviceTypeDTO"
import DeviceTypeEditForm from "@/modules/service/components/forms/device-type/DeviceTypeEditForm.vue"

const title = 'Typ urządzenia'
const route = useRoute()
const deviceTypeId = Number(route.params.id)
const deviceTypeService = container.resolve('IDeviceTypeService') as IDeviceTypeService
const deviceType = ref<DeviceTypeDTO>(new DeviceTypeDTO)
deviceType.value = await deviceTypeService.getDeviceType(deviceTypeId)

</script>

<style scope>
.w-5 { width: 5% }
.w-20 { width: 20% }
.w-33 { width: 33.333333% }
</style>
