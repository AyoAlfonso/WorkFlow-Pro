import * as React from "react";
import * as R from "ramda";
import { observer } from "mobx-react";
//import { RouterModel } from "mst-react-router";
import { Loading, Avatar } from "~/components/shared";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { usePageViews } from "~/components/shared/analytics";
import { ThemeProvider } from "styled-components";
import { DragDropContext } from "react-beautiful-dnd";

// stores
import { IUserStore } from "../stores/user-store";
// theme
import { baseTheme } from "../themes/base";
import { GlobalStyles } from "./global-styles";

// components
import { HomeContainer } from "./domains/home/home-container";
import { DummyHome } from "./domains/home/dummy-home";
import { useMst } from "../setup/root";
import styled from "styled-components";
import { IIssueStore } from "../stores/issue-store";
import { LoginForm } from "./domains/user/login-form";
import { IKeyActivityStore } from "../stores/key-activity-store";
import { ModalProvider } from "styled-react-modal";
import { Toaster } from "./shared/toaster";

import { AccountabilityChart } from "./domains/company/accountability-chart";
import { StrategicPlan } from "./domains/company/strategic-plan";

import { AccountSettings } from "./domains/account/account-settings";

import { HeaderBar } from "./domains/nav/header-bar";
import { SideNav } from "./domains/nav";
import { Placeholder } from "./shared/placeholder";
import { GoalsIndex } from "./domains/goals/goals-index";
import { DummyGoalsIndex } from "./domains/goals/dummy-goals-index";
import { TeamOverview } from "./domains/meetings/team-overview";
import { DummyTeamOverview } from "./domains/meetings/dummy-team";
import { Meeting } from "./domains/meetings/meeting";
import { PersonalPlanning } from "./domains/meetings/personal-planning";
import { JournalIndex } from "~/components/domains/journal/journal-index";
import { NotesIndex } from "~/components/domains/notes/notes-index";
import { AuditLogsIndex } from "./domains/audit-logs/audit-logs-index";
import { ScorecardsIndex } from "~/components/domains/scorecard/scorecards-index";
import { DummyScorecardsIndex } from "~/components/domains/scorecard/dummy-scorecards";

import { Section1 } from "./domains/meetings-forum/section-1";
import { Section2 } from "./domains/meetings-forum/section-2";
import { ForumNotSetup } from "./domains/meetings-forum/not-setup";
import { ForumAgenda } from "./domains/meetings-forum/forum-agenda";
import { ForumWelcomeModal } from "./shared/forum-welcome-modal";
import { OnboardingModal } from "./domains/onboarding";

import { Onboarding } from "./domains/onboarding";
import { WeeklyCheckIn } from "./domains/check-in/weekly-checkin";
import { DummyCheckin } from "./domains/check-in/dummy-checkin";
import { useEffect } from "react";
import { getWeekOf } from "~/utils/date-time";
import { CheckInSuccess } from "./domains/check-in/components/checkin-success";
import { ForgotPasswordForm } from "./domains/user/forgot-password-form";
import { CheckIn } from "./domains/check-in/checkin-index";
import { NewCheckIn } from "./domains/check-in/new-checkin-index";
import { NewCheckinLayout } from "./domains/check-in/new-checkin-layout";
import { CheckInBuilderLayout } from "./domains/check-in/checkin-builder-layout";
import { CheckinInsights } from "./domains/check-in/checkin-insights";
import CheckinInsightsIndex from "./domains/check-in/checkin-insights-index";

import { UpdateProfileForm } from "./domains/user/update-profile-form";
import CheckInWizard from "./domains/check-in/checkin";
const Container = styled.div`
  margin-left: 136px;
  margin-right: 40px;
  margin-bottom: 50px;
  padding-top: 96px;
  height: inherit;

  @media only screen and (max-width: 768px) {
    margin: 0;
    padding-top: 64px;
  }
`;

export interface IAppProps {
  userStore?: IUserStore;
  issueStore?: IIssueStore;
  keyActivityStore?: IKeyActivityStore;
}

