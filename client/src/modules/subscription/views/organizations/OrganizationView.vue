<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          {{ view.title }} <small class="text-muted ms-1">{{ organizationId }}</small>
        </h3>
      </div>
    </div>
    <OrganizationDetails :organizationId="organizationId" />
    <OrganizationContacts :organizationId="organizationId" />
    <OrganizationSubscriptions :organizationId="organizationId" />
    <OrganizationUsers :organizationId="organizationId" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useCurrentUser } from "@/store/user"
import { useRoute } from "vue-router"
import OrganizationDetails from "@/modules/subscription/components/organization/details/OrganizationDetails.vue"
import OrganizationContacts from "@/modules/subscription/components/organization/contacts/OrganizationContacts.vue"
import OrganizationSubscriptions from "@/modules/subscription/components/organization/subscriptions/OrganizationSubscriptions.vue"
import OrganizationUsers from "@/modules/subscription/components/organization/users/OrganizationUsers.vue"

const view = { title: 'Szczegóły organizacji' }
const route = useRoute()
const userStore = useCurrentUser()

const organizationId = ref()
organizationId.value = route.params.organizationId as string

if (organizationId.value == null) {
  organizationId.value = userStore.getCurrentUser.organizationId
}
</script>
