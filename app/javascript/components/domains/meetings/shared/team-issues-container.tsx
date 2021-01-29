import * as React from "react";
import { useState } from "react";
import { IssuesHeader } from "../../issues/issues-header";
import { TeamIssuesBody } from "./team-issues-body";
import { useTranslation } from "react-i18next";

interface TeamIssuesContainerProps {
  teamId: number | string;
  title: string;
}

export const TeamIssuesContainer = ({ teamId, title }: TeamIssuesContainerProps): JSX.Element => {
  const [showOpenIssues, setShowOpenIssues] = useState<boolean>(true);
  const { t } = useTranslation();

  return (
    <>
      <IssuesHeader
        showOpenIssues={showOpenIssues}
        setShowOpenIssues={setShowOpenIssues}
        issuesText={title}
        teamId={teamId}
      />
      <TeamIssuesBody showOpenIssues={showOpenIssues} teamId={teamId} />
    </>
  );
};
