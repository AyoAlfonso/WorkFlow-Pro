import "mobx-react-lite/batchingForReactDom";
import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
// components
import { App } from "../components/App";

// stores
import { rootStore, Provider } from "../setup/root";
import { getEnv } from "mobx-state-tree";

import "../i18n/i18n";

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
      <Provider value={rootStore}>
        <Router history={getEnv(rootStore).routerHistory}>
          <App />
        </Router>
      </Provider>
    </GoogleOAuthProvider>,
    document.getElementById("root"),
  );
});
