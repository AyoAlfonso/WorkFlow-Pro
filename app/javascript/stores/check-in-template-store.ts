import { types, flow, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import checkInTypes from "~/constants/check-in-types";
import { CheckInTemplateModel } from "../models/check-in-templates";
import { ApiResponse } from "apisauce";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import * as R from "ramda";
import { StepModel } from "~/models/step";
import { toJS } from "mobx";
import { CheckInArtifactsModel } from "~/models/check-in-artifacts";
import { sortByDueDate, sortByName } from "~/utils/sorting";

export const CheckInTemplateStoreModel = types
  .model("CheckInTemplateStoreModel")
  .props({
    checkInTemplates: types.array(CheckInTemplateModel),
    currentCheckIn: types.maybeNull(CheckInTemplateModel),
    checkIns: types.array(CheckInArtifactsModel),
    currentCheckInArtifact: types.maybeNull(CheckInArtifactsModel),
    checkInTemplateInsights: types.maybeNull(types.frozen()),
  })
  .extend(withEnvironment())
  .actions(self => ({
    fetchCheckInTemplates: flow(function*() {
      try {
        const response: ApiResponse<any> = yield self.environment.api.getCheckInTemplates();

        self.checkInTemplates = response.data;
        console.log(self.checkInTemplates, "self.checkInTemplates ");
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
    getCheckIns: flow(function*() {
      console.log("in getCheckIns");
      try {
        const response: ApiResponse<any> = yield self.environment.api.getCheckins();
        self.checkIns = response.data.checkInArtifacts;
        console.log(self.checkIns, response.data.checkInArtifacts);
        return response.data.checkInArtifacts;
      } catch {
        // showToast("Something went wrong", ToastMessageConstants.ERROR);
        // caught by Api Monitor
      }
    }),
    createCheckinTemplate: flow(function*(checkInTemplate) {
      const response: ApiResponse<any> = yield self.environment.api.createCheckinTemplate(
        checkInTemplate,
      );
      if (response.ok) {
        showToast("Check-in template created successfully", ToastMessageConstants.SUCCESS);
        return response.data.template.id;
      } else {
        showToast(
          "Error creating check-in template, please try again",
          ToastMessageConstants.ERROR,
        );
        return false;
      }
    }),
    publishCheckinTemplate: flow(function*(id) {
      const response: ApiResponse<any> = yield self.environment.api.publishCheckin(id);
      if (response.ok) {
        return true;
      } else {
        showToast(
          "Error publishing check-in template, please try again",
          ToastMessageConstants.ERROR,
        );
        return false;
      }
    }),
    runCheckinOnce: flow(function*(checkInId) {
      const response = yield self.environment.api.runCheckinOnce(checkInId);
      if (response.ok) {
        return response.data.checkInArtifact?.id;
      } else {
        showToast("Error running check-in template, please try again", ToastMessageConstants.ERROR);
        return false;
      }
    }),
    updateCheckinArtifact: flow(function*(id, value) {
      const response: ApiResponse<any> = yield self.environment.api.updateCheckinArtifact(
        id,
        value,
      );
      if (response.ok) {
        showToast("Check-in updated successfully", ToastMessageConstants.SUCCESS);
        self.currentCheckInArtifact = response.data.checkInArtifact;
        return true;
      } else {
        showToast("Something went wrong, please try again", ToastMessageConstants.ERROR);
        return false;
      }
    }),
    updateCheckinTemplate: flow(function*(id, value) {
      const response: ApiResponse<any> = yield self.environment.api.updateCheckinTemplate(
        id,
        value,
      );
      if (response.ok) {
        showToast("Template updated successfully", ToastMessageConstants.SUCCESS);
        self.currentCheckIn = response.data.template;
        return response.data.checkInTemplate.id;
      } else {
        showToast("Something went wrong, please try again", ToastMessageConstants.ERROR);
        return false;
      }
    }),
    skipCheckIn: flow(function*(checkInId) {
      const response: ApiResponse<any> = yield self.environment.api.updateCheckinArtifact(
        checkInId,
        { skip: true },
      );
      if (response.ok) {
        showToast("Check-in skipped successfully", ToastMessageConstants.SUCCESS);
        const checkins = self.checkIns.filter(checkin => checkin.id !== checkInId);
        const newCheckins = [...checkins, response.data.checkInArtifact];
        self.checkIns = newCheckins as any;
        return true;
      } else {
        showToast("Something went wrong, please try again", ToastMessageConstants.ERROR);
        return false;
      }
    }),
    getCheckInTemplateInsights: flow(function*(id) {
      const response: ApiResponse<any> = yield self.environment.api.getTemplateInsights(id);
      if (response.ok) {
        self.checkInTemplateInsights = response.data.template;
        return response.data.template;
      } else {
        showToast("Something went wrong, please try again", ToastMessageConstants.ERROR);
        return false;
      }
    }),
  }))
  .actions(self => ({
    updateCurrentCheckIn(checkInObj) {
      self.currentCheckIn = checkInObj;
    },
    findCheckinTemplate(id) {
      const checkin = toJS(self.checkIns).find(checkin => checkin.id == id);
      const currentCheckIn = { ...checkin?.checkInTemplate, currentStep: 1 };
      self.currentCheckIn = currentCheckIn;
      self.currentCheckInArtifact = checkin;
      return { checkin, currentCheckIn };
    },
    updateCheckInArtifactResponse(index, response) {
      const responseArray = toJS(self.currentCheckInArtifact).checkInArtifactLogs[0]?.responses;
      responseArray[index] = response;
      const item = {
        responses: responseArray,
      };
      self.updateCheckinArtifact(self.currentCheckInArtifact.id, item);
    },
    getTemplateById(id) {
      const checkin = toJS(self.checkInTemplates).find(checkin => checkin.id == id);
      self.currentCheckIn = checkin;
      return checkin;
    },
    sortArtifacts(sortBy) {
      const checkIns = self.checkIns;
      let sortedCheckins;
      if (sortBy === "dueDate") {
        const filteredArtifacts = checkIns
          .filter(artifact => artifact.checkInTemplate.runOnce)
          .slice()
          .sort(sortByDueDate);

        const data = checkIns
          .filter(artifact => !artifact.checkInTemplate.runOnce)
          .slice()
          .sort(sortByDueDate);

        sortedCheckins = [...data, ...filteredArtifacts];
      } else if (sortBy === "name") {
        sortedCheckins = checkIns.slice().sort(sortByName);
      }
      self.checkIns = sortedCheckins;
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
