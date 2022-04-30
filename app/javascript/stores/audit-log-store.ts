import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { AuditLogModel } from "../models/audit-log";
import moment from "moment";
import { ToastMessageConstants } from "~/constants/toast-types";
import { showToast } from "~/utils/toast-message";
import il8n from "i18next";
//import { ObjectiveLogModel } from "~/models/objective-log";

export const AuditLogStoreModel = types
  .model("AuditLogModel")
  .props({
    auditLogs: types.array(AuditLogModel),
    //objectiveLogs: types.maybeNull(types.array(ObjectiveLogModel)),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    getAudit: flow(function*(params) {
      const env = getEnv(self);
      try {
        const response: any = yield env.api.getAuditLogs(params);
        self.auditLogs = response.data.userActivityLogs;
        return response.data;
      } catch {
        showToast(`There was an error fetching the audit log`, ToastMessageConstants.ERROR);
      }
    }),
  }));

type AuditLogStoreType = typeof AuditLogStoreModel.Type;
export interface IAuditLogStore extends AuditLogStoreType {
  auditLog;
}