import { types } from "mobx-state-tree";

export const DailyLogModel = types
  .model("DailyLogModel")
  .props({
    id: types.identifierNumber,
    workStatus: types.maybeNull(types.string),
  })
  .views(self => ({}))
  .actions(self => ({
    setWorkStatus: (workStatus: string) => {
      self.workStatus = workStatus;
    },
  }));

type DailyLogModelType = typeof DailyLogModel.Type;
type DailyLogModelDataType = typeof DailyLogModel.CreationType;

export interface IUser extends DailyLogModelType {}
export interface IUserData extends DailyLogModelDataType {}