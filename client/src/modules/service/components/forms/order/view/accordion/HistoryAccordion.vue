<template>
  <div class="list-group">
    <div
      class="w-100 pt-3 pb-2"
      :class="{ 'border-bottom': index !== orderHistory.length - 1 }"
      v-for="(item, index) in orderHistory" :key="item.id"
    >
      <h6 class="mb-1">
        <small class="badge text-bg-primary">{{ item.date }}</small>
        <span class="ms-2">
          {{ item.name }}
        </span>
      </h6>
      <p class="text-secondary mb-1" v-html="item.text"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { container } from "tsyringe"
import type { IOrderViewService } from "@/modules/service/api/services/order/OrderViewService"
import type { OrderViewHistoryDTO } from "@/modules/service/api/dtos/order/view/OrderViewHistoryDTO"

const props = defineProps({
  orderId: { type: Number, required: true }
})

const orderViewService = container.resolve('IOrderViewService') as IOrderViewService
const orderHistory = ref<OrderViewHistoryDTO[]>([])
orderHistory.value = await orderViewService.getOrderHistory(props.orderId)

</script>