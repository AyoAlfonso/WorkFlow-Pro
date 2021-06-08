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
    questionnaireAttemptsSummaryForReflections: types.maybeNull(types.frozen()),
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
      optionalParams = {},
    ) {
      const { sessionStore } = getRoot(self);
      try {
        const response: ApiResponse<any> = yield self.environment.api.createQuestionnaireAttempt(
          questionnaireId,
          { ...questionnaireAttemptData, ...optionalParams },
        );
        if (response.ok) {
          if (optionalParams["logDate"]) {
            //if the log applies to the dslected daily log update it
            sessionStore.updateSelectedDailyLog(response.data);
          } else {
            //if the log applies to current daily log merge it
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
          }
        }
      } catch {
        // error messaging handled by API monitor
      }
    }),
    getQuestionnaireAttemptsSummaryForReflections: flow(function*(questionnaireId) {
      const response: ApiResponse<any> = yield self.environment.api.getQuestionnaireAttemptsSummaryForReflections(
        questionnaireId,
      );

      if (response.ok) {
        self.questionnaireAttemptsSummaryForReflections = response.data;
        return self.questionnaireAttemptsSummaryForReflections;
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
