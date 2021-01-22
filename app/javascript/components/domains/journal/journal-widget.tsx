import { observer } from "mobx-react";
import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { JournalHeader } from "./journal-header";
import { JournalBody } from "./journal-body";
import { Accordion } from '~/components/shared/accordion';

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
      <JournalAccordion
        expanded={expanded === "panel0"} 
        onChange={handleChange("panel0")} 
        elevation={0} 
      >
        <JournalHeader 
          expanded={expanded} 
          questionnaireVariant={questionnaireVariant}
          setQuestionnaireVariant={setQuestionnaireVariant} 
        />
        <JournalBody
          setQuestionnaireVariant={setQuestionnaireVariant} 
        />
      </JournalAccordion>
    );
  },
);

const JournalAccordion = styled(Accordion)`
  width: 100%;
  min-width: 224px;
  display: flex;
  flex-direction: column;
`;
