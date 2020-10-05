import { types } from "mobx-state-tree";
import { QuestionnaireAttemptModel } from "./questionnaire-attempt";

export const QuestionnaireAttemptsDataModel = types
  .model("QuestionnaireAttemptsDataModel")
  .props({
    date: types.string,
    items: types.array(QuestionnaireAttemptModel),
  })
  .views(self => ({}))
  .actions(self => ({}));

type QuestionnaireAttemptsDataModelType = typeof QuestionnaireAttemptsDataModel.Type;
type QuestionnaireAttemptsDataModelDataType = typeof QuestionnaireAttemptsDataModel.CreationType;

export interface IQuestionnaireAttemptsData extends QuestionnaireAttemptsDataModelType {}
export interface IQuestionnaireAttemptsDataData extends QuestionnaireAttemptsDataModelDataType {}
