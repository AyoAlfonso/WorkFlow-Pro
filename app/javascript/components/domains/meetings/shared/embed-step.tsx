import { isNil, isEmpty } from "ramda";
import * as React from "react";
import styled from "styled-components";

export interface IEmbedStepProps {
  linkEmbed: string;
}

export const EmbedStep = ({ linkEmbed }: IEmbedStepProps): JSX.Element => {
  //if text contains iframe, render as div

  const isIframe = linkEmbed.search("iframe") != -1;
  if (isIframe) {
    return (
      <EmbedDiv key={"embed-step"}>
        <div dangerouslySetInnerHTML={{ __html: linkEmbed }}></div>
      </EmbedDiv>
    );
  } else {
    return <IFrame key={"embed-step"} src={linkEmbed}></IFrame>;
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
