import * as React from "react";
import styled from "styled-components";
import { IssuesHeader } from "./issues-header";
import { IssuesBody } from "./issues-body";
import { useState } from "react";
import { StyledOverviewAccordion } from "~/components/shared/styles/overview-styles";

interface IIssuesContainerProps {
  expanded: string;
  handleChange: any;
}

export const Issues = ({ expanded, handleChange }: IIssuesContainerProps): JSX.Element => {
  const [showOpenIssues, setShowOpenIssues] = useState<boolean>(true);

  return (
    <StyledOverviewAccordion
      expanded={expanded === "panel2"}
      onChange={handleChange("panel2")}
      elevation={0}
    >
      <IssuesHeader expanded={expanded} />
      <IssuesBody showOpenIssues={showOpenIssues} setShowOpenIssues={setShowOpenIssues} />
    </StyledOverviewAccordion>
  );
};
