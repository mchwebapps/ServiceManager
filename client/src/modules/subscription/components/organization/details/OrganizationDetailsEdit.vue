<template>
  <Form>
    <!--begin::Flex-->
    <div class="d-flex flex-wrap pt-3 pb-5">
      <!--begin::Col-->
      <div class="w-100 w-md-50">
        <!--begin::Elements-->
        <div class="w-100 w-md-auto ps-5 py-3 border-bottom me-0 me-md-5">
          <span class="text-gray-400 me-2">Konto: </span>
          <span class="text-danger fw-bold">{{
            organization.ownerAccountEmail || "brak"
          }}</span>
        </div>

        <div class="w-100 w-md-auto ps-5 py-3 border-bottom me-0 me-md-5">
          <span class="text-gray-400 me-2">Rodzaj konta: </span>
          <span class="text-danger fw-bold">{{
            getAccountTypeName(organization.accountType) || "brak"
          }}</span>
        </div>

        <div class="w-100 w-md-auto py-1 mt-3 me-0 me-md-5">
          <!-- v-if="showBusiness" -->
          <div class="form-floating">
            <Field
              type="text"
              id="company"
              name="company"
              placeholder="Nazwa firmy"
              class="form-control my-0 border"
              v-model="organizationEdit.name"
              :rules="{ required: true, alpha: true, min: 3, max: 64 }"
            />
            <label for="company" class="text-gray-400"> Nazwa firmy: </label>
            <div class="form-text text-danger mb-2">
              <ErrorMessage name="company" />
            </div>
          </div>
        </div>

        <div class="w-100 w-md-auto py-1 me-0 me-md-5">
          <!-- v-if="showBusiness" -->
          <div class="form-floating">
            <Field
              type="text"
              id="nip"
              name="nip"
              placeholder="Nazwa firmy"
              class="form-control my-0 border"
              v-model="organizationEdit.taxNumber"
              :rules="{ required: true, digits: 10 }"
            />
            <label for="nip" class="text-gray-400 me-2"> NIP: </label>
            <div class="form-text text-danger mb-2">
              <ErrorMessage name="nip" />
            </div>
          </div>
        </div>
        <!--end::Elements-->
      </div>
      <!--end::Col-->

      <!--begin::Col-->
      <div class="w-100 w-md-50">
        <!--begin::Elements-->
        <div class="w-100 w-md-auto py-1 ms-0 ms-md-5">
          <div class="form-floating">
            <Field
              type="text"
              id="city"
              name="city"
              placeholder="Miejscowość"
              class="form-control my-0 border"
              v-model="organizationEdit.city"
              :rules="{
                required: true,
                min: 3,
                regex: /^[a-zA-ZąćęłńóśżźĄĆĘŁŃÓŚŻŹ -]+$/,
              }"
            />
            <label for="city" class="text-gray-400 me-2"> Miejscowość: </label>
            <div class="form-text text-danger mb-2">
              <ErrorMessage name="city" />
            </div>
          </div>
        </div>

        <div class="w-100 w-md-auto py-1 ms-0 ms-md-5">
          <div class="form-floating">
            <Field
              type="text"
              id="street"
              name="street"
              placeholder="Ulica i nr domu"
              class="form-control my-0 border"
              v-model="organizationEdit.street"
              :rules="{
                required: true,
                max: 64,
                regex: /^[a-zA-ZąćęłńóśżźĄĆĘŁŃÓŚŻŹ0-9 -./]+$/,
              }"
            />
            <label for="street" class="text-gray-400 me-2">
              Ulica i numer domu:
            </label>
            <div class="form-text text-danger mb-2">
              <ErrorMessage name="street" />
            </div>
          </div>
        </div>

        <div class="w-100 w-md-auto py-1 ms-0 ms-md-5">
          <div class="form-floating">
            <Field
              type="text"
              id="postcode"
              name="postcode"
              placeholder="Kod pocztowy"
              class="form-control my-0 border"
              v-model="organizationEdit.postCode"
              :rules="{ required: true, digits: 5 }"
            />
            <label for="postcode" class="text-gray-400 me-2">
              Kod pocztowy:
            </label>
            <div class="form-text text-danger mb-2">
              <ErrorMessage name="postcode" />
            </div>
          </div>
        </div>

        <div class="w-100 w-md-auto py-1 ms-0 ms-md-5">
          <div class="form-floating">
            <Field
              type="text"
              id="voivodeship"
              name="voivodeship"
              placeholder="Województwo"
              class="form-control my-0 border"
              v-model="organizationEdit.voivodeship"
              :rules="{ required: true, alpha: true, max: 32 }"
            />
            <label for="voivodeship" class="text-gray-400 me-2">
              Województwo:
            </label>
            <div class="form-text text-danger mb-2">
              <ErrorMessage name="voivodeship" />
            </div>
          </div>
        </div>

        <div class="w-100 w-md-auto py-1 ms-0 ms-md-5">
          <div class="form-floating">
            <Field
              type="text"
              id="country"
              name="country"
              placeholder="Kraj"
              class="form-control my-0 border"
              v-model="organizationEdit.country"
              :rules="{ required: true, alpha: true, max: 32 }"
            />
            <label for="country" class="text-gray-400 me-2"> Kraj: </label>
            <div class="form-text text-danger mb-2">
              <ErrorMessage name="country" />
            </div>
          </div>
        </div>
        <!--end::Elements-->
      </div>
      <!--end::Col-->
    </div>
    <!--end::Flex-->

    <!--begin::Flex-->
    <div
      class="d-flex flex-wrap flex-row justify-content-between justify-content-sm-start flex-row-reverse pb-5"
    >
      <!--begin::Buttons-->
      <button
        type="button"
        class="btn btn-primary btn-sm ms-2"
        @click="editDetails()"
      >
        Zapisz
      </button>
      <button
        type="button"
        class="btn btn-light-danger btn-sm"
        @click="$emit('edit-details-close')"
      >
        Zakończ
      </button>
      <!--end::Buttons-->
    </div>
    <!--end::Flex-->
  </Form>
</template>

<script lang="ts">
import { defineComponent, ref, watch, toRefs } from "vue"
import { AccountTypes } from "@/modules/subscription/api/enums/StoreEnums"
import { AccountTypeHelper } from "@/modules/subscriptio/api/helpers/AccountTypeHelper"
import { OrganizationDTO } from "@/modules/subscription/api/dtos/OrganizationDTO"
// import { UserService } from "@/api/services/UserService"

import { Form, Field, ErrorMessage, defineRule } from "vee-validate"
import {
  required,
  alpha,
  alpha_num,
  max,
  digits,
  regex,
} from "@vee-validate/rules"

export default defineComponent({
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  props: {
    organization: {
      type: OrganizationDTO,
      required: true,
    },
  },
  setup(props) {
    let { organization } = toRefs(props)

    let showBusiness = ref(
      props.organization.accountType == AccountTypes.Business
    );
    let showConsumer = ref(
      props.organization.accountType == AccountTypes.Personal
    )

    watch(
      () => props.organization,
      (newValue) => {
        organization.value = newValue;
      }
    )

    defineRule("required", required)
    defineRule("alpha", alpha)
    defineRule("alpha_num", alpha_num)
    defineRule("max", max)
    defineRule("digits", digits)
    defineRule("regex", regex)

    return {
      organizationEdit: organization,
      showBusiness: showBusiness,
      showConsumer: showConsumer,
      //userService: userService
    }
  },
  methods: {
    getAccountTypeName: AccountTypeHelper.getAccountTypeName,

    editDetails() {
      console.log("edytuj details")
    },
  },
})
</script>
