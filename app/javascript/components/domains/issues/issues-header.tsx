import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Icon } from "../../shared/icon";
import { useTranslation } from "react-i18next";
import { CreateIssueModal } from "./create-issue-modal";
import { AccordionSummary } from '~/components/shared/accordion-components';
import { HeaderContainerNoBorder } from "~/components/shared/styles/container-header";

interface IssuesHeaderProps {
  issuesText?: string;
  expanded: string;
}

export const IssuesHeader = ({
  issuesText,
  expanded,
}: IssuesHeaderProps): JSX.Element => {
  const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);

  const { t } = useTranslation();

  return (
    <>    
      <CreateIssueModal
        createIssueModalOpen={createIssueModalOpen}
        setCreateIssueModalOpen={setCreateIssueModalOpen}
      />
      <AccordionSummary>
        <HeaderContainerNoBorder>
          <Icon
            icon={expanded === "panel2" ? "Chevron-Up" : "Chevron-Down"}
            size={15}
            style={{ paddingRight: "15px" }}
            iconColor={expanded === "panel2" ? "primary100" : "grey60" }
          />
          <HeaderText
            expanded={expanded}
          > 
            {issuesText || t("issues.title") || "Issues"} 
          </HeaderText>
        </HeaderContainerNoBorder>
        <AddNewIssueContainer onClick={() => setCreateIssueModalOpen(true)}>
          <AddNewIssuePlus>
            <Icon icon={"Plus"} size={16} />
          </AddNewIssuePlus>
        </AddNewIssueContainer>
      </AccordionSummary>
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
    props.expanded === "panel2" ? props.theme.colors.black : props.theme.colors.grey60};
`;

const AddNewIssuePlus = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.grey60};
`;

const AddNewIssueContainer = styled.div`
  display: flex;
  cursor: pointer;
  margin-left: 8px;
  margin-right: 8px;
  padding-left: 4px;
  margin-bottom: -5px;
`;