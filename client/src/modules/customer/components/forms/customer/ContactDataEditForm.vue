<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-6 mb-3">
        <label for="firstName" class="form-label">Imię:</label>
        <input type="text" class="form-control form-control-sm" id="firstName" placeholder="Wpisz imię" :value="contactData?.firstName">
      </div>
      <div class="col-12 col-md-6 mb-3">
        <label for="lastName" class="form-label">Nazwisko:</label>
        <input type="text" class="form-control form-control-sm" id="lastName" placeholder="Wpisz nazwisko" :value="contactData?.lastName">
      </div>
      <div class="col-12 col-md-6 mb-3">
        <label for="phone" class="form-label">Nr telefonu:</label>
        <input type="text" class="form-control form-control-sm" id="phone" placeholder="Wpisz numer telefonu" :value="contactData?.phone">
      </div>
      <div class="col-12 col-md-6 mb-3">
        <label for="email" class="form-label">E-Mail:</label>
        <input type="text" class="form-control form-control-sm" id="email" placeholder="Wpisz adres mailowy" :value="contactData?.email">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps([
  'contactData'
])
</script>