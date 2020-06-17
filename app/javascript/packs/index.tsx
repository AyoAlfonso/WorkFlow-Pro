//import { Provider } from "mobx-react";
import "mobx-react-lite/batchingForReactDom";
//import { getEnv } from "mobx-state-tree";
import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";

// components
import { App } from "../components/App";

// stores
//@ts-ignore
import { setupRootStore } from "../setup/root-store";
//@ts-ignore
import { startup } from "../setup/startup";
//@ts-ignore
import { IRootStore, rootStore, Provider } from "../stores/root-store";
import { getEnv } from "mobx-state-tree";

document.addEventListener("DOMContentLoaded", () => {
  setupRootStore()
    .then((rootStore: IRootStore) => {
      return new Promise(resolve => {
        startup(rootStore).then(() => resolve(rootStore));
      });
    })
    .then((rootStore: IRootStore) => {
      ReactDOM.render(
        <Provider value={rootStore}>
          <Router history={getEnv(rootStore).routerHistory}>
            <App />
          </Router>
        </Provider>,
        document.getElementById("root")
      );
    });
});
