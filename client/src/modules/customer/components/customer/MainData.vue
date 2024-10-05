<template>
  <div class="row bg-primary bg-opacity-10 border rounded mt-2 mx-0 mb-4 p-2">
    <div class="col-12">
      <ul class="list-group list-group-flush border rounded my-2">
        <li class="list-group-item py-1">
          Rodzaj klienta: <b class="ms-1">{{ CustomerTypeHelper.getCustomerTypeName(customer?.customerType as CustomerTypes) }}</b>
        </li>
        <li class="list-group-item py-1">
          NIP: <b class="ms-1">{{ customer?.taxNumber || '-' }}</b>
        </li>
      </ul>
    </div>
  </div>
  <hr class="my-3">
</template>

<script setup lang="ts">
import { CustomerDTO } from '@/modules/customer/api/dtos/CustomerDTO'
import { CustomerTypeHelper } from '@/modules/customer/api/helpers/CustomerTypeHelper'
import type { CustomerTypes } from '@/modules/customer/store/enums/StoreEnums'

defineProps({ 
  'customer': { type: CustomerDTO, requred: true }
})
</script>