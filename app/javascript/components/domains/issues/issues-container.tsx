import * as React from "react";
import styled from "styled-components";
import { IssuesHeader } from "./issues-header";
import { IssuesBody } from "./issues-body";
import { useState } from "react";
import { StyledOverviewAccordion } from "~/components/shared/styles/overview-styles";
import { AccordionDetails } from "~/components/shared/accordion-components";

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
      <AccordionDetailsContainer>
        <IssuesBody showOpenIssues={showOpenIssues} setShowOpenIssues={setShowOpenIssues} />
      </AccordionDetailsContainer>
    </StyledOverviewAccordion>
  );
};

const AccordionDetailsContainer = styled(AccordionDetails)`
  padding: 0px 0px 15px 0px;
  display: flex;
  flex-direction: column;
`;
