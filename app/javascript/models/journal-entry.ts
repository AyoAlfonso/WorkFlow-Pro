import { types } from "mobx-state-tree";

// generatedFromId: types.number,
// generatedFromType: types.string,
export const JournalEntryModel = types
  .model("JournalEntryModel")
  .props({
    id: types.identifierNumber,
    userId: types.number,
    body: types.string,
    preview: types.string,
    createdAt: types.string,
  })
  .views(self => ({}))
  .actions(self => ({}));

type JournalEntryModelType = typeof JournalEntryModel.Type;
type JournalEntryModelDataType = typeof JournalEntryModel.CreationType;

export interface IJournalEntry extends JournalEntryModelType {}
export interface IJournalEntryData extends JournalEntryModelDataType {}
