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
      const response: ApiResponse<any> = yield self.environment.api.getJournalEntries(
        dateFilterObj,
      );
      self.journalEntriesFiltered = response.data;
    }),
    updateJournalEntry: flow(function*(updatedJournalEntry) {
      const { sessionStore } = getRoot(self);
      const response: ApiResponse<any> = yield self.environment.api.updateJournalEntry(
        updatedJournalEntry,
      );
   
      if (response.ok) {
        //nested filter is hard to update, entry will update list
        
        return response.data;
        
      }
      return false;
    }),
    deleteJournalEntry: flow(function*(journalEntry) {
      const response: ApiResponse<any> = yield self.environment.api.deleteJournalEntry(
        journalEntry.id,
      );
      if (response.ok) {
        //nested filter is hard to update, entry will update list
        return true;
      }
      return false;
    }),
  }));

type JournalStoreType = typeof JournalStoreModel.Type;
export interface IJournalStore extends JournalStoreType {
  journalEntriesFiltered: any;
}
