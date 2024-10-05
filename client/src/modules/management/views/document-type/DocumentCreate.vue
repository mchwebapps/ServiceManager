<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom mb-3 pb-3">
          {{ title }}
        </h3>
      </div>
    </div>
  </div>
  <DocumentTypeCreateForm />
</template>

<script setup lang="ts">
import DocumentTypeCreateForm from "@/modules/management/components/forms/document-type/DocumentTypeCreateForm.vue"

const title = 'Nowy rodzaj dokumentu'

</script>