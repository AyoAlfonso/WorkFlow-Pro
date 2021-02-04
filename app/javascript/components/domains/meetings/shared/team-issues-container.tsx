import * as React from "react";
import { useState } from "react";
import { TeamIssuesHeader } from "./team-issues-header";
import { TeamIssuesBody } from "./team-issues-body";
import { CardLayout } from "~/components/layouts/card-layout";
interface TeamIssuesContainerProps {
  teamId: number | string;
  title: string;
}

export const TeamIssuesContainer = ({ teamId, title }: TeamIssuesContainerProps): JSX.Element => {
  const [showOpenIssues, setShowOpenIssues] = useState<boolean>(true);

  return (
    <CardLayout
      customHeader={
        <TeamIssuesHeader
          showOpenIssues={showOpenIssues}
          setShowOpenIssues={setShowOpenIssues}
          issuesText={title}
          teamId={teamId}
        />
      }
      height={"100%"}
    >
      <TeamIssuesBody showOpenIssues={showOpenIssues} teamId={teamId} />
    </CardLayout>
  );
};
