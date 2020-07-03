import { types } from "mobx-state-tree";

export const CoreFourModel = types
  .model("CoreFourModel")
  .props({
    core1: types.string,
    core2: types.string,
    core3: types.string,
    core4: types.string,
  })
  .views(self => ({}))
  .actions(self => ({}));

type CoreFourModelType = typeof CoreFourModel.Type;
type CoreFourModelDataType = typeof CoreFourModel.CreationType;

export interface ICoreFour extends CoreFourModelType {}
export interface ICoreFourData extends CoreFourModelDataType {}
