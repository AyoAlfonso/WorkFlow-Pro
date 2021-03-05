import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Heading, Icon } from "~/components/shared";
import * as moment from "moment";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { InitialsGenerator } from "~/components/shared/issues-and-key-activities/initials-generator";
import { baseTheme } from "~/themes";
import { CreateKeyActivityModal } from "../../key-activities/create-key-activity-modal";
import { CreateKeyActivityButton } from "../../key-activities/create-key-activity-button";
import { KeyActivitiesList } from "../../key-activities/key-activities-list";
import { FilterDropdown } from "../../key-activities/filter-dropdown";
import * as R from "ramda";
import { StyledIcon } from "~/components/shared/issues-and-key-activities/scheduled-group-selector";

export const HomeKeyActivities = observer(
  (): JSX.Element => {
    const [selectedFilterGroupName, setSelectedFilterGroupName] = useState<string>("Tomorrow");
    const [selectedFilterTeamId, setSelectedFilterTeamId] = useState<number>(null);
    const [showCompletedItems, setShowCompletedItems] = useState<boolean>(false);
    const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);
    const [todayFilterDropdownOpen, setTodayFilterDropdownOpen] = useState<boolean>(false);
    const [dynamicFilterDropdownOpen, setDynamicFilterDropdownOpen] = useState<boolean>(false);
    const [todayModalClicked, setTodayModalClicked] = useState<boolean>(false);

    const {
      keyActivityStore,
      sessionStore: { scheduledGroups },
      teamStore: { teams },
    } = useMst();

    const todaysKeyActivities = keyActivityStore.keyActivitiesByScheduledGroupName("Today");
    const selectedFilterGroupId = R.path(
      ["id"],
      scheduledGroups.find(group => group.name == selectedFilterGroupName),
    );
    const todayFilterGroupId = scheduledGroups.find(group => group.name == "Today").id;

    const selectedFilterGroupIdToday = R.path(
      ["id"],
      scheduledGroups.find(group => group.name == "Today"),
    );

    const subHeaderForFilterGroups = (name: string): string => {
      switch (name) {
        case "Weekly List":
          return "Pyns you have to get done this week";
        case "Tomorrow":
          return moment()
            .add(1, "days")
            .format("MMMM D");
        case "Backlog":
          return "Pyns you have not scheduled";
      }
    };

    const filteredKeyActivities = () => {
      if (showCompletedItems) {
        return keyActivityStore.completedActivities;
      } else if (selectedFilterGroupName) {
        return keyActivityStore.keyActivitiesByScheduledGroupName(selectedFilterGroupName);
      } else {
        return keyActivityStore.keyActivitiesByTeamId(selectedFilterTeamId);
      }
    };

    const renderMiddleColumnHeader = () => {
      if (showCompletedItems) {
        return renderHeader(
          "Completed Pyns",
          "A list of your completed pyns.",
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
          "Pyns you are accountable for that are associated with this team.",
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
        <>
          <HeaderRowContainer>
            <StyledHeading type={"h2"} fontSize={"20px"}>
              {header}
            </StyledHeading>
          </HeaderRowContainer>
          <HeaderRowContainer>
            <SubHeaderContainer>{subText}</SubHeaderContainer>
            {!R.isNil(scheduledGroupId) && (
              <SortContainer onClick={() => setFilterOpen(!sortFilterOpen)}>
                <Icon icon={"Sort"} size={12} iconColor="grey100" />
                {sortFilterOpen && (
                  <FilterDropdown
                    setFilterOpen={setFilterOpen}
                    scheduledGroupId={scheduledGroupId}
                  />
                )}
              </SortContainer>
            )}
          </HeaderRowContainer>
        </>
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

    return (
      <Container>
        <ListContainer>
          <HeaderContainer>
            {renderHeader(
              "Today",
              moment().format("MMMM D"),
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
              droppableId={`todays-activities-${todayFilterGroupId}`}
            />
          </KeyActivitiesListContainer>
        </ListContainer>
        <ListContainer>
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
              droppableId={
                selectedFilterGroupName
                  ? `scheduled-group-activities-${selectedFilterGroupId}`
                  : `team-activities-${selectedFilterTeamId}`
              }
            />
          </KeyActivitiesListContainer>
        </ListContainer>
        <FilterContainer>
          {renderFilterGroupOptions()}
          {renderFilterCompletedOption()}
          {renderFilterTeamOptions()}
        </FilterContainer>
        <CreateKeyActivityModal
          createKeyActivityModalOpen={createKeyActivityModalOpen}
          setCreateKeyActivityModalOpen={setCreateKeyActivityModalOpen}
          todayModalClicked={todayModalClicked}
          defaultSelectedGroupId={selectedFilterGroupId}
          defaultSelectedTeamId={selectedFilterTeamId}
          defaultTypeAsWeekly={true}
          todayFilterGroupId={todayFilterGroupId}
        />
      </Container>
    );
  },
);

const Container = styled.div`
  display: flex;
  width: 70%;
`;

const ListContainer = styled.div`
  width: 50%;
  margin-right: 20px;
`;

const FilterContainer = styled.div`
  width: 30px;
  margin-top: 42px;
`;

const HeaderContainer = styled.div``;

const HeaderRowContainer = styled.div`
  display: flex;
`;

const SubHeaderContainer = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.grey100};
  margin-top: auto;
  margin-bottom: auto;
`;

const StyledHeading = styled(Heading)`
  font-weight: bold;
`;

const SortContainer = styled.div`
  margin-left: auto;
  &: hover {
    cursor: pointer;
  }
`;

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

const KeyActivitiesListContainer = styled.div`
  height: 100%;
`;
