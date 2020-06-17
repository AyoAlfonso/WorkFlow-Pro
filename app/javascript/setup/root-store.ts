// import * as Monitors from "./api-monitors";
// import { setupEnvironment } from "./environment";
// import { RootStoreModel } from "../stores/root-store";
// import { onSnapshot } from "mobx-state-tree";

export async function setupRootStore() {
  const environment = await setupEnvironment();

  console.log("setup root store");

  const initialState = {
    router: environment.router,
    userStore: {
      users: [],
      count: 5
    }
  };

  //   const initialState = {
  //     router: {},
  //     userStore: {
  //       users: []
  //     },
  //     issueStore: {
  //       issues: []
  //     }
  //   };

  //   const rootStore = RootStoreModel.create(initialState, environment);

  //   onSnapshot(rootStore, snapshot => console.log("Snapshot: ", snapshot));

  //   // add API Monitors
  //   const { api } = environment;

  //   if (process.env.NODE_ENV !== "production") {
  //     console.tron.trackMstNode(rootStore);
  //     Monitors.addLoggingMonitor(api);
  //   }

  //   return rootStore;
}
