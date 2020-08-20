import { types } from "mobx-state-tree";

export const NotificationValidation = types
  .model("NotificationValidation")
  .props({
    timeOfDay: types.string,
    dayOfWeek: types.string,
  })
  .views(self => ({}))
  .actions(self => ({}));

type NotificationValidationType = typeof NotificationValidation.Type;
type NotificationValidationDataType = typeof NotificationValidation.CreationType;

export interface INotificationValidation extends NotificationValidationType {}
export interface INotificationValidationData extends NotificationValidationDataType {}
