import "mobx-react-lite/batchingForReactDom";
import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { App } from "../components/App";

import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
// stores
import { rootStore, Provider } from "../setup/root";
import { getEnv } from "mobx-state-tree";

import "../i18n/i18n";

export const msalConfig = {
  auth: {
    clientId: process.env.MICROSOFT_CLIENT_ID,
    redirectUri: process.env.MICROSOFT_REDIRECT_URI, // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
    postLogoutRedirectUri: process.env.MICROSOFT_LOGOUT_REDIRECT_URI,
  },
  cache: {
    cacheLocation: "localStorage",
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};

ntListener("DOMContentLoaded", () => {
  const msalInstance = new PublicClientApplication(msalConfig);

  ReactDOM.render(
    <MsalProvider instance={msalInstance}>
      <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
        <Provider value={rootStore}>
          <Router history={getEnv(rootStore).routerHistory}>
            <App />
          </Router>
        </Provider>
      </GoogleOAuthProvider>
    </MsalProvider>,
    document.getElementById("root"),
  );
});
