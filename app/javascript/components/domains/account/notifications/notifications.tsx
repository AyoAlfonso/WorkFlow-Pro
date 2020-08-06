import { Checkbox, Label } from "@rebass/forms";
import React from "react";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import {
  BodyContainer,
  NotificationTableRowContainer,
  NotificationTableRowColumn,
  NotificationTableHeaderContainer,
} from "./notification-styles";
import { Icon, Text } from "~/components/shared";
import { Container, HeaderContainer, HeaderText } from "../container-styles";
import { observer } from "mobx-react";

export const Notifications = (): JSX.Element => {
  const { t } = useTranslation();
  const { notificationStore } = useMst();
  const { notifications } = notificationStore;

  const renderNotificationRows = () => {
    return notifications.map(notification => (
      <NotificationTableRow key={notification.id} notification={notification} />
    ));
  };

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
};

interface INotificationTableRowProps {
  notification: any;
}

const NotificationTableRow = observer(
  ({ notification }: INotificationTableRowProps): JSX.Element => {
    const { notificationStore } = useMst();

    const toggleEmailNotification = notification => {
      if (notification.method === "disabled") {
        notification.changeMethod("email");
      } else {
        notification.changeMethod("disabled");
      }
      notificationStore.update(notification);
    };

    const { notificationType, rule, method } = notification;
    return (
      <NotificationTableRowContainer>
        <NotificationTableRowColumn width={"30%"}>{notificationType}</NotificationTableRowColumn>
        <NotificationTableRowColumn width={"40%"}>{rule}</NotificationTableRowColumn>
        <NotificationTableRowColumn width={"10%"} justifyContent={"center"}>
          <Label justifyContent={"center"}>
            <Checkbox
              id={`${notificationType}-email`}
              name={notificationType}
              defaultChecked={method === "email"}
              onClick={() => {
                toggleEmailNotification(notification);
              }}
            />
          </Label>
        </NotificationTableRowColumn>
        <NotificationTableRowColumn width={"15%"} justifyContent={"flex-end"}>
          <Icon icon={"Edit-2"} size={"15px"} iconColor={"grey80"} />
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
          <Text fontWeight={600}>{t("profile.notificationsTable.type")}</Text>
        </NotificationTableRowColumn>
        <NotificationTableRowColumn width={"40%"}>
          <Text fontWeight={600}>{t("profile.notificationsTable.rule")}</Text>
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
