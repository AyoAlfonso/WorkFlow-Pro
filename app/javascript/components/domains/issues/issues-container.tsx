import * as React from "react";
import styled from "styled-components";
import { IssuesHeader } from "./issues-header";
import { IssuesBody } from "./issues-body";
import { useState } from "react";
import { Accordion } from '~/components/shared/accordion-components';

interface IIssuesContainerProps {
  expanded: string;
  handleChange: any;
}

export const Issues = ({ 
  expanded, 
  handleChange, 
}: IIssuesContainerProps): JSX.Element => {
  const [showOpenIssues, setShowOpenIssues] = useState<boolean>(true);

  return (
    <IssuesAccordion 
      expanded={expanded === "panel2"} 
      onChange={handleChange("panel2")} 
      elevation={0}
    >
      <IssuesHeader expanded={expanded} />
      <IssuesBody showOpenIssues={showOpenIssues} setShowOpenIssues={setShowOpenIssues} />
    </IssuesAccordion>
  );
};

const IssuesAccordion = styled(Accordion)`
  width: 100%;
  min-width: 224px;
  display: flex;
  flex-direction: column;
`;
