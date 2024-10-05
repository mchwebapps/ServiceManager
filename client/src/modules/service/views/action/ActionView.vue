<template>
  <div class="container mt-5 mb-2">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          {{ title }} <small class="text-muted ms-1">{{ action.name }}</small>
        </h3>
      </div>
    </div>
  </div>
  <ActionEditForm :actionId="actionId" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import { container } from "tsyringe"
import type { IActionService } from "@/modules/service/api/services/action/ActionService"
import  { ActionDTO } from "@/modules/service/api/dtos/action/ActionDTO"
import ActionEditForm from "@/modules/service/components/forms/action/ActionEditForm.vue"

const title = 'Czynność'
const route = useRoute()
const actionId = Number(route.params.id)
const actionService = container.resolve('IActionService') as IActionService
const action = ref<ActionDTO>(new ActionDTO)
action.value = await actionService.getAction(actionId)

</script>

<style scope>
.w-5 { width: 5% }
.w-20 { width: 20% }
.w-33 { width: 33.333333% }
</style>
