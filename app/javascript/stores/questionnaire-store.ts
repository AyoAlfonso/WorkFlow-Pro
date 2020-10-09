import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { QuestionnaireAttemptModel } from "../models/questionnaire-attempt";
import { QuestionnaireAttemptsDataModel } from "../models/questionnaire-attempts-data";
import { QuestionnaireModel } from "../models/questionnaire";
import { ApiResponse } from "apisauce";

export const QuestionnaireStoreModel = types
  .model("QuestionnaireStoreModel")
  .props({
    questionnaires: types.array(QuestionnaireModel),
    questionnaireAttempt: types.maybeNull(QuestionnaireAttemptModel),
    questionnaireAttemptsSummary: types.array(QuestionnaireAttemptsDataModel),
  })
  .extend(withEnvironment())
  .views(self => ({
    getQuestionnaireByVariant(variant) {
      return self.questionnaires.find(q => q.name === variant);
    },
  }))
  .actions(self => ({
    fetchQuestionnaires: flow(function*() {
      try {
        const response: ApiResponse<any> = yield self.environment.api.getQuestionnaires();
        self.questionnaires = response.data;
      } catch {
        // error messaging handled by API monitor
      }
    }),
  }))
  .actions(self => ({
    createQuestionnaireAttempt: flow(function*(
      questionnaireId,
      questionnaireAttemptData,
      questionnaireTitle: string,
    ) {
      const { sessionStore } = getRoot(self);
      try {
        const response: ApiResponse<any> = yield self.environment.api.createQuestionnaireAttempt(
          questionnaireId,
          questionnaireAttemptData,
        );
        sessionStore.updateUser(
          {
            dailyLogsAttributes: [
              {
                ...response.data,
              },
            ],
          },
          `${questionnaireTitle} Complete`,
        );
      } catch {
        // error messaging handled by API monitor
      }
    }),
    getQuestionnaireAttemptsSummary: flow(function*(dateFilterObj) {
      try {
        const response: ApiResponse<any> = yield self.environment.api.getQuestionnaireAttemptsSummary(
          dateFilterObj,
        );
        self.questionnaireAttemptsSummary = response.data;
      } catch {
        // caught by Api monitor
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
  questionnaireAttemptsSummary: any;
}
