import { types, flow } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { UserModel } from "../models/user";
import { ApiResponse } from "apisauce";

export const UserStoreModel = types
  .model("UserStoreModel")
  .props({
    users: types.array(UserModel),
    count: types.number
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    fetchUsers: flow(function*() {
      const response: ApiResponse<any> = yield self.environment.api.getUsers();
      if (response.ok) {
        //self.users = response.data;
        self.users = [
          {
            id: 1,
            email: "test@gmail.com"
          }
        ] as any;
      }
    })
  }))
  .actions(self => ({
    reset() {
      self.users = [] as any;
    }
  }))
  .actions(self => ({
    load: flow(function*() {
      self.reset();
      yield self.fetchUsers();
    })
  }));

type UserStoreType = typeof UserStoreModel.Type;
export interface IUserStore extends UserStoreType {
  users: any;
}
