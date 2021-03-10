import * as React from "react";
import * as R from "ramda";
import { observer } from "mobx-react";
//import { RouterModel } from "mst-react-router";
import { Route, Switch } from "react-router-dom";
import { usePageViews } from "~/components/shared/analytics";
import { ThemeProvider } from "styled-components";
import { DragDropContext } from "react-beautiful-dnd";

// stores
import { IUserStore } from "../stores/user-store";
// theme
import {} from "styled-components/cssprop";
import { baseTheme } from "../themes/base";
import { GlobalStyles } from "./global-styles";

// components
import { HomeContainer } from "./domains/home/home-container";
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
import { TeamOverview } from "./domains/meetings/team-overview";
import { Meeting } from "./domains/meetings/meeting";
import { PersonalPlanning } from "./domains/meetings/personal-planning";
import { JournalIndex } from "~/components/domains/journal/journal-index";
import { NotesIndex } from "~/components/domains/notes/notes-index";

import { Section1 } from "./domains/meetings-forum/section-1";
import { Section2 } from "./domains/meetings-forum/section-2";
import { ForumNotSetup } from "./domains/meetings-forum/not-setup";
import { ForumAgenda } from "./domains/meetings-forum/forum-agenda";
import { ForumWelcomeModal } from "./shared/forum-welcome-modal";
import { OnboardingModal } from "./domains/onboarding";

import { Onboarding } from "./domains/onboarding";

const Container = styled.div`
  margin-left: 136px;
  margin-right: 40px;
  margin-bottom: 50px;
  padding-top: 96px;
  height: inherit;
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
    const loggedIn = sessionStore.loggedIn; //if logged in show switch

    const onDragEnd = result => {
      const { destination, source, draggableId } = result;

      if (!result.destination) {
        return;
      }

      let newPosition = destination.index;
      if (newPosition === source.index && destination.droppableId === source.droppableId) {
        return;
      }

      const splittedDraggableId = destination.droppableId.split("-");

      if (R.includes("keyActivity", draggableId)) {
        const keyActivityId = parseInt(R.replace("keyActivity-", "", draggableId));
        keyActivityStore.updateKeyActivityState(keyActivityId, "position", newPosition + 1);
        if (destination.droppableId === "weekly-activities") {
          keyActivityStore.startLoading("weekly-activities");
          keyActivityStore.updateKeyActivityState(keyActivityId, "weeklyList", true);
          keyActivityStore.updateKeyActivityState(keyActivityId, "todaysPriority", false);
        } else if (destination.droppableId === "master-activities") {
          keyActivityStore.startLoading("master-activities");
          keyActivityStore.updateKeyActivityState(keyActivityId, "weeklyList", false);
          keyActivityStore.updateKeyActivityState(keyActivityId, "todaysPriority", false);
        } else if (destination.droppableId === "todays-priorities") {
          keyActivityStore.startLoading("todays-priorities");
          keyActivityStore.updateKeyActivityState(keyActivityId, "weeklyList", false);
          keyActivityStore.updateKeyActivityState(keyActivityId, "todaysPriority", true);
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
        keyActivityStore.updateKeyActivity(keyActivityId);
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
              <Switch>
                <Route
                  exact
                  path={[
                    "/",
                    "/personal_planning/:meeting_id",
                    "/team/:team_id",
                    "/account",
                    "/company/accountability",
                    "/company/strategic_plan",
                    "/goals",
                    "/journals",
                    "/notes",
                    "/forum",
                    "/forum/:team_id",
                    "/meetings/agenda",
                    "/meetings/section_1",
                    "/meetings/section_1/:team_id",
                    "/meetings/section_2",
                    "/meetings/section_2/:team_id",
                  ]}
                >
                  <>
                    <SideNav />
                    <HeaderBar />
                    <ForumWelcomeModal />
                    <OnboardingModal />
                    <Container>
                      <Route exact path="/" component={HomeContainer} />
                      <Route
                        exact
                        path="/personal_planning/:meeting_id"
                        component={PersonalPlanning}
                      />

                      <Route exact path="/team/:team_id" component={TeamOverview} />
                      <Route exact path="/account" component={AccountSettings} />
                      <Route exact path="/company/accountability" component={AccountabilityChart} />
                      <Route exact path="/company/strategic_plan" component={StrategicPlan} />
                      <Route exact path="/goals" component={GoalsIndex} />
                      <Route exact path="/journals" component={JournalIndex} />
                      <Route exact path="/notes" component={NotesIndex} />
                      <Route exact path="/forum" component={ForumNotSetup} />
                      <Route exact path="/forum/:team_id" component={TeamOverview} />
                      <Route exact path="/meetings/agenda" component={ForumAgenda} />
                      <Route exact path="/meetings/section_1" component={Section1} />
                      <Route exact path="/meetings/section_1/:team_id" component={Section1} />
                      <Route exact path="/meetings/section_2" component={Section2} />
                      <Route exact path="/meetings/section_2/:team_id" component={Section2} />
                    </Container>
                  </>
                </Route>
                <Route exact path={["/team/:team_id/meeting/:meeting_id"]}>
                  <>
                    <Route exact path="/team/:team_id/meeting/:meeting_id" component={Meeting} />
                  </>
                </Route>
              </Switch>
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
