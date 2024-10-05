<template>
  <Form @submit="editContacts">
    <div v-if="contacts.length !== 0">
      <div
        class="d-flex flex-row flex-wrap align-items-start py-5"
        v-for="(contact, index) in contacts"
        :key="contact.id"
      >
        <div class="w-100 w-md-auto pe-2">
          <div class="form-floating">
            <Field
              type="text"
              id="firstName"
              :name="'firstName[' + index + ']'"
              placeholder="Imię"
              class="form-control my-0 border w-100"
              v-model="contact.firstName"
              :rules="{ required: true, alpha: true, min: 3 }"
            />
            <label for="firstName" class="text-gray-400 mt-0">Imię:</label>
            <div class="form-text text-danger mb-2">
              <ErrorMessage :name="'firstName[' + index + ']'" />
            </div>
          </div>
        </div>

        <div class="w-100 w-md-auto pe-2">
          <div class="form-floating">
            <Field
              type="text"
              id="lastName"
              :name="'lastName[' + index + ']'"
              placeholder="Nazwisko"
              class="form-control my-0 border"
              v-model="contact.lastName"
              :rules="{ required: true, alpha: true, min: 3 }"
            />
            <label for="lastName" class="text-gray-400 mt-0">Nazwisko:</label>
            <div class="form-text text-danger mb-2">
              <ErrorMessage :name="'lastName[' + index + ']'" />
            </div>
          </div>
        </div>

        <div class="w-100 w-md-auto pe-2">
          <div class="form-floating">
            <Field
              type="text"
              id="phone"
              :name="'phone[' + index + ']'"
              placeholder="Telefon"
              class="form-control my-0 border"
              v-model="contact.phone"
              :rules="{ numeric: true, min: 9 }"
            />
            <label for="phone" class="text-gray-400 mt-0">Telefon:</label>
            <div class="form-text text-danger mb-2">
              <ErrorMessage :name="'phone[' + index + ']'" />
            </div>
          </div>
        </div>

        <div class="w-100 w-md-auto pe-2">
          <div class="form-floating">
            <Field
              type="text"
              id="email"
              :name="'email[' + index + ']'"
              placeholder="E-mail"
              class="form-control my-0 border"
              v-model="contact.email"
              :rules="{ email: true }"
            />
            <label for="email" class="text-gray-400 mt-0">E-mail:</label>
            <div class="form-text text-danger mb-2">
              <ErrorMessage :name="'email[' + index + ']'" />
            </div>
          </div>
        </div>

        <div class="align-self-center text-center w-100 w-md-auto mx-auto pe-2">
          <i
            class="bi bi-trash d-none d-md-block cursor-pointer text-hover-danger fs-2"
            @click="deleteContact(organizationId, contact.id)"
          ></i>
        </div>
      </div>

      <div
        class="d-flex flex-wrap flex-row justify-content-between justify-content-sm-start flex-row-reverse"
      >
        <button
          type="button"
          class="btn btn-primary btn-sm ms-2"
          @click="editContacts()"
        >
          Zapisz
        </button>
        <button
          type="button"
          class="btn btn-light-danger btn-sm"
          @click="$emit('edit-contacts-close')"
        >
          Zakończ
        </button>
      </div>
    </div>
    <div
      class="d-flex flex-row flex-wrap justify-content-start pt-3 pb-3 ps-5"
      v-else
    >
      Brak kontaktów.
    </div>
  </Form>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from "vue"
import type { OrganizationContactDTO } from "@/modules/subscription/api/dtos/OrganizationContactDTO"
import { OrganizationContactService } from "@/modules/subscription/api/services/OrganizationContactService"
import Swal from "sweetalert2";

import { Form, Field, ErrorMessage, defineRule, configure } from "vee-validate"
import { required, alpha, email, numeric, min } from "@vee-validate/rules"

import { container } from "tsyringe"
import type { IOrganizationContactService } from "@/modules/subscription/api/services/OrganizationContactService"

export default defineComponent({
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  props: {
    organizationId: {
      type: String,
      required: true,
    },
    contactsRefresh: {
      type: Number,
    },
  },
  setup(props) {
    const contactService = container.resolve('IOrganizationContactService') as IOrganizationContactService
    let contacts = ref<OrganizationContactDTO[]>([])

    watch(
      () => props.organizationId,
      async (newId) => {
        contacts.value = await contactService.getContacts(newId)
      },
      { deep: true }
    )

    watch(
      () => props.contactsRefresh,
      async () => {
        contacts.value = await contactService.getContacts(props.organizationId)
      },
      { deep: true }
    )

    onMounted(() => {
      if (props.organizationId) {
        contactService.getContacts(props.organizationId).then(c => contacts.value = c)
      }
    })

    defineRule("required", required)
    defineRule("alpha", alpha)
    defineRule("email", email)
    defineRule("numeric", numeric)
    defineRule("min", min)

    return {
      contacts
    }
  },
  methods: {
    async editContacts() {
      const service = container.resolve('IOrganizationContactService') as IOrganizationContactService

      try {
        await service.editContacts(
          this.organizationId,
          this.contacts as OrganizationContactDTO[]
        )

        this.contacts = await service.getContacts(this.organizationId)

        this.$emit("edit-contacts-success")

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Kontakty edytowane",
          timer: 2500,
          showConfirmButton: false,
          showCloseButton: false,
        })
      } catch (error) {
        Swal.fire({
          title: "Wystąpił błąd!",
          text: "Kontakty nie zostały edytowane. Spróbuj ponownie za chwilę.",
          icon: "error",
          showConfirmButton: true,
        }).then(() => {
          this.$emit("delete-contact-error")

          console.log(error);
        })
      }
    },

    async deleteContact(organizationId: string, contactId: number) {
      const service = container.resolve('IOrganizationContactService') as IOrganizationContactService

      try {
        Swal.fire({
          icon: "warning",
          title: "Czy na pewno chcesz usunąć ten kontakt?",
          showCancelButton: true,
          cancelButtonText: "Nie",
          showConfirmButton: true,
          confirmButtonText: 'Tak'
        })
        .then(
          async (result) => {             
            if (result.isConfirmed) {
              await service.deleteContact(organizationId, contactId)
              this.$emit('delete-contact-success')
              this.contacts = await service.getContacts(this.organizationId)

              Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Kontakt usunięty',
                timer: 2500,
                showConfirmButton: false,
                showCloseButton: false
              })
            }
          }
        )
      } catch (error) {
        Swal.fire({
          title: "Wystąpił błąd!",
          text: "Kontakt nie został dodany. Spróbuj ponownie za chwilę.",
          icon: "error",
          showConfirmButton: true,
        }).then(() => {
          this.$emit("delete-contact-error")

          console.log(error)
        })
      }
    },
  },
})
</script>
