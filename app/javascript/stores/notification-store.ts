import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { ApiResponse } from "apisauce";
import { NotificationModel } from "~/models/notification";
import * as R from "ramda";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";

export const NotificationStoreModel = types
  .model("NotificationStoreModel")
  .props({
    notifications: types.maybeNull(types.array(NotificationModel)),
    notificationToEdit: types.maybeNull(NotificationModel),
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
    reset() {
      self.notifications = [] as any;
    },
    setNotificationToEdit(notification) {
      self.notificationToEdit = R.clone(notification);
    },
    resetNotificationToEdit() {
      self.notificationToEdit = null;
    },
  }))
  .actions(self => ({
    load: flow(function*() {
      self.reset();
      yield self.fetchNotifications();
    }),
    update: flow(function*(notification, metadata) {
      const response: ApiResponse<any> = yield self.environment.api.updateNotification(
        notification,
        metadata,
      );
      if (response.ok) {
        self.notifications = response.data;
        showToast("Notification updated", ToastMessageConstants.SUCCESS);
      }
    }),
  }));

type NotificationStoreType = typeof NotificationStoreModel.Type;
export interface INotificationStore extends NotificationStoreType {
  notifications;
}
