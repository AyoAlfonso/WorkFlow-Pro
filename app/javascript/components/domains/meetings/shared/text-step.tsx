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
    <Container>
      <div
        className="trix-content"
        dangerouslySetInnerHTML={{ __html: step.descriptionTextContent }}
      ></div>
    </Container>
  );
};

const Container = styled.div`
  max-height: 700px;
  margin-left: 16px;
  min-width: 640px;
  width: 75%;
  font-size: 48px;
  font-family: exo;
`;
