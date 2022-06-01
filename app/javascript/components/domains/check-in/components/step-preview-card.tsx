import * as React from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared";
import ContentEditable from "react-contenteditable";

interface StepPreviewCardProps {
  stepType: string;
  iconName: string;
  deleteStep: any;
  selected: boolean;
}

export const StepPreviewCard = ({
  stepType,
  iconName,
  deleteStep,
  selected
}: StepPreviewCardProps): JSX.Element => {
  return (
    <Container>
      <IconContainer>
        <Icon icon={"Move"} size={14} mr={"1em"} iconColor={"greyActive"} />
      </IconContainer>
      <BodyContainer>
        <HeaderContainer>
          <StepTypeContainer>
            <Icon icon={iconName} size={"1em"} mr={"0.5em"} iconColor={"primary100"} />
            <StepTypeText>{stepType}</StepTypeText>
          </StepTypeContainer>
          <OptionsContainer>
            <IconContainer>
              <Icon icon={"Change"} size={"1em"} mr={"0.5em"} iconColor={"grey100"} />
            </IconContainer>
            <IconContainer onClick={() => deleteStep()}>
              <Icon icon={"Delete"} size={"1em"} iconColor={"grey100"} />
            </IconContainer>
          </OptionsContainer>
        </HeaderContainer>
        <StepQuestion type="text" value="What are you working on?" />
      </BodyContainer>
    </Container>
  );
};

const Container = styled.div`
  background-color: ${props => props.theme.colors.white};
  box-shadow: 0px 3px 6px #00000029;
  padding: 1em;
  display: flex;
  align-items: center;
  width: 300px;
  // max-width: 50%;
  border-radius: 8px;
  margin-bottom: 1em;

  &: hover {
    border: 1px solid ${props => props.theme.colors.primary100};
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
