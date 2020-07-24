import * as React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { JournalHeader } from "./journal-header";
import { SurveyBot } from "../../shared/survey-bot";
import { IconButton } from "../../shared/icon-button";

export const Journal = (): JSX.Element => {
  const [surveyVariant, setSurveyVariant] = useState<string>("");

  return (
    <JournalContainer>
      <JournalHeader />
      {surveyVariant !== "" ? (
        <SurveyBot variant={surveyVariant} endFn={setSurveyVariant} />
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
            onClick={() => setSurveyVariant("createMyDay")}
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
            onClick={() => setSurveyVariant("thoughtChallenge")}
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
            onClick={() => setSurveyVariant("eveningReflection")}
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
