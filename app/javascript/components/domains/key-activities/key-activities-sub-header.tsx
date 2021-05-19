import * as R from "ramda";
import * as React from "react";
import styled from "styled-components";
import { KeyActivityListSubHeaderContainer } from "~/components/domains/key-activities/key-activities-list";
import { FilterDropdown } from "~/components/domains/key-activities/filter-dropdown";
import { Icon } from "~/components/shared";
import { KeyActivitiesHeader } from "~/components/domains/key-activities/key-activities-header-no-filter";
import { useTranslation } from "react-i18next";
import { Text } from "~/components/shared/text";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { showToast } from "~/utils/toast-message";
import { useHistory } from "react-router";
import { ToastMessageConstants } from "~/constants/toast-types";
import { QuestionnaireTypeConstants } from "~/constants/questionnaire-types";

interface KeyActivitiesHeaderProps {
  header: string;
  subText: string;
  sortFilterOpen: boolean;
  setFilterOpen: any;
  scheduledGroupId?: number;
  setQuestionnaireVariant?: React.Dispatch<React.SetStateAction<string>>;
}

export const KeyActivitiesSubHeader = observer(
  ({
    header,
    subText,
    sortFilterOpen,
    setFilterOpen,
    scheduledGroupId,
    setQuestionnaireVariant,
  }: KeyActivitiesHeaderProps): JSX.Element => {
    const {
      sessionStore: { profile },
      meetingStore,
    } = useMst();
    const { t } = useTranslation();
    const history = useHistory();

    const onPlanClicked = () => {
      if (profile.questionnaireTypeForPlanning == "daily") {
        meetingStore.createPersonalDailyMeeting().then(({ meeting }) => {
          if (!R.isNil(meeting)) {
            history.push(`/personal_planning/${meeting.id}`);
          } else {
            showToast("Failed to start planning.", ToastMessageConstants.ERROR);
          }
        });
      } else {
        onReflectClicked();
      }
    };

    const onReflectClicked = () => {
      meetingStore.createPersonalWeeklyMeeting().then(({ meeting }) => {
        if (!R.isNil(meeting)) {
          history.push(`/personal_planning/${meeting.id}`);
        } else {
          showToast("Failed to start planning.", ToastMessageConstants.ERROR);
        }
      });
    };

    const renderPlanAndReflect = (): JSX.Element => {
      return (
        <PlanAndReflectContainer>
          <SelectionText type={"small"} onClick={() => onPlanClicked()}>
            Plan
          </SelectionText>
          <SeprationDot />
          <SelectionText type={"small"} onClick={() => onReflectClicked()}>
            Reflect
          </SelectionText>
        </PlanAndReflectContainer>
      );
    };

    return (
      <>
        <HeaderRowContainer>
          <KeyActivitiesHeader
            title={header == "Backlog" ? t("keyActivities.backlogTitle") : header}
          />
          {header == "Today" && renderPlanAndReflect()}
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
  },
);

const HeaderRowContainer = styled.div`
  display: flex;
`;
const SortContainer = styled.div`
  margin-left: auto;
  &: hover {
    cursor: pointer;
  }
`;

const PlanAndReflectContainer = styled.div`
  display: flex;
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
`;

const SeprationDot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 100%;
  background-color: ${props => props.theme.colors.greyActive};
  margin-top: 15px;
  margin-bottom: auto;
  margin-left: 8px;
  margin-right: 8px;
`;

const SelectionText = styled(Text)`
  color: ${props => props.theme.colors.greyActive};

  &: hover {
    cursor: pointer;
  }
`;
