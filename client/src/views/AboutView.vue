<template>
  <div class="about ">
    <h1 class="mx-auto">About</h1>
  </div>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layout/DefaultLayout.vue'
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: calc(100vh - 80px);
    display: flex;
    align-items: center;
  }
}
</style>
