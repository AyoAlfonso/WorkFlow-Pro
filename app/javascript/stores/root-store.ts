import { types, IStateTreeNode } from "mobx-state-tree";
import { RouterModel } from "mst-react-router";

export const RootStoreModel = types
  .model("RootStoreModel")
  .props({
    router: types.optional(RouterModel, {}),
  })
  .views((self) => ({}))
  .actions((self) => ({}));

export interface RootStore extends IStateTreeNode {
  router: RouterModel;
}
