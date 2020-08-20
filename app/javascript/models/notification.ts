import { types } from "mobx-state-tree";
import { NotificationRule, NotificationValidation } from "./";

export const NotificationModel = types
  .model("NotificationModel")
  .props({
    id: types.identifierNumber,
    notificationType: types.string,
    rules: types.array(NotificationRule),
    validations: types.array(NotificationValidation),
    method: types.string,
  })
  .views(self => ({}))
  .actions(self => ({
    changeMethod: method => {
      self.method = method;
    },
    changeTimeOfDay: timeOfDay => {
      self.validations[0].timeOfDay = timeOfDay;
    },
    changeDayOfWeek: dayOfWeek => {
      self.validations[0].dayOfWeek = dayOfWeek;
    },
  }));

type NotificationModelType = typeof NotificationModel.Type;
type NotificationModelDataType = typeof NotificationModel.CreationType;

export interface INotification extends NotificationModelType {}
export interface INotificationData extends NotificationModelDataType {}
