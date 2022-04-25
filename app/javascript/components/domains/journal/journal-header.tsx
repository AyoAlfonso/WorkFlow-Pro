import * as React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { SurveyBot } from "./survey-bot";
import { Link } from "react-router-dom";
import { Icon } from "~/components/shared";
import Modal from "styled-react-modal";
import { AccordionSummary } from "~/components/shared/accordion-components";
import {
  HeaderContainerNoBorder,
  AccordionHeaderText,
} from "~/components/shared/styles/container-header";

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
    window.openWidget && window.openWidget();
  };

  return (
    <>
      <AccordianContainer>
        <HeaderContainerNoBorder>
          <Icon
            icon={expanded === "panel0" ? "Chevron-Up" : "Chevron-Down"}
            size={15}
            style={{ paddingRight: "15px" }}
            iconColor={expanded === "panel0" ? "primary100" : "grey60"}
          />
          <AccordionHeaderText expanded={expanded} accordionPanel={"panel0"}>
            {" "}
            {t("journals.title")}{" "}
          </AccordionHeaderText>
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
      </AccordianContainer>
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
  padding-right: 10px;
`;

const EndButton = styled.div`
  color: ${props => props.theme.colors.grey60};
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

  @media only screen and (max-width: 768px) {
    width: 95vw;
    height: 90%;
    min-width: 95vw;
    position: static;
  }
`;

const AccordianContainer = styled(AccordionSummary)`
  @media only screen and (max-width: 768px) {
    display: none !important;
  }
`;
