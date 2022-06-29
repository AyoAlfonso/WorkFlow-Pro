import { types } from "mobx-state-tree";

export const EntityModel = types.model("EnitiyModel").props({
  id: types.identifierNumber,
  name: types.string,
  type: types.string,
  lastName: types.maybeNull(types.string),
  avatarUrl: types.maybeNull(types.string),
  defaultAvatarUrl: types.maybeNull(types.string),
})

type EntityModelType = typeof EntityModel.Type;
type EntityModelDataType = typeof EntityModel.CreationType;

export interface IEntity extends EntityModelType {}
export interface IEntityModelData extends EntityModelDataType {}