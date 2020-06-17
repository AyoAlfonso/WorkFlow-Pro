import { types, IStateTreeNode, Instance } from "mobx-state-tree";
import { RouterModel } from "mst-react-router";
import { UserStoreModel, IUserStore } from "./user-store";
import { createContext, useContext } from "react";

export const RootStoreModel = types.model({
  router: RouterModel,
  userStore: UserStoreModel
});

// export const RootStoreModel = types
//   .model("RootStoreModel")
//   .props({
//     router: types.optional(RouterModel, {}),
//     userStore: types.optional(UserStoreModel, {})
//   })
//   .views(self => ({}))
//   .actions(self => ({}));

export const rootStore = RootStoreModel.create({
  router: {},
  userStore: {
    users: [],
    count: 5
  }
});

export interface IRootStore extends IStateTreeNode {
  router: RouterModel;
  userStore: IUserStore;
}

export type RootInstance = Instance<typeof RootStoreModel>;
const RootStoreContext = createContext<null | RootInstance>(null);

export const Provider = RootStoreContext.Provider;
export function useMst() {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}
