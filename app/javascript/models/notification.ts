import { types } from "mobx-state-tree";

export const NotificationModel = types
  .model("NotificationModel")
  .props({
    id: types.identifierNumber,
    notificationType: types.string,
    rule: types.string,
    method: types.string,
  })
  .views(self => ({}))
  .actions(self => ({
    changeMethod: method => {
      self.method = method;
    },
  }));

type NotificationModelType = typeof NotificationModel.Type;
type NotificationModelDataType = typeof NotificationModel.CreationType;

export interface INotification extends NotificationModelType {}
export interface INotificationData extends NotificationModelDataType {}
