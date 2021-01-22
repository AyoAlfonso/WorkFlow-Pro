import { observer } from "mobx-react";
import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { JournalHeader } from "./journal-header";
import { JournalBody } from "./journal-body";
import Accordion from '@material-ui/core/Accordion';

interface IJournalProps {
  expanded: string | false;
  handleChange: any;
}

export const Journal = observer(
  ({
    expanded,
    handleChange
  }: IJournalProps): JSX.Element => {
    const [questionnaireVariant, setQuestionnaireVariant] = useState<string>("");

    return (
      <JournalContainer 
        expanded={expanded === "panel0"} 
        onChange={handleChange("panel0")} 
      >
        <JournalHeader 
          expanded={expanded} 
          questionnaireVariant={questionnaireVariant}
          setQuestionnaireVariant={setQuestionnaireVariant} 
        />
        <JournalBody
          setQuestionnaireVariant={setQuestionnaireVariant} 
        />
      </JournalContainer>
    );
  },
);

const JournalContainer = styled(Accordion)`
  width: 100%;
  min-width: 224px;
  display: flex;
  flex-direction: column;
`;
