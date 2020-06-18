import { types, flow, IStateTreeNode } from "mobx-state-tree";
import { RouterModel } from "mst-react-router";
import { UserStoreModel, IUserStore } from "./user-store";
import { IssueStoreModel, IIssueStore } from "./issue-store";

export const RootStoreModel = types
  .model("RootStoreModel")
  .props({
    router: types.optional(RouterModel, {}),
    userStore: UserStoreModel,
    issueStore: IssueStoreModel
  })
  .views(self => ({}))
  .actions(self => ({
    startup: flow(function*() {
      // do some API calls
      self.userStore.load();
    })
  }))
  .actions(self => ({
    afterCreate() {
      self.startup();
    }
  }));

export interface IRootStore extends IStateTreeNode {
  router: RouterModel;
  userStore: IUserStore;
  issueStore: IIssueStore;
}
