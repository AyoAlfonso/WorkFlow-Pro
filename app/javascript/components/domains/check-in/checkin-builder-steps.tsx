import React, { useEffect, useState } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { BasicStep } from "./basic-step";
import { SelectedStepType, StepsSelectorPage } from "./steps-selector-page";
import { SetupPage } from "./setup-page";
import { ParticipantsProps } from "./checkin-builder-layout";

interface CheckinBuilderStepsProps {
  step: any;
  checkinName: string;
  setCheckinName: React.Dispatch<React.SetStateAction<string>>;
  setSelectedSteps: React.Dispatch<React.SetStateAction<Array<SelectedStepType>>>;
  selectedSteps: Array<SelectedStepType>;
  selectedItems: Array<ParticipantsProps>;
  setSelectedItems: React.Dispatch<React.SetStateAction<Array<ParticipantsProps>>>;
  setResponseViewers: React.Dispatch<React.SetStateAction<string>>;
  responseViewers: string;
  cadence: string;
  setCadence: React.Dispatch<React.SetStateAction<string>>;
  checkinTime: string;
  setCheckinTime: React.Dispatch<React.SetStateAction<string>>;
  checkinDay: string;
  setCheckinDay: React.Dispatch<React.SetStateAction<string>>;
  timezone: string;
  setTimezone: React.Dispatch<React.SetStateAction<string>>;
  reminderUnit: string;
  setReminderUnit: React.Dispatch<React.SetStateAction<string>>;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  anonymousResponse: boolean;
  setAnonymousResponse: React.Dispatch<React.SetStateAction<boolean>>;
  reminderValue: string;
  setReminderValue: React.Dispatch<React.SetStateAction<string>>;
  selectedResponseItems: Array<ParticipantsProps>;
  setSelectedResponseItems: React.Dispatch<React.SetStateAction<Array<ParticipantsProps>>>;
  checkinType: string;
  setCheckinType: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

export const CheckinBuilderSteps = ({
  step,
  checkinName,
  setCheckinName,
  selectedSteps,
  setSelectedSteps,
  selectedItems,
  setSelectedItems,
  responseViewers,
  setResponseViewers,
  cadence,
  setCadence,
  checkinTime,
  setCheckinTime,
  checkinDay,
  setCheckinDay,
  timezone,
  setTimezone,
  reminderUnit,
  setReminderUnit,
  selectedDate,
  setSelectedDate,
  anonymousResponse,
  setAnonymousResponse,
  reminderValue,
  setReminderValue,
  selectedResponseItems,
  setSelectedResponseItems,
  checkinType,
  setCheckinType,
  description,
  setDescription,
}: CheckinBuilderStepsProps): JSX.Element => {
  const stepComponent = step => {
    switch (step.componentToRender) {
      case "basic":
        return (
          <>
            <CheckinName>{checkinName}</CheckinName>
            <BasicStep
              checkinName={checkinName}
              setCheckinName={setCheckinName}
              checkinType={checkinType}
              setCheckinType={setCheckinType}
              description={description}
              setDescription={setDescription}
            />
          </>
        );
      case "steps":
        return (
          <>
            <CheckinName>{checkinName}</CheckinName>
            <StepsSelectorPage setSelectedSteps={setSelectedSteps} selectedSteps={selectedSteps} />
          </>
        );
      case "setup":
        return (
          <>
            <CheckinName>{checkinName}</CheckinName>
            <SetupPage
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
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
              setTimezone={setTimezone}
              reminderUnit={reminderUnit}
              setReminderUnit={setReminderUnit}
              anonymousResponse={anonymousResponse}
              setAnonymousResponse={setAnonymousResponse}
              reminderValue={reminderValue}
              setReminderValue={setReminderValue}
              selectedResponseItems={selectedResponseItems}
              setSelectedResponseItems={setSelectedResponseItems}
            />
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <BodyContainer>
      <StepComponentContainer>{stepComponent(step)}</StepComponentContainer>
    </BodyContainer>
  );
};

const BodyContainer = styled.div`
  display: flex;
  width: -webkit-fill-available;
  width: -moz-available;
  justify-content: center;
`;

const StepComponentContainer = styled.div`
  width: inherit;
  min-width: 320px;
  // margin-left: 8px;
  @media only screen and (max-width: 768px) {
    margin-left: 0;
  }
  @media only screen and (min-width: 1200px) {
    width: -webkit-fill-available;
  }
`;

const CheckinName = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme.colors.black};
  display: inline-block;
  margin-bottom: 32px;
`;
