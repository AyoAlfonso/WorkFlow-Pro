import { observer } from "mobx-react";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { color } from "styled-system";
import { Avatar, Icon, Loading } from "~/components/shared";
import { useMst } from "~/setup/root";
import { MilestoneCard } from "../../goals/milestone/milestone-card";
import { KeyElement } from "../../goals/shared/key-element";
import { CreateKeyActivityModal } from "../../key-activities/create-key-activity-modal";
import { KeyActivitiesList } from "../../key-activities/key-activities-list";

interface MobileTodosInitiativesProps {
  disabled?: boolean;
}

export const MobileTodosInitiatives = observer(
  ({ disabled }: MobileTodosInitiativesProps): JSX.Element => {
    const [listSelectorOpen, setListSelectorOpen] = useState<boolean>(false);
    const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);
    const [showCompletedItems, setShowCompletedItems] = useState<boolean>(false);
    const [currentList, setCurrentList] = useState<string>("Weekly List");
    const [loading, setLoading] = useState<boolean>(true);

    const {
      keyActivityStore,
      sessionStore,
      companyStore,
      milestoneStore,
      keyElementStore,
      userStore,
    } = useMst();
    const { t } = useTranslation();
    const { keyElementsForWeeklyCheckin } = keyElementStore;

    const isKeyResults = companyStore.company?.objectivesKeyType === "KeyResults";
    const listRef = useRef<HTMLDivElement>(null);

    const initiativeName = isKeyResults ? "Key Results" : "Milestones";

    const selectedFilterGroupId = sessionStore.getScheduledGroupIdByName("Weekly List");

    useEffect(() => {
      showCompletedItems
        ? keyActivityStore.fetchCompleteKeyActivities()
        : keyActivityStore.fetchIncompleteKeyActivities();
    }, [showCompletedItems]);

    useEffect(() => {
      milestoneStore.getMilestonesForPersonalMeeting();
      keyElementStore.getKeyElementsForWeeklyCheckIn().then(() => {
        setLoading(false);
      });
    }, []);

    useEffect(() => {
      const externalEventHandler = e => {
        if (!listSelectorOpen) return;

        const node = listRef.current;

        if (node && node.contains(e.target)) {
          return;
        }
        setListSelectorOpen(false);
      };

      if (listSelectorOpen) {
        document.addEventListener("click", externalEventHandler);
      } else {
        document.removeEventListener("click", externalEventHandler);
      }

      return () => {
        document.removeEventListener("click", externalEventHandler);
      };
    }, []);

    const groupBy = objectArray => {
      return objectArray.reduce(function(acc, obj) {
        const key = `${obj["elementableType"]}` + "_" + `${obj["elementableId"]}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
    };

    const sortedKeyElements = keyElementsForWeeklyCheckin && groupBy(keyElementsForWeeklyCheckin);

    const weeklyKeyActivities = keyActivityStore.incompleteKeyActivitiesByScheduledGroupName(
      "Weekly List",
    );
    console.log(weeklyKeyActivities);

    const droppableId = `scheduled-group-activities-${selectedFilterGroupId}`;

    const listName = currentList;

    const renderListSelector = (): JSX.Element => {
      return (
        <ListSelectorContainer ref={listRef}>
          <IconContainer display="flex" onClick={() => setListSelectorOpen(!listSelectorOpen)}>
            <Icon icon={"List"} size={"16px"} iconColor={"primary100"} mr="12px" />
            <ListText>{listName}</ListText>
            {!listSelectorOpen ? (
              <Icon icon={"Chevron-Down"} size={"16px"} iconColor={"primary100"} ml="8px" />
            ) : (
              <ChevronUp icon={"Chevron-Down"} size={"16px"} iconColor={"primary100"} ml="8px" />
            )}
          </IconContainer>
          {listSelectorOpen && (
            <ListDropdownContainer>
              <ListOption
                onClick={() => {
                  setCurrentList("Weekly List");
                  setListSelectorOpen(false);
                  setShowCompletedItems(false);
                }}
              >
                Weekly List
              </ListOption>
              <ListOption
                onClick={() => {
                  setCurrentList(initiativeName);
                  setListSelectorOpen(false);
                  setShowCompletedItems(false);
                }}
              >
                {initiativeName}
              </ListOption>
            </ListDropdownContainer>
          )}
        </ListSelectorContainer>
      );
    };

    const renderKeyActivitiesList = (): JSX.Element => {
      return (
        <KeyActivitiesList
          keyActivities={weeklyKeyActivities}
          droppableId={droppableId}
          keyActivityStoreLoading={keyActivityStore.loading}
        />
      );
    };

    const renderWeeklyMilestones = (): JSX.Element[] => {
      return milestoneStore.milestonesForPersonalMeeting.map(milestone => (
        <MilestoneContainer key={milestone.id}>
          <StyledText>{`${milestone.quarterlyGoalDescription || ""}`}</StyledText>
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            editable={true}
            fromMeeting={true}
            itemType={"quarterlyGoal"}
          />
        </MilestoneContainer>
      ));
    };

    const groupKrs = () => {
      const keyElements = sortedKeyElements;
      const index = Object.values(keyElements);
      const map = index.map(arry => arry);
      return map;
    };

    const renderKeyResults = (): JSX.Element[] => {
      return (
        keyElementsForWeeklyCheckin &&
        groupKrs().map((groupedKrs: Array<any>, index) => {
          const user = userStore.users?.find(
            user => user.id == groupedKrs[0]["elementableOwnedBy"],
          );
          return (
            <KeyElementsContainer key={index}>
              <TopSection>
                <Avatar
                  defaultAvatarColor={user?.defaultAvatarColor}
                  avatarUrl={user?.avatarUrl}
                  firstName={user?.firstName}
                  lastName={user?.lastName}
                  size={20}
                  marginLeft={"0"}
                />
                <StyledTitle>{groupedKrs[0]["elementableContextDescription"]}</StyledTitle>
              </TopSection>
              {groupedKrs.map((kr, index) => {
                const lastKeyElement = index == keyElementsForWeeklyCheckin.length - 1;
                return (
                  <KeyElement
                    elementId={kr.id}
                    key={kr.id}
                    store={keyElementStore}
                    editable={true}
                    lastKeyElement={lastKeyElement}
                    type={"checkIn"}
                    targetValueMargin={"0"}
                  />
                );
              })}
            </KeyElementsContainer>
          );
        })
      );
    };

    const initiativeComponent = isKeyResults ? renderKeyResults() : renderWeeklyMilestones();

    if (loading) {
      return <Loading />;
    }

    return (
      <Container disabled={disabled}>
        <CreateKeyActivityModal
          createKeyActivityModalOpen={createKeyActivityModalOpen}
          setCreateKeyActivityModalOpen={setCreateKeyActivityModalOpen}
          defaultSelectedGroupId={sessionStore.getScheduledGroupIdByName("Weekly List")}
        />
        {renderListSelector()}
        {currentList !== initiativeName && (
          <AddNewKeyActivityContainer onClick={() => setCreateKeyActivityModalOpen(true)}>
            <AddNewKeyActivityPlus>
              <Icon icon={"Plus"} size={16} iconColor={"primary100"} />
            </AddNewKeyActivityPlus>
            <AddNewKeyActivityText> {t<string>("keyActivities.addTitle")}</AddNewKeyActivityText>
          </AddNewKeyActivityContainer>
        )}
        {currentList == initiativeName ? initiativeComponent : renderKeyActivitiesList()}
      </Container>
    );
  },
);

const ChevronUp = styled(Icon)`
  transform: rotate(180deg);
`;

type ContainerProps = {
  disabled?: boolean;
};

const Container = styled.div<ContainerProps>`
  ${color}
  position: relative;
  padding: 0px 0px 6px 0px;
  pointer-events: ${props => (props.disabled ? "none" : "auto")};
  display: none @media (min-width: 768px) {
    display: block;
  }
`;

type IconContainerProps = {
  ml?: string;
  display?: string;
  cursor?: string;
  mr?: string;
};

const ListDropdownContainer = styled.div`
  position: absolute;
  background: ${props => props.theme.colors.white};
  width: 10em;
  border-radius: 4px;
  box-shadow: 0px 3px 6px #00000029;
  z-index: 5;
  padding: 1em 0;
  margin-top: 5px;
`;

const ListOption = styled.span`
  display: block;
  font-size: 0.875em;
  color: ${props => props.theme.colors.black};
  padding: 0.5em 1em;
  &:hover {
    background: ${props => props.theme.colors.backgroundGrey};
  }
`;

const ListSelectorContainer = styled.div`
  position: relative;
  margin-top: 1.5em;
  margin-left: 1em;
  margin-bottom: 1em;
`;

const IconContainer = styled.div<IconContainerProps>`
  margin-left: ${props => (props.ml ? props.ml : "none")};
  margin-right: ${props => (props.mr ? props.mr : "none")};
  display: ${props => (props.display ? props.display : "block")};
  align-items: center;
  cursor: ${props => (props.cursor ? props.cursor : "default")};
  position: relative;
`;

const ListText = styled.span`
  font-size: 0.875em;
  color: ${props => props.theme.colors.black};
  font-family: Exo;
  font-weight: bold;
  margin-top: 3px;
`;

const AddNewKeyActivityPlus = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.grey80};
`;

const AddNewKeyActivityText = styled.p`
  ${color}
  font-size: 16px;
  margin-left: 21px;
  color: ${props => props.theme.colors.grey80};
  line-height: 20pt;
`;

const AddNewKeyActivityContainer = styled.div`
  display: flex;
  cursor: pointer;
  margin-bottom: -5px;
  margin-left: 8px;
  padding-left: 4px;
  &:hover ${AddNewKeyActivityText} {
    color: ${props => props.theme.colors.primary100};
    font-weight: bold;
  }
  &:hover ${AddNewKeyActivityPlus} {
    color: ${props => props.theme.colors.primary100};
  }
`;

const MilestoneContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding-bottom: 16px;
`;

const StyledText = styled.h4`
  font-size: 20px;
  margin-bottom: 8px;
  margin-top: 0;
`;

const KeyElementsContainer = styled.div`
  margin-bottom: 50px;
  padding-left: 1em;
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 25px;
`;

const StyledTitle = styled.span`
  font-size: 16px;
  font-weight: bold;
  margin-left: 5px;
`;
