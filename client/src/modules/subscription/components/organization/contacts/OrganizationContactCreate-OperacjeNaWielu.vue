<template>
  <Form @submit="createContact">
    <div
      class="d-flex flex-column flex-md-row flex-wrap justify-content-start py-5"
    >
      <div class="pe-2">
        <div class="form-floating">
          <Field
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Imię"
            class="form-control my-0 border"
            v-model="contacts.firstName"
            :rules="{ required: true, alpha: true, min: 3 }"
          />
          <label for="firstName" class="mt-0">Imię:</label>
          <div class="form-text text-danger mb-2">
            <ErrorMessage name="firstName" />
          </div>
        </div>
      </div>

      <div class="pe-2">
        <div class="form-floating">
          <Field
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Nazwisko"
            class="form-control my-0 border"
            v-model="contacts.lastName"
            :rules="{ required: true, alpha: true, min: 3 }"
          />
          <label for="lastName" class="mt-0">Nazwisko:</label>
          <div class="form-text text-danger mb-2">
            <ErrorMessage name="lastName" />
          </div>
        </div>
      </div>

      <div class="pe-2">
        <div class="form-floating">
          <Field
            type="text"
            id="phone"
            name="phone"
            placeholder="Telefon"
            class="form-control my-0 border"
            v-model="contacts.phone"
            :rules="{ numeric: true, min: 9 }"
          />
          <label for="phone" class="mt-0">Telefon:</label>
          <div class="form-text text-danger mb-2">
            <ErrorMessage name="phone" />
          </div>
        </div>
      </div>

      <div class="pe-2">
        <div class="form-floating">
          <Field
            type="text"
            id="email"
            name="email"
            placeholder="E-mail"
            class="form-control my-0 border"
            v-model="contacts.email"
            :rules="{ email: true }"
          />
          <label for="email" class="mt-0">E-mail:</label>
          <div class="form-text text-danger mb-2">
            <ErrorMessage name="email" />
          </div>
        </div>
      </div>

      <button type="submit" class="btn btn-primary mb-2 me-2">Dodaj</button>
    </div>
  </Form>

  <div class="alert alert-danger" v-if="errors">
    <ul class="list-unstyled mb-0">
      <li v-for="err in errors" :key="err">{{ err[0] }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue"
import { OrganizationContactDTO } from "@/modules/subscription/api/dtos/OrganizationContactDTO"
import { OrganizationContactService } from "@/modules/subscription/api/services/OrganizationContactService"
import Swal from "sweetalert2"

import { Form, Field, ErrorMessage, defineRule, configure } from "vee-validate"
import { required, alpha, email, numeric, min } from "@vee-validate/rules"

import { container } from 'tsyringe'
import type { IOrganizationContactService } from '@/modules/subscription/api/services/OrganizationContactService'

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
  },
  emits: ["create-contact-success", "create-contact-error"],
  setup() {
    const contacts = ref(new OrganizationContactDTO())

    let errors = ref()

    defineRule("required", required)
    defineRule("alpha", alpha)
    defineRule("email", email)
    defineRule("numeric", numeric)
    defineRule("min", min)

    return {
      contacts,
      errors,
    }
  },
  methods: {
    async createContact() {
      const service = container.resolve('IOrganizationContactService') as IOrganizationContactService

      try {
        const result = await service.createContact(
          this.organizationId,
          this.contacts
        )

        this.$emit("create-contact-success")

        this.contacts.firstName = ""
        this.contacts.lastName = ""
        this.contacts.phone = ""
        this.contacts.email = ""

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Kontakt utworzony!",
          timer: 2500,
          showConfirmButton: false,
          showCloseButton: false,
        })
      }
      catch (error: any) {
        Swal.fire({
          title: "Błąd serwera!",
          html: "Kontakt nie został dodany.<br>Sprawdź szczegółowe komunikaty lub odśwież stronę i spróbuj ponownie.",
          icon: "error",
          showConfirmButton: true,
        }).then(() => {
          this.$emit("create-contact-error")
          this.errors = error.response.data.errors
        })
      }
    },
  },
})
</script>
