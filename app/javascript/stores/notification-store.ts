import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { ApiResponse } from "apisauce";
import { NotificationModel } from "~/models/notification";

export const NotificationStoreModel = types
  .model("NotificationStoreModel")
  .props({
    notifications: types.maybeNull(types.array(NotificationModel)),
  })
  .extend(withEnvironment())
  .views(self => ({}))
  .actions(self => ({
    fetchNotifications: flow(function*() {
      const response: ApiResponse<any> = yield self.environment.api.getNotifications();
      if (response.ok) {
        self.notifications = response.data;
      }
    }),
  }))
  .actions(self => ({
    reset() {
      self.notifications = [] as any;
    },
  }))
  .actions(self => ({
    load: flow(function*() {
      self.reset();
      yield self.fetchNotifications();
    }),
    update: flow(function*(notification) {
      const response: ApiResponse<any> = yield self.environment.api.updateNotification(
        notification,
      );
      if (response.ok) {
        self.notifications = response.data;
      }
    }),
  }));

type NotificationStoreType = typeof NotificationStoreModel.Type;
export interface INotificationStore extends NotificationStoreType {
  notifications;
}
