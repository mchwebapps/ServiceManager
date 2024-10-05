<template>
  <!--begin::Row-->
  <div class="row gy-5 g-xl-10">
    <!--begin::Col-->
    <div class="col-xl-4">

    </div>
    <!--end::Col-->

    <!--begin::Col-->
    <div class="col-xl-4">

    </div>
    <!--end::Col-->

    <!--begin::Col-->
    <div class="col-xl-4">

    </div>
    <!--end::Col-->
  </div>
  <!--end::Row-->

  <!-- table -->

  <!--begin::Row-->
  <div class="row gy-5 g-xl-10">
    <!--begin::Col-->
    <div class="col-xxl-6">

    </div>
    <!--end::Col-->

    <!--begin::Col-->
    <div class="col-xxl-6">

    </div>
    <!--end::Col-->
  </div>
  <!--end::Row-->
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from "vue";

export default defineComponent({
  name: "dashboard",
  setup() {
    onMounted(() => {
      if (!localStorage.getItem("config")) {
      }
    });

    onUnmounted(() => {
      if (!localStorage.getItem("config")) {
      }
    });
  },
});
</script>
