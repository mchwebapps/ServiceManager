import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { Actions, Mutations } from "@/store/enums/StoreEnums";
import ApiService from "@/core/services/ApiService";
import { ModuleService } from "@/api/services/ModuleService";

class AppModuleInfo {
  key!: string;
  name!: string;
}

@Module
export default class AppModulesModule extends VuexModule {
  subscriptionModules: AppModuleInfo[] = [];
  roleModules: AppModuleInfo[] = [];

  get getSubscriptionModules(): AppModuleInfo[] {
    return this.subscriptionModules;
  }
  get getRoleModules(): AppModuleInfo[] {
    return this.roleModules;
  }

  @Mutation
  async [Mutations.SET_SUBSCRIPTION_MODULES]() {
    const service = new ModuleService();
    const modules = await service.getModules("SUBSCRIPTION");

    this.subscriptionModules = modules.map((m) => {
      const module = new AppModuleInfo();
      module.key = m.key;
      module.name = m.name;
      return module;
    });
  }

  @Mutation
  async [Mutations.SET_ROLE_MODULES]() {
    const service = new ModuleService();
    const modules = await service.getModules("ROLE");

    this.roleModules = modules.map((m) => {
      const module = new AppModuleInfo();
      module.key = m.key;
      module.name = m.name;
      return module;
    });
  }
}
