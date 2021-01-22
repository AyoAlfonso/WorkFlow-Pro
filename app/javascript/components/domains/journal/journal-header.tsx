import * as React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {
  ToolsHeaderContainer,
  HeaderText,
} from "~/components/shared/styles/container-header";
import { SurveyBot } from "./survey-bot";
import { Link } from "react-router-dom";
import { Icon } from "~/components/shared";
import Modal from "styled-react-modal";
import AccordionSummary from '@material-ui/core/AccordionSummary';

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
    <JournalHeaderContainer>
      <ToolsHeaderContainer>
        <Icon
          icon={expanded === "panel0" ? "Chevron-Up" : "Chevron-Down"}
          size={15}
          style={{ paddingRight: "15px" }}
        />
        <HeaderText> {t("journals.title")} </HeaderText>
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
      </ToolsHeaderContainer>
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
    </JournalHeaderContainer>
  );
};

const JournalHeaderContainer = styled(AccordionSummary)`
  border-radius: 10px;
  border: 0px solid white;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 224px;
  margin-right: 20px;
`;

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

