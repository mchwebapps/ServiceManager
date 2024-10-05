<template>
  <Suspense>
    <div class="wrapper d-flex">
      <AppSidebar />
      <!-- Page content wrapper-->
      <div class="page-content-wrapper">
        <!-- Top navigation-->
        <AppTopbar />
        <!-- Page content-->
        <div class="container-fluid">
          <slot></slot>
        </div>
      </div>
    </div>
  </Suspense>
</template>

<script setup lang="ts">
import AppSidebar from "@/layout/AppSidebar.vue"
import AppTopbar from "@/layout/AppTopbar.vue"
// import AppContent from "@/layout/AppContent.vue"
</script>