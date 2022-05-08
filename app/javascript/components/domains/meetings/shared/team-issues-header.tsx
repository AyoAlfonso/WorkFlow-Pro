import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { space, SpaceProps, color, ColorProps } from "styled-system";
import { useMst } from "~/setup/root";
import { Icon } from "../../../shared/icon";
import { HeaderContainer, HeaderText } from "~/components/shared/styles/container-header";
import { WidgetHeaderSortButtonMenu } from "~/components/shared/widget-header-sort-button-menu";
import { useTranslation } from "react-i18next";
interface TeamIssuesHeaderProps {
  showOpenIssues: boolean;
  setShowOpenIssues: React.Dispatch<React.SetStateAction<boolean>>;
  issuesText?: string;
  teamId?: number | string;
  meetingId?: number | string;
}

export const TeamIssuesHeader = ({
  showOpenIssues,
  setShowOpenIssues,
  issuesText,
  meetingId,
  teamId,
}: TeamIssuesHeaderProps): JSX.Element => {
  const [sortOptionsOpen, setSortOptionsOpen] = useState<boolean>(false);

  const { issueStore, companyStore } = useMst();

  const { t } = useTranslation();

  const isForum = companyStore.company?.displayFormat == "Forum";

  const sortOptionsForCompany = [
    {
      label: "Sort by Upvotes",
      value: "by_upvotes",
    },
    {
      label: "Sort by Priority",
      value: "by_priority",
    },
  ];

  const sortOptionsForForum = [
    {
      label: "Sort by Upvotes",
      value: "by_upvotes",
    },
    {
      label: "Sort by Due Date",
      value: "by_due_date",
    },
    {
      label: "Sort by Priority",
      value: "by_priority",
    },
  ];

  const sortMenuOptions = isForum ? sortOptionsForForum : sortOptionsForCompany;

  const handleSortMenuItemClick = value => {
    setSortOptionsOpen(false);
    issueStore.sortIssuesByPriority({ sort: value, teamId: teamId, meetingId: meetingId });
  };

  return (
    <HeaderContainer>
      <HeaderText> {issuesText || t("issues.issues") || "Issues"} </HeaderText>
      <FilterContainer>
        <FilterOptions
          onClick={() => setShowOpenIssues(true)}
          mr={"15px"}
          color={showOpenIssues ? "primary100" : "grey40"}
        >
          Open
        </FilterOptions>
        <FilterOptions
          onClick={() => setShowOpenIssues(false)}
          color={!showOpenIssues ? "primary100" : "grey40"}
        >
          Closed
        </FilterOptions>
        <WidgetHeaderSortButtonMenu
          onButtonClick={setSortOptionsOpen}
          onMenuItemClick={handleSortMenuItemClick}
          menuOpen={sortOptionsOpen}
          menuOptions={sortMenuOptions}
          ml={"15px"}
        />
      </FilterContainer>
    </HeaderContainer>
  );
};

const FilterContainer = styled.div`
  display: flex;
  margin-left: auto;
  justify-content: center;
  align-items: center;
`;

const FilterOptions = styled.p<ColorProps & SpaceProps>`
  ${space}
  ${color}
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
`;
