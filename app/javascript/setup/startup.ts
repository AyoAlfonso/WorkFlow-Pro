import { IRootStore } from "../stores/root-store";

export async function startup(rootStore: IRootStore) {
  // Initial loading of stores
  const { userStore } = rootStore;
  await userStore.load();
}
