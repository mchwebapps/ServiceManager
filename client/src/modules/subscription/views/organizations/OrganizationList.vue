<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          {{ view.title }} <small class="text-muted ms-1">{{ }}</small>
        </h3>
      </div>
    </div>
    <div class="row justify-content-between">
      <div class="col-10 col-md-8 col-lg-4">
        <input type="text" class="form-control form-control-sm my-3" placeholder="Wyszukaj">
      </div>
      <div class="col-2 col-md-4 col-lg-4">
        <!-- <RouterLink :to="{ name: 'customer-create'}" class="btn btn-sm btn-primary float-end my-3 ms-auto">Dodaj</RouterLink> -->
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="table-responsive">
          <table class="table table-hover text-center align-middle fs-6">
            <thead class="bg-primary bg-opacity-10">
              <tr>
                <th scope="col" v-for="col in cols">{{ col }}</th>
              </tr>
            </thead>
            <tbody>

              <tr v-for="organization in organizations" :key="organization.id">
                <!-- <th scope="row">{{ organization.id }}</th> -->
                <td>
                  <RouterLink :to="{ name: 'organization-view', params: { organizationId: organization.id } }" class="text-decoration-none">
                    {{ organization.ownerUserEmail }}
                  </RouterLink>
                </td>
                <td>{{ organization.userCount }}</td>
                <td>
                  <span :class="OrganizationStatusHelper.getOrganizationStatusBadgeClass(organization.hasActiveSubscription)">
                    {{ OrganizationStatusHelper.getOrganizationStatusName(organization.hasActiveSubscription) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <nav aria-label="Page navigation example">
            <ul class="pagination pagination-sm justify-content-end">
              <li class="page-item disabled">
                <a class="page-link">&lt;</a>
              </li>
              <li class="page-item active"><a class="page-link" href="#">1</a></li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">3</a></li>
              <li class="page-item">
                <a class="page-link" href="#">&gt;</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { OrganizationSummaryDTO } from "@/modules/subscription/api/dtos/OrganizationSummaryDTO"
import { OrganizationStatusHelper } from "@/modules/subscription/api/helpers/OrganizationStatusHelper"
import { container } from "tsyringe"
import type { IOrganizationService } from "@/modules/subscription/api/services/OrganizationService"

const cols = ['Organizacja', 'Ilość użytkowników', 'Aktywne subskrypcje']
const view = { title: 'Lista organizacji' }

const organizationService = container.resolve('IOrganizationService') as IOrganizationService
const organizations = ref<OrganizationSummaryDTO[]>([])
// organizations.value = await organizationService.getOrganizations()
organizationService.getOrganizations().then((o) => { organizations.value = o })
</script>
