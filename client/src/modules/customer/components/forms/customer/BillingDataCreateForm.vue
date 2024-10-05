<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 mb-3">
        <label for="companyName" class="form-label">Firma:</label>
        <input type="text" class="form-control form-control-sm" id="companyName" placeholder="Wpisz nazwę firmy">
      </div>
      <div class="col-12 mb-3">
        <label for="companyStreet" class="form-label">Ulica:</label>
        <div class="input-group input-group-sm">
          <span class="input-group-text">ul.</span>
          <input type="text" class="form-control" id="companyStreet" placeholder="Wpisz nazwę ulicy">
        </div>
      </div>
      <div class="col-12 col-md-6 mb-3">
        <label for="companyBuildingNo" class="form-label">Nr budynku:</label>
        <input type="text" class="form-control form-control-sm" id="companyBuildingNo" placeholder="Wpisz nr budynku/domu">
      </div>
      <div class="col-12 col-md-6 mb-3">
        <label for="companyHouseNo" class="form-label">Nr lokalu:</label>
        <input type="text" class="form-control form-control-sm" id="companyHouseNo" placeholder="Wpisz nr lokalu/mieszkania">
      </div>
      <div class="col-12 mb-3">
        <label for="companyPostcode" class="form-label">Kod pocztowy:</label>
        <input type="text" class="form-control form-control-sm" id="companyPostcode" placeholder="Wpisz kod pocztowy">
      </div>
      <div class="col-12 mb-3">
        <label for="companyCity" class="form-label">Miejscowość:</label>
        <input type="text" class="form-control form-control-sm" id="companyCity" placeholder="Wpisz nazwę miejscowości">
      </div>
      <div class="col-12 mb-3">
        <label for="companyBankAccount" class="form-label">Nr konta:</label>
        <input type="text" class="form-control form-control-sm" id="companyBankAccount" placeholder="Wpisz nr rachunku bankowego">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>