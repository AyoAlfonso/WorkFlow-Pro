import { types } from "mobx-state-tree";

export const NotificationRule = types
  .model("NotificationRule")
  .props({
    interval: types.number,
    ruleType: types.string,
  })
  .views(self => ({}))
  .actions(self => ({}));

type NotificationRuleType = typeof NotificationRule.Type;
type NotificationRuleDataType = typeof NotificationRule.CreationType;

export interface INotificationRule extends NotificationRuleType {}
export interface INotificationRuleData extends NotificationRuleDataType {}
