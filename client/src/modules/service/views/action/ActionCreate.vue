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
  <ActionCreateForm />
</template>

<script setup lang="ts">
import ActionCreateForm from "@/modules/service/components/forms/action/ActionCreateForm.vue"

const title = 'Nowe czynności'

</script>