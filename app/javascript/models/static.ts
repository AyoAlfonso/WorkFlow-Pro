import { types } from "mobx-state-tree";

export const StaticModel = types
  .model("StaticModel")
  .props({
    timezones: types.maybeNull(types.array(types.string)),
    userRoles: types.maybeNull(types.array(types.frozen())),
  })
  .views(self => ({}))
  .actions(self => ({}));

type StaticModelType = typeof StaticModel.Type;
type StaticModelDataType = typeof StaticModel.CreationType;

export interface IStatic extends StaticModelType {}
export interface IStaticData extends StaticModelDataType {}
