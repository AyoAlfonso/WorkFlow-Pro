import { types, flow, getEnv } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { UserModel } from "../models/user";
//import { ApiResponse } from "apisauce";

export const UserStoreModel = types
  .model("UserStoreModel")
  .props({
    users: types.array(UserModel),
    count: types.number,
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    fetchUsers: flow(function* () {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getUsers();
        if (response.ok) {
          self.users = response.data;
          self.count = self.users.length;
        }
      } catch {
        // error messaging handled by API monitor
      }
    }),
  }))
  .actions(self => ({
    reset() {
      self.users = [] as any;
    },
  }))
  .actions(self => ({
    load: flow(function* () {
      self.reset();
      yield self.fetchUsers();
    }),
  }));

type UserStoreType = typeof UserStoreModel.Type;
export interface IUserStore extends UserStoreType {
  users: any;
  count: number;
}
