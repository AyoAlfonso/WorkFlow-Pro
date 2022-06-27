import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared";
import { agreementScale, sentimentScale } from "../data/selection-scale-data";

interface SelectionScaleProps {
  question: string;
  type?: string;
  disabled?: boolean;
}

export const SelectionScale = ({ question, type, disabled }: SelectionScaleProps): JSX.Element => {
  const [selected, setSelected] = useState<number>(0);

  return (
    <Container disabled={disabled}>
      <QuestionText>{question}</QuestionText>
      <OptionsContainer>
        {type == "sentiment"
          ? sentimentScale.map(sentiment => (
              <OptionContainer key={sentiment.option}>
                <StepContainer onClick={() => setSelected(sentiment.option)}>
                  <Option selected={selected == sentiment.option}>
                    {selected === sentiment.option ? (
                      <Icon icon={"Checkmark"} size={"14px"} iconColor={"skyBlue"} />
                    ) : (
                      sentiment.option
                    )}
                  </Option>
                  <LabelText>{sentiment.label}</LabelText>
                </StepContainer>
              </OptionContainer>
            ))
          : agreementScale.map(agreement => (
              <OptionContainer key={agreement.option}>
                <StepContainer onClick={() => setSelected(agreement.option)}>
                  <Option selected={selected == agreement.option}>
                    {selected === agreement.option ? (
                      <Icon icon={"Checkmark"} size={"14px"} iconColor={"skyBlue"} />
                    ) : (
                      agreement.option
                    )}
                  </Option>
                  <LabelText>{agreement.label}</LabelText>
                </StepContainer>
              </OptionContainer>
            ))}
      </OptionsContainer>
    </Container>
  );
};

type ContaineProps = {
  disabled?: boolean;
}

const Container = styled.div<ContaineProps>`
  background: ${props => props.theme.colors.white};
  padding: 1em;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 8px;
  height: 140px;
  pointer-events: ${props => (props.disabled ? "none" : "auto")};
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
`;

const LabelText = styled.span`
  color: ${props => props.theme.colors.grey100};
  font-size: 10px;
  font-weight: bold;
  margin-top: 10px;
  white-space: nowrap;
`;
