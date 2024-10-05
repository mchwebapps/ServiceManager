<template>
  <div id="appBody" :class="bodyClass.getBodyClass">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router"
import { useBodyClass } from "@/store/bodyClass"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import "bootstrap-icons/font/bootstrap-icons.css"

const bodyClass = useBodyClass()
</script>

<style>

</style>
