<template>
  <div class="d-flex align-items-center pt-5">
    <div class="w-100">
      <h1 class="text-center">Dashboard</h1>
      <h2 class="text-center text-secondary">Co wyświetlamy w Dashboardzie?</h2>
      <h3 class="text-center text-success pt-2">
        Widok strony głównej widoczny tuż po zalogowaniu do aplikacji.
      </h3>
      <img src="/src/assets/pictures/dashboard.png">
    </div>
  </div>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layout/DefaultLayout.vue'

</script>

<style scoped>
img {
  display: block;
  margin: 50px auto;
  width: 80%;
  height: auto;
}
</style>
