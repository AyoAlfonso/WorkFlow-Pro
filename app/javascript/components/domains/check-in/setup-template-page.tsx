import * as React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { useHistory, useParams } from "react-router-dom";
import { WizardLayout } from "~/components/layouts/wizard-layout";
import * as R from "ramda";
import { Button } from "~/components/shared/button";
import { Icon } from "~/components/shared";
import { CheckinBuilderSteps } from "./checkin-builder-steps";
import { CheckinBuilderAgenda } from "./components/check-in-builder-agenda";
import { useMst } from "~/setup/root";
import moment from "moment";
import { toJS } from "mobx";
import { getIconName } from "./data/step-data";

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
  defaultAvatarColor?: string;
  avatarUrl?: string;
  name?: string;
  lastName?: string;
  executive?: number;
}

export const SetupTemplatePage = observer(
  (): JSX.Element => {
    const { companyStore, sessionStore, checkInTemplateStore } = useMst();
    const template = toJS(checkInTemplateStore.currentCheckIn);

    const [currentStep, setCurrentStep] = useState(2);
    const [checkinName, setCheckinName] = useState<string>("");
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
    const [checkinType, setCheckinType] = useState<string>("");
    const [checkinDescription, setCheckinDescription] = useState<string>("");

    const isForum = companyStore.company?.displayFormat == "Forum";

    const history = useHistory();
    const { id, artifactId } = useParams();

    const getTimezone = {
      0: "user",
      1: "account",
    };

    const getCadence = cad => {
      switch (cad) {
        case "every-weekday":
          return "Every Weekday";
        case "weekly":
          return "Weekly";
        case "daily":
          return "daily";
        case "once":
          return "Once";
        case "monthly":
          return "Monthly";
        case "bi-weekly":
          return "Bi-weekly";
        case "quarterly":
          return "Quarterly";
        default:
          return "";
      }
    };

    useEffect(() => {
      if (id) {
        checkInTemplateStore.fetchCheckInTemplates().then(() => {
          const template = checkInTemplateStore.getTemplateById(id);
          setCheckinName(template.name);
          setCheckinDescription(template.description);
          setCheckinType(template.ownerType);
          template.checkInTemplatesSteps.forEach(step => {
            setSelectedSteps(steps => [
              ...steps,
              {
                stepType: step.stepType,
                name: step.name,
                iconName: getIconName(step.name),
                instructions: step.instructions,
                orderIndex: step.orderIndex,
                componentToRender: step.componentToRender,
                variant: step.variant,
                question: step.question,
              },
            ]);
          });
        });
      } else if (artifactId) {
        checkInTemplateStore.getCheckIns().then(() => {
          const { currentCheckIn: template } = checkInTemplateStore.findCheckinTemplate(artifactId);

          setCurrentStep(0);
          setCheckinName(template?.name);
          setCheckinDescription(template.description);
          setCheckinType(template.ownerType);
          setParticipants(template.participants);
          setResponseViewers("Custom");
          setCadence(getCadence(template.dateTimeConfig.cadence));
          setCheckinTime(moment(template.dateTimeConfig.time, ["HH:mm"]).format("hh:mm A"));
          setCheckinDay(template.dateTimeConfig.day);
          setSelectedDate(new Date(template.dateTimeConfig.date));
          setTimeZone(getTimezone[template.timeZone]);
          setSelectedResponseViewers(template.viewers);
          setReminderUnit(template.reminder.unit);
          setReminderValue(template.reminder.value);
          template.checkInTemplatesSteps.forEach(step => {
            setSelectedSteps(steps => [
              ...steps,
              {
                stepType: step.stepType,
                name: step.name,
                iconName: getIconName(step.name),
                instructions: step.instructions,
                orderIndex: step.orderIndex,
                componentToRender: step.componentToRender,
                variant: step.variant,
                question: step.question,
              },
            ]);
          });
        });
      }
    }, [id, artifactId]);

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

    const formatCadence = () => {
      switch (cadence) {
        case "Every Weekday":
          return "every-weekday";
        case "Weekly":
          return "weekly";
        case "Daily":
          return "daily";
        case "Once":
          return "once";
        case "Monthly":
          return "monthly";
        case "Bi-weekly":
          return "bi-weekly";
        case "Quarterly":
          return "quarterly";
        default:
          return "";
      }
    };

    const showDateTime = cadence == "Once" || cadence == "Monthly" || cadence == "Quarterly";
    const showDayTime = cadence == "Weekly" || cadence == "Bi-weekly";

    const createCheckin = () => {
      const checkin = {
        name: checkinName,
        checkInTemplatesStepsAttributes: selectedSteps,
        participants: participants,
        anonymous: anonymousResponse,
        checkInType: template.checkInType,
        ownerType: checkinType.toLowerCase(),
        description: checkinDescription,
        timeZone: timezone,
        viewers: viewers,
        runOnce: cadence == "Once" ? selectedDate : "",
        dateTimeConfig: {
          cadence: formatCadence(),
          time: moment(checkinTime, ["hh:mm A"]).format("HH:mm"),
          date: showDateTime ? selectedDate : "",
          day: showDayTime ? checkinDay : "",
        },
        reminder: {
          unit: reminderUnit,
          value: reminderValue,
        },
        parent: template.id,
      };
      if (id) {
      checkInTemplateStore.createCheckinTemplate(checkin).then(id => {
        checkInTemplateStore.publishCheckinTemplate(id).then(() => {
          history.push("/check-in/templates");
        });
      });
      } else {
        const templateId = checkInTemplateStore.currentCheckInArtifact.checkInTemplate.id;
        checkInTemplateStore.updateCheckinTemplate(templateId, checkin).then(id => {
          if (id) {
            return checkInTemplateStore.publishCheckinTemplate(id).then(() => {
              history.push("/check-in/templates");
            })
          }
        })
      }
    };

    const title = () => R.path([currentStep, "name"], steps);

    const description = () => R.path([currentStep, "description"], steps);

    const disabled = template?.checkInType !== "dynamic";

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
        disabled={disabled}
      />
    );

    const closeButtonClick = () => {
      if (confirm(`Are you sure you want to exit?`)) {
        if (id) {
          history.push(`/check-in/templates`);
        } else {
          history.push(`/check-in`);
        }
      }
    };

    const finishCheckIn = () => {
      return (
        <StopButton
          disabled={currentStep == 2 && !participants.length}
          variant={"primary"}
          onClick={createCheckin}
          small
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
              disabled={currentStep == 1 && !selectedSteps.length}
            >
              Next
            </NextButton>
          ) : (
            finishCheckIn()
          )}
        </>
      );
    };

    if (!template) return <></>;
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

export const Container = styled.div`
  height: 100%;
`;

type IButtonProps = {
  variant: string;
  onClick: () => void;
  small: boolean;
};

export const NextButton = styled(Button)<IButtonProps>`
  width: 100%;
  font-size: 16px;
`;

export const LeftButtonContainer = styled.div`
  margin-right: 16px;
`;

export const BackButton = styled(Button)<IButtonProps>`
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

export const StopButton = styled(Button)<IStopMeetingButton>`
  width: 100%;
  margin: 0;
  font-size: 16px;
`;
