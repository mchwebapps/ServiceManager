<template>
  <form @submit.prevent>
    <div
      class="modal fade"
      tabindex="-1"
      :id="modal.id?.replace('#', '')"
      :data-bs-backdrop="(modal.backdrop) ? 'static' : null"
      :data-bs-keyboard="(modal.keyboard) ? 'false' : 'true'"
      
    >
      <div class="modal-dialog modal-dialog-centered" :class="modal.size">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ modal.title }}
                <span :class="'badge fw-normal ms-2 text-bg-' + modal.color">
                  {{ modal.subtitle }}
                </span>
              </h5>
              <slot name="close"></slot>
            </div>
            <div class="modal-body">
              <slot></slot>
              <div class="errorMessage" v-if="errors?.length != 0">
                <hr>
                <div class="alert bg-danger bg-opacity-10 border-danger p-3 my-10">
                  <slot name="error"></slot>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <slot name="buttons"></slot>
            </div>
          </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">

export interface IModal {
  settings: {
    id: string
    size: string
    backdrop: boolean
    keyboard: boolean
    title: string
    subtitle: string
    color: string
  }
  btnText: string
  btnLock: boolean
}
defineProps({
  modal: { type: Object, required: true },
  errors: Array<Object>
})

</script>

