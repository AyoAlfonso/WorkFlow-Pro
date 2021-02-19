import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Icon } from "../../shared/icon";
import { useTranslation } from "react-i18next";
import { CreateIssueModal } from "./create-issue-modal";
import { AccordionSummary } from "~/components/shared/accordion-components";
import { IconContainerWithPadding } from "~/components/shared/icon";
import {
  HeaderContainerNoBorder,
  AccordionHeaderText,
} from "~/components/shared/styles/container-header";
import { useMst } from "~/setup/root";
import { Loading } from "~/components/shared";
import * as R from "ramda";
import { observer } from "mobx-react";

interface IssuesHeaderProps {
  issuesText?: string;
  expanded: string;
}

export const IssuesHeader = observer(
  ({ issuesText, expanded }: IssuesHeaderProps): JSX.Element => {
    const {
      companyStore: { company },
    } = useMst();

    const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);

    const { t } = useTranslation();

    if (R.isNil(company)) {
      return <Loading />;
    }

    const renderHeaderTextForCompanyType = () => {
      return company.displayFormat == "Forum" ? "My Personal Parking Lot" : "Issues";
    };

    return (
      <>
        <CreateIssueModal
          createIssueModalOpen={createIssueModalOpen}
          setCreateIssueModalOpen={setCreateIssueModalOpen}
        />
        <AccordionSummary>
          <HeaderContainerNoBorder>
            <Icon
              icon={expanded === "panel2" ? "Chevron-Up" : "Chevron-Down"}
              size={15}
              style={{ paddingRight: "15px" }}
              iconColor={expanded === "panel2" ? "primary100" : "grey60"}
            />
            <AccordionHeaderText expanded={expanded} accordionPanel={"panel2"}>
              {issuesText || renderHeaderTextForCompanyType()}
            </AccordionHeaderText>
          </HeaderContainerNoBorder>
          <IconContainerWithPadding
            onClick={e => {
              e.stopPropagation();
              setCreateIssueModalOpen(true);
            }}
          >
            <Icon icon={"Plus"} size={16} />
          </IconContainerWithPadding>
        </AccordionSummary>
      </>
    );
  },
);
