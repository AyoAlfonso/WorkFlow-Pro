import { types, getRoot } from "mobx-state-tree";

export const AuditLogModel = types
  .model("AuditLogModel")
  .props({
    id: types.identifierNumber,
    userId: types.maybeNull(types.string),
    browser: types.maybeNull(types.string),
    ipAddress: types.maybeNull(types.string),
    location: types.maybeNull(types.string),
    controller: types.maybeNull(types.string),
    action: types.maybeNull(types.string),
    params: types.maybeNull(types.string),
    companyId: types.maybeNull(types.number), /// might be string
    teamId: types.maybeNull(types.string),
    note: types.maybeNull(types.string),
    createdAt: types.maybeNull(types.string),
    updatedAt: types.maybeNull(types.string),
  })
  .views(self => ({
    // get auditId() {
    //   return self.id;
    // },
    // get auditAction() {
    //   return self.action;
    // },
    // get auditLocation() {
    //   return self.location;
    // },
    // get auditBrowser() {
    //   return self.browser;
    // },
  }))
  .actions(self => ({}));

type AuditLogModelType = typeof AuditLogModel.Type;
type AuditLogModelDataType = typeof AuditLogModel.CreationType;

export interface IAuditLog extends AuditLogModelType {}
export interface IAuditLogData extends AuditLogModelDataType {}
