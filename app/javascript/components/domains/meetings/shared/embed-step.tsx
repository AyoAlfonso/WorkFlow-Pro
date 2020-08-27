import * as React from "react";
import { IStep } from "~/models/step";
import styled from "styled-components";

export interface IEmbedStepProps {
  step: IStep;
}

export const EmbedStep = ({ step }: IEmbedStepProps): JSX.Element => {
  return (
    <EmbedDiv>
      <IFrame src={step.linkEmbed}></IFrame>
    </EmbedDiv>
  );
};

const EmbedDiv = styled.div`
  height: 600px;
  width: 100%;
`;

const IFrame = styled.iframe`
  height: 100%;
  width: 100%;
  border: 0;
`;
