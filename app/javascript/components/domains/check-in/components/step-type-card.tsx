import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Icon } from "~/components/shared";

interface StepTypeCardProps {
  iconName: string;
  stepType: string;
  description: string;
  iconColor: string;
  setSelectedSteps: React.Dispatch<React.SetStateAction<Array<any>>>;
  setShowStepsModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StepTypeCard = ({
  iconName,
  stepType,
  description,
  iconColor,
  setSelectedSteps,
  setShowStepsModal,
}: StepTypeCardProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Container
      onClick={() => {
        setSelectedSteps(steps => [...steps, { stepType, iconName, position: steps.length + 1 }]);
        setShowStepsModal && setShowStepsModal(false);
      }}
    >
      <IconContainer>
        <Icon icon={iconName} size="64px" iconColor={iconColor} />
      </IconContainer>
      <TextContainer>
        <StepName>{t(`${stepType}`)}</StepName>
        <Description>{t(`${description}`)}</Description>
      </TextContainer>
    </Container>
  );
};

const Container = styled.div`
  background: ${props => props.theme.colors.white};
  box-shadow: 0px 3px 6px #00000029;
  padding: 1em;
  // min-width: 40%;
  // width: 290px;
  display: flex;
  border-radius: 0.5em;
  display: flex;
  gap: 0 0.5em;
  cursor: pointer;
  &: hover {
    background: ${props => props.theme.colors.backgroundGrey};
  }
`;

const IconContainer = styled.div``;

const TextContainer = styled.div``;

const StepName = styled.span`
  display: block;
  color: ${props => props.theme.colors.black};
  text-align: left;
  font-size: 1em;
  font-weight: bold;
  line-spacing: 1em;
  margin-bottom: 10px;
`;

const Description = styled.span`
  color: ${props => props.theme.colors.black};
  text-align: left;
  font-size: 0.75em;
`;
