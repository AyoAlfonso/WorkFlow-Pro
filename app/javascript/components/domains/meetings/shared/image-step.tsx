import * as React from "react";
import * as R from "ramda";
import { Loading } from "~/components/shared/loading";
import { IStep } from "~/models/step";
import { Text } from "~/components/shared/text";
import styled from "styled-components";

export interface IImageStepProps {
  step: IStep;
}

export const ImageStep = ({ step }: IImageStepProps): JSX.Element => {
  if (R.isNil(step.imageUrl)) {
    return <Text>This URL for the image is either missing</Text>;
  }
  return (
    <Container>
      <Image src={step.imageUrl} alt={step.name} />
    </Container>
  );
};

const Container = styled.div`
  height: 600px;
`;

const Image = styled.img`
  width: 100%;
  display: block;
  margin: auto;
  object-fit: contain;
`;
