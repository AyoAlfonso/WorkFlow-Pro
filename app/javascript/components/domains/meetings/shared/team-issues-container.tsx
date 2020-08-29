import * as React from "react";
import { useState } from "react";
import { IssuesHeader } from "../../issues/issues-header";
import { TeamIssuesBody } from "./team-issues-body";
import { useTranslation } from "react-i18next";

export const TeamIssuesContainer = (): JSX.Element => {
  const [showOpenIssues, setShowOpenIssues] = useState<boolean>(true);
  const { t } = useTranslation();

  return (
    <>
      <IssuesHeader
        showOpenIssues={showOpenIssues}
        setShowOpenIssues={setShowOpenIssues}
        issuesText={t("teams.teamIssuesTitle")}
      />
      <TeamIssuesBody showOpenIssues={showOpenIssues} />
    </>
  );
};
