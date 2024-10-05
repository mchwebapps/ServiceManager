<template>
  <div class="container mt-5 mb-2">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          {{ title }} <small class="text-muted ms-1">{{ shippingMethod.name }}</small>
        </h3>
      </div>
    </div>
  </div>
  <ShippingMethodEditForm :shippingMethod="shippingMethod" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import { container } from "tsyringe"
import type { IShippingMethodService } from "@/modules/management/api/services/shipping-method/ShippingMethodService"
import  { ShippingMethodDTO } from "@/modules/management/api/dtos/shipping-method/ShippingMethodDTO"
import ShippingMethodEditForm from "@/modules/management/components/forms/shipping-method/ShippingMethodEditForm.vue"

const title = 'Sposób wysyłki'
const route = useRoute()
const shippingMethodId = Number(route.params.id)
const shippingMethodService = container.resolve('IShippingMethodService') as IShippingMethodService
const shippingMethod = ref<ShippingMethodDTO>(new ShippingMethodDTO)
shippingMethod.value = await shippingMethodService.getShippingMethod(shippingMethodId)

</script>
