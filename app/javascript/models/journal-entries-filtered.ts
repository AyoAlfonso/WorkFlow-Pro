import { types } from "mobx-state-tree";
import { JournalEntryModel } from "./journal-entry";

export const JournalEntriesFilteredModel = types
  .model("JournalEntriesFilteredModel")
  .props({
    date: types.string,
    items: types.array(JournalEntryModel),
  })
  .views(self => ({}))
  .actions(self => ({}));

type JournalEntriesFilteredModelType = typeof JournalEntriesFilteredModel.Type;
type JournalEntriesFilteredModelDataType = typeof JournalEntriesFilteredModel.CreationType;

export interface IJournalEntriesFiltered extends JournalEntriesFilteredModelType {}
export interface IJournalEntriesFilteredData extends JournalEntriesFilteredModelDataType {}
