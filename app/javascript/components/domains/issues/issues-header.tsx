import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Icon } from "../../shared/icon";
import { useTranslation } from "react-i18next";
import { CreateIssueModal } from "./create-issue-modal";
import { AccordionSummary } from '~/components/shared/accordion-components';
import { HeaderContainerNoBorder } from "~/components/shared/styles/container-header";
import { IconContainerWithPadding } from "~/components/shared/icon";

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
        <IconContainerWithPadding 
          onClick={(e) => {
            e.stopPropagation(); 
            setCreateIssueModalOpen(true);
          }}
        >

            <Icon icon={"Plus"} size={16} />
        </IconContainerWithPadding>
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
