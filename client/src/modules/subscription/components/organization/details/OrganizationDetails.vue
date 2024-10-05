<template>
  <div class="row bg-primary bg-opacity-10 border rounded mt-2 mx-0 mb-4 p-2">
    <div class="col-12">
      <ul class="list-group list-group-flush border rounded my-2">
        <li class="list-group-item py-1">Konto: <b class="ms-1">{{ organization.ownerAccountEmail }}</b></li>
        <li class="list-group-item py-1">Rodzaj konta: <b class="ms-1">{{ AccountTypeHelper.getAccountTypeName(organization.accountType) }}</b></li>
        <li class="list-group-item py-1" v-if="showBusiness">Nazwa firmy: <b class="ms-1">{{ organization.name }}</b></li>
        <li class="list-group-item py-1" v-if="showBusiness">NIP: <b class="ms-1">{{ organization.taxNumber }}</b></li>
        <li class="list-group-item py-1">Miejscowość: <b class="ms-1">{{ organization.city }}</b></li>
        <li class="list-group-item py-1">Ulica i nr domu: <b class="ms-1">{{ fullAddress(organization.street, organization.houseNo, organization.flatNo) || '-' }}</b></li>
        <li class="list-group-item py-1">Kod pocztowy: <b class="ms-1">{{ organization.postCode || '-' }}</b></li>
        <li class="list-group-item py-1">Województwo: <b class="ms-1">{{ organization.voivodeship || '-' }}</b></li>
      </ul>
      <!-- <a
        type="button"
        href="https://host.docker.internal:8443/realms/iAdmin/account/#/personal-info"
        target="_blank"
        class="btn btn-sm btn-warning ms-2 mt-1 me-1 mb-1"
        title="Edytuj dane"
      >
        <i class="bi bi-pen fs-4"></i>
        Edytuj 
      </a> -->
    </div>
  </div>
  <hr class="my-3">

  <!-- <div class="mb-5 pt-5 text-center text-primary" v-if="!organization">
    <div class="spinner-border" role="status">
      <span class="sr-only">Wczytywanie...</span>
    </div>
  </div> -->
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { AccountTypes } from "@/modules/subscription/api/enums/StoreEnums"
import { AccountTypeHelper } from "@/modules/subscription/api/helpers/AccountTypeHelper"
import { OrganizationDTO } from "@/modules/subscription/api/dtos/OrganizationDTO"
import { container } from "tsyringe"
import type { IOrganizationService } from "@/modules/subscription/api/services/OrganizationService"

const props = defineProps({
  'organizationId': { type: String, required: true }
})

const organization = ref<OrganizationDTO>(new OrganizationDTO())

let showBusiness = ref(organization.value.accountType == AccountTypes.Business)
//let showConsumer = ref(organization.value.accountType == AccountTypes.Personal)

const fullAddress = (street: string, houseNo: string, flatNo: string): string => {
  return flatNo === '' ? `${street} ${houseNo}` : `${street} ${houseNo} m ${flatNo}`
}

async function processAsync(){

    const organizationService = container.resolve('IOrganizationService') as IOrganizationService
    organization.value = await organizationService.getOrganization(props.organizationId)

    // if (props.organizationId) {
    //   organizationService
    //     .getOrganization(props.organizationId)
    //     .then((o) => (organization.value = o))
    // }

    // watch(
    //   () => props.organizationId,
    //   async (newId) => {
    //     organization.value = await organizationService.getOrganization(newId)
    //   },
    //   { deep: true }
    // );

}
 processAsync()
</script>
