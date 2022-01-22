import * as React from "react";
import styled from "styled-components";
import * as R from "ramda";
import { CodeBlockDiv, ContainerDiv, Divider, PropsList, RowDiv } from "./shared";
import { atomOneLight, CopyBlock } from "react-code-blocks";
import { rootStore, Provider } from "../app/javascript/setup/root";
import { useTranslation } from "react-i18next";
import { WizardLayout } from "~/components/layouts/wizard-layout";
import { CheckinStep } from "~/components/domains/check-in/components/checkin-step";
import { Icon, Text, Button } from "~/components/shared";
import { CheckInSideOptions } from "~/components/domains/check-in/checkin-side-options";
import { WeeklyReflection } from "~/components/domains/meetings/components/weekly-reflection";
import { TextStep } from "~/components/domains/meetings/shared/text-step";
import { ImageStep } from "~/components/domains/meetings/shared/image-step";
import { EmbedStep } from "~/components/domains/meetings/shared/embed-step";
import { KpiComponent } from "~/components/domains/check-in/components/kpi";
import { Recap } from "~/components/domains/meetings/components/recap";
import { MeetingRating } from "~/components/domains/meetings/components/meeting-rating";

export default { title: "Meeting" };

const meeting = {
  id: 1,
  name: "Weekly Check In",
  checkInType: "weekly_check_in",
  description: "",
  checkInTemplatesSteps: [
    {
      id: 25,
      stepType: "component",
      orderIndex: 0,
      name: "Milestones",
      instructions: "Provide updates on your Milestones and KPIs to complete this weekly check-in.",
      componentToRender: "WeeklyMilestones",
      checkInTemplateId: 1,
    },
    {
      id: 26,
      stepType: "component",
      orderIndex: 1,
      name: "KPI",
      instructions: "Provide updates on your Milestones and KPIs to complete this weekly check-in.",
      componentToRender: "KPI",
      checkInTemplateId: 1,
    },
  ],
  currentStep: 0,
};

