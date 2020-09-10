import { types } from "mobx-state-tree";

export const QuestionnaireModel = types
  .model("QuestionnaireModel")
  .props({
    id: types.identifierNumber,
    name: types.string,
    steps: types.array(types.frozen<object>()),
    title: types.string,
  })
  .views(self => ({}))
  .actions(self => ({}));

type QuestionnaireModelType = typeof QuestionnaireModel.Type;
type QuestionnaireModelDataType = typeof QuestionnaireModel.CreationType;

export interface IQuestionnaire extends QuestionnaireModelType {}
export interface IQuestionnaireData extends QuestionnaireModelDataType {}
