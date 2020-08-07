import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { JournalHeader } from "./journal-header";
import { SurveyBot } from "./survey-bot";
import { IconButton } from "../../shared/icon-button";
import { QuestionnaireTypeConstants } from "../../../constants/questionnaire-types";

export const Journal = (): JSX.Element => {
  const [questionnaireVariant, setQuestionnaireVariant] = useState<string>("");

  return (
    <JournalContainer>
      <JournalHeader />
      {questionnaireVariant !== "" ? (
        <SurveyBot variant={questionnaireVariant} endFn={setQuestionnaireVariant} />
      ) : (
        <ButtonContainer>
          <IconButton
            width={"100%"}
            height={"64px"}
            bg={"white"}
            mt={"20px"}
            mx={"15px"}
            iconName={"AM-Check-in"}
            iconSize={28}
            iconColor={"cautionYellow"}
            text={"Create My Day"}
            shadow={true}
            onClick={() => setQuestionnaireVariant(QuestionnaireTypeConstants.createMyDay)}
          />
          <IconButton
            width={"100%"}
            height={"64px"}
            bg={"white"}
            mt={"15px"}
            mx={"15px"}
            iconName={"Negative-Thoughts"}
            iconSize={28}
            iconColor={"warningRed"}
            text={"Thought Challenge"}
            shadow={true}
            onClick={() => setQuestionnaireVariant(QuestionnaireTypeConstants.thoughtChallenge)}
          />
          <IconButton
            width={"100%"}
            height={"64px"}
            bg={"white"}
            mt={"15px"}
            mx={"15px"}
            iconName={"Check-in"}
            iconSize={28}
            iconColor={"primary40"}
            text={"Evening Reflection"}
            shadow={true}
            onClick={() => setQuestionnaireVariant(QuestionnaireTypeConstants.eveningReflection)}
          />
        </ButtonContainer>
      )}
    </JournalContainer>
  );
};

const JournalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ButtonContainer = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
`;
