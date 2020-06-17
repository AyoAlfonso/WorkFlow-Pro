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
import { useMst } from "../stores/root-store";

export interface IAppProps {
  userStore?: IUserStore;
}

export const App = observer(
  (props: IAppProps): JSX.Element => {
    const { userStore } = useMst();
    console.log("users", userStore.users);
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
        <HomeContainer />
      </ThemeProvider>
    );
  }
);
