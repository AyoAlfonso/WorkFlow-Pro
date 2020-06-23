import { types, getEnv, flow } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { withRootStore } from "../lib/with-root-store";
import * as R from "ramda";

import { UserModel } from "../models/user";

export const SessionStoreModel = types
  .model("SessionStoreModel")
  .props({
    loggedIn: types.boolean,
    //profile details added as a profile model
    profile: types.maybeNull(UserModel),
  })
  .extend(withRootStore())
  .extend(withEnvironment())
  .views((self) => ({}))
  .actions((self) => ({
    loadProfile: flow(function* () {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.profile();
        if (response.ok) {
          //add details to user model
          self.profile = UserModel.create({
            id: response.data.id,
            email: response.data.email,
            firstName: response.data.firstName,
          });
          self.loggedIn = true;
        }
      } catch {
        // error messaging handled by API monitor
      }
    }),
  }))
  .actions((self) => ({
    login: flow(function* (email, password) {
      //may want to show a loading modal here
      const env = getEnv(self);
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
          }
        }
      } catch {
        // error messaging handled by API monitor
      }
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
