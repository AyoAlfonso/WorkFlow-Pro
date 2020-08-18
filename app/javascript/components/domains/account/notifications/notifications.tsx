import { Checkbox, Label } from "@rebass/forms";
import React, { useState } from "react";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import {
  BodyContainer,
  IconContainer,
  NotificationTableRowContainer,
  NotificationTableRowColumn,
  NotificationTableHeaderContainer,
} from "./notification-styles";
import { Icon, Text } from "~/components/shared";
import { Container, HeaderContainer, HeaderText } from "../container-styles";
import { observer } from "mobx-react";
import { EditNotification } from "./";
import * as R from "ramda";

export const Notifications = observer(
  (): JSX.Element => {
    const { t } = useTranslation();
    const { notificationStore } = useMst();
    const { notifications } = notificationStore;

    const renderNotificationRows = () => {
      return notifications.map(notification => (
        <NotificationTableRow key={notification.id} notification={notification} />
      ));
    };

    if (notificationStore.notificationToEdit !== null) {
      return <EditNotification />;
    } else {
      return (
        <Container>
          <HeaderContainer>
            <HeaderText>{t("profile.notifications")}</HeaderText>
          </HeaderContainer>
          <BodyContainer>
            <NotificationTableHeader />
            {renderNotificationRows()}
          </BodyContainer>
        </Container>
      );
    }
  },
);

interface INotificationTableRowProps {
  notification: any;
}

const NotificationTableRow = observer(
  ({ notification }: INotificationTableRowProps): JSX.Element => {
    const { notificationStore } = useMst();

    const handleEditNotification = notification => {
      notificationStore.setNotificationToEdit(notification);
    };

    const toggleEmailNotification = notification => {
      if (notification.method === "disabled") {
        notification.changeMethod("email");
      } else {
        notification.changeMethod("disabled");
      }
      notificationStore.update(notification);
    };

    const { method, notificationType, validations } = notification;
    return (
      <NotificationTableRowContainer>
        <NotificationTableRowColumn width={"30%"}>{notificationType}</NotificationTableRowColumn>
        <NotificationTableRowColumn width={"40%"}>
          {`${validations[0].dayOfWeek} @ ${validations[0].timeOfDay}`}
        </NotificationTableRowColumn>
        <NotificationTableRowColumn width={"10%"} justifyContent={"center"}>
          <Label justifyContent={"center"}>
            <Checkbox
              id={`${notificationType}-email`}
              name={notificationType}
              defaultChecked={method === "email"}
              onClick={() => {
                toggleEmailNotification(notification);
              }}
              style={{}}
            />
          </Label>
        </NotificationTableRowColumn>
        <NotificationTableRowColumn width={"15%"} justifyContent="flex-end">
          <IconContainer onClick={() => handleEditNotification(notification)}>
            <Icon icon={"Edit-2"} size={"15px"} iconColor={"grey80"} />
          </IconContainer>
        </NotificationTableRowColumn>
      </NotificationTableRowContainer>
    );
  },
);

const NotificationTableHeader = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <NotificationTableHeaderContainer>
      <NotificationTableRowContainer>
        <NotificationTableRowColumn width={"30%"}>
          <Text fontWeight={600}>{t("profile.notificationsTable.reminder")}</Text>
        </NotificationTableRowColumn>
        <NotificationTableRowColumn width={"40%"}>
          <Text fontWeight={600}>{t("profile.notificationsTable.repeat")}</Text>
        </NotificationTableRowColumn>
        <NotificationTableRowColumn width={"10%"} justifyContent={"center"}>
          <Text fontWeight={600}>{t("profile.notificationsTable.email")}</Text>
        </NotificationTableRowColumn>
        <NotificationTableRowColumn
          width={"10%"}
          justifyContent={"center"}
        ></NotificationTableRowColumn>
      </NotificationTableRowContainer>
    </NotificationTableHeaderContainer>
  );
};
