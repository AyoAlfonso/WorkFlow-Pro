import { types, getEnv, flow } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { withRootStore } from "../lib/with-root-store";
import * as R from "ramda";

export const SessionStoreModel = types
  .model("SessionStoreModel")
  .props({
    loggedIn: types.boolean,
    //profile details added as a profile model
  })
  .extend(withRootStore())
  .extend(withEnvironment())
  .views((self) => ({}))
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
            //TODO SET TOKEN INTO COOKIE
            //env.api.setJWT(newJWT);
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
    logoutRequest() {
      self.loggedIn = false;
    },
  }));

type SessionStoreType = typeof SessionStoreModel.Type;
export interface ISessionStore extends SessionStoreType {}
