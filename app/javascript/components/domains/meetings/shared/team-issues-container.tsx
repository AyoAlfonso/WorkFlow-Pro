import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { TeamIssuesHeader } from "./team-issues-header";
import { TeamIssuesBody } from "./team-issues-body";
import { CreateIssueModal } from "~/components/domains/issues/create-issue-modal";

import { CardLayout } from "~/components/layouts/card-layout";
import { Icon } from "~/components/shared";
import { AccordionSummary } from "~/components/shared/accordion-components";
import { IconContainerWithPadding } from "~/components/shared/icon";
import {
  HeaderContainerNoBorder,
  AccordionHeaderText,
} from "~/components/shared/styles/container-header";
interface TeamIssuesContainerProps {
  teamId: number | string;
  title: string;
  expanded: string;
  handleChange: any;
}

export const TeamIssuesContainer = ({
  teamId,
  title,
  expanded,
  handleChange,
}: TeamIssuesContainerProps): JSX.Element => {
  const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);
  const [showOpenIssues, setShowOpenIssues] = useState<boolean>(true);
  const { t } = useTranslation();

  //TODO: set create issue to the team (defaulting the label to team)
  return (
    <>
      <CreateIssueModal
        createIssueModalOpen={createIssueModalOpen}
        setCreateIssueModalOpen={setCreateIssueModalOpen}
        teamId={teamId}
      />
      <AccordionSummary>
        <HeaderContainerNoBorder>
          <Icon
            icon={expanded === "team-issues-panel" ? "Chevron-Up" : "Chevron-Down"}
            size={15}
            style={{ paddingRight: "15px" }}
            iconColor={expanded === "team-issues-panel" ? "primary100" : "grey60"}
          />
          <AccordionHeaderText expanded={expanded} accordionPanel={"team-issues-panel"}>
            {" "}
            {title}{" "}
          </AccordionHeaderText>
        </HeaderContainerNoBorder>
        <IconContainerWithPadding
          onClick={e => {
            e.stopPropagation();
            setCreateIssueModalOpen(true);
          }}
        >
          <Icon iconColor={"grey60"} icon={"Plus"} paddingTop={"2px"} size={16} />
        </IconContainerWithPadding>
      </AccordionSummary>

      {expanded === "team-issues-panel" && (
        <TeamIssuesBody
          showOpenIssues={showOpenIssues}
          setShowOpenIssues={setShowOpenIssues}
          showFilters={true}
          teamId={teamId}
        />
      )}
    </>
  );
};
