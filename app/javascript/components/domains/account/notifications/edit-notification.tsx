import { observer } from "mobx-react";
import React, { useState } from "react";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import { BodyContainer, NotificationEditTableColumn } from "./notification-styles";
import { Button, Icon, Input, Text } from "~/components/shared";
import { Label, Select } from "~/components/shared/input";
import * as R from "ramda";
import { Container, HeaderContainer, HeaderText } from "../container-styles";
import { TimePicker } from "./";
import styled from "styled-components";
import { getNoticationName } from "./";

export const EditNotification = observer(
  (): JSX.Element => {
    const { t } = useTranslation();
    const { notificationStore } = useMst();
    const { notificationToEdit } = notificationStore;

    const updateNotification = notification => {
      notificationStore.update(notification, {
        note: `Updated notifications on settings module ${notificationToEdit.notificationType}`,
      });
    };

    return (
      <Container>
        <HeaderContainer>
          <HeaderTextAndIconContainer>
            <BackHeaderText onClick={() => notificationStore.resetNotificationToEdit()}>
              {t<string>("profile.notifications")}
            </BackHeaderText>
            <ChevronRight icon={"Chevron-Left"} size={"10px"} iconColor={"grey100"} />
            <HeaderText>{getNoticationName(notificationToEdit.notificationType)}</HeaderText>
          </HeaderTextAndIconContainer>
        </HeaderContainer>
        <BodyContainer>
          <NotificationEditTableColumn>
            <NotificationOptionsContainer>
              {notificationToEdit.notificationType !== "Weekly Checkin" && (
                <RenderNotificationDayOptions days={["Friday", "Saturday", "Sunday", "Monday"]} />
              )}
              {notificationToEdit.notificationType == "Weekly Checkin" && (
                <RenderNotificationDayOptions
                  days={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}
                />
              )}
            </NotificationOptionsContainer>
            <NotificationOptionsContainer>
              {notificationToEdit.notificationType !== "Evening Reflection" && (
                <RenderNotificationTimeOptions />
              )}
              {notificationToEdit.notificationType == "Evening Reflection" && (
                <RenderNotificationTimeOptions beginLimit={"12:00 PM"} endLimit={"11:00 PM"} />
              )}
            </NotificationOptionsContainer>
          </NotificationEditTableColumn>
          <SaveButtonContainer>
            <Button
              small
              variant={"primary"}
              onClick={() => updateNotification(notificationToEdit)}
              mr={"44px"}
            >
              {t<string>("general.save")}
            </Button>
          </SaveButtonContainer>
        </BodyContainer>
      </Container>
    );
  },
);

const RenderNotificationTimeOptions = ({ ...props }): JSX.Element => {
  const { t } = useTranslation();
  const [notificationTime, setNotificationTime] = useState();
  const { notificationStore } = useMst();
  const { notificationToEdit } = notificationStore;

  const handleTimeOfDayChange = time => {
    setNotificationTime(time);
    notificationToEdit.changeTimeOfDay(time);
  };

  return (
    <OptionContainer>
      <Label htmlFor="time">{t<string>("profile.editNotification.time")}</Label>
      <TimePicker
        name="notification-time"
        onChange={e => {
          handleTimeOfDayChange(e.target.value);
        }}
        beginLimit={props.beginLimit}
        endLimit={props.endLimit}
        defaultValue={notificationToEdit.validations[0].timeOfDay}
        disabled={false}
        style={{ width: "18.75em" }}
      />
    </OptionContainer>
  );
};

interface RenderNotificationDayOptionsProps {
  days: any[];
}

const RenderNotificationDayOptions = ({ days }: RenderNotificationDayOptionsProps): JSX.Element => {
  const { t } = useTranslation();
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
    <OptionContainer>
      <Label htmlFor="day">{t<string>("profile.editNotification.day")}</Label>
      <Select
        name="day"
        onChange={e => {
          handleDayOfWeekChange(e.target.value);
        }}
        value={notificationDay}
        defaultValue={dayOfWeek}
        disabled={dayOfWeek === "Every Day"}
        style={{ width: "18.75em" }}
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
    </OptionContainer>
  );
};

const NotificationOptionsContainer = styled.div`
  margin-bottom: 16px;
`;

export const HeaderTextAndIconContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const SaveButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 332px;
`;

const BackHeaderText = styled(HeaderText)`
  color: ${props => props.theme.colors.grey100};
  margin-right: 0.5em;
  cursor: pointer;
`;

const ChevronRight = styled(Icon)`
  transform: rotate(180deg);
  margin-right: 0.5em;
  margin-top: 0.25em;
`;

const OptionContainer = styled.div`
  margin-right: 1.5em;
`;
