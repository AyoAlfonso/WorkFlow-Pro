import * as React from "react";
import * as R from "ramda";
import { Loading } from "~/components/shared/loading";
import { IStep } from "~/models/step";
import { Text } from "~/components/shared/text";
import styled from "styled-components";
import { Card, CardBody, CardHeaderText } from "~/components/shared/card";

export interface ITextStepProps {
  step: IStep;
}

export const TextStep = ({ step }: ITextStepProps): JSX.Element => {
  if (R.isNil(step.descriptionTextContent)) {
    return <Text>This text for the step is missing</Text>;
  }
  let cardWidth;
  switch (step.name) {
    case "Updates":
      cardWidth = "500px";
      break;
    default:
      cardWidth = "100%";
  }
  return (
    <Container>
      <Card
        width={cardWidth}
        alignment={"center"}
        border={"none"}
        headerComponent={<CardHeaderText fontSize={"16px"}>{step.name}</CardHeaderText>}
      >
        <CardBody>
          <div
            className="trix-content"
            dangerouslySetInnerHTML={{ __html: step.descriptionTextContent }}
          ></div>
        </CardBody>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  max-height: 700px;
  margin-left: 15px;
`;
