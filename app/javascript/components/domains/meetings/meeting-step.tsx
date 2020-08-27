import * as React from "react";
import * as R from "ramda";

import { Heading } from "~/components/shared/heading";
import { Button } from "~/components/shared/button";
import { ConversationStarter } from "./components/conversation-starter";
import { Text } from "~/components/shared/text";
import { observer } from "mobx-react";
import { IMeeting } from "~/models/meeting";
import { IStep } from "~/models/step";
import meetingTypes from "~/constants/meeting-types";
import { Loading } from "~/components/shared/loading";
import { ImageStep } from "~/components/domains/meetings/shared/image-step";
import { EmbedStep } from "~/components/domains/meetings/shared/embed-step";

export interface IMeetingStepProps {
  meeting: IMeeting;
}

const StepComponent = (step: IStep) => {
  if (R.isNil(step)) {
    return <Loading />;
  }
  switch (step.stepType) {
    case "component":
      switch (step.componentToRender) {
        case "ConversationStarter":
          return <ConversationStarter />;
        default:
          return <Text>This custom component has not been configured</Text>;
      }
      break;
    case "image":
      return <ImageStep step={step} />;
      break;
    case "embedded_link":
      return <EmbedStep step={step} />;
      break;
    default:
      return <Text>This meeting step type has not been configured</Text>;
  }
};

export const MeetingStep = observer(
  ({ meeting }: IMeetingStepProps): JSX.Element => {
    if (R.isNil(meeting) || R.isNil(meeting.currentStepDetails)) {
      return <Loading />;
    }
    return (
      <>
        <Text>{meeting.currentStepDetails.name}</Text>
        <Text>{meeting.currentStepDetails.instructions}</Text>
        {StepComponent(meeting.currentStepDetails)}
      </>
    );
  },
);
