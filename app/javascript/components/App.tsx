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

import { AccountSettings } from "./domains/account/account-settings";

import { HeaderBar } from "./domains/nav/header-bar";
import { SideNav } from "./domains/nav";
import { Placeholder } from "./shared/placeholder";

const Container = styled.div`
  margin-left: 168px;
  width: 85%;
  margin-bottom: 50px;
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
                    path={"/team"}
                    render={() => {
                      return <Placeholder />;
                    }}
                  />
                  <Route
                    path={"/account"}
                    render={() => {
                      return <AccountSettings />;
                    }}
                  />
                  <Route
                    path={"/company"}
                    render={() => {
                      return <AccountabilityChart />;
                    }}
                  />
                  <Route
                    path={"/goals"}
                    render={() => {
                      return <Placeholder />;
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
