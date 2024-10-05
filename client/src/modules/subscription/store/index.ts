import { createStore } from "vuex";
import { config } from "vuex-module-decorators";

import BodyModule from "@/store/modules/BodyModule";
import BreadcrumbsModule from "@/store/modules/BreadcrumbsModule";
import ConfigModule from "@/store/modules/ConfigModule";
import UserModule from "./modules/UserModule";
import AppModulesModule from "./modules/AppModulesModule";

config.rawError = true;

const store = createStore({
  modules: {
    BodyModule,
    BreadcrumbsModule,
    ConfigModule,
    UserModule,
    AppModulesModule,
  },
});

export default store;
