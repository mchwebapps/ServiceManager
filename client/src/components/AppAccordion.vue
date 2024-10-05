<template>
  <div class="accordion" :id="accordion.accordionId">
    <div class="accordion-item">
      <h2 class="accordion-header" :id="accordion.headerId">
        <button
          type="button"
          class="accordion-button text-primary"
          data-bs-toggle="collapse"
          :data-bs-target="'#' + accordion.collapseId"
          aria-expanded="true"
          :aria-controls="accordion.collapseId"
        >
          <slot name="header"></slot>
        </button>
      </h2>
      <div
        :id="accordion.collapseId"
        class="accordion-collapse collapse"
        :class="{ 'show': accordion.show }"
        :aria-labelledby="accordion.headerId"
        :data-bs-parent="'#' + accordion.accordionId"
      >
        <div class="accordion-body">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface IAccordion {
  accordionId: string
  headerId: string
  collapseId: string
  show: boolean
}
defineProps({
  accordion: { type: Object, required: true }
})
</script>