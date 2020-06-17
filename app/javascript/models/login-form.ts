import { types, getEnv, getRoot, flow } from "mobx-state-tree";
import * as R from "ramda";

export const LoginFormModel = types
  .model("LoginFormModel")
  .props({
    //MOVE TO LOCAL STATE
    // email: types.maybeNull(types.string),
    // password: types.maybeNull(types.string),
  })
  .views((self) => ({}))
  .actions((self) => ({
    submit: flow(function* (email, password) {
      //may want to show a loading modal here
      const env = getEnv(self);
      const { sessionStore } = getRoot(self);
      try {
        const response: any = yield env.api.login(email, password);
        if (response.ok) {
          //save credentials
          console.log(response);
          const newJWT = R.path(["headers", "authorization"], response);

          if (newJWT && newJWT.startsWith("Bearer")) {
            console.log(newJWT);
            sessionStore.loggedIn(true);
            //env.api.setJWT(newJWT);
          }
        }
      } catch {
        // error messaging handled by API monitor
      }
    }),
  }));

type LoginFormModelType = typeof LoginFormModel.Type;
type LoginFormModelDataType = typeof LoginFormModel.CreationType;

export interface ILoginForm extends LoginFormModelType {}
export interface ILoginFormData extends LoginFormModelDataType {}
