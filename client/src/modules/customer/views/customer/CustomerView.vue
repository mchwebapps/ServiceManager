<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          {{ title }} <small class="text-muted ms-1">{{ customer.name }}</small>
        </h3>
      </div>
    </div>
    <MainData :customer="customer" />
    <BillingData :customerId="customerId" />
    <ShippingData :customerId="customerId" />
    <ContactData :customerId="customerId" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import  { CustomerDTO } from '@/modules/customer/api/dtos/CustomerDTO'
import { container } from 'tsyringe'
import type { ICommonCustomerService } from '@/core/services/customer/CommonCustomerService'
import MainData from '@/modules/customer/components/customer/MainData.vue'
import BillingData from '@/modules/customer/components/customer/BillingData.vue'
import ShippingData from '@/modules/customer/components/customer/ShippingData.vue'
import ContactData from '@/modules/customer/components/customer/ContactData.vue'

const route = useRoute()
const customerId = route.params.id as string
const customerService = container.resolve('ICommonCustomerService') as ICommonCustomerService
const customer = ref<CustomerDTO>(new CustomerDTO)
customer.value = await customerService.getCustomer(customerId)

const title = 'Klient'

</script>

<style scope>
.w-5 { width: 5% }
.w-20 { width: 20% }
.w-33 { width: 33.333333% }
</style>
