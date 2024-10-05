<template>
  <div class="container mt-5 mb-2">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          {{ title }} <small class="text-muted ms-1">{{ documentType.name }}</small>
        </h3>
      </div>
    </div>
  </div>
  <DocumentTypeEditForm :documentType="documentType" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import { container } from "tsyringe"
import type { IDocumentTypeService } from "@/modules/management/api/services/document-type/DocumentTypeService"
import  { DocumentTypeDTO } from "@/modules/management/api/dtos/document-type/DocumentTypeDTO"
import DocumentTypeEditForm from "@/modules/management/components/forms/document-type/DocumentTypeEditForm.vue"

const title = 'Rodzaj dokumentu'
const route = useRoute()
const documentTypeId = Number(route.params.id)
const documentTypeService = container.resolve('IDocumentTypeService') as IDocumentTypeService
const documentType = ref<DocumentTypeDTO>(new DocumentTypeDTO)
  documentType.value = await documentTypeService.getDocumentType(documentTypeId)

</script>
