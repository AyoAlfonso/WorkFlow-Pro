import * as React from "react";
import styled from "styled-components";
import { Button } from "~/components/shared/button";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { MeetingStep } from "./meeting-step";
import { HomeContainerBorders } from "../home/shared-components";
import { MeetingSideOptions } from "./meeting-side-options";
import { useTranslation } from "react-i18next";
import { WizardLayout } from "~/components/layouts/wizard-layout";

export interface ITeamMeetingProps {
  meeting: any;
  title: string;
  description: string;
  meetingStarted: boolean;
  startMeetingButton: JSX.Element;
  stopMeetingButton: JSX.Element;
  stepsComponent: JSX.Element;
}

export const MeetingWizardLayout = observer(
  ({
    meeting,
    title,
    description,
    meetingStarted,
    startMeetingButton,
    stopMeetingButton,
    stepsComponent,
  }: ITeamMeetingProps): JSX.Element => {
    const { t } = useTranslation();
    const { meetingStore } = useMst();

    return (
      <Container>
        <WizardLayout
          title={title}
          description={description}
          customActionButton={meetingStarted ? stopMeetingButton : startMeetingButton}
          childrenUnderDescription={
            <MeetingSideOptions teamId={meeting.teamId} meeting={meeting} />
          }
          showSkipButton={false}
          singleComponent={<MeetingStep meeting={meetingStore.currentMeeting} />}
          customStepsComponent={stepsComponent}
        />
      </Container>
    );
  },
);

const Container = styled.div`
  height: 100%;
`;

const MeetingControlButton = styled(Button)`
  width: 100%;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DateAndButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProgressBarTimerContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 16px;
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
`;

const AgendaContainer = styled(HomeContainerBorders)`
  width: 20%;
  margin-right: 10px;
  min-width: 320px;
  margin-top: 35px;
  padding: 16px;
  min-height: 500px;
`;

const ContentsContainer = styled.div`
  display: flex;
`;

const CoreFourWrapper = styled.div`
  width: 100%;
  margin-left: 20px;
  margin-top: 30px;
`;

const AgendaHeaderContainer = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
  padding-bottom: 10px;
`;
