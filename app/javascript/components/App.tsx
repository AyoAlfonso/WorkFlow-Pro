import * as React from "react";
import { observer } from "mobx-react";
//import { RouterModel } from "mst-react-router";
import { Route, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";

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
import { Team } from "./domains/meetings/team-overview";
import { Meeting } from "./domains/meetings/meeting";

const Container = styled.div`
  margin-left: 168px;
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
    const { sessionStore } = useMst();
    const loggedIn = sessionStore.loggedIn; //if logged in show switch
    return (
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
                    path={"/team/:id/meeting"}
                    render={() => {
                      return <Meeting />;
                    }}
                  />
                  <Route
                    path={"/team/:id"}
                    render={() => {
                      return <Team />;
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
    );
  },
);
