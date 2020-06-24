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

export interface IAppProps {
  userStore?: IUserStore;
  issueStore?: IIssueStore;
}

export const App = observer(
  (props: IAppProps): JSX.Element => {
    const { sessionStore } = useMst();
    const loggedIn = sessionStore.loggedIn; //if logged in show switch
    return (
      <ThemeProvider theme={baseTheme}>
        <GlobalStyles />
        {loggedIn ? (
          <>
            <button onClick={() => sessionStore.logoutRequest()}>Logout</button>
            <Switch>
              <Route
                exact
                path={"/"}
                render={() => {
                  return <HomeContainer />;
                }}
              />
            </Switch>
          </>
        ) : (
          <LoginForm />
        )}
      </ThemeProvider>
    );
  }
);
