import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared";

interface NumericalStepProps {
  question: string;
}

export const NumericalStep = ({ question }: NumericalStepProps): JSX.Element => {
  const [selected, setSelected] = useState<number>(0);

  const numericalScale = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <Container>
      <QuestionText>{question}</QuestionText>
      <OptionsContainer>
        {numericalScale.map(num => (
          <OptionContainer key={num}>
            <StepContainer onClick={() => setSelected(num)}>
              <Option selected={selected == num}>
                {selected === num ? (
                  <Icon icon={"Checkmark"} size={"14px"} iconColor={"skyBlue"} />
                ) : (
                  num
                )}
              </Option>
            </StepContainer>
          </OptionContainer>
        ))}
      </OptionsContainer>
    </Container>
  );
};

const Container = styled.div`
  background: ${props => props.theme.colors.white};
  padding: 1em;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 8px;
  height: 140px;
`;

const QuestionText = styled.span`
  display: block;
  color: ${props => props.theme.colors.black};
  font-size: 20px;
  font-weight: bold;
  font-family: Exo;
  text-align: left;
  margin-bottom: 3.25em;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StepContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  top: -25px;
  @media only screen and (max-width: 768px) {
    top: -15px;
  }
`;

const OptionContainer = styled.li`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;

  &:after {
    content: "";
    height: 8px;
    background-color: ${props => props.theme.colors.skyBlue};
    order: -1;
    @media only screen and (max-width: 768px) {
      height: 4px;
    }
  }
`;

type OptionProps = {
  selected?: boolean;
};

const Option = styled.div<OptionProps>`
  height: 32px;
  width: 32px;
  background-color: ${props =>
    props.selected ? props.theme.colors.primary100 : props.theme.colors.skyBlue};
  border-radius: 50%;
  padding: 5px;
  color: ${props => props.theme.colors.primary100};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  @media only screen and (max-width: 768px) {
    height: 24px;
    width: 24px;
    padding: 1px;
  }
`;

const LabelText = styled.span`
  color: ${props => props.theme.colors.grey100};
  font-size: 10px;
  font-weight: bold;
  margin-top: 10px;
`;
