import { getRoot, IStateTreeNode } from "mobx-state-tree";
import { RootStore } from "../stores/root-store";

export const withRootStore = () => (self: IStateTreeNode) => ({
  views: {
    get rootStore() {
      return getRoot<RootStore>(self);
    },
  },
});
