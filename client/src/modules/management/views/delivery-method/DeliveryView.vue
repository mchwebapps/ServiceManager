<template>
  <div class="container mt-5 mb-2">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          {{ title }} <small class="text-muted ms-1">{{ deliveryMethod.name }}</small>
        </h3>
      </div>
    </div>
  </div>
  <DeliveryMethodEditForm :deliveryMethod="deliveryMethod" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import { container } from "tsyringe"
import type { IDeliveryMethodService } from "@/modules/management/api/services/delivery-method/DeliveryMethodService"
import  { DeliveryMethodDTO } from "@/modules/management/api/dtos/delivery-method/DeliveryMethodDTO"
import DeliveryMethodEditForm from "@/modules/management/components/forms/delivery-method/DeliveryMethodEditForm.vue"

const title = 'Sposób dostawy'
const route = useRoute()
const deliveryMethodId = Number(route.params.id)
const deliveryMethodService = container.resolve('IDeliveryMethodService') as IDeliveryMethodService
const deliveryMethod = ref<DeliveryMethodDTO>(new DeliveryMethodDTO)
  deliveryMethod.value = await deliveryMethodService.getDeliveryMethod(deliveryMethodId)

</script>
