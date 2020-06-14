import { Provider } from "mobx-react";
import { getEnv } from "mobx-state-tree";
import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";

// stores
import { setupRootStore } from "../setup/root-store";
import { startup } from "../setup/startup";
import { IRootStore } from "../stores/root-store";

// components
import { App } from "../components/App";

document.addEventListener("DOMContentLoaded", () => {
  setupRootStore()
    .then((rootStore: IRootStore) => {
      return new Promise((resolve) => {
        startup(rootStore).then(() => resolve(rootStore));
      });
    })
    .then((rootStore: IRootStore) => {
      ReactDOM.render(
        <Provider {...rootStore}>
          <Router history={getEnv(rootStore).routerHistory}>
            <App />
          </Router>
        </Provider>,
        document.getElementById("root")
      );
    });
});
