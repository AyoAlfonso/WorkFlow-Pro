import React, { useEffect, useState } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { BasicStep } from "./basic-step";
import { StepsSelectorPage } from "./steps-selector-page";

interface CheckinBuilderStepsProps {
  step: any;
  checkinName: string;
  setCheckinName: React.Dispatch<React.SetStateAction<string>>;
}

export const CheckinBuilderSteps = ({ step, checkinName, setCheckinName }: CheckinBuilderStepsProps): JSX.Element => {
const stepComponent = step => {
  switch (step.componentToRender) {
    case "basic":
      return (
        <>
          <CheckinName>{checkinName}</CheckinName>
          <BasicStep checkinName={checkinName} setCheckinName={setCheckinName} />
        </>
      );
    case "steps":
      return (
        <>
          <CheckinName>{checkinName}</CheckinName>
          <StepsSelectorPage />
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
`;

const StepComponentContainer = styled.div`
  width: inherit;
  min-width: 320px;
  // margin-left: 8px;
  @media only screen and (max-width: 768px) {
    margin-left: 0;
  }
`;

const CheckinName = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme.colors.black};
  display: inline-block;
  margin-bottom: 32px;
`