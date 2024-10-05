<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-6 mb-3">
        <label for="firstName" class="form-label">Imię:</label>
        <input type="text" class="form-control form-control-sm" id="firstName" placeholder="Wpisz imię" v-model="contact.firstName">
      </div>
      <div class="col-12 col-md-6 mb-3">
        <label for="lastName" class="form-label">Nazwisko:</label>
        <input type="text" class="form-control form-control-sm" id="lastName" placeholder="Wpisz nazwisko" v-model="contact.lastName">
      </div>
      <div class="col-12 col-md-6 mb-3">
        <label for="phone" class="form-label">Nr telefonu:</label>
        <input type="text" class="form-control form-control-sm" id="phone" placeholder="Wpisz numer telefonu" v-model="contact.phoneNumber">
      </div>
      <div class="col-12 col-md-6 mb-3">
        <label for="email" class="form-label">E-Mail:</label>
        <input type="text" class="form-control form-control-sm" id="email" placeholder="Wpisz adres mailowy" v-model="contact.email">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CommonCustomerContactDTO } from '@/core/dtos/customer/CommonCustomerContactDTO'

const emits = defineEmits([
  'create'
])

const contact = ref<CommonCustomerContactDTO>(new CommonCustomerContactDTO)
emits('create', contact)
</script>