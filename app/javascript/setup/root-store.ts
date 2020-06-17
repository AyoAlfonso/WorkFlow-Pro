import * as Monitors from "./api-monitors";
import { setupEnvironment } from "./environment";
import { RootStoreModel } from "../stores/root-store";

export async function setupRootStore() {
  const environment = await setupEnvironment();
  const initialState = {
    router: environment.router,
    userStore: {
      users: [],
      count: 5
    }
  };

  const rootStore = RootStoreModel.create(initialState, environment);

  // add API Monitors
  const { api } = environment;

  if (process.env.NODE_ENV !== "production") {
    console.tron.trackMstNode(rootStore);
    Monitors.addLoggingMonitor(api);
  }

  return rootStore;
}
