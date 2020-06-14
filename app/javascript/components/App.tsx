import * as React from "react";
import { inject, observer } from "mobx-react";
import { RouterModel } from "mst-react-router";
import { Route, Switch } from "react-router-dom";

// stores
import { IUserStore } from "../stores/user-store";
// theme

// components
import { HomeContainer } from "./home/home-container";

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
