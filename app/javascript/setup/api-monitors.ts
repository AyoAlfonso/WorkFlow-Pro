import * as R from "ramda";
import { TIMEOUT_ERROR, UNKNOWN_ERROR, CONNECTION_ERROR, CLIENT_ERROR } from "apisauce";
import { showToast } from "../utils/toast-message";
import { ToastMessageConstants } from "../constants/toast-types";

// Adds a console.log to every request
export const addLoggingMonitor = api => {
  if (process.env.NODE_ENV !== "production" || process.env.DEBUG === "true") {
    api.addMonitor(response => {
      if (R.contains(response.problem, [TIMEOUT_ERROR, UNKNOWN_ERROR, CONNECTION_ERROR])) {
        console.log(`[API] ERROR: \n`, response, `\n\n`);
      } else {
        const path = R.replace(response.config.baseURL, "", response.config.url);
        const status = response.status;
        const method = R.toUpper(response.config.method);
        console.log(
          `[API] status: ${status} | method: ${method} | path: ${path}\n`,
          response,
          `\n\n`,
        );
      }
    });
  }
};

export const addErrorToastMonitor = (api, loggedIn) => {
  api.addMonitor(response => {
    if ((response.status !== 200 && response.status !== 201) || response.problem !== null) {
      switch (response.problem) {
        case CLIENT_ERROR:
          if (loggedIn || response.config.url.includes("sign_in")) {
            showToast(
              R.path(["data", "error"], response) || `A client error occurred`,
              ToastMessageConstants.ERROR,
            );
          } else {
            showToast(
              R.path(["data", "message"], response) ||
                R.path(["data", "error"], response) ||
                "Something went wrong",
              ToastMessageConstants.ERROR,
            );
          }
          break;
        case CONNECTION_ERROR:
          showToast("A connection error occurred", ToastMessageConstants.ERROR);
          break;
        case UNKNOWN_ERROR:
          showToast("An unknown error occurred", ToastMessageConstants.ERROR);
          break;
        case TIMEOUT_ERROR:
          showToast("A timeout error occurred", ToastMessageConstants.ERROR);
          break;
        default:
          showToast(
            R.path(["data", "message"], response) || "Something went wrong",
            ToastMessageConstants.ERROR,
          );
      }
    } else if (response.status === 403) {
      showToast("An authorization error occurred", ToastMessageConstants.ERROR);
    }
  });
};
