import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { QuestionnaireAttemptModel } from "../models/questionnaire-attempt";
import { QuestionnaireModel } from "../models/questionnaire";
import { ApiResponse } from "apisauce";

export const QuestionnaireStoreModel = types
  .model("QuestionnaireStoreModel")
  .props({
    questionnaires: types.array(QuestionnaireModel),
    questionnaireAttempt: types.maybeNull(QuestionnaireAttemptModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    fetchQuestionnaires: flow(function*() {
      const response: ApiResponse<any> = yield self.environment.api.getQuestionnaires();
      try {
        self.questionnaires = response.data;
      } catch {
        // error messaging handled by API monitor
      }
    }),
  }))
  .actions(self => ({
    createQuestionnaireAttempt: flow(function*(questionnaireId, questionnaireAttemptData) {
      const env = getEnv(self);
      try {
        const response: ApiResponse<any> = yield env.api.createQuestionnaireAttempt(
          questionnaireId,
          questionnaireAttemptData,
        );
        self.questionnaireAttempt = response.data;
      } catch {
        // error messaging handled by API monitor
      }
    }),
  }))
  .actions(self => ({
    reset() {
      self.questionnaires = [] as any;
    },
  }))
  .actions(self => ({
    load: flow(function*() {
      self.reset();
      yield self.fetchQuestionnaires();
    }),
  }));

type QuestionnaireStoreType = typeof QuestionnaireStoreModel.Type;
export interface IQuestionnaireStore extends QuestionnaireStoreType {
  questionnaires: any;
  questionnaireAttempt: any;
}
