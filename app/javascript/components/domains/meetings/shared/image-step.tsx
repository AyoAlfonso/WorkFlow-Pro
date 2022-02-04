import * as React from "react";
import * as R from "ramda";
import { IStep } from "~/models/step";
import { Text } from "~/components/shared/text";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

export interface IImageStepProps {
  step: IStep;
}

export const ImageStep = ({ step }: IImageStepProps): JSX.Element => {
  const { t } = useTranslation();

  if (R.isNil(step.imageUrl)) {
    return <Text> {t("meeting.missingImageURL")}</Text>;
  }

  return (
    <Container>
      <Image src={step.imageUrl} alt={step.name} />
    </Container>
  );
};

const Container = styled.div`
  max-height: 700px;
  width: 100%;
`;

const Image = styled.img`
  width: 100%;
  display: block;
  margin: auto;
  object-fit: contain;
`;
