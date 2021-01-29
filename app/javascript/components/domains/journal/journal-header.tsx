import * as React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { SurveyBot } from "./survey-bot";
import { Link } from "react-router-dom";
import { Icon } from "~/components/shared";
import Modal from "styled-react-modal";
import { AccordionSummary } from '~/components/shared/accordion-components';
import { HeaderContainerNoBorder } from "~/components/shared/styles/container-header";

declare global {
  interface Window {
    closeWidget: () => void | void;
    openWidget: () => void | void;
  }
}

interface IJournalHeaderProps {
  expanded: string;
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
        <HeaderContainerNoBorder>
          <Icon
            icon={expanded === "panel0" ? "Chevron-Up" : "Chevron-Down"}
            size={15}
            style={{ paddingRight: "15px" }}
            iconColor={expanded === "panel0" ? "primary100" : "grey60" }
          />
          <HeaderText
            expanded={expanded}
          > {t("journals.title")} </HeaderText>
        </HeaderContainerNoBorder>
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

type HeaderTextType = {
  expanded?: string;
};

export const HeaderText = styled.h4<HeaderTextType>`
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 20px;
  font-size: 16px;
  font-weight: 600;
  color: ${props => 
    props.expanded === "panel0" ? props.theme.colors.black : props.theme.colors.grey60};
`;

const EndButtonContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
`;

const EndButton = styled.div`
  color: ${props => props.theme.colors.grey60};
  cursor: pointer;
  font-size: 12px;
  font-weight: 400;
  padding-right: 10px;
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

