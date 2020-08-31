import * as React from "react";
import * as R from "ramda";
import { useState } from "react";
import styled from "styled-components";
import { ContainerHeaderWithText } from "~/components/shared/styles/container-header";
import { SurveyBot } from "./survey-bot";
import { IconButton } from "../../shared/icon-button";
import { QuestionnaireTypeConstants } from "../../../constants/questionnaire-types";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { useTranslation } from "react-i18next";
import { Icon } from "~/components/shared/icon";
import { TextNoMargin } from "~/components/shared/text";

export const Journal = observer(
  (props): JSX.Element => {
    const [questionnaireVariant, setQuestionnaireVariant] = useState<string>("");
    const { t } = useTranslation();
    const { sessionStore } = useMst();

    const pynBotGreeting = R.replace(
      "{userName}",
      sessionStore.profile.firstName,
      t("journals.pynBotGreeting"),
    );

    const defaultJournalButtonProps = {
      width: "100%",
      height: "48px",
      bg: "white",
      mt: "20px",
      mx: "15px",
      pl: "15px",
      iconSize: 28,
      shadow: true,
    };

    return (
      <JournalContainer>
        <ContainerHeaderWithText text={t("journals.title")} />
        {questionnaireVariant !== "" ? (
          <SurveyBot variant={questionnaireVariant} endFn={setQuestionnaireVariant} />
        ) : (
          <ButtonContainer>
            <PynBotSpeechContainer>
              <PynBotContainer>
                <PynBotIconContainer>
                  <Icon icon={"PynBot"} iconColor={"primary80"} size={"42px"} width={"100%"} />
                </PynBotIconContainer>
                <TextNoMargin fontSize={"12px"} fontWeight={600}>
                  PynBot
                </TextNoMargin>
              </PynBotContainer>
              <SpeechBubble>{pynBotGreeting}</SpeechBubble>
            </PynBotSpeechContainer>
            <IconButton
              {...defaultJournalButtonProps}
              iconName={"AM-Check-in"}
              iconColor={"cautionYellow"}
              text={t("journals.createMyDay")}
              onClick={() => setQuestionnaireVariant(QuestionnaireTypeConstants.createMyDay)}
              disabled={R.path(["profile", "currentDailyLog", "createMyDay"], sessionStore)}
            />
            <IconButton
              {...defaultJournalButtonProps}
              iconName={"LynchPyn-Iconography_Check-in"}
              iconColor={"successGreen"}
              text={t("journals.thoughtChallenge")}
              onClick={() => setQuestionnaireVariant(QuestionnaireTypeConstants.thoughtChallenge)}
            />
            <IconButton
              {...defaultJournalButtonProps}
              iconName={"Check-in"}
              iconColor={"primary40"}
              text={t("journals.eveningReflection")}
              onClick={() => setQuestionnaireVariant(QuestionnaireTypeConstants.eveningReflection)}
              disabled={R.path(["profile", "currentDailyLog", "eveningReflection"], sessionStore)}
            />
          </ButtonContainer>
        )}
      </JournalContainer>
    );
  },
);

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
  padding: 15px;
`;

const PynBotSpeechContainer = styled.div`
  display: flex;
  width: 100%;
  margin: 0;
  padding: 0;
`;

const PynBotContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 30%;
`;

const PynBotIconContainer = styled.div`
  display: inline-flex;
  align-content: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
`;

const SpeechBubble = styled.div`
  display: inline-block;
  width: 70%;
  height: 2em;
  text-align: center;
  border-radius: 10px;
  box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.1);
  font-family: Lato;
  font-size: 15px;
  padding: 15px;
`;
