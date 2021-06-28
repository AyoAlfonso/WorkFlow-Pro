import { types, getRoot } from "mobx-state-tree";
import { QuarterlyGoalModel } from "./quarterly-goal";
import { KeyElementModel } from "./key-element";
import { UserModel } from "./user";

export const KeyPerformanceIndicatorModel = types
  .model("KeyPerformanceIndicatorModel")
  .props({
    id: types.identifierNumber,
    companyId: types.maybeNull(types.number),
    createdById: types.number,
    description: types.string,
    ownedById: types.number,
    ownedBy: types.maybeNull(UserModel),
    unitType: types.maybeNull(types.number),
    isDeleted: types.boolean,
  })
  .views(self => ({}))
  .actions(self => ({}));
