import * as React from "react";
import * as R from "ramda";
import { observer } from "mobx-react";
//import { RouterModel } from "mst-react-router";
import { Route, Switch } from "react-router-dom";
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

const Container = styled.div`
  margin-left: 136px;
  margin-right: 40px;
  margin-bottom: 50px;
  padding-top: 120px;
`;

export interface IAppProps {
  userStore?: IUserStore;
  issueStore?: IIssueStore;
  keyActivityStore?: IKeyActivityStore;
}

export const App = observer(
  (props: IAppProps): JSX.Element => {
    const { issueStore, keyActivityStore, sessionStore } = useMst();
    const loggedIn = sessionStore.loggedIn; //if logged in show switch

    const updateMipCount = count => {
      const currentDailyLog = sessionStore.profile.currentDailyLog;
      sessionStore.updateUser({
        dailyLogsAttributes: [
          {
            ...currentDailyLog,
            mipCount: currentDailyLog.mipCount + count,
          },
        ],
      });
    };

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
          updateMipCount(-1);
        } else if (destination.droppableId === "master-activities") {
          keyActivityStore.startLoading("master-activities");
          keyActivityStore.updateKeyActivityState(keyActivityId, "weeklyList", false);
          keyActivityStore.updateKeyActivityState(keyActivityId, "todaysPriority", false);
          updateMipCount(-1);
        } else if (destination.droppableId === "todays-priorities") {
          keyActivityStore.startLoading("todays-priorities");
          keyActivityStore.updateKeyActivityState(keyActivityId, "weeklyList", false);
          keyActivityStore.updateKeyActivityState(keyActivityId, "todaysPriority", true);
          updateMipCount(1);
        }
        keyActivityStore.updateKeyActivity(keyActivityId);
      } else if (R.includes("team-issue", draggableId)) {
        const issueId = parseInt(R.replace("team-issue-", "", draggableId));
        issueStore.updateIssuePosition(issueId, newPosition + 1);
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
                  </Switch>
                </Container>
              </>
            ) : (
              <LoginForm />
            )}
          </ModalProvider>
        </ThemeProvider>
      </DragDropContext>
    );
  },
);
