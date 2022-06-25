import { types, flow, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import checkInTypes from "~/constants/check-in-types";
import { CheckInTemplateModel } from "../models/check-in-templates";
import { ApiResponse } from "apisauce";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import * as R from "ramda";
import { StepModel } from "~/models/step";

export const CheckInTemplateStoreModel = types
  .model("CheckInTemplateStoreModel")
  .props({
    checkInTemplates: types.array(CheckInTemplateModel),
    currentCheckIn: types.maybeNull(CheckInTemplateModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    fetchCheckInTemplates: flow(function*() {
      try {
        const response: ApiResponse<any> = yield self.environment.api.getCheckInTemplates();
        self.checkInTemplates = response.data;
      } catch {
        // caught by Api Monitor
      }
    }),
    getCheckIn: flow(function*(checkInName) {
      try {
        const response: ApiResponse<any> = yield self.environment.api.getCheckInTemplates();
        const checkIn = {
          ...response.data.find(meeting => meeting.name === checkInName),
          currentStep: 0,
        };
        self.currentCheckIn = checkIn;
      } catch {
        // caught by Api Monitor
      }
    }),
    createCheckinTemplate: flow(function*(checkInTemplate) {
      const response: ApiResponse<any> = yield self.environment.api.createCheckinTemplate(
        checkInTemplate,
      );
      if (response.ok) {
        showToast("Check-in template created successfully", ToastMessageConstants.SUCCESS);
        return true;
      } else {
        showToast(
          "Error creating check-in template, please try again",
          ToastMessageConstants.ERROR,
        );
        return false;
      }
    }),
  }))
  .actions(self => ({
    updateCurrentCheckIn(checkInObj) {
      self.currentCheckIn = checkInObj;
    },
  }))
  .actions(self => ({
    load: flow(function*() {
      yield self.fetchCheckInTemplates();
    }),
  }));

type CheckInTemplateStoreType = typeof CheckInTemplateStoreModel.Type;

export interface ICheckInTemplateStore extends CheckInTemplateStoreType {
  checkInTemplates: any;
  currentCheckIn: any;
}
