<template>
  <div class="container mt-5 mb-2">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          {{ title }} <small class="text-muted ms-1">{{ department.name }}</small>
        </h3>
      </div>
    </div>
  </div>
  <DepartmentEditForm :department="department" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import { container } from "tsyringe"
import type { IDepartmentService } from "@/modules/management/api/services/department/DepartmentService"
import  { DepartmentDTO } from "@/modules/management/api/dtos/department/DepartmentDTO"
import DepartmentEditForm from "@/modules/management/components/forms/department/DepartmentEditForm.vue"

const title = 'Oddział'
const route = useRoute()
const departmentId = Number(route.params.id)
const departmentService = container.resolve('IDepartmentService') as IDepartmentService
const department = ref<DepartmentDTO>(new DepartmentDTO)
department.value = await departmentService.getDepartment(departmentId)

</script>
