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
    <OrganizationContactCreate
      :organizationId="organizationId"
      @create-contact-success="onCreateOrganizationContactSuccess()"
      @create-contact-error="onCreateOrganizationContactError()"
      v-if="isCreatingOrganizationContact"
    />
    <OrganizationContacts
      :organizationId="organizationId"
      :contactsRefresh="contactsRefresh"
      v-if="!isEditingOrganizationContacts"
    />
    <OrganizationContactsEdit
      :organizationId="organizationId"
      @edit-contacts-success="onEditOrganizationContactsSuccess()"
      @edit-contacts-close="editOrganizationContacts()"
      v-else
    />
    <OrganizationSubscriptions :organizationId="organizationId" />
    <OrganizationUsers
      :organizationId="organizationId"
      :usersRefresh="usersRefresh"
      @delete-user-success="onDeleteOrganizationUserSuccess()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { Modal } from "bootstrap"
import { useRoute } from "vue-router"

import OrganizationDetails from "@/modules/subscription/components/organization/details/OrganizationDetails.vue"
import OrganizationContactCreate from "@/modules/subscription/components/organization/contacts/OrganizationContactCreate-OperacjeNaWielu.vue"
import OrganizationContacts from "@/modules/subscription/components/organization/contacts/OrganizationContacts.vue"
import OrganizationContactsEdit from "@/modules/subscription/components/organization/contacts/OrganizationContactsEdit-OperacjeNaWielu.vue"
import OrganizationSubscriptions from "@/modules/subscription/components/organization/subscriptions/OrganizationSubscriptions.vue"
import OrganizationUsers from "@/modules/subscription/components/organization/users/OrganizationUsers.vue"

const props = defineProps({
  'organizationId': { type: String, required: true }
})

const view = { title: 'Szczegóły organizacji' }

const route = useRoute()
// const customerId = route.params.id as string;
// const customerService = new CustomerService()
// const customer = ref<CustomerDTO>(new CustomerDTO)
// customer.value = customerService.getCustomer(customerId)

let isEditingOrganizationContacts = ref<boolean>(false)
let isCreatingOrganizationContact = ref<boolean>(false)
let isCreatingOrganizationUser = ref<boolean>(true)
let isRolesVisible = ref<boolean>(false)
let holdOn = ref<boolean>(false)
let isSelectActive = ref<boolean>(true)
let contactsRefresh = ref<boolean>(false)
let usersRefresh = ref<boolean>(false)

let errors = ref()
let selected = ref()
let userId = ref()

const onCreateOrganizationContactSuccess = () => {
  isCreatingOrganizationContact.value = false
  contactsRefresh.value = !contactsRefresh.value
}
const onCreateOrganizationContactError = () => {}
const editOrganizationContacts = () => {
  isEditingOrganizationContacts.value = !isEditingOrganizationContacts.value;
  isCreatingOrganizationContact.value = false
}
const onEditOrganizationContactsSuccess = () => {
  isEditingOrganizationContacts.value = false
  contactsRefresh.value = !contactsRefresh.value
}
const onDeleteOrganizationUserSuccess = () => {
  usersRefresh.value = !usersRefresh.value
}
</script>
