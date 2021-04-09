import * as R from "ramda";
import * as React from "react";
import styled from "styled-components";
import { KeyActivityListSubHeaderContainer } from "~/components/domains/key-activities/key-activities-list";
import { FilterDropdown } from "~/components/domains/key-activities/filter-dropdown";
import { Icon } from "~/components/shared";
import { KeyActivitiesHeader } from "~/components/domains/key-activities/key-activities-header-no-filter";
import { useTranslation } from "react-i18next";

interface KeyActivitiesHeaderProps {
  header: string;
  subText: string;
  sortFilterOpen: boolean;
  setFilterOpen: any;
  scheduledGroupId?: number;
}

export const KeyActivitiesSubHeader = ({
  header,
  subText,
  sortFilterOpen,
  setFilterOpen,
  scheduledGroupId,
}: KeyActivitiesHeaderProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <>
      <HeaderRowContainer>
        <KeyActivitiesHeader
          title={header == "Backlog" ? t("keyActivities.backlogTitle") : header}
        />
      </HeaderRowContainer>
      <HeaderRowContainer>
        <KeyActivityListSubHeaderContainer>{subText}</KeyActivityListSubHeaderContainer>
        {!R.isNil(scheduledGroupId) && (
          <SortContainer onClick={() => setFilterOpen(!sortFilterOpen)}>
            <Icon icon={"Sort"} size={12} iconColor="grey100" />
            {sortFilterOpen && (
              <FilterDropdown setFilterOpen={setFilterOpen} scheduledGroupId={scheduledGroupId} />
            )}
          </SortContainer>
        )}
      </HeaderRowContainer>
    </>
  );
};

const HeaderRowContainer = styled.div`
  display: flex;
`;
const SortContainer = styled.div`
  margin-left: auto;
  &: hover {
    cursor: pointer;
  }
`;
