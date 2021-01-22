import * as React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { SurveyBot } from "./survey-bot";
import { Link } from "react-router-dom";
import { Icon } from "~/components/shared";
import Modal from "styled-react-modal";
import { AccordionSummary } from '~/components/shared/accordion';
import {
  HeaderText,
  ToolsHeaderContainer,
} from "~/components/shared/styles/container-header";

declare global {
  interface Window {
    closeWidget: () => void | void;
    openWidget: () => void | void;
  }
}

interface IJournalHeaderProps {
  expanded: string | false;
  questionnaireVariant: string;
  setQuestionnaireVariant: any;
}

export const JournalHeader = ({ 
  expanded,
  questionnaireVariant,
  setQuestionnaireVariant, 
}: IJournalHeaderProps): JSX.Element => {

  const { t } = useTranslation();

  const handleChatbotEnd = () => {
    setQuestionnaireVariant("");
    window.openWidget();
  };

  return (
    <>
      <AccordionSummary>
        <ToolsHeaderContainer>
          <Icon
            icon={expanded === "panel0" ? "Chevron-Up" : "Chevron-Down"}
            size={15}
            style={{ paddingRight: "15px" }}
          />
          <HeaderText> {t("journals.title")} </HeaderText>
        </ToolsHeaderContainer>
        <EndButtonContainer>
          <Link to="/journals" style={{ textDecoration: "none", padding: "0" }}>
            <EndButton
              onClick={() => {
                if (questionnaireVariant !== "") {
                  setQuestionnaireVariant("");
                }
              }}
            >
              {t("journals.viewEntries")}
            </EndButton>
          </Link>
        </EndButtonContainer>
      </AccordionSummary>
      <StyledModal isOpen={questionnaireVariant !== ""} transitionSpeed={1000}>
        {questionnaireVariant !== "" ? (
          <SurveyBot
            variant={questionnaireVariant}
            endFn={handleChatbotEnd}
            optionalActionsComponent={
              <EndButtonContainer>
                {questionnaireVariant ? (
                  <EndButton
                  onClick={() => {
                    if (confirm(t("journals.confirmQuit"))) {
                      handleChatbotEnd();
                    }
                  }}
                  >
                    Quit Journal
                  </EndButton>
                ) : null}
              </EndButtonContainer>
            }
            />
            ) : (
              <></>
              )}
      </StyledModal>
    </>
  );
};

const EndButtonContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
`;

const EndButton = styled.div`
  color: ${props => props.theme.colors.primary100};
  cursor: pointer;
  font-size: 12px;
  font-weight: 400;
`;

const StyledModal = Modal.styled`
  width: 30rem;
  min-width: 30rem;
  height: 100%;
  border-radius: 10px;
  bottom: 0;
  right: 0;
  position: absolute;
  background-color: ${props => props.theme.colors.white};
`;

