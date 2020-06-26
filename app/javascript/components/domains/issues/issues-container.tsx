import * as React from "react";
import { IssuesHeader } from "./issues-header";
import { IssuesBody } from "./issues-body";
import { useState } from "react";

export const IssuesContainer = (): JSX.Element => {
  const [showOpenIssues, setShowOpenIssues] = useState<boolean>(true);

  return (
    <>
      <IssuesHeader showOpenIssues={showOpenIssues} setShowOpenIssues={setShowOpenIssues} />
      <IssuesBody showOpenIssues={showOpenIssues} />
    </>
  );
};
