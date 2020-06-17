import * as React from "react";
import { IssuesHeader } from "./issues-header";
import { IssuesBody } from "./issues-body";
import { useState } from "react";

export const IssuesContainer = (): JSX.Element => {
  const [showAllIssues, setShowAllIssues] = useState<boolean>(false);

  return (
    <>
      <IssuesHeader
        showAllIssues={showAllIssues}
        setShowAllIssues={setShowAllIssues}
      />
      <IssuesBody showAllIssues={showAllIssues} />
    </>
  );
};
