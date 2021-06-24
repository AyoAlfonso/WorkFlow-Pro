import { types } from "mobx-state-tree";

export const ProductFeaturesModel = types
         .model("ProductFeaturesModel")
         .props({
           id: types.identifierNumber,
           userId: types.number,
           objective: types.maybeNull(types.boolean),
           pyns: types.maybeNull(types.boolean),
           team: types.maybeNull(types.boolean),
           meeting: types.maybeNull(types.boolean),
           company: types.maybeNull(types.boolean)
         })
         .views(self => ({}))
         .actions(self => ({}));

type ProductFeaturesModelType = typeof ProductFeaturesModel.Type;
type ProductFeaturesModelDataType = typeof ProductFeaturesModel.CreationType;

export interface IProductFeatures extends ProductFeaturesModelType {}
export interface IProductFeaturesData extends ProductFeaturesModelDataType {}
