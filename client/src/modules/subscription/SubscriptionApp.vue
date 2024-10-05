<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layout/DefaultLayout.vue'
import { RouterView } from 'vue-router'
</script>