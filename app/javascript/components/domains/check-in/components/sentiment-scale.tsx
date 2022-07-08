import React from "react";
import { useState } from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { Icon } from "~/components/shared";
import { sentimentScale } from "../data/selection-scale-data";
import { toJS } from "mobx";

interface SentimentScaleProps {
  question: string;
  disabled?: boolean;
}

export const SentimentScale = observer(({ question, disabled }: SentimentScaleProps): JSX.Element => {
  const { checkInTemplateStore } = useMst();

  const {
    currentCheckInArtifact,
    updateCheckinArtifact,
    updateCheckInArtifactResponse,
  } = checkInTemplateStore;

  const checkInArtifactLogs = currentCheckInArtifact?.checkInArtifactLogs;

  const savedResponse =
    checkInArtifactLogs &&
    toJS(checkInArtifactLogs)[0]?.responses.find(
      response => response.questionType === "sentiment" && response.prompt === question,
    );

  const [selected, setSelected] = useState<number>(savedResponse?.response || 0);

  const submitCheckinResponse = num => {
    const index =
      toJS(checkInArtifactLogs).length &&
      toJS(checkInArtifactLogs)[0]?.responses.findIndex(
        response => response.questionType === "sentiment" && response.prompt === question,
      );
    if (!index) {
      const item = {
        responses: [{ questionType: "sentiment", prompt: question, response: num }],
      };
      updateCheckinArtifact(currentCheckInArtifact.id, item);
    } else if (index === -1) {
      const item = {
        responses: [
          ...checkInArtifactLogs[0].responses,
          { questionType: "sentiment", prompt: question, response: num },
        ],
      };
      updateCheckinArtifact(currentCheckInArtifact.id, item);
    } else {
      const item = { questionType: "sentiment", prompt: question, response: num };
      updateCheckInArtifactResponse(index, item);
    }
  };

  return (
    <Container disabled={disabled}>
      <QuestionText>{question}</QuestionText>
      <OptionsContainer>
        {sentimentScale.map(sentiment => (
          <OptionContainer key={sentiment.option}>
            <StepContainer
              onClick={() => {
                setSelected(sentiment.option);
                submitCheckinResponse(sentiment.option);
              }}
            >
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
        ))}
      </OptionsContainer>
    </Container>
  );
});

type ContaineProps = {
  disabled?: boolean;
};

const Container = styled.div<ContaineProps>`
  background: ${props => props.theme.colors.white};
  padding: 1em;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 8px;
  // height: 140px;
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
