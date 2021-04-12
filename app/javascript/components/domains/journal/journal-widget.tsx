import { observer } from "mobx-react";
import * as React from "react";
import { useState } from "react";
import { JournalHeader } from "./journal-header";
import { JournalBody } from "./journal-body";
import { StyledOverviewAccordion } from "~/components/shared/styles/overview-styles";

interface IJournalProps {
  expanded: string;
  handleChange: any;
}

export const Journal = observer(
  ({ expanded, handleChange }: IJournalProps): JSX.Element => {
    const [questionnaireVariant, setQuestionnaireVariant] = useState<string>("");

    return (
      <StyledOverviewAccordion
        expanded={expanded === "panel0"}
        onChange={handleChange("panel0")}
        elevation={0}
      >
        <JournalHeader
          expanded={expanded}
          questionnaireVariant={questionnaireVariant}
          setQuestionnaireVariant={setQuestionnaireVariant}
        />
        <JournalBody setQuestionnaireVariant={setQuestionnaireVariant} />
      </StyledOverviewAccordion>
    );
  },
);
