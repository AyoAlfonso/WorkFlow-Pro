import { observer } from "mobx-react";
import * as R from "ramda";
import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Icon } from "~/components/shared/icon";
import { HeaderContainer, HeaderText } from "~/components/shared/styles/container-header";
import { TextNoMargin } from "~/components/shared/text";
import { QuestionnaireTypeConstants } from "../../../constants/questionnaire-types";
import { useMst } from "../../../setup/root";
import { IconButton } from "../../shared/icon-button";
import { SurveyBot } from "./survey-bot";

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
        <HeaderContainer>
          <HeaderText>{t("journals.title")}</HeaderText>
          <EndButtonContainer>
            {questionnaireVariant ? (
              <EndButton onClick={() => setQuestionnaireVariant("")}>Quit Journal</EndButton>
            ) : null}
          </EndButtonContainer>
        </HeaderContainer>
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
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  padding: 15px;
  width: 90%;
`;

const PynBotSpeechContainer = styled.div`
  display: flex;
  margin: 0;
  padding: 0;
  width: 100%;
`;

const PynBotContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 30%;
`;

const PynBotIconContainer = styled.div`
  align-content: center;
  border-radius: 50%;
  box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.1);
  display: inline-flex;
  height: 64px;
  justify-content: center;
  margin-bottom: 10px;
  width: 64px;
`;

const SpeechBubble = styled.div`
  border-radius: 20px 20px 20px 0;
  box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.1);
  display: inline-block;
  font-family: Lato;
  font-size: 15px;
  line-height: 1em;
  max-height: 2em;
  overflow: hidden;
  padding: 15px;
  text-align: center;
  text-overflow: ellipsis;
  width: 70%;
`;

const EndButtonContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const EndButton = styled.div`
  color: ${props => props.theme.colors.primary100};
  cursor: pointer;
  font-size: 11pt;
  font-weight: 400;
`;
