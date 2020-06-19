import * as Monitors from "./api-monitors";
import { setupEnvironment } from "./environment";
import { RootStoreModel } from "../stores/root-store";
import { Instance } from "mobx-state-tree";
import { createContext, useContext } from "react";

const environment = setupEnvironment();
const initialState = {
  router: environment.router,
  userStore: {
    users: [],
    count: 5
  },
  issueStore: {
    issues: []
  }
};

export const rootStore = RootStoreModel.create(initialState, environment);

// add API Monitors
const { api } = environment;
if (process.env.NODE_ENV !== "production") {
  console.tron.trackMstNode(rootStore);
  Monitors.addLoggingMonitor(api);
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