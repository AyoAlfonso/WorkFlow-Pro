import * as React from "react";
import styled from "styled-components";
import { IssuesHeader } from "./issues-header";
import { IssuesBody } from "./issues-body";
import { useState } from "react";
import { Accordion } from '~/components/shared/accordion';

interface IIssuesContainerProps {
  expanded: string | false;
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
  border-radius: 10px;
  border: 0px solid white;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  margin-bottom: 5px;
  width: 100%;
  min-width: 224px;
  display: flex;
  flex-direction: column;
`;
