import * as React from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared";
import ContentEditable from "react-contenteditable";
import { SelectedStepType } from "../steps-selector-page";

interface StepPreviewCardProps {
  step: SelectedStepType;
  deleteStep: any;
  selected?: boolean;
  setShowStepsModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChanging: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSteps: React.Dispatch<React.SetStateAction<Array<any>>>;
  selectedSteps?: Array<SelectedStepType>;
}

export const StepPreviewCard = ({
  step,
  deleteStep,
  selected,
  setShowStepsModal,
  setIsChanging,
  setSelectedSteps,
  selectedSteps,
}: StepPreviewCardProps): JSX.Element => {
  const { stepType, iconName, position, question } = step
  
  const handleChange = (e: any) => {
    const steps = [...selectedSteps];
    const stepIndex = steps.findIndex(step => step.position == position);
    steps[stepIndex].question = e.target.value;
    setSelectedSteps(steps);
  }

  return (
    <Container selected={selected}>
      <IconContainer>
        <Icon icon={"DnD"} size={14} mr={"1em"} iconColor={"greyActive"} />
      </IconContainer>
      <BodyContainer>
        <HeaderContainer>
          <StepTypeContainer>
            <Icon icon={iconName} size={"1em"} mr={"0.5em"} iconColor={"primary100"} />
            <StepTypeText>{stepType}</StepTypeText>
          </StepTypeContainer>
          <OptionsContainer>
            <IconContainer
              onClick={() => {
                setShowStepsModal(true);
                setIsChanging(true);
              }}
            >
              <Icon icon={"Change"} size={"1em"} mr={"0.5em"} iconColor={"grey100"} />
            </IconContainer>
            <IconContainer onClick={() => deleteStep()}>
              <Icon icon={"Delete"} size={"1em"} iconColor={"grey100"} />
            </IconContainer>
          </OptionsContainer>
        </HeaderContainer>
        <StepQuestion type="text" name="question" onChange={handleChange} value={question} />
      </BodyContainer>
    </Container>
  );
};

type ContainerProps = {
  selected: boolean;
};

const Container = styled.div<ContainerProps>`
  background-color: ${props =>
    props.selected ? props.theme.colors.backgroundGrey : props.theme.colors.white};
  box-shadow: 0px 3px 6px #00000029;
  padding: 1em;
  display: flex;
  align-items: center;
  width: 300px;
  // max-width: 50%;
  border-radius: 8px;
  margin-bottom: 1em;

  &: hover {
    outline: 1px solid ${props => props.theme.colors.primary100};
  }

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

const IconContainer = styled.div`
  cursor: pointer;
`;

const BodyContainer = styled.div`
  flex-grow: 1;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StepTypeContainer = styled.div`
  display: flex;
`;

const StepTypeText = styled.span`
  color: ${props => props.theme.colors.primary100};
  font-size: 10px;
  font-weight: bold;
`;

const OptionsContainer = styled.div`
  display: flex;
`;

const StepQuestion = styled.input`
  font-size: 0.75em;
  font-weight: bold;
  margin-top: 1em;
  color: ${props => props.theme.colors.black};
  width: -webkit-fill-available;
  width: -moz-available;
  border: 0px;
  border-radius: 2px;
  padding: 0.5em;
  padding-left: 0;

  &:focus {
    outline: 1px solid ${props => props.theme.colors.primary100};
  }
`;

const StyledContentEditable = styled(ContentEditable)`
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 0.75em;
  font-weight: bold;
  margin-top: 1em;
  color: ${props => props.theme.colors.black};
`;
