import { isNil, isEmpty } from "ramda";
import * as React from "react";
import { IStep } from "~/models/step";
import styled from "styled-components";
import { IMeeting } from "~/models/meeting";

export interface IEmbedStepProps {
  step: IStep;
}

export const EmbedStep = ({ step }: IEmbedStepProps): JSX.Element => {
  //if text contains iframe, render as div

  const isIframe = step.linkEmbed.search("iframe") != -1;
  if (isIframe) {
    return (
      <EmbedDiv key={"embed-step"}>
        <div dangerouslySetInnerHTML={{ __html: step.linkEmbed }}></div>
      </EmbedDiv>
    );
  } else {
    return <IFrame key={"embed-step"} src={step.linkEmbed}></IFrame>;
  }
};

const IFrame = styled.iframe`
  height: 90%;
  width: 100%;
  border: 0;
`;

const EmbedDiv = styled.div`
  height: 90%;
  width: 100%;
  border: 0;
`;
