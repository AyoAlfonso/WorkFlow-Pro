import { types, flow, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { DescriptionTemplateModel } from "../models/description-template";
import { ApiResponse } from "apisauce";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import * as R from "ramda";

export const DescriptionTemplateStoreModel = types
  .model("DescriptionTemplateStoreModel")
  .props({
    descriptionTemplates: types.maybeNull(types.array(DescriptionTemplateModel)),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    fetchDescriptiveTemplates: flow(function*() {
      const response: ApiResponse<any> = yield self.environment.api.getDescriptionTemplates();
      self.descriptionTemplates = response.data.templates;
    }),
  }))
  .actions(self => ({
    updateDescriptiveTemplates: flow(function*(templates) {
      try {
        const response: ApiResponse<any> = yield self.environment.api.updateDescriptiveTemplates(templates
        );
        if (response.ok) {
          self.descriptionTemplates = response.data.templates;
          showToast("Templates updated", ToastMessageConstants.SUCCESS);
        }
      } catch {
        // caught bv Api Monitor
      }
    }),
    updateDescriptiveTemplatesBody: flow(function*(formData) {
     try {
        const response: ApiResponse<any> = yield self.environment.api.updateDescriptiveTemplatesBody(formData,
        );
        if (response.ok) {
            self.descriptionTemplates = response.data.templates;
          // self.descriptionTemplates = response.data.templates;
          // showToast("Templates updated", ToastMessageConstants.SUCCESS);
        }
      } catch {
        // caught bv Api Monitor
      }
    }),

    deleteDescriptiveTemplate: flow(function*(meetingId) {
      try {
        const response: ApiResponse<any> = yield self.environment.api.deleteMeeting(meetingId);
        return response.data;
        showToast("Template deleted", ToastMessageConstants.SUCCESS);
      } catch {
        // caught bv Api Monitor
      }
    })
  }))
  .actions(self => ({
    reset() {
      self.descriptionTemplates = [] as any;
    },
  }))
  .actions(self => ({
    load: flow(function*() {
      self.reset();
      self.fetchDescriptiveTemplates();
    }),
  }))

type DescriptionTemplateStoreType = typeof DescriptionTemplateStoreModel.Type;
export interface IDescriptionTemplateStore extends DescriptionTemplateStoreType {}
