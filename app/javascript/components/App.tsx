import * as React from "react";
import { inject, observer } from "mobx-react";
import { RouterModel } from "mst-react-router";
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

export interface IAppProps {
  router?: RouterModel;
  userStore?: IUserStore;
}

export const App = inject(
  "router",
  "userStore"
)(
  observer(
    (props: IAppProps): JSX.Element => {
      const { users } = props.userStore;
      console.log("users", users);
      return (
        <ThemeProvider theme={baseTheme}>
          <GlobalStyles />
          <Switch>
            <Route
              exact
              path={"/"}
              render={() => {
                return <HomeContainer />;
              }}
            />
          </Switch>
        </ThemeProvider>
      );
    }
  )
);
