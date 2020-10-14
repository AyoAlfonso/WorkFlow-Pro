import { observer } from "mobx-react";
import React, { useState } from "react";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import { BodyContainer, NotificationEditTableColumn } from "./notification-styles";
import { Button, Icon, Input, Text } from "~/components/shared";
import { Label, Select } from "~/components/shared/input";
import * as R from "ramda";
import { Container, HeaderContainer, HeaderText, IconContainer } from "../container-styles";
import { TimePicker } from "./";
import styled from "styled-components";

export const EditNotification = observer(
  (): JSX.Element => {
    const { t } = useTranslation();
    const { notificationStore } = useMst();
    const { notificationToEdit } = notificationStore;

    const updateNotification = notification => {
      notificationStore.update(notification);
    };

    return (
      <Container>
        <HeaderContainer>
          <HeaderTextAndIconContainer>
            <IconContainer pr="8px" onClick={() => notificationStore.resetNotificationToEdit()}>
              <Icon icon={"Chevron-Left"} size={"18px"} iconColor={"grey40"} />
            </IconContainer>
            <HeaderText>{notificationToEdit.notificationType}</HeaderText>
          </HeaderTextAndIconContainer>
        </HeaderContainer>
        <BodyContainer>
          <NotificationEditTableColumn>
            <RenderNotificationTimeOptions />
            <RenderNotificationDayOptions />
          </NotificationEditTableColumn>
          <SaveButtonContainer>
            <Button
              small
              variant={"primary"}
              onClick={() => updateNotification(notificationToEdit)}
              mr={"44px"}
            >
              {t("general.save")}
            </Button>
          </SaveButtonContainer>
        </BodyContainer>
      </Container>
    );
  },
);

const RenderNotificationTimeOptions = (): JSX.Element => {
  const { t } = useTranslation();
  const [notificationTime, setNotificationTime] = useState();
  const { notificationStore } = useMst();
  const { notificationToEdit } = notificationStore;

  const handleTimeOfDayChange = time => {
    setNotificationTime(time);
    notificationToEdit.changeTimeOfDay(time);
  };

  return (
    <>
      <Label htmlFor="time">{t("profile.editNotification.reminder")}</Label>
      <TimePicker
        name="notification-time"
        onChange={e => {
          handleTimeOfDayChange(e.target.value);
        }}
        defaultValue={notificationToEdit.validations[0].timeOfDay}
        disabled={false}
      />
    </>
  );
};

const RenderNotificationDayOptions = (): JSX.Element => {
  const { t } = useTranslation();
  let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const [notificationDay, setNotificationDay] = useState();
  const { notificationStore } = useMst();
  const { notificationToEdit } = notificationStore;
  const dayOfWeek = notificationToEdit.validations[0].dayOfWeek;
  dayOfWeek === "Every Day" ? (days = ["Every Day"]) : null;

  const handleDayOfWeekChange = day => {
    setNotificationDay(day);
    notificationToEdit.changeDayOfWeek(day);
  };

  return (
    <Select
      name="day"
      onChange={e => {
        handleDayOfWeekChange(e.target.value);
      }}
      value={notificationDay}
      defaultValue={dayOfWeek}
      disabled={dayOfWeek === "Every Day"}
    >
      {R.map(
        (day: string) => (
          <option key={day} value={day}>
            {day}
          </option>
        ),
        days,
      )}
    </Select>
  );
};

export const HeaderTextAndIconContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const SaveButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: 332px;
`;
