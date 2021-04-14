import * as React from "react";
import * as R from "ramda";
import { IStep } from "~/models/step";
import { Text } from "~/components/shared/text";
import styled from "styled-components";

export interface ITextStepProps {
  step: IStep;
}

export const TextStep = ({ step }: ITextStepProps): JSX.Element => {
  if (R.isNil(step.descriptionTextContent)) {
    return <Text>This text for the step is missing</Text>;
  }

  return (
    <TextStepContainer>
      <TextStepDiv
        className="trix-content"
        dangerouslySetInnerHTML={{ __html: step.descriptionTextContent }}
      />
    </TextStepContainer>
  );
};

export const TextStepDiv = styled.div`
  max-height: 700px;
  margin: auto;
  min-width: 640px;
  width: 80%;
  font-size: 48px;
  font-family: exo;
  justify-content: center;
  align-items: center;
`;

export const TextStepContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;
