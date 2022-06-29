import * as React from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared";
import { useMst } from "~/setup/root";
import ContentEditable from "react-contenteditable";
import { SelectedStepType } from "../steps-selector-page";
import { Draggable } from "react-beautiful-dnd";

interface StepPreviewCardProps {
  step: SelectedStepType;
  index: number;
  deleteStep: () => void;
  selected?: boolean;
  setShowStepsModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChanging: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSteps: React.Dispatch<React.SetStateAction<Array<SelectedStepType>>>;
  selectedSteps?: Array<SelectedStepType>;
  handleClick: () => void;
}

export const StepPreviewCard = ({
  step,
  deleteStep,
  selected,
  setShowStepsModal,
  setIsChanging,
  setSelectedSteps,
  selectedSteps,
  handleClick,
  index,
}: StepPreviewCardProps): JSX.Element => {
  const { companyStore } = useMst();
  const isForum = companyStore.company?.displayFormat == "Forum";

  const { name, iconName, orderIndex, question, variant } = step;

  const handleChange = (e: any) => {
    const steps = [...selectedSteps];
    const stepIndex = steps.findIndex(step => step.orderIndex == orderIndex);
    steps[stepIndex].question = e.target.value;
    setSelectedSteps(steps);
  };

  const formatIssue = str => {
    if (isForum) {
      return "Topics";
    } else {
      return str;
    }
  };

  const formatVariant = str => {
    if (isForum) {
      return "My Topics";
    } else {
      return str;
    }
  }
  
  const formattedStepName = name == "Issues" ? formatIssue(name) : name;

  const formattedVariant = variant == "My Issues" ? formatVariant(variant) : variant;

  return (
    <Draggable draggableId={orderIndex.toString()} index={index} type="StepPreviewCard">
      {provided => (
        <Container
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          selected={selected}
          onClick={() => handleClick()}
        >
          <IconContainer>
            <Icon icon={"DnD"} size={14} mr={"1em"} iconColor={"greyActive"} />
          </IconContainer>
          <BodyContainer>
            <HeaderContainer>
              <StepTypeContainer>
                <Icon icon={iconName} size={"1em"} mr={"0.5em"} iconColor={"primary100"} />
                <StepTypeText>{formattedStepName}</StepTypeText>
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
            {variant ? (
              <VariantText>{formattedVariant}</VariantText>
            ) : (
              <StepQuestion
                selected={selected}
                type="text"
                name="question"
                onChange={handleChange}
                value={question}
              />
            )}
          </BodyContainer>
        </Container>
      )}
    </Draggable>
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
  align-items: center;
`;

const StepTypeText = styled.span`
  color: ${props => props.theme.colors.primary100};
  font-size: 10px;
  font-weight: bold;
`;

const OptionsContainer = styled.div`
  display: flex;
`;

const StepQuestion = styled.input<ContainerProps>`
  background-color: ${props =>
    props.selected ? props.theme.colors.backgroundGrey : props.theme.colors.white};
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

const VariantText = styled.span`
  display: inline-block;
  font-size: 0.75em;
  font-weight: bold;
  margin-top: 1em;
  padding: 0.5em;
  padding-left: 0;
  color: ${props => props.theme.colors.black};
  width: -webkit-fill-available;
  width: -moz-available;
`;

const StyledContentEditable = styled(ContentEditable)`
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 0.75em;
  font-weight: bold;
  margin-top: 1em;
  color: ${props => props.theme.colors.black};
`;
