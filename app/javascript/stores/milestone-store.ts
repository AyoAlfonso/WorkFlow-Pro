import { types, flow, getEnv } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import { MilestoneModel } from "~/models/milestone";
import { MilestonesForWeeklyCheckinModel } from "~/models/weekly-checkin-milestones";

export const MilestoneStoreModel = types
  .model("MilestoneModel")
  .props({
    milestonesForPersonalMeeting: types.maybeNull(types.array(MilestoneModel)),
    milestonesForWeeklyCheckin: types.maybeNull(MilestonesForWeeklyCheckinModel),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    getMilestonesForPersonalMeeting: flow(function*() {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getMilestonesForPersonalMeeting();
        self.milestonesForPersonalMeeting = response.data;
      } catch {
        showToast("There was an error retrieving the milestones", ToastMessageConstants.ERROR);
      }
    }),
    updateMilestoneFromPersonalMeeting: flow(function*(milestoneId) {
      const env = getEnv(self);
      try {
        const milestoneIndex = self.milestonesForPersonalMeeting.findIndex(
          milestone => milestone.id == milestoneId,
        );
        const milestone = self.milestonesForPersonalMeeting.find(
          milestone => milestone.id == milestoneId,
        );
        const response: any = yield env.api.updateMilestone(milestone);
        self.milestonesForPersonalMeeting[milestoneIndex] = response.data;
      } catch {
        showToast("There was an error updating the milestone", ToastMessageConstants.ERROR);
      }
    }),
    getMilestonesForWeeklyCheckin: flow(function*(weekOf) {
      const env = getEnv(self);
      try {
        const response = yield env.api.getWeeklyCheckinMilestones(weekOf);
        self.milestonesForWeeklyCheckin = response.data;
      } catch {
        showToast("There was an error retrieving the milestones", ToastMessageConstants.ERROR);
      }
    }),
  }))
  .actions(self => ({
    updateDescriptionFromPersonalMeeting(id, description) {
      const milestoneIndex = self.milestonesForPersonalMeeting.findIndex(
        milestone => milestone.id == id,
      );
      self.milestonesForPersonalMeeting[milestoneIndex]["description"] = description;
      self.updateMilestoneFromPersonalMeeting(id);
    },
    updateStatusFromPersonalMeeting(id, status) {
      const milestoneIndex = self.milestonesForPersonalMeeting.findIndex(
        milestone => milestone.id == id,
      );
      self.milestonesForPersonalMeeting[milestoneIndex]["status"] = status;
      self.updateMilestoneFromPersonalMeeting(id);
    },
  }));

type MilestoneStoreType = typeof MilestoneStoreModel.Type;
export interface IMilestoneStore extends MilestoneStoreType {
  milestonesForPersonalMeeting;
}
