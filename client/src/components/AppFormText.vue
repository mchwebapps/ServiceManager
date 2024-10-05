<template>
  <div
    class="form-text user-select-none mt-1">
    <small
      class="border-bottom border-success border-opacity-25 rounded-1 px-2"
      :class="'text-' + color"
    >
      <slot></slot>
    </small>
  </div>
</template>

<script setup lang="ts">
defineProps({
  color: { type: String, required: true }
})
</script>