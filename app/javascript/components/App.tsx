import * as React from "react";
import { inject, observer } from "mobx-react";
import { RouterModel } from "mst-react-router";
import { Route, Switch } from "react-router-dom";

// stores

// theme

// components
import { HomeContainer } from "./home/home-container";

export interface AppProps {
  router?: RouterModel;
}

export const App = inject("router")(
  observer(
    (props: AppProps): JSX.Element => {
      return (
        <Switch>
          <Route
            exact
            path={"/"}
            render={() => {
              return <HomeContainer />;
            }}
          />
        </Switch>
      );
    }
  )
);
