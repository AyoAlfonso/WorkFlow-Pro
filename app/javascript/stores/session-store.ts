import { types, getEnv, flow, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { withRootStore } from "../lib/with-root-store";
import * as R from "ramda";

import { UserModel } from "../models/user";

export const SessionStoreModel = types
  .model("SessionStoreModel")
  .props({
    loading: types.boolean,
    loggedIn: types.boolean,
    //profile details added as a profile model
    profile: types.maybeNull(UserModel),
  })
  .extend(withRootStore())
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    loadProfile: flow(function* () {
      self.loading = true;
      const env = getEnv(self);
      try {
        const response: any = yield env.api.profile();
        if (response.ok) {
          //add details to user model
          self.profile = response.data;
          self.loggedIn = true;
        }
      } catch {
        // error messaging handled by API monitor
      }
      self.loading = false;
    }),
  }))
  .actions(self => ({
    login: flow(function* (email, password) {
      self.loading = true;
      //may want to show a loading modal here
      const env = getEnv(self);
      const { companyStore } = getRoot(self);
      try {
        const response: any = yield env.api.login(email, password);
        if (response.ok) {
          //save credentials
          console.log(response);
          const newJWT = R.path(["headers", "authorization"], response);

          if (newJWT && newJWT.startsWith("Bearer")) {
            self.loggedIn = true;
            //default cookie set for rails.  Alternative cookies could be done:
            //https://github.com/js-cookie/js-cookie#cookie-attributes
            // by default cookie removed when browser closed
            // Cookies.set("Authorization", newJWT, {
            //   sameSite: true,
            //   httpOnly: true,
            //   expires: 365,
            // });

            //TODO SET TOKEN INTO COOKIE
            //env.api.setJWT(newJWT);
            self.loadProfile();
            companyStore.load();
          }
        }
      } catch {
        // error messaging handled by API monitor
      }
      self.loading = false;
    }),
    // logoutRequest: flow(function* () {
    // yield self.environment.api.logout();
    // self.loggedIn = false;
    // }),
    logoutRequest: flow(function* () {
      const env = getEnv(self);
      const response: any = yield env.api.signOut();
      if (response.ok) {
      }
      self.loggedIn = false;
    }),
  }));

type SessionStoreType = typeof SessionStoreModel.Type;
export interface ISessionStore extends SessionStoreType {}
