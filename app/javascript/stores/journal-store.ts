import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { JournalEntriesFilteredModel } from "../models/journal-entries-filtered";
import { ApiResponse } from "apisauce";

export const JournalStoreModel = types
  .model("JournalStoreModel")
  .props({
    journalEntriesFiltered: types.array(JournalEntriesFilteredModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    getJournalEntries: flow(function*(dateFilterObj) {
      try {
        const response: ApiResponse<any> = yield self.environment.api.getJournalEntries(
          dateFilterObj,
        );
        self.journalEntriesFiltered = response.data;
      } catch {
        // caught by Api monitor
      }
    }),
  }));

type JournalStoreType = typeof JournalStoreModel.Type;
export interface IJournalStore extends JournalStoreType {
  journalEntriesFiltered: any;
}
