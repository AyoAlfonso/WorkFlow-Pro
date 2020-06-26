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
import { IIssueStore } from "../stores/issue-store";
import { LoginForm } from "./domains/user/login-form";
import { IKeyActivityStore } from "../stores/key-activity-store";
import { ModalProvider } from "styled-react-modal";

import { HeaderBar } from "./domains/nav/header-bar";
import { SideNav } from "./domains/nav/side-nav";
import { Placeholder } from "./shared/Placeholder";

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
          {loggedIn ? (
            <>
              <SideNav />
              <HeaderBar />

              <Switch>
                <Route
                  exact
                  path={"/"}
                  render={() => {
                    return <HomeContainer />;
                  }}
                />
                <Route
                  exact
                  path={"/team"}
                  render={() => {
                    return <Placeholder />;
                  }}
                />
                <Route
                  exact
                  path={"/company"}
                  render={() => {
                    return <Placeholder />;
                  }}
                />
                <Route
                  exact
                  path={"/goals"}
                  render={() => {
                    return <Placeholder />;
                  }}
                />
              </Switch>
            </>
          ) : (
            <LoginForm />
          )}
        </ModalProvider>
      </ThemeProvider>
    );
  },
);