const teamMeeting = {
  id: 42,
  name: "Weekly Meeting",
  meetingType: "team_weekly",
  averageRating: null,
  issuesDone: null,
  keyActivitiesDone: null,
  averageTeamMood: null,
  goalProgress: null,
  teamId: 1,
  createdAt: "2022-01-11T11:05:09.103Z",
  startTime: "2022-01-11T11:05:11.000Z",
  endTime: null,
  currentStep: 2,
  hostName: "Christopher Pang",
  scheduledStartTime: null,
  totalDuration: 75,
  title: "Tuesday, January 11",
  notes: "",
  meetingTemplateId: 1,
  hostedBy: {
    id: 3,
    firstName: "Christopher",
    lastName: "Pang",
    phoneNumber: "778-998-1234",
    email: "christopher@laterolabs.com",
    createdAt: "2021-10-13T11:04:27.502Z",
    updatedAt: "2022-01-07T18:49:27.064Z",
    personalVision: "Great!",
    companyId: 2,
    timezone: "(GMT-08:00) Pacific Time (US & Canada)",
    userRoleId: 2,
    defaultAvatarColor: "fuschiaBlue",
    title: "",
    deletedAt: null,
    defaultSelectedCompanyId: 2,
    avatarUrl:
      "http://localhost:3000/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBHdz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--28646dc00f0bd1b1e066a0b59b1677e1319e8e68/blob",
  },
  settings: {},
  steps: [
    {
      id: 419,
      stepType: "image",
      orderIndex: 0,
      name: "How Are You Feeling?",
      instructions: "Go beyond the obvious to identify exactly what you're feeling",
      duration: 5,
      componentToRender: null,
      imageUrl:
        "http://localhost:3000/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBMQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--f7f93b4f445408eb5882926f46194e8095a27923/mood-board.png",
      descriptionTextContent: "",
      linkEmbed: null,
    },
    {
      id: 420,
      stepType: "component",
      orderIndex: 1,
      name: "Conversation Starter",
      instructions: "Use the prompt below and have a conversation around the topic as a team.",
      duration: 5,
      componentToRender: "ConversationStarter",
      imageUrl: null,
      descriptionTextContent: "",
      linkEmbed: null,
    },
    {
      id: 421,
      stepType: "component",
      orderIndex: 2,
      name: "Team Pulse",
      instructions: "Review the team pulse for the past 7 days.",
      duration: 5,
      componentToRender: "TeamPulse",
      imageUrl: null,
      descriptionTextContent: "",
      linkEmbed: null,
    },
    {
      id: 422,
      stepType: "description_text",
      orderIndex: 3,
      name: "Updates",
      instructions:
        "Provide personal or work-related updates. You can also use this time to give shoutouts.",
      duration: 5,
      componentToRender: null,
      imageUrl:
        "http://localhost:3000/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBMUT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2a7b1c5dd9374a65d259d3bc1a11f2930837597e/updates.png",
      descriptionTextContent:
        '<div class="trix-content">\n  Do you have anything to share with the team? It can be personal, about work, or simply a shoutout!\n</div>\n',
      linkEmbed: null,
    },
    {
      id: 423,
      stepType: "embedded_link",
      orderIndex: 4,
      name: "Dashboard",
      instructions: "Review the Key Metrics from this week.",
      duration: 5,
      componentToRender: null,
      imageUrl: null,
      descriptionTextContent: "",
      linkEmbed: "https://public.datapine.com/#board/pGEtHxIopXJN4hJmpqlN1",
    },
    {
      id: 424,
      stepType: "component",
      orderIndex: 5,
      name: "Goals",
      instructions:
        "Review Goals and Objectives. Inspect Objectives that are not on track and need attention.",
      duration: 5,
      componentToRender: "Goals",
      imageUrl: null,
      descriptionTextContent: "",
      linkEmbed: null,
    },
    {
      id: 425,
      stepType: "component",
      orderIndex: 6,
      name: "Pyns",
      instructions:
        "Review Pyns list and discuss why they weren’t completed if there are any items outstanding.",
      duration: 5,
      componentToRender: "KeyActivities",
      imageUrl: null,
      descriptionTextContent: "",
      linkEmbed: null,
    },
    {
      id: 426,
      stepType: "component",
      orderIndex: 7,
      name: "Issues",
      instructions:
        "Review the Issues list and prioritize as a team to select the top 3 items. Discuss them one by one and move onto the next item if you have addressed all 3 items in the allotted time.",
      duration: 30,
      componentToRender: "Issues",
      imageUrl: null,
      descriptionTextContent: "",
      linkEmbed: null,
    },
    {
      id: 427,
      stepType: "component",
      orderIndex: 8,
      name: "Recap",
      instructions:
        "Quick recap of today’s meeting. Review the newly added Pyns and make sure everyone knows what they’re responsible for.",
      duration: 5,
      componentToRender: "Recap",
      imageUrl: null,
      descriptionTextContent: "",
      linkEmbed: null,
    },
    {
      id: 428,
      stepType: "component",
      orderIndex: 9,
      name: "Meeting Rating",
      instructions:
        "Rate the meeting out of 5 in terms of how effective it was in helping you move closer to Goals.",
      duration: 5,
      componentToRender: "MeetingRating",
      imageUrl: null,
      descriptionTextContent: "",
      linkEmbed: null,
    },
  ],
  currentWeekAverageUserEmotions: {
    emotionScores: [],
    recordDates: [],
  },
  currentMonthAverageUserEmotions: {
    emotionScores: [],
    recordDates: [],
  },
  currentWeekAverageTeamEmotions: 3,
  currentMonthAverageTeamEmotions: 3,
  emotionScorePercentageDifference: 300,
  emotionScorePercentageDifferenceMonthly: 300,
  statsForWeek: null,
  statsForMonth: null,
  myCurrentMilestones: [],
  habitsPercentageIncreaseFromPreviousWeek: null,
  habitsPercentageIncreaseFromPreviousMonth: null,
};

