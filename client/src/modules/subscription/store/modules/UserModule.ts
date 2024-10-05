import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { Actions, Mutations } from "@/store/enums/StoreEnums";
import ApiService from "@/core/services/ApiService";
import store from "..";

class UserInfo {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  organizationId!: string;
}

@Module
export default class UserModule extends VuexModule {
  userProfile: UserInfo = new UserInfo();

  get getUserProfile(): UserInfo {
    return this.userProfile;
  }

  @Mutation
  [Mutations.SET_USER_PROFILE](payload) {
    this.userProfile.id = payload.id;
    this.userProfile.firstName = payload.firstName!;
    this.userProfile.lastName = payload.lastName!;
    this.userProfile.email = payload.email!;
    if (
      payload.attributes["organization_id"] &&
      payload.attributes["organization_id"].length > 0
    ) {
      this.userProfile.organizationId =
        payload.attributes["organization_id"][0];
    }

    ApiService.setHeader();
    store.commit(Mutations.SET_SUBSCRIPTION_MODULES);
    store.commit(Mutations.SET_ROLE_MODULES);
  }
}
