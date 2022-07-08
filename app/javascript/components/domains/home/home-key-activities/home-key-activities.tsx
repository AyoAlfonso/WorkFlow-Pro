import * as React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { Icon, Loading } from "~/components/shared";
import { today, tomorrow } from "~/lib/date-helpers";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { InitialsGenerator } from "~/components/shared/issues-and-key-activities/initials-generator";
import { baseTheme } from "~/themes";
import { CreateKeyActivityModal } from "../../key-activities/create-key-activity-modal";
import { CreateKeyActivityButton } from "../../key-activities/create-key-activity-button";
import {
  KeyActivitiesList,
  KeyActivityColumnStyleListContainer,
  KeyActivitiesWrapperContainer,
  KeyActivitiesListContainer,
} from "../../key-activities/key-activities-list";
import { KeyActivitiesSubHeader } from "../../key-activities/key-activities-sub-header";
import { StyledIcon } from "~/components/shared/issues-and-key-activities/scheduled-group-selector";
import { useTranslation } from "react-i18next";

export interface IHomeKeyActivities {
  todayOnly?: boolean;
  weeklyOnly?: boolean;
  width?: string;
  setQuestionnaireVariant?: React.Dispatch<React.SetStateAction<string>>;
  hideListSelector?: boolean;
  disabled?: boolean;
}

