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
import { WizardLayout } from "./layouts/wizard-layout";

const Container = styled.div`
  margin-left: 136px;
  margin-right: 40px;
  margin-bottom: 50px;
  padding-top: 96px;
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
        }
        keyActivityStore.updateKeyActivity(keyActivityId);
      } else if (R.includes("team_issue", draggableId)) {
        const teamIssueId = parseInt(R.replace("team_issue-", "", draggableId));
        issueStore.updateTeamIssuePosition(teamIssueId, newPosition + 1);
      } else if (R.includes("issue", draggableId)) {
        const draggableIdList = draggableId.split("_")
        const issueId = parseInt(R.replace("issue-", "", draggableIdList[0]));
        const meetingId = parseInt(R.replace("forumMeetingId-", "", draggableIdList[1]))
        if (destination.droppableId === "issues-container") {
          issueStore.updateIssuePosition(issueId, newPosition + 1);
        }
        else if (destination.droppableId === "scheduled-issues") { 
          issueStore.createTeamIssueMeetingEnablement(issueId, meetingId);
        }
      }
    };
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <ThemeProvider theme={baseTheme}>
          <ModalProvider>
            <GlobalStyles />
            <Toaster position="bottom-right" />
            {loggedIn ? (
              <>
                <SideNav />
                <HeaderBar />

                <Container>
                  <Switch>
                    <Route
                      exact
                      path={"/"}
                      render={() => {
                        return <HomeContainer />;
                      }}
                    />
                    <Route
                      path={"/personal_planning/:meeting_id"}
                      render={() => {
                        return <PersonalPlanning />;
                      }}
                    />
                    <Route
                      path={"/team/:team_id/meeting/:meeting_id"}
                      render={() => {
                        return <Meeting />;
                      }}
                    />
                    <Route
                      path={"/team/:team_id"}
                      render={() => {
                        return <TeamOverview />;
                      }}
                    />
                    <Route
                      path={"/account"}
                      render={() => {
                        return <AccountSettings />;
                      }}
                    />
                    <Route
                      path={"/company/accountability"}
                      render={() => {
                        return <AccountabilityChart />;
                      }}
                    />
                    <Route
                      path={"/company/strategic_plan"}
                      render={() => {
                        return <StrategicPlan />;
                      }}
                    />
                    <Route
                      path={"/goals"}
                      render={() => {
                        return <GoalsIndex />;
                      }}
                    />
                    <Route
                      path={"/journals"}
                      render={() => {
                        return <JournalIndex />;
                      }}
                    />
                    <Route
                      path={"/notes"}
                      render={() => {
                        return <NotesIndex />;
                      }}
                    />

                    <Route
                      exact
                      path={"/forum/"}
                      render={() => {
                        return <ForumNotSetup />;
                      }}
                    />
                    <Route
                      path={"/forum/:team_id"}
                      render={() => {
                        return <TeamOverview />;
                      }}
                    />
                    <Route
                      path={"/meetings/agenda"}
                      render={() => {
                        return <ForumAgenda />;
                      }}
                    />
                    <Route
                      exact
                      path={"/meetings/section_1"}
                      render={() => {
                        return <Section1 />;
                      }}
                    />
                    <Route
                      path={"/meetings/section_1/:team_id"}
                      render={() => {
                        return <Section1 />;
                      }}
                    />
                    <Route
                      exact
                      path={"/meetings/section_2"}
                      render={() => {
                        return <Section2 />;
                      }}
                    />
                    <Route
                      path={"/meetings/section_2/:team_id"}
                      render={() => {
                        return <Section2 />;
                      }}
                    />
                  </Switch>
                </Container>
              </>
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
                  path={"/test_template"}
                  render={() => {
                    return (
                      <WizardLayout
                        title={"Goals"}
                        description={
                          "Goals are things you (and your company) want to achieve in the next 3-12 months."
                        }
                        showSkipButton={false}
                        leftBodyComponents={<> Left Component </>}
                        rightBodyComponents={<> Right Component </>}
                        steps={[
                          "Tell us more about yourself",
                          "Your company's Foundation Four \u2122",
                          "Create your first Goal",
                          "Add your first Pyn (todo)",
                          "Add your Team",
                        ]}
                        currentStep={1}
                      />
                    );
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
