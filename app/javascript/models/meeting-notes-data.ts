import { types } from "mobx-state-tree";

export const MeetingNotesDataModel = types
  .model("MeetingNotesDataModel")
  .props({
    date: types.string,
    items: types.array(types.frozen()),
  })
  .views(self => ({}))
  .actions(self => ({}));

type MeetingNotesDataModelType = typeof MeetingNotesDataModel.Type;
type MeetingNotesDataModelDataType = typeof MeetingNotesDataModel.CreationType;

export interface IMeetingNotesData extends MeetingNotesDataModelType {}
export interface IMeetingNotesDataData extends MeetingNotesDataModelDataType {}
