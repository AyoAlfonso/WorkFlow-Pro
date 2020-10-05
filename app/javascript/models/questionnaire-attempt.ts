import { types } from "mobx-state-tree";

export const QuestionnaireAttemptModel = types
  .model("QuestionnaireAttemptModel")
  .props({
    id: types.identifierNumber,
    userId: types.number,
    questionnaireId: types.number,
    questionnaireType: types.string,
    answers: types.array(types.frozen<object>()),
    steps: types.array(types.frozen<object>()),
    renderedSteps: types.array(types.frozen<object>()),
    completedAt: types.string,
    emotionScore: types.maybeNull(types.number),
  })
  .views(self => ({}))
  .actions(self => ({}));

type QuestionnaireAttemptModelType = typeof QuestionnaireAttemptModel.Type;
type QuestionnaireAttemptModelDataType = typeof QuestionnaireAttemptModel.CreationType;

export interface IQuestionnaireAttempt extends QuestionnaireAttemptModelType {}
export interface IQuestionnaireAttemptData extends QuestionnaireAttemptModelDataType {}
