import * as React from "react";
import { useState } from "react";
import * as R from "ramda";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Icon } from "~/components/shared/icon";
import { TextDiv, TextNoMargin } from "~/components/shared/text";
import { QuestionnaireTypeConstants } from "../../../constants/questionnaire-types";
import { useMst } from "../../../setup/root";
import { IconButton } from "../../shared/icon-button";
import { AccordionDetails } from "~/components/shared/accordion-components";

import { ToastMessageConstants } from "~/constants/toast-types";
import { showToast } from "~/utils/toast-message";

import { todaysDateFull } from "~/lib/date-helpers";
import { DailyRecordPicker } from "~/components/shared/daily-record-picker";

interface IJournalBodyProps {
  setQuestionnaireVariant: any;
}

export const JournalBody = observer(
  ({ setQuestionnaireVariant }: IJournalBodyProps): JSX.Element => {
    const { sessionStore, meetingStore } = useMst();
    const { loading } = sessionStore;
    const history = useHistory();

    const { t } = useTranslation();

    const [showCalendar, setShowCalendar] = useState<boolean>(false);
    const [selectedDateFilter, setSelectedDateFilter] = useState<string>(todaysDateFull);

    const pynBotGreeting = t("journals.pynBotGreeting", {
      userName: sessionStore.profile.firstName,
    });

    const defaultJournalButtonProps = {
      width: "90%",
      height: "48px",
      bg: "white",
      mt: "20px",
      mx: "16px",
      pl: "15px",
      iconSize: 28,
      shadow: true,
    };

    const dailyLogToDisplay =
      sessionStore?.selectedDailyLog || sessionStore.profile?.currentDailyLog;
    if (R.isNil(dailyLogToDisplay) || R.isNil(loading)) {
      return <></>;
    }

    const getDailyLogByDate = filter => {
      setSelectedDateFilter(filter);
      if (todaysDateFull == filter) {
        sessionStore.getSelectedDailyLog(null);
      } else {
        sessionStore.getSelectedDailyLog(filter);
      }
    };

    return (
      <AccordionDetailsContainer>
        <DailyRecordPicker
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
          selectedDateFilter={selectedDateFilter}
          setSelectedDateFilter={setSelectedDateFilter}
          retrieveData={getDailyLogByDate}
        />
        <ButtonContainer>
          <PynBotSpeechContainer>
            <PynBotContainer>
              <PynBotIconContainer>
                <Icon icon={"PynBot"} iconColor={"primary80"} size={"42px"} width={"90%"} />
              </PynBotIconContainer>
              <TextNoMargin fontSize={"12px"} fontWeight={600}>
                PynBot
              </TextNoMargin>
            </PynBotContainer>
            <SpeechBubble>{pynBotGreeting}</SpeechBubble>
          </PynBotSpeechContainer>
          {/* <IconButton
          {...defaultJournalButtonProps}
          iconName={"AM-Check-in"}
          iconColor={"cautionYellow"}
          text={t("journals.createMyDay")}
          onClick={() => {
            if (todaysDateFull !== selectedDateFilter) {
              meetingStore.createPersonalDailyMeeting().then(({ meeting }) => {
                if (!R.isNil(meeting)) {
                  history.push(`/personal_planning/${meeting.id}`);
                } else {
                  showToast("Failed to start planning.", ToastMessageConstants.ERROR);
                }
              });
            }
          }}
          disabled={todaysDateFull !== selectedDateFilter || dailyLogToDisplay?.createMyDay}
        /> */}
          <IconButton
            {...defaultJournalButtonProps}
            iconName={"AM-Check-in"}
            iconColor={"cautionYellow"}
            text={t("journals.createMyDay")}
            onClick={() =>
              setQuestionnaireVariant(QuestionnaireTypeConstants.createMyDay, selectedDateFilter)
            }
            disabled={loading || dailyLogToDisplay?.createMyDay}
          />
          <IconButton
            {...defaultJournalButtonProps}
            iconName={"PM-Check-in"}
            iconColor={"primary40"}
            text={t("journals.eveningReflection")}
            onClick={() =>
              setQuestionnaireVariant(
                QuestionnaireTypeConstants.eveningReflection,
                selectedDateFilter,
              )
            }
            disabled={loading || dailyLogToDisplay?.eveningReflection}
          />
          {todaysDateFull == selectedDateFilter && (
            <IconButton
              {...defaultJournalButtonProps}
              iconName={"Weekly"}
              iconColor={"primaryActive"}
              text={t("journals.weeklyReflection")}
              onClick={() =>
                setQuestionnaireVariant(
                  QuestionnaireTypeConstants.weeklyReflection,
                  selectedDateFilter,
                )
              }
              disabled={loading || dailyLogToDisplay?.weeklyReflection}
            />
          )}
          {todaysDateFull == selectedDateFilter && (
            <IconButton
              {...defaultJournalButtonProps}
              iconName={"EoM"}
              iconColor={"fuschiaBlue"}
              text={t("journals.monthlyReflection")}
              onClick={() =>
                setQuestionnaireVariant(
                  QuestionnaireTypeConstants.monthlyReflection,
                  selectedDateFilter,
                )
              }
              disabled={loading}
            />
          )}
          <FooterText color={"greyActive"}>{t("journals.footer")}</FooterText>
        </ButtonContainer>
      </AccordionDetailsContainer>
    );
  },
);

const AccordionDetailsContainer = styled(AccordionDetails)`
  border: 0px solid white;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 224px;
  margin-right: 20px;

  @media only screen and (max-width: 768px) {
    box-shadow: none;
  }
`;

const ButtonContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px;
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
  padding: 16px;
  text-align: center;
  text-overflow: ellipsis;
  width: 70%;
  margin-top: auto;
  margin-bottom: auto;
`;

const FooterText = styled(TextDiv)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  font-size: 11px;
  margin-top: 16px;
`;
