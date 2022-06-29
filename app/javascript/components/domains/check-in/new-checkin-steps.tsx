import React, { useEffect, useState } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { Text } from "~/components/shared/text";
import { observer } from "mobx-react";
import { CheckinTemplates } from "./components/checkin-templates";

export interface NewCheckinStepProps {
  step: any;
}

const stepComponent = step => {
  switch (step.componentToRender) {
    case "checkInTemplates": {
      return <CheckinTemplates />;
    }
    default:
      return <CheckinTemplates />;
  }
};

export const NewCheckInStep = observer(
  ({ step }: NewCheckinStepProps): JSX.Element => {
    return (
      <BodyContainer>
        <StepComponentContainer>{stepComponent(step)}</StepComponentContainer>
      </BodyContainer>
    );
  },
);

const BodyContainer = styled.div`
  display: flex;
  width: -webkit-fill-available;
  width: -moz-available;
`;

const StepComponentContainer = styled.div`
  width: inherit;
  min-width: 320px;
  // margin-left: 8px;
  @media only screen and (max-width: 768px) {
    margin-left: 0;
  }
`;
