<template>
  <ul class="list-group">
    <li
      class="list-group-item border-0 border-bottom border-danger border-opacity-50 text-danger mb-1 py-1"
      v-for="e in errors" :key="e.key"
    >
      {{ e.key }}: {{ e.errorMessage }}
    </li>
  </ul>
</template>

<script setup lang="ts">
defineProps({
  errors: { type: Object, required: true }
})
</script>