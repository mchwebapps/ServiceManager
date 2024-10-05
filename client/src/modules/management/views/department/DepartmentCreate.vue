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
  <DepartmentCreateForm />
</template>

<script setup lang="ts">
import DepartmentCreateForm from "@/modules/management/components/forms/department/DepartmentCreateForm.vue"

const title = 'Nowy oddział'

</script>