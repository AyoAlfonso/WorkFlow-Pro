import { types, IStateTreeNode } from "mobx-state-tree";
import { RouterModel } from "mst-react-router";
import { IUserStore, UserStoreModel } from "./user-store";

export const RootStoreModel = types
  .model("RootStoreModel")
  .props({
    router: types.optional(RouterModel, {}),
    userStore: types.optional(UserStoreModel, {}),
  })
  .views((self) => ({}))
  .actions((self) => ({}));

export interface IRootStore extends IStateTreeNode {
  router: RouterModel;
  userStore: IUserStore;
}