export const App = observer(
  (props: IAppProps): JSX.Element => {
    usePageViews();
    const { issueStore, keyActivityStore, sessionStore } = useMst();
    const loggedIn = sessionStore.loggedIn;
    const profile = sessionStore.profile;

    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
      const redirectHome = () => {
        const width = window.innerWidth <= 768;
        const id = profile?.id;
        if (width) {
          if (location.pathname.includes("check-in")) return;
          if (location.pathname === "/") return;
          if (id) return history.push(`/`);
        }
      };
      redirectHome();
    }, [profile]);

    // useEffect(() => {
    //   setTimeout(() => {
    //     if (!sessionStore?.loggedIn) {
    //       return history.push("/");
    //     }
    //   }, 1000);
    // }, [sessionStore]);

    let noFeatures;
    let showGoalRoute;
    let showTeamRoute;
    let showScorecardRoute;
    if (profile) {
      noFeatures = !profile.productFeatures;
      showGoalRoute = !noFeatures && profile.productFeatures.objective;
      showTeamRoute = !noFeatures && profile.productFeatures && profile.productFeatures.team;
      showScorecardRoute =
        !noFeatures && profile.productFeatures && profile.productFeatures.scorecard;
    }
    const onDragEnd = result => {
      const { destination, source, draggableId } = result;

      if (!result.destination) {
        return;
      }

      const newPosition = destination.index;
      if (newPosition === source.index && destination.droppableId === source.droppableId) {
        return;
      }

      const splittedDraggableId = destination.droppableId.split("-");

      if (R.includes("keyActivity", draggableId)) {
        const keyActivityId = parseInt(R.replace("keyActivity-", "", draggableId));
        keyActivityStore.updateKeyActivityState(keyActivityId, "position", newPosition + 1);
        if (destination.droppableId === "weekly-activities") {
          keyActivityStore.startLoading("weekly-activities");
          keyActivityStore.updateKeyActivityState(
            keyActivityId,
            "scheduledGroupId",
            sessionStore.getScheduledGroupIdByName("Weekly List"),
          );
        } else if (destination.droppableId === "master-activities") {
          keyActivityStore.startLoading("master-activities");
          keyActivityStore.updateKeyActivityState(
            keyActivityId,
            "scheduledGroupId",
            sessionStore.getScheduledGroupIdByName("Backlog"),
          );
        } else if (destination.droppableId === "todays-priorities") {
          keyActivityStore.startLoading("todays-priorities");
          keyActivityStore.updateKeyActivityState(
            keyActivityId,
            "scheduledGroupId",
            sessionStore.getScheduledGroupIdByName("Today"),
          );
        } else if (R.includes("todays-activities", destination.droppableId)) {
          keyActivityStore.startLoading("home-key-activities");
          keyActivityStore.updateKeyActivityState(keyActivityId, "teamId", null);
          keyActivityStore.updateKeyActivityState(
            keyActivityId,
            "scheduledGroupId",
            parseInt(splittedDraggableId[splittedDraggableId.length - 1]),
          );
        } else if (R.includes("scheduled-group-activities", destination.droppableId)) {
          keyActivityStore.startLoading("home-key-activities");
          keyActivityStore.updateKeyActivityState(keyActivityId, "teamId", null);
          keyActivityStore.updateKeyActivityState(
            keyActivityId,
            "scheduledGroupId",
            parseInt(splittedDraggableId[splittedDraggableId.length - 1]),
          );
        } else if (R.includes("team-activities", destination.droppableId)) {
          keyActivityStore.startLoading("home-key-activities");
          keyActivityStore.updateKeyActivityState(
            keyActivityId,
            "teamId",
            parseInt(splittedDraggableId[splittedDraggableId.length - 1]),
          );
          keyActivityStore.updateKeyActivityState(keyActivityId, "scheduledGroupId", null);
        }
        keyActivityStore.updateKeyActivity(keyActivityId, null, true);
      } else if (R.includes("team_issue", draggableId)) {
        //something to handle team issue meeting enablement creation / deletion depnding on droppable type
        //in the create simply create it
        //in the delete simply remove it

        if (destination.droppableId == "team-parking-lot-issues") {
          const draggableIdList = draggableId.split(":");
          const teamIssueId = parseInt(R.replace("team_issue-", "", draggableIdList[0]));
          const meetingId = parseInt(R.replace("meeting_id-", "", draggableIdList[1]));

          issueStore.updateTeamIssuePosition(teamIssueId, newPosition + 1, {
            meetingId,
            meetingEnabled: false,
          });
        } else if (destination.droppableId == "team-scheduled-issues") {
          const draggableIdList = draggableId.split(":");
          const teamIssueId = parseInt(R.replace("team_issue-", "", draggableIdList[0]));
          const meetingId = parseInt(R.replace("meeting_id-", "", draggableIdList[1]));
          //meetingId is used to determine if a team issue meeting enablement is or not created
          issueStore.updateTeamIssuePosition(teamIssueId, newPosition + 1, {
            meetingId,
            meetingEnabled: true,
          });
        } else {
          //standard team issue functionality. Used in companies.
          //Technically assumes meetingEnabled is not a thing in this case.
          const teamIssueId = parseInt(R.replace("team_issue-", "", draggableId));
          issueStore.updateTeamIssuePosition(teamIssueId, newPosition + 1);
        }
      } else if (R.includes("issue", draggableId)) {
        const issueId = parseInt(R.replace("issue-", "", draggableId));
        issueStore.updateIssuePosition(issueId, newPosition + 1);
      }
    };

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <ThemeProvider theme={baseTheme}>
          <ModalProvider>
            <GlobalStyles />
            <Toaster position="bottom-right" />
            {loggedIn ? (
              (profile.provider && !profile.lastName) || !profile.firstName ? (
                <Route
                  exact
                  path={"/"}
                  render={() => {
                    return <UpdateProfileForm />;
                  }}
                />
              ) : profile && profile.currentCompanyOnboarded ? (
                <Switch>
                  <Route
                    exact
                    path={[
                      "/",
                      "/team/:team_id",
                      "/team/:team_id/dashboard",
                      "/account",
                      "/company/accountability",
                      "/company/strategic_plan",
                      "/goals",
                      "/scorecard/:owner_type/:owner_id",
                      "/journals",
                      "/notes",
                      "/audit-logs",
                      "/forum",
                      "/forum/:team_id",
                      "/meetings/agenda",
                      "/meetings/section_1",
                      "/meetings/section_1/:team_id",
                      "/meetings/section_2",
                      "/meetings/section_2/:team_id",
                      "/check-in",
                      "/check-in/insights/:id",
                      // "/static-planner",
                      // "/static-goals",
                      // "/static-scorecards",
                      // "/static-checkin",
                      // "/static-teams",
                    ]}
                  >
                    <>
                      <SideNav />
                      <HeaderBar />
                      {/* <ForumWelcomeModal /> */}
                      <OnboardingModal />
                      <Container>
                        {profile.productFeatures && profile.productFeatures.pyns ? (
                          <Route exact path="/" component={HomeContainer} />
                        ) : (
                          <Route exact path="/" component={GoalsIndex} />
                        )}

                        {/* {<Route exact path="/static-goals" component={DummyGoalsIndex} />}
                        {<Route exact path="/static-planner" component={DummyHome} />}
                        {<Route exact path="/static-scorecards" component={DummyScorecardsIndex} />}
                        {<Route exact path="/static-checkin" component={DummyCheckin} />}
                        {<Route exact path="/static-teams" component={DummyTeamOverview} />} */}

                        {showGoalRoute && <Route exact path="/goals" component={GoalsIndex} />}
                        {showTeamRoute && (
                          <Route
                            exact
                            path={["/team/:team_id", "/team/:team_id/dashboard"]}
                            component={TeamOverview}
                          />
                        )}
                        <Route exact path="/account" component={AccountSettings} />
                        <Route
                          exact
                          path="/company/accountability"
                          component={AccountabilityChart}
                        />
                        <Route exact path="/company/strategic_plan" component={StrategicPlan} />
                        {showScorecardRoute && (
                          <Route
                            exact
                            path="/scorecard/:owner_type/:owner_id"
                            component={ScorecardsIndex}
                          />
                        )}
                        <Route exact path="/journals" component={JournalIndex} />
                        <Route exact path="/notes" component={NotesIndex} />
                        {profile.role == "Admin" && (
                          <Route exact path="/audit-logs" component={AuditLogsIndex} />
                        )}

                        {profile.productFeatures && profile.productFeatures.meeting && (
                          <>
                            <Route exact path="/meetings/agenda" component={ForumAgenda} />
                            <Route exact path="/forum" component={ForumNotSetup} />
                            <Route exact path="/forum/:team_id" component={TeamOverview} />
                          </>
                        )}
                        {profile.productFeatures && (
                          <>
                            <Route exact path="/meetings/section_1" component={Section1} />
                            <Route exact path="/meetings/section_1/:team_id" component={Section1} />
                            <Route exact path="/meetings/section_2" component={Section2} />
                            <Route exact path="/meetings/section_2/:team_id" component={Section2} />
                          </>
                        )}

                        {profile.productFeatures && profile.productFeatures.checkIn && (
                          <>
                            <Route exact path="/check-in" component={CheckIn} />
                            <Route
                              exact
                              path="/check-in/insights/:id"
                              component={CheckinInsightsIndex}
                            />
                          </>
                        )}
                      </Container>
                    </>
                  </Route>
                  <Route
                    exact
                    path={["/personal_planning/:meeting_id", "/team/:team_id/meeting/:meeting_id"]}
                  >
                    <>
                      <Route
                        exact
                        path="/personal_planning/:meeting_id"
                        component={PersonalPlanning}
                      />
                      {profile.productFeatures && profile.productFeatures.meeting && (
                        <Route
                          exact
                          path="/team/:team_id/meeting/:meeting_id"
                          component={Meeting}
                        />
                      )}
                    </>
                  </Route>
                  <>
                    <Route
                      exact
                      path="/weekly-check-in/:userId/:weekOf"
                      component={WeeklyCheckIn}
                    />
                    <Route exact path="/check-in/success" component={CheckInSuccess} />
                    <Route exact path="/check-in/templates" component={NewCheckinLayout} />
                    <Route exact path="/check-in/build" component={CheckInBuilderLayout} />

                    <Route exact path="/check-in/run/:id" component={CheckInWizard} />
                  </>
                </Switch>
              ) : (
                <Switch>
                  <Route exact path={["/"]}>
                    <>
                      <Route
                        path={"/"}
                        render={() => {
                          return <Onboarding />;
                        }}
                      />
                    </>
                  </Route>
                </Switch>
              )
            ) : (
              <Switch>
                <Route
                  exact
                  path={"/"}
                  render={() => {
                    return <LoginForm />;
                  }}
                />
                <Route
                  exact
                  path={"/forgotpassword"}
                  render={() => {
                    return <ForgotPasswordForm />;
                  }}
                />
                <Route
                  path={"/onboarding"}
                  render={() => {
                    return <Onboarding />;
                  }}
                />
              </Switch>
            )}
          </ModalProvider>
        </ThemeProvider>
      </DragDropContext>
    );
  },
);
