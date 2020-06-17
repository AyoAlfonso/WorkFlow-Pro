import { types } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { withRootStore } from "../lib/with-root-store";
import { LoginFormModel } from "../models/login-form";

export const SessionStoreModel = types
  .model("SessionStoreModel")
  .props({
    loginForm: types.optional(LoginFormModel, {}),
    loggedIn: types.boolean,
  })
  .extend(withRootStore())
  .extend(withEnvironment())
  .views((self) => ({}))
  .actions((self) => ({
    setLoggedIn(value: boolean) {
      self.loggedIn = value;
    },
    // logoutRequest: flow(function* () {
    // yield self.environment.api.logout();
    // self.loggedIn = false;
    // }),
    logoutRequest() {
      self.loggedIn = false;
    },
  }));

type SessionStoreType = typeof SessionStoreModel.Type;
export interface ISessionStore extends SessionStoreType {}
