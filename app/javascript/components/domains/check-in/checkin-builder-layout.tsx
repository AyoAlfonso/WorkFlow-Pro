import * as React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import { WizardLayout } from "~/components/layouts/wizard-layout";
import * as R from "ramda";
import { Button } from "~/components/shared/button";
import { Icon } from "~/components/shared";
import { CheckinBuilderSteps } from "./checkin-builder-steps";
import { CheckinBuilderAgenda } from "./components/check-in-builder-agenda";
import { useMst } from "~/setup/root";
import moment from "moment";

interface SelectedStepType {
  stepType: string;
  name: string;
  iconName: string;
  question?: string;
  instructions: string;
  orderIndex: number;
  componentToRender: string;
  variant?: string;
}

export interface ParticipantsProps {
  id: number;
  type: string;
  defaultAvatarColor: string;
  avatarUrl?: string;
  name: string | null;
  lastName?: string;
  executive?: number;
}

export const CheckInBuilderLayout = observer(
  (): JSX.Element => {
    const [currentStep, setCurrentStep] = useState(0);
    const [checkinName, setCheckinName] = useState<string>("New Check-in");
    const [selectedSteps, setSelectedSteps] = useState<Array<SelectedStepType>>([]);
    const [participants, setParticipants] = useState<Array<ParticipantsProps>>([]);
    const [responseViewers, setResponseViewers] = useState("All Participants");
    const [cadence, setCadence] = useState<string>("Every Weekday");
    const [checkinTime, setCheckinTime] = useState<string>("09:00 AM");
    const [checkinDay, setCheckinDay] = useState<string>("Monday");
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [timezone, setTimeZone] = useState<string>("user");
    const [reminderUnit, setReminderUnit] = useState<string>("Hour(s)");
    const [anonymousResponse, setAnonymousResponse] = useState<boolean>(false);
    const [reminderValue, setReminderValue] = useState("1");
    const [selectedResponseViewers, setSelectedResponseViewers] = useState<
      Array<ParticipantsProps>
    >([]);
    const [checkinType, setCheckinType] = useState<string>("Team");
    const [checkinDescription, setCheckinDescription] = useState<string>("");

    const { companyStore, sessionStore } = useMst();
    const isForum = companyStore.company?.displayFormat == "Forum";

    const history = useHistory();

    const company = companyStore && {
      id: companyStore.company?.id,
      type: "company",
      defaultAvatarColor: "cautionYellow",
      avatarUrl: companyStore.company?.logoUrl,
      name: companyStore.company?.name,
    };

    const currentUser = sessionStore && {
      id: sessionStore.profile?.id,
      type: "user",
      defaultAvatarColor: sessionStore.profile?.defaultAvatarColor,
      avatarUrl: sessionStore.profile?.avatarUrl,
      name: sessionStore.profile?.firstName,
      lastName: sessionStore.profile?.lastName,
    };

    const viewers =
      responseViewers === "All Participants"
        ? participants
        : responseViewers == `Entire ${isForum ? "Forum" : "Company"}`
        ? [company]
        : responseViewers == "Just Me"
        ? [currentUser]
        : selectedResponseViewers;

    const steps = [
      {
        name: "Basic",
        description: "Set up the basic information of this check-in.",
        componentToRender: "basic",
        orderIndex: 0,
      },
      {
        name: "Steps",
        description:
          "Choose from a variety of step types that will encourage the kind of responses you are looking for.",
        componentToRender: "steps",
        orderIndex: 1,
      },
      {
        name: "Setup",
        description:
          "Configure who will be asked to response, the cadence of the Check-in, and who will see the responses.",
        componentToRender: "setup",
        orderIndex: 2,
      },
    ];

    const showDateTime = cadence == "Once" || cadence == "Monthly" || cadence == "Quarterly";
    const showDayTime = cadence == "Weekly" || cadence == "Bi-weekly";
    console.log({
      name: checkinName,
      steps: selectedSteps,
      participants: participants,
      anonymous: anonymousResponse,
      type: "dynamic",
      checkInType: checkinType,
      description: checkinDescription,
      timeZone: timezone,
      viewers: viewers,
      runOnce: cadence == "Once" && selectedDate,
      dateTimeConfig: {
        cadence: cadence,
        time: moment(checkinTime, ["hh:mm A"]).format("HH:mm"),
        date: showDateTime ? selectedDate : "",
        day: showDayTime ? checkinDay : "",
      },
      reminder: {
        unit: reminderUnit,
        value: reminderValue,
      },
      tags: ["global", "custom"],
    });

    const createCheckin = () => {
      const checkin = {
        name: checkinName,
        steps: selectedSteps,
        participants: participants,
        anonymous: anonymousResponse,
        type: "dynamic",
        checkInType: checkinType,
        description: checkinDescription,
        timeZone: timezone,
        viewers: viewers,
        runOnce: cadence == "Once" && selectedDate,
        dateTimeConfig: {
          cadence: cadence,
          time: moment(checkinTime, ["hh:mm A"]).format("HH:mm"),
          date: showDateTime ? selectedDate : "",
          day: showDayTime ? checkinDay : "",
        },
        reminder: {
          unit: reminderUnit,
          value: reminderValue,
        },
        tags: ["global", "custom"],
      };
    };

    const title = () => R.path([currentStep, "name"], steps);

    const description = () => R.path([currentStep, "description"], steps);

    const component = () => (
      <CheckinBuilderSteps
        checkinName={checkinName}
        setCheckinName={setCheckinName}
        step={steps[currentStep]}
        setSelectedSteps={setSelectedSteps}
        selectedSteps={selectedSteps}
        selectedItems={participants}
        setSelectedItems={setParticipants}
        setResponseViewers={setResponseViewers}
        responseViewers={responseViewers}
        cadence={cadence}
        setCadence={setCadence}
        checkinTime={checkinTime}
        setCheckinTime={setCheckinTime}
        checkinDay={checkinDay}
        setCheckinDay={setCheckinDay}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        timezone={timezone}
        setTimezone={setTimeZone}
        reminderUnit={reminderUnit}
        setReminderUnit={setReminderUnit}
        anonymousResponse={anonymousResponse}
        setAnonymousResponse={setAnonymousResponse}
        reminderValue={reminderValue}
        setReminderValue={setReminderValue}
        selectedResponseItems={selectedResponseViewers}
        setSelectedResponseItems={setSelectedResponseViewers}
        checkinType={checkinType}
        setCheckinType={setCheckinType}
        description={checkinDescription}
        setDescription={setCheckinDescription}
      />
    );

    const closeButtonClick = () => {
      if (confirm(`Are you sure you want to exit?`)) {
        history.push(`/check-in`);
      }
    };

    const finishCheckIn = () => {
      return (
        <StopButton
          variant={"primary"}
          onClick={() => {
            history.push(`/check-in`);
          }}
          small
          disabled={false}
        >
          Publish
        </StopButton>
      );
    };

    const actionButtons = () => {
      return (
        <>
          {currentStep > 0 && (
            <LeftButtonContainer>
              <BackButton
                small
                variant={"primaryOutline"}
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <StyledBackIcon icon={"Move2"} size={"15px"} iconColor={"primary100"} />
              </BackButton>
            </LeftButtonContainer>
          )}
          {currentStep + 1 < 3 ? (
            <NextButton
              small
              variant={"primary"}
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={currentStep >= 3}
            >
              Next
            </NextButton>
          ) : (
            finishCheckIn()
          )}
        </>
      );
    };

    return (
      <Container>
        <WizardLayout
          title={title()}
          description={description()}
          customActionButton={actionButtons()}
          childrenUnderDescription={
            <CheckinBuilderAgenda steps={steps} currentStep={currentStep} />
          }
          singleComponent={component()}
          showSkipButton={false}
          showCloseButton={true}
          onCloseButtonClick={closeButtonClick}
          showBackButton={false}
          bodyContainerOverflow={"hidden"}
        />
      </Container>
    );
  },
);

const Container = styled.div`
  height: 100%;
`;

type IButtonProps = {
  variant: string;
  onClick: () => void;
  small: boolean;
};

const NextButton = styled(Button)<IButtonProps>`
  width: 100%;
  font-size: 16px;
`;

const LeftButtonContainer = styled.div`
  margin-right: 16px;
`;

const BackButton = styled(Button)<IButtonProps>`
  width: 32px;
  padding-left: 0;
  padding-right: 0;
`;

const StyledBackIcon = styled(Icon)`
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
`;

type IStopMeetingButton = {
  variant: string;
  onClick: () => void;
  small: boolean;
  disabled: boolean;
};

const StopButton = styled(Button)<IStopMeetingButton>`
  width: 100%;
  margin: 0;
  font-size: 16px;
`;
