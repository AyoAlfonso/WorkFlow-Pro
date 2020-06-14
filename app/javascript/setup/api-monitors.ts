import * as R from "ramda";
import { TIMEOUT_ERROR, UNKNOWN_ERROR, CONNECTION_ERROR } from "apisauce";

// Adds a console.log to every request
export const addLoggingMonitor = (api) => {
  if (process.env.NODE_ENV !== "production" || process.env.DEBUG === "true") {
    api.addMonitor((response) => {
      if (
        R.contains(response.problem, [
          TIMEOUT_ERROR,
          UNKNOWN_ERROR,
          CONNECTION_ERROR,
        ])
      ) {
        console.log(`[API] ERROR: \n`, response, `\n\n`);
      } else {
        const path = R.replace(
          response.config.baseURL,
          "",
          response.config.url
        );
        const status = response.status;
        const method = R.toUpper(response.config.method);
        console.log(
          `[API] status: ${status} | method: ${method} | path: ${path}\n`,
          response,
          `\n\n`
        );
      }
    });
  }
};