export const HomeKeyActivities = observer(
  ({
    todayOnly = false,
    weeklyOnly = false,
    width,
    setQuestionnaireVariant,
    hideListSelector,
    disabled,
  }: IHomeKeyActivities): JSX.Element => {
    const [selectedFilterGroupName, setSelectedFilterGroupName] = useState<string>("Weekly List");
    const [selectedFilterTeamId, setSelectedFilterTeamId] = useState<number>(null);
    const [showCompletedItems, setShowCompletedItems] = useState<boolean>(false);
    const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);
    const [todayFilterDropdownOpen, setTodayFilterDropdownOpen] = useState<boolean>(false);
    const [dynamicFilterDropdownOpen, setDynamicFilterDropdownOpen] = useState<boolean>(false);
    const [todayModalClicked, setTodayModalClicked] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const {
      keyActivityStore,
      sessionStore,
      sessionStore: { scheduledGroups },
    } = useMst();
    const { t } = useTranslation();

    useEffect(() => {
      setLoading(true)
      showCompletedItems
        ? keyActivityStore.fetchCompleteKeyActivities().then(() => setLoading(false))
        : keyActivityStore.fetchIncompleteKeyActivities().then(() => setLoading(false));
    }, [showCompletedItems]);

    const todaysKeyActivities = keyActivityStore.incompleteKeyActivitiesByScheduledGroupName(
      "Today",
    );

    const completedKeyActivities = keyActivityStore.completedActivities;

    const selectedFilterGroupId = sessionStore.getScheduledGroupIdByName(selectedFilterGroupName);

    const selectedFilterGroupIdToday = sessionStore.getScheduledGroupIdByName("Today");

    const teams = sessionStore.profile.currentCompanyUserTeams;

    const subHeaderForFilterGroups = (name: string): string => {
      switch (name) {
        case "Tomorrow":
          return tomorrow;
        case "Weekly List":
          return t("keyActivities.weeklyListDescription");
        case "Backlog":
          return t("keyActivities.backlogDescription");
      }
    };

    const filteredKeyActivities = () => {
      if (showCompletedItems) {
        return completedKeyActivities;
      } else if (selectedFilterGroupName) {
        return keyActivityStore.incompleteKeyActivitiesByScheduledGroupName(
          selectedFilterGroupName,
        );
      } else {
        return keyActivityStore.incompleteKeyActivitiesByTeamId(selectedFilterTeamId);
      }
    };

    const renderMiddleColumnHeader = () => {
      if (showCompletedItems) {
        return renderHeader(
          "Completed Todos",
          "A list of your completed todos.",
          dynamicFilterDropdownOpen,
          setDynamicFilterDropdownOpen,
          selectedFilterGroupId,
        );
      } else if (selectedFilterGroupName) {
        return renderHeader(
          selectedFilterGroupName,
          subHeaderForFilterGroups(selectedFilterGroupName),
          dynamicFilterDropdownOpen,
          setDynamicFilterDropdownOpen,
          selectedFilterGroupId,
        );
      } else {
        const teamName = teams.find(team => team.id == selectedFilterTeamId).name;
        return renderHeader(
          teamName,
          "Todos you are accountable for that are associated with this team.",
          dynamicFilterDropdownOpen,
          setDynamicFilterDropdownOpen,
        );
      }
    };

    const renderHeader = (
      header: string,
      subText: string,
      sortFilterOpen: boolean,
      setFilterOpen: any,
      scheduledGroupId?: number,
    ): JSX.Element => {
      return (
        <KeyActivitiesSubHeader
          header={header}
          subText={subText}
          sortFilterOpen={sortFilterOpen}
          setFilterOpen={setFilterOpen}
          scheduledGroupId={scheduledGroupId}
          setQuestionnaireVariant={header == "Today" && setQuestionnaireVariant}
        />
      );
    };

    const renderFilterGroupOptions = (): Array<JSX.Element> => {
      return scheduledGroups.map((group, index) => {
        const currentSelectedItem = selectedFilterGroupName == group.name;
        if (group.name != "Today") {
          return (
            <FilterOptionContainer
              key={index}
              currentSelectedItem={currentSelectedItem}
              onClick={() => {
                setSelectedFilterTeamId(null);
                setSelectedFilterGroupName(group.name);
                setShowCompletedItems(false);
              }}
            >
              <InitialsGenerator
                name={group.name}
                fontColor={currentSelectedItem ? baseTheme.colors.black : baseTheme.colors.grey100}
                fontSize={"14px"}
                iconSize={"18px"}
              />
            </FilterOptionContainer>
          );
        }
      });
    };

    const renderFilterTeamOptions = (): Array<JSX.Element> => {
      return teams.map((team, index) => {
        const currentSelectedTeam = selectedFilterTeamId == team.id;
        return (
          <FilterOptionContainer
            key={index}
            currentSelectedItem={currentSelectedTeam}
            onClick={() => {
              setSelectedFilterGroupName(null);
              setSelectedFilterTeamId(team.id);
              setShowCompletedItems(false);
            }}
          >
            <InitialsGenerator
              name={team.name}
              fontColor={currentSelectedTeam ? baseTheme.colors.black : baseTheme.colors.grey100}
              fontSize={"14px"}
              iconSize={"18px"}
            />
          </FilterOptionContainer>
        );
      });
    };

    const renderFilterCompletedOption = (): JSX.Element => {
      return (
        <FilterOptionContainer
          currentSelectedItem={showCompletedItems}
          onClick={() => {
            setSelectedFilterTeamId(null);
            setSelectedFilterGroupName("");
            setShowCompletedItems(true);
          }}
        >
          <StyledIcon
            icon={"Checkmark"}
            size={"18px"}
            iconColor={showCompletedItems ? baseTheme.colors.black : baseTheme.colors.grey100}
          />
        </FilterOptionContainer>
      );
    };

    if (todayOnly) {
      return (
        <KeyActivitiesWrapperContainer width={width} disabled={disabled}>
          <SingleListContainer>
            <HeaderContainer>
              {renderHeader(
                "Today",
                today,
                todayFilterDropdownOpen,
                setTodayFilterDropdownOpen,
                selectedFilterGroupIdToday,
              )}
            </HeaderContainer>
            <KeyActivitiesListContainer>
              <CreateKeyActivityButton
                onButtonClick={() => {
                  setCreateKeyActivityModalOpen(true);
                }}
              />
              <KeyActivitiesList
                keyActivities={todaysKeyActivities}
                droppableId={`todays-activities-${selectedFilterGroupIdToday}`}
                loading={loading}
                keyActivityStoreLoading={keyActivityStore.loading}
                mobile={false}
              />
            </KeyActivitiesListContainer>
          </SingleListContainer>

          <CreateKeyActivityModal
            createKeyActivityModalOpen={createKeyActivityModalOpen}
            setCreateKeyActivityModalOpen={setCreateKeyActivityModalOpen}
            todayModalClicked={true}
            todayFilterGroupId={selectedFilterGroupIdToday}
          />
        </KeyActivitiesWrapperContainer>
      );
    } else if (weeklyOnly) {
      return (
        <KeyActivitiesWrapperContainer width={width} disabled={disabled}>
          <SingleListContainer>
            <HeaderContainer>
              {renderHeader(
                "Weekly List",
                subHeaderForFilterGroups("Weekly List"),
                dynamicFilterDropdownOpen,
                setDynamicFilterDropdownOpen,
                selectedFilterGroupId,
              )}
            </HeaderContainer>
            <KeyActivitiesListContainer>
              <CreateKeyActivityButton
                onButtonClick={() => {
                  setCreateKeyActivityModalOpen(true);
                }}
              />
              <KeyActivitiesList
                keyActivities={keyActivityStore.incompleteKeyActivitiesByScheduledGroupName(
                  "Weekly List",
                )}
                loading={loading}
                droppableId={`scheduled-group-activities-${sessionStore.getScheduledGroupIdByName(
                  "Weekly List",
                )}`}
                keyActivityStoreLoading={keyActivityStore.loading}
                mobile={false}
              />
            </KeyActivitiesListContainer>
          </SingleListContainer>

          <CreateKeyActivityModal
            createKeyActivityModalOpen={createKeyActivityModalOpen}
            setCreateKeyActivityModalOpen={setCreateKeyActivityModalOpen}
            todayModalClicked={todayModalClicked}
            defaultSelectedGroupId={selectedFilterGroupId}
            defaultSelectedTeamId={selectedFilterTeamId}
            todayFilterGroupId={selectedFilterGroupIdToday}
          />
        </KeyActivitiesWrapperContainer>
      );
    } else {
      return (
        <KeyActivitiesWrapperContainer width={width} disabled={disabled}>
          <KeyActivityColumnStyleListContainer>
            <HeaderContainer>
              {renderHeader(
                "Today",
                today,
                todayFilterDropdownOpen,
                setTodayFilterDropdownOpen,
                selectedFilterGroupIdToday,
              )}
            </HeaderContainer>
            <KeyActivitiesListContainer>
              <CreateKeyActivityButton
                onButtonClick={() => {
                  setTodayModalClicked(true);
                  setCreateKeyActivityModalOpen(true);
                }}
              />
              <KeyActivitiesList
                keyActivities={todaysKeyActivities}
                loading={loading}
                droppableId={`todays-activities-${selectedFilterGroupIdToday}`}
                keyActivityStoreLoading={keyActivityStore.loading}
                mobile={false}
              />
            </KeyActivitiesListContainer>
          </KeyActivityColumnStyleListContainer>
          <KeyActivityColumnStyleListContainer>
            <HeaderContainer>{renderMiddleColumnHeader()}</HeaderContainer>
            <KeyActivitiesListContainer>
              <CreateKeyActivityButton
                onButtonClick={() => {
                  setCreateKeyActivityModalOpen(true);
                  setTodayModalClicked(false);
                }}
              />
              <KeyActivitiesList
                keyActivities={filteredKeyActivities()}
                loading={loading}
                droppableId={
                  selectedFilterGroupName
                    ? `scheduled-group-activities-${selectedFilterGroupId}`
                    : `team-activities-${selectedFilterTeamId}`
                }
                keyActivityStoreLoading={keyActivityStore.loading}
                mobile={false}
              />
            </KeyActivitiesListContainer>
          </KeyActivityColumnStyleListContainer>
          {!hideListSelector && (
            <FilterContainer>
              {renderFilterGroupOptions()}
              {renderFilterCompletedOption()}
              {/* {renderFilterTeamOptions()} */}
            </FilterContainer>
          )}
          <CreateKeyActivityModal
            createKeyActivityModalOpen={createKeyActivityModalOpen}
            setCreateKeyActivityModalOpen={setCreateKeyActivityModalOpen}
            todayModalClicked={todayModalClicked}
            defaultSelectedGroupId={selectedFilterGroupId}
            defaultSelectedTeamId={selectedFilterTeamId}
            todayFilterGroupId={selectedFilterGroupIdToday}
          />
        </KeyActivitiesWrapperContainer>
      );
    }
  },
);

const SingleListContainer = styled.div`
  width: 100%;
  margin-right: 20px;
  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

const FilterContainer = styled.div`
  width: 30px;
  margin-top: 42px;
`;

const HeaderContainer = styled.div``;

type FilterOptionsContainerProps = {
  currentSelectedItem: boolean;
};

const FilterOptionContainer = styled.div<FilterOptionsContainerProps>`
  text-align: center;
  height: 27px;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 50%;
  justify-content: center;
  display: flex;
  background-color: ${props => props.currentSelectedItem && props.theme.colors.grey20};
  &: hover {
    cursor: pointer;
  }
`;
