<template>
  <div class="">
    <!-- <label for="exampleFormControlTextarea1" class="form-label">Example textarea</label> -->
    <textarea class="form-control" id="exampleFormControlTextarea1" rows="1"></textarea>
    <div class="d-flex justify-content-between my-2">
      <div class="pt-1">
        <small>Załączniki: <b>0</b></small>
      </div>
      <div class="ms-auto">
        <i class="bi bi-film text-secondary" role="button"></i>
        <i class="bi bi-image text-secondary ms-2" role="button"></i>
        <i class="bi bi-camera text-secondary ms-2" role="button"></i>
        <button type="button" class="btn btn-sm btn-primary ms-3">Dodaj</button>
      </div>
    </div>
  </div>
  <div class="list-group">
    <div
      class="w-100 border-top pt-3 pb-2"
      v-for="(item, index) in orderNotes" :key="item.id"
    >
      <h6 class="mb-1">
        <small class="badge text-bg-primary">{{ item.date }}</small>
        <span class="ms-2">
          {{ item.author }}
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
import type { OrderViewNoteDTO } from "@/modules/service/api/dtos/order/view/OrderViewNoteDTO"

const props = defineProps({
  orderId: { type: Number, required: true }
})

const orderViewService = container.resolve('IOrderViewService') as IOrderViewService
const orderNotes = ref<OrderViewNoteDTO[]>([])
orderNotes.value = await orderViewService.getOrderNotes(props.orderId)

</script>