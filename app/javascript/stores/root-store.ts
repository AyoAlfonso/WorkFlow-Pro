import { types, flow, IStateTreeNode } from "mobx-state-tree";
import { RouterModel } from "mst-react-router";
import { UserStoreModel, IUserStore } from "./user-store";
import { IssueStoreModel, IIssueStore } from "./issue-store";
import { KeyActivityStoreModel, IKeyActivityStore } from "./key-activity-store";
import { SessionStoreModel, ISessionStore } from "./session-store";
import { CompanyStoreModel, ICompanyStore } from "./company-store";
import { GoalStoreModel, IGoalStore } from "./goal-store";
import { AnnualInitiativeStoreModel, IAnnualInitiativeStore } from "./annual-initiative-store";
import { QuarterlyGoalStoreModel, IQuarterlyGoalStore } from "./quarterly-goal-store";
import { HabitStoreModel } from "./habit-store";
import { QuestionnaireStoreModel, IQuestionnaireStore } from "./questionnaire-store";
import { TeamStoreModel, ITeamStore } from "./team-store";

export const RootStoreModel = types
  .model("RootStoreModel")
  .props({
    router: types.optional(RouterModel, {}),
    userStore: UserStoreModel,
    issueStore: IssueStoreModel,
    keyActivityStore: KeyActivityStoreModel,
    sessionStore: SessionStoreModel,
    companyStore: CompanyStoreModel,
    goalStore: GoalStoreModel,
    annualInitiativeStore: AnnualInitiativeStoreModel,
    quarterlyGoalStore: QuarterlyGoalStoreModel,
    habitStore: HabitStoreModel,
    questionnaireStore: QuestionnaireStoreModel,
    teamStore: TeamStoreModel,
  })
  .views(self => ({}))
  .actions(self => ({
    startup: flow(function*() {
      //check if there is a cookie, if so try to call the profile endpoint and set logged into true
      yield self.sessionStore.loadProfile();
      if (self.sessionStore.loggedIn) {
        self.companyStore.load();
        // do some API calls
        self.userStore.load();
        self.teamStore.load();
      }
    }),
  }))
  .actions(self => ({
    afterCreate() {
      self.startup();
    },
  }));

export interface IRootStore extends IStateTreeNode {
  router: RouterModel;
  userStore: IUserStore;
  issueStore: IIssueStore;
  keyActivityStore: IKeyActivityStore;
  sessionStore: ISessionStore;
  goalStore: IGoalStore;
  annualInitiativeStore: IAnnualInitiativeStore;
  quarterlyGoalStore: IQuarterlyGoalStore;
  questionnaireStore: IQuestionnaireStore;
  teamStore: ITeamStore;
}
