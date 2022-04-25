import * as Monitors from "./api-monitors";
import { setupEnvironment } from "./environment";
import { RootStoreModel } from "../stores/root-store";
import { Instance } from "mobx-state-tree";
import { createContext, useContext } from "react";

const environment = setupEnvironment();
const initialState = {
  router: environment.router,
  userStore: {
    users: [],
  },
  issueStore: {
    issues: [],
    loading: false,
    commentLogs: null,
  },
  labelStore: {
    labelsList: [],
  },
  sessionStore: {
    loading: true,
    loggedIn: false,
    profile: null,
  },
  keyActivityStore: {
    incompleteKeyActivities: [],
    completedKeyActivities: [],
    keyActivitiesFromMeeting: [],
    keyActivitiesForOnboarding: [],
    loading: false,
    loadingList: null,
  },
  companyStore: {
    company: null,
    onboardingCompany: null,
    onboardingDisplayFormat: "",
    onboardingCompanyGoals: null,
    onboardingKeyActivities: null,
    onboardingTeam: null,
    onboardingModalOpen: false,
  },
  forumStore: {
    error: false,
    currentForumTeamId: null,
    currentForumYear: null,
    forumYearMeetings: [],
  },
  goalStore: {
    companyGoals: null,
    personalGoals: null,
    closedCompanyGoals: null,
    closedPersonalGoals: null,
  },
  annualInitiativeStore: {
    annualInitiative: null,
    objectiveLogs: null,
  },
  quarterlyGoalStore: {
    quarterlyGoal: null,
    objectiveLogs: null,
  },
  habitStore: {
    habits: [],
  },
  questionnaireStore: {
    questionnaires: [],
    questionnaireAttempt: null,
  },
  journalStore: {},
  teamStore: {
    teams: [],
  },
  keyElementStore: {
    keyElementsForWeeklyCheckin: null,
  },
  meetingStore: {
    currentMeeting: null,
    meetings: [],
    teamMeetings: [],
    currentPersonalPlanning: null,
  },
  notificationStore: {
    notifications: null,
  },
  milestoneStore: {
    milestonesForPersonalMeeting: null,
    milestonesForWeeklyCheckin: null,
  },
  staticDataStore: {
    loading: false,
    timeZones: [],
    headingsAndDescriptions: {},
    fieldsAndLabels: {},
  },
  subInitiativeStore: {
    subInitiative: null,
    objectiveLogs: null,
  },
  scorecardStore: {
    kpis: [],
  },
  keyPerformanceIndicatorStore: {
    kpi: null,
    allKPIs: [],
  },
  descriptionTemplateStore: {
    descriptionTemplates: [],
  },
  checkInTemplateStore: {
    checkInTemplates: [],
    currentCheckIn: null,
  },
  auditLogStore: {
    auditLogs: [],
    //objectiveLogs: null,
  },
};

export const rootStore = RootStoreModel.create(initialState, environment);

// add API Monitors
const { api } = environment;
Monitors.addErrorToastMonitor(api, rootStore.sessionStore.loggedIn);
if (process.env.NODE_ENV !== "production") {
  console.tron.trackMstNode(rootStore);
  Monitors.addLoggingMonitor(api);
}

export type RootInstance = Instance<typeof RootStoreModel>;
const RootStoreContext = createContext<null | RootInstance>(null);

export const Provider = RootStoreContext.Provider;
export function useMst() {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}