export const Meeting = () => {
  const [currentStep, setCurrentStep] = React.useState(0);

  const meetingTitle = () => R.path(["name"], meeting);

  const meetingDescription = () => meeting.checkInTemplatesSteps[currentStep].instructions;

  const nextStep = stepIndex => {
    meeting.currentStep = stepIndex;
    setCurrentStep(stepIndex);
  };

  const renderVisibilityText = () => {
    const { t } = useTranslation();
    return (
      <StepText type={"small"}>
        <Icon icon={"Visibility"} size={"15px"} iconColor={"grey80"} />
        {t("Everyone in your company will see your response")}
      </StepText>
    );
  };

  const childrenUnderDescription = () => (
    <ChildrenContainer>
      {renderVisibilityText()}
      {/* <CheckInSideOptions checkIn={meeting} /> */}
    </ChildrenContainer>
  );

  const closeButtonClick = () => {
    if (confirm(`Are you sure you want to exit this weekly check-in?`)) {
      console.log("pushed to home");
    }
  };

  const StopMeetingButton = () => {
    return (
      <StopButton
        variant={"primary"}
        onClick={() => {
          console.log(`push to /check-in/success`);
        }}
        small
        disabled={false}
      >
        Publish Check-in
      </StopButton>
    );
  };

  const numberOfSteps = meeting.checkInTemplatesSteps.length;
  const meetingComponent = () => <CheckinStep checkin={meeting} />;

  const actionButtons = () => {
    return (
      <>
        {currentStep > 0 && (
          <LeftButtonContainer>
            <BackButton small variant={"primaryOutline"} onClick={() => nextStep(currentStep - 1)}>
              <StyledBackIcon icon={"Move2"} size={"15px"} iconColor={"primary100"} />
            </BackButton>
          </LeftButtonContainer>
        )}
        {currentStep + 1 < numberOfSteps ? (
          <NextButton
            small
            variant={"primary"}
            onClick={() => {
              nextStep(currentStep + 1);
              console.log("clicked");
              console.log(currentStep);
            }}
            disabled={currentStep >= numberOfSteps}
          >
            Next Question
          </NextButton>
        ) : (
          StopMeetingButton()
        )}
      </>
    );
  };

  const renderStepsForMobile = () => (
    <QuestionText type={"small"}>{`Question ${currentStep + 1} / ${numberOfSteps}`}</QuestionText>
  );
  return (
    <Provider value={rootStore}>
      <ContainerDiv>
        <h1>Wizard Layout</h1>
        <CodeBlockDiv mb={"20px"}>
          <CopyBlock
            text={`
              import * as React from "react";
              import { WizardLayout } from "~/components/layouts/wizard-layout";
              
              <WizardLayout
                title={meetingTitle()}
                description={meetingDescription()}
                customActionButton={actionButtons()}
                childrenUnderDescription={childrenUnderDescription()}
                showSkipButton={false}
                singleComponent={meetingComponent()}
                showLynchpynLogo={false}
                showCloseButton={true}
                onCloseButtonClick={closeButtonClick}
                stepsForMobile={renderStepsForMobile()}
                textUnderMobileButton={renderVisibilityText()}
              />
              )
            `}
            language={"tsx"}
            theme={atomOneLight}
          />
        </CodeBlockDiv>
        <Container>
          <WizardLayout
            title={meetingTitle()}
            description={meetingDescription()}
            customActionButton={actionButtons()}
            childrenUnderDescription={childrenUnderDescription()}
            showSkipButton={false}
            singleComponent={meetingComponent()}
            showLynchpynLogo={false}
            showCloseButton={true}
            onCloseButtonClick={closeButtonClick}
            stepsForMobile={renderStepsForMobile()}
            textUnderMobileButton={renderVisibilityText()}
          />
        </Container>
      </ContainerDiv>
      <ContainerDiv>
        <h1>Text Step</h1>
        <Container>
          <TextStep step={teamMeeting.steps[3]} />
        </Container>
      </ContainerDiv>
      <ContainerDiv>
        <h1>Image Step</h1>
        <Container>
          <ImageStep step={teamMeeting.steps[0]} />
        </Container>
      </ContainerDiv>
      <ContainerDiv>
        <h1>Embedded Link</h1>
        <Container>
          <EmbedStep linkEmbed={teamMeeting.steps[4].linkEmbed} />
        </Container>
      </ContainerDiv>
      <ContainerDiv>
        <h1>Kpi</h1>
        <Container>
          <KpiComponent />
        </Container>
      </ContainerDiv>
    </Provider>
  );
};

const Container = styled.div`
  padding: 0 10px;
  margin-bottom: 20px;
`;

const StepText = styled(Text)`
  color: ${props => props.theme.colors.greyActive};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -15px;
  margin-bottom: 30px;
  > * {
    &:first-child {
      margin-right: 8px;
    }
  }
  @media only screen and (max-width: 768px) {
    margin-top: -8px;
    margin-bottom: 0;
    justify-content: flex-start;
  }
`;

const ChildrenContainer = styled.div``;

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

const QuestionText = styled(Text)`
  display: none;
  margin-left: auto;
  margin-right: auto;
  color: ${props => props.theme.colors.grey100};
  @media only screen and (max-width: 992px) {
    display: inline-block;
  }
`;
