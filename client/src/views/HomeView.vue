<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layout/DefaultLayout.vue'
//import TheWelcome from '@/components/TheWelcome.vue'
import { RouterView } from 'vue-router'
</script>