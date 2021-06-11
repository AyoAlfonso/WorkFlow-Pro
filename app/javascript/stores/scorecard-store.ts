import { types } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { ScorecardModel } from "../models/scorecard";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import * as R from "ramda";

export const ScorecardStoreModel = types
  .model("ScorecardModel")
  .props({
  })
  .extend(withEnvironment())
