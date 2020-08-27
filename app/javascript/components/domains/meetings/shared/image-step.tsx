import * as React from "react";
import * as R from "ramda";
import { Loading } from "~/components/shared/loading";
import { IStep } from "~/models/step";
import { Text } from "~/components/shared/text";
import styled from "styled-components";
import { Card, CardBody } from "~/components/shared/card";

export interface IImageStepProps {
  step: IStep;
}

export const ImageStep = ({ step }: IImageStepProps): JSX.Element => {
  if (R.isNil(step.imageUrl)) {
    return <Text>This URL for the image is missing</Text>;
  }
  let cardWidth;
  switch (step.name) {
    case "How Are You Feeling?":
      cardWidth = "1400px";
      break;
    case "Updates":
      cardWidth = "500px";
      break;
    default:
      cardWidth = "800px";
  }
  return (
    <Container>
      <Card
        width={cardWidth}
        alignment={"left"}
        headerComponent={
          <Text fontSize={"12px"} fontWeight={"bold"}>
            {step.name}
          </Text>
        }
      >
        <CardBody>
          <Image src={step.imageUrl} alt={step.name} />
        </CardBody>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  max-height: 700px;
`;

const Image = styled.img`
  width: 100%;
  display: block;
  margin: auto;
  object-fit: contain;
`;
