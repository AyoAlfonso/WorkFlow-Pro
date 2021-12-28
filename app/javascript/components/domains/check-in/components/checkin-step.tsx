import React, { useEffect, useState } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { Text } from "~/components/shared/text";
import { observer } from "mobx-react";
import { IMeeting } from "~/models/meeting";
import { IStep } from "~/models/step";
import { Loading } from "~/components/shared/loading";
import { ImageStep } from "~/components/domains/meetings/shared/image-step";
import { EmbedStep } from "~/components/domains/meetings/shared/embed-step";
import { TextStep } from "~/components/domains/meetings/shared/text-step";
import { WeeklyMilestones } from "./weekly-milestones";
import { KpiComponent } from "./kpi";
import { WeeklyKeyResults } from "./weekly-key-results";

export interface ICheckinStepProps {
  checkin: IMeeting;
}

const StepComponent = (step: IStep, checkin: IMeeting) => { 
  switch (step.stepType) {
    case "component":
      switch (step.componentToRender) { 
        case "KPI":
          return <KpiComponent />;
        case "WeeklyMilestones":
          return <WeeklyMilestones />;
        case "WeeklyKeyResults":
          return <WeeklyKeyResults />;
        default:
          return <Text>This custom component has not been configured</Text>;
      }
    case "image":
      return <ImageStep step={step} />;
    case "embedded_link":
      //the embedded link will override itself based on the team's override key setting
      return <EmbedStep linkEmbed={step.linkEmbed} />;
    case "description_text":
      return <TextStep step={step} />;
    default:
      return <Text>This checkin step type has not been configured</Text>;
  }
};

export const CheckinStep = observer(
  ({ checkin }: ICheckinStepProps): JSX.Element => {
    if (R.isNil(checkin) || R.isNil(checkin.currentStepDetails)) {
      return <Loading />;
    }
    return (
      <BodyContainer>
        <StepComponentContainer>
          {StepComponent(checkin.currentStepDetails, checkin)}
        </StepComponentContainer>
      </BodyContainer>
    );
  },
);

const BodyContainer = styled.div`
  display: flex;
  width: -webkit-fill-available;
`;

const StepComponentContainer = styled.div`
  width: inherit;
  min-width: 320px;
  // margin-left: 8px;
  @media only screen and (max-width: 768px) {
    margin-left: 0;
  }
`;
