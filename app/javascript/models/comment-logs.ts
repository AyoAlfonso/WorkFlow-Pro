import { types, getRoot } from "mobx-state-tree";

export const CommentLogModel = types
  .model("CommentLogModel")
  .props({
    id: types.maybeNull(types.identifierNumber),
    ownedById: types.maybeNull(types.number),
    parentType: types.maybeNull(types.string),
    parentId: types.maybeNull(types.number),
    note: types.maybeNull(types.string),
    createdAt: types.maybeNull(types.string),
  })
  .views(self => ({}))
  .actions(self => ({}));

type CommentLogModelType = typeof CommentLogModel.Type;
type CommentLogModelDataType = typeof CommentLogModel.CreationType;

export interface ICommentLog extends CommentLogModelType {}
