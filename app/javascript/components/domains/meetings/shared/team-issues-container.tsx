import * as React from "react";
import { useState } from "react";
import { IssuesHeader } from "../../issues/issues-header";
import { TeamIssuesBody } from "./team-issues-body";

export const TeamIssuesContainer = (): JSX.Element => {
  const [showOpenIssues, setShowOpenIssues] = useState<boolean>(true);

  return (
    <>
      <IssuesHeader
        showOpenIssues={showOpenIssues}
        setShowOpenIssues={setShowOpenIssues}
        issuesText={"Team's Issues"}
      />
      <TeamIssuesBody showOpenIssues={showOpenIssues} />
    </>
  );
};
