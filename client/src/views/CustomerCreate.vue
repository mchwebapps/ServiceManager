<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom mb-3 pb-3">
          {{ title }} <small class="text-muted ms-1">{{ CustomerTypeHelper.getCustomerTypeName(customerType) }}</small>
        </h3>
        <div class="border-bottom mb-3 pb-3">
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              id="business-customer"
              :value="CustomerTypes.Business"
              v-model="customerType"
              autocomplete="off"
              checked
            >
            <label class="form-check-label" for="business-customer">
              {{ CustomerTypeHelper.getCustomerTypeName(CustomerTypes.Business) }}
            </label>
          </div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              id="individual-customer"
              :value="CustomerTypes.Personal"
              v-model="customerType"
              autocomplete="off"
            >
            <label class="form-check-label" for="individual-customer">
              {{ CustomerTypeHelper.getCustomerTypeName(CustomerTypes.Personal) }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
  <BusinessCustomerForm v-if="isBusinessFormActive" @created="emitCreatedCustomerId" />
  <PersonalCustomerForm v-if="isPersonalFormActive" @created="emitCreatedCustomerId" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { CustomerTypes } from '@/modules/customer/store/enums/StoreEnums'
import { CustomerTypeHelper } from '@/modules/customer/api/helpers/CustomerTypeHelper'
import BusinessCustomerForm from '@/components/forms/BusinessCustomerCreateForm.vue'
import PersonalCustomerForm from '@/components/forms/PersonalCustomerCreateForm.vue'

const title = 'Nowy klient'
const emits = defineEmits(['created'])

const customerType = ref<CustomerTypes>(CustomerTypes.Business)
const isBusinessFormActive = ref(true)
const isPersonalFormActive = ref(false)

const emitCreatedCustomerId = (createdCustomerId: string) => {
  return (createdCustomerId !== '') ? emits('created', createdCustomerId) : null
}

watch(customerType, () => {
  switch (customerType.value) {
    case CustomerTypes.Business:
      isBusinessFormActive.value = true
      isPersonalFormActive.value = false
      break
    case CustomerTypes.Personal:
      isBusinessFormActive.value = false
      isPersonalFormActive.value = true
      break
  }
})

</script>