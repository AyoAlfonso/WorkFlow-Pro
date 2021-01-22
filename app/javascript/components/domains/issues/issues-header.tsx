import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { color } from "styled-system";
import { Icon } from "../../shared/icon";
import { ToolsHeaderContainer, HeaderText } from "~/components/shared/styles/container-header";
import { useTranslation } from "react-i18next";
import { CreateIssueModal } from "./create-issue-modal";
import { AccordionSummary } from '~/components/shared/accordion';

interface IssuesHeaderProps {
  issuesText?: string;
  expanded: string | false;
}

export const IssuesHeader = ({
  issuesText,
  expanded,
}: IssuesHeaderProps): JSX.Element => {
  const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);

  const { t } = useTranslation();

  return (
    <IssuesHeaderContainer>
      <CreateIssueModal
        createIssueModalOpen={createIssueModalOpen}
        setCreateIssueModalOpen={setCreateIssueModalOpen}
        />
        <Icon
          icon={expanded === "panel2" ? "Chevron-Up" : "Chevron-Down"}
          size={15}
          style={{ paddingRight: "15px" }}
        />
        <ToolsHeaderContainer>
          <HeaderText> 
            {issuesText || t("issues.title") || "Issues"} 
          </HeaderText>
        </ToolsHeaderContainer>
        <AddNewIssueContainer onClick={() => setCreateIssueModalOpen(true)}>
          <AddNewIssuePlus>
            <Icon icon={"Plus"} size={16} />
          </AddNewIssuePlus>
        </AddNewIssueContainer>
    </IssuesHeaderContainer>
  );
};

const IssuesHeaderContainer = styled(AccordionSummary)`
  border-radius: 10px;
  border: 0px solid white;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  min-width: 224px;
  margin-right: 20px;
`;

const AddNewIssuePlus = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.primary100};
`;

const AddNewIssueContainer = styled.div`
  display: flex;
  cursor: pointer;
  margin-left: 8px;
  margin-right: 8px;
  padding-left: 4px;
  margin-bottom: -5px;
`;