"use strict";
exports.__esModule = true;
exports.loginRequest = exports.msalConfig = void 0;
require("mobx-react-lite/batchingForReactDom");
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var react_router_dom_1 = require("react-router-dom");
var google_1 = require("@react-oauth/google");
var App_1 = require("../components/App");
var msal_react_1 = require("@azure/msal-react");
var msal_browser_1 = require("@azure/msal-browser");
// stores
var root_1 = require("../setup/root");
var mobx_state_tree_1 = require("mobx-state-tree");
require("../i18n/i18n");
exports.msalConfig = {
    auth: {
        clientId: process.env.MICROSOFT_CLIENT_ID,
        redirectUri: process.env.MICROSOFT_REDIRECT_URI,
        postLogoutRedirectUri: process.env.MICROSOFT_LOGOUT_REDIRECT_URI
    },
    cache: {
        cacheLocation: "localStorage"
    }
};
exports.loginRequest = {
    scopes: ["User.Read"]
};
document.addEventListener("DOMContentLoaded", function () {
    var msalInstance = new msal_browser_1.PublicClientApplication(exports.msalConfig);
    react_dom_1["default"].render(<msal_react_1.MsalProvider instance={msalInstance}>
      <google_1.GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
        <root_1.Provider value={root_1.rootStore}>
          <react_router_dom_1.Router history={mobx_state_tree_1.getEnv(root_1.rootStore).routerHistory}>
            <App_1.App />
          </react_router_dom_1.Router>
        </root_1.Provider>
      </google_1.GoogleOAuthProvider>
    </msal_react_1.MsalProvider>, document.getElementById("root"));
});
