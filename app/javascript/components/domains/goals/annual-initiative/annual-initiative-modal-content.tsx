import * as React from "react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { useEffect, useState, useRef } from "react";
import { useMst } from "~/setup/root";
import { Icon } from "~/components/shared/icon";
import * as R from "ramda";
import { UserDefaultIcon } from "~/components/shared/user-default-icon";
import { StatusBlockColorIndicator } from "../shared/status-block-color-indicator";
import { OwnedBySection } from "../shared/owned-by-section";
import ContentEditable from "react-contenteditable";
import { observer } from "mobx-react";
import { SubHeaderText } from "~/components/shared/sub-header-text";
import { CreateGoalSection } from "../shared/create-goal-section";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { RecordOptions } from "../shared/record-options";
import { Loading } from "~/components/shared";
import { RoleCEO, RoleAdministrator } from "~/lib/constants";
import { GoalDropdownOptions } from "../shared/goal-dropdown-options";
import { Context } from "../shared-quarterly-goal-and-sub-initiative/context";
import moment from "moment";

interface IAnnualInitiativeModalContentProps {
  annualInitiativeId: number;
  setAnnualInitiativeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setQuarterlyGoalModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAnnualInitiativeDescription: React.Dispatch<React.SetStateAction<string>>;
  setQuarterlyGoalId: React.Dispatch<React.SetStateAction<number>>;
}

export const AnnualInitiativeModalContent = observer(
  ({
    annualInitiativeId,
    setAnnualInitiativeModalOpen,
    setQuarterlyGoalModalOpen,
    setSelectedAnnualInitiativeDescription,
    setQuarterlyGoalId,
  }: IAnnualInitiativeModalContentProps): JSX.Element => {
    const { annualInitiativeStore, companyStore, sessionStore, quarterlyGoalStore } = useMst();
    const currentUser = sessionStore.profile;

    const [showCreateQuarterlyGoal, setShowCreateQuarterlyGoal] = useState<boolean>(false);
    const [showAllQuarterlyGoals, setShowAllQuarterlyGoals] = useState<boolean>(false);
    const [showDropdownOptionsContainer, setShowDropdownOptionsContainer] = useState<boolean>(
      false,
    );

    const { t } = useTranslation();
    const descriptionRef = useRef(null);

    const quarterlyGoalTitle = sessionStore.quarterlyGoalTitle;

    useEffect(() => {
      annualInitiativeStore.getAnnualInitiative(annualInitiativeId);
    }, []);

    const annualInitiative = annualInitiativeStore.annualInitiative;
    if (annualInitiative == null) {
      return <Loading />;
    }

    const editable =
      (currentUser.id == annualInitiative.ownedById ||
        currentUser.role == RoleCEO ||
        currentUser.role == RoleAdministrator) &&
      !annualInitiative.closedInitiative;

    const activeQuarterlyGoals = annualInitiative.activeQuarterlyGoals;
    const allQuarterlyGoals = annualInitiative.quarterlyGoals;

    const renderQuarterlyGoals = () => {
      const quarterlyGoalsToDisplay = showAllQuarterlyGoals
        ? allQuarterlyGoals
        : activeQuarterlyGoals;
      return quarterlyGoalsToDisplay.map((quarterlyGoal, index) => {
        return (
          <QuarterlyGoalContainer key={index}>
            <StatusBlockColorIndicator
              milestones={quarterlyGoal.milestones || []}
              indicatorWidth={"80px"}
              indicatorHeight={4}
              marginBottom={16}
            />

            <TopRowContainer>
              <QuarterlyGoalDescription
                onClick={() => {
                  setAnnualInitiativeModalOpen(false);
                  setQuarterlyGoalId(quarterlyGoal.id);
                  setSelectedAnnualInitiativeDescription(annualInitiative.description);
                  setQuarterlyGoalModalOpen(true);
                }}
              >
                {quarterlyGoal.description}
              </QuarterlyGoalDescription>
              <QuarterlyGoalOptionContainer>
                <RecordOptions type={"quarterlyGoal"} id={quarterlyGoal.id} />
              </QuarterlyGoalOptionContainer>
            </TopRowContainer>
            <BottomRowContainer>
              {quarterlyGoal.ownedBy && (
                <QuarterlyGoalOwnerContainer>
                  <UserDefaultIcon
                    firstName={R.path(["ownedBy", "firstName"], quarterlyGoal)}
                    lastName={R.path(["ownedBy", "lastName"], quarterlyGoal)}
                    defaultAvatarColor={R.path(["ownedBy", "defaultAvatarColor"], quarterlyGoal)}
                    size={40}
                  />
                </QuarterlyGoalOwnerContainer>
              )}
            </BottomRowContainer>
          </QuarterlyGoalContainer>
        );
      });
    };

    const renderDropdownOptions = (): JSX.Element => {
      return (
        editable && (
          <DropdownOptionsContainer
            onClick={() => setShowDropdownOptionsContainer(!showDropdownOptionsContainer)}
          >
            <StyledOptionIcon icon={"Options"} size={"16px"} iconColor={"grey80"} />
            {showDropdownOptionsContainer && (
              <GoalDropdownContainer>
                <GoalDropdownOptions
                  setShowDropdownOptions={setShowDropdownOptionsContainer}
                  setModalOpen={setAnnualInitiativeModalOpen}
                  itemType={"annualInitiative"}
                  itemId={annualInitiative.id}
                />
              </GoalDropdownContainer>
            )}
          </DropdownOptionsContainer>
        )
      );
    };

    const goalYearString = `FY${(annualInitiative.fiscalYear % 100)}/${(annualInitiative.fiscalYear + 1) % 100}`;

    const renderHeader = (): JSX.Element => {
      return (
        <HeaderContainer>
          <TitleContainer>
            <StyledContentEditable
              innerRef={descriptionRef}
              html={annualInitiative.description}
              disabled={!editable}
              onChange={e => {
                if (!e.target.value.includes("<div>")) {
                  annualInitiativeStore.updateModelField("description", e.target.value);
                }
              }}
              onKeyDown={key => {
                if (key.keyCode == 13) {
                  descriptionRef.current.blur();
                }
              }}
              onBlur={() => annualInitiativeStore.update()}
            />
            {R.isNil(annualInitiative.companyId) ? null : (
              <GoalText>
                driving {"  "}
                <StyledNavLink to={"/company/strategic_plan"}>
                  The {companyStore.company.name} Plan
                </StyledNavLink>
              </GoalText>
            )}
            <DetailsContainer>
              <IconContainer>
                <Icon icon={"Initiative"} size={"16px"} iconColor={"grey80"} />
              </IconContainer>
              <YearText type={"small"}>{goalYearString}</YearText>
              <OwnedBySection
                marginLeft={"0px"}
                marginRight={"0px"}
                marginTop={"auto"}
                marginBottom={"auto"}
                ownedBy={annualInitiative.ownedBy}
                type={"annualInitiative"}
                //TODO: Confirm if this is necessary 
                // disabled={annualInitiative.closedInitiative}
              />
            </DetailsContainer>
          </TitleContainer>
          {!annualInitiative.closedAt && (
            <AnnualInitiativeActionContainer>
              {renderDropdownOptions()}
              <CloseIconContainer onClick={() => setAnnualInitiativeModalOpen(false)}>
                <Icon icon={"Close"} size={"16px"} iconColor={"grey80"} />
              </CloseIconContainer>
            </AnnualInitiativeActionContainer>
          )}
        </HeaderContainer>
      );
    };

    const renderGoals = (): JSX.Element => {
      return (
        <>
          <SubHeaderContainer>
            <SubHeaderTextContainer>
              <SubHeaderText
                text={t("quarterlyGoal.title", { title: quarterlyGoalTitle })}
                noMargin={true}
              />
            </SubHeaderTextContainer>
            <FilterOptionsContainer>
              <FilterOptionContainer underline={!showAllQuarterlyGoals}>
                <FilterOption
                  onClick={() => setShowAllQuarterlyGoals(false)}
                  color={showAllQuarterlyGoals ? "grey40" : "primary100"}
                >
                  Open
                </FilterOption>
              </FilterOptionContainer>
              <FilterOptionContainer underline={showAllQuarterlyGoals}>
                <FilterOption
                  onClick={() => setShowAllQuarterlyGoals(true)}
                  color={showAllQuarterlyGoals ? "primary100" : "grey40"}
                >
                  All
                </FilterOption>
              </FilterOptionContainer>
            </FilterOptionsContainer>
          </SubHeaderContainer>
          <QuarterlyGoalsContainer>
            {renderQuarterlyGoals()}
            {editable && (
              <CreateGoalContainer>
                <CreateGoalSection
                  placeholder={t("quarterlyGoal.enterTitle", { title: quarterlyGoalTitle })}
                  addButtonText={`${t("quarterlyGoal.add", { title: quarterlyGoalTitle })} (Q${
                    companyStore.company.quarterForCreatingQuarterlyGoals
                  })`}
                  createButtonText={t("quarterlyGoal.addGoal", { title: quarterlyGoalTitle })}
                  showCreateGoal={showCreateQuarterlyGoal}
                  setShowCreateGoal={setShowCreateQuarterlyGoal}
                  createAction={quarterlyGoalStore.create}
                  annualInitiativeId={annualInitiative.id}
                  inAnnualInitiative={true}
                  buttonWidth={"auto"}
                />
              </CreateGoalContainer>
            )}
          </QuarterlyGoalsContainer>
        </>
      );
    };

    return (
      <>
        {annualInitiative.closedAt && (
          <ClosedStatusBannerContainer>
          {t("annualInitiative.cardClosed", {
            title: sessionStore.companyStaticData[0].value
          })}. {t("annualInitiative.createdOn")} {`FY${annualInitiative.fiscalYear}`}.
            <AnnualInitiativeActionContainer>
              {renderDropdownOptions()}
              <CloseIconContainer onClick={() => setAnnualInitiativeModalOpen(false)}>
                <Icon icon={"Close"} size={"16px"} iconColor={"grey80"} />
              </CloseIconContainer>
            </AnnualInitiativeActionContainer>
          </ClosedStatusBannerContainer>
        )}
        <Container>
          {renderHeader()}
          <SectionContainer>
            <Context itemType={"annualInitiative"} item={annualInitiative} />
          </SectionContainer>
          <SectionContainer>{renderGoals()}</SectionContainer>
        </Container>
      </>
    );
  },
);

const Container = styled.div`
  min-width: 240px;
  margin-right: ${props => props["margin-right"] || "0px"};
  height: fit-content;
  padding: 48px;
  overflow: auto;
  padding-left: auto;
  padding-right: auto;
`;

const HeaderContainer = styled.div`
  display: flex;
`;

const TitleContainer = styled.div``;

const GoalText = styled(Text)`
  font-size: 15px;
  color: ${props => props.theme.colors.grey80};
  margin-left: 4px;
  margin-top: 8px;
`;

const AnnualInitiativeActionContainer = styled.div`
  display: flex;
  margin-left: auto;
`;

const IconContainer = styled.div`
  margin-right: 8px;
  margin-top: auto;
  margin-bottom: auto;
`;

const CloseIconContainer = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const SectionContainer = styled.div`
  margin-top: 24px;
`;

const QuarterlyGoalsContainer = styled.div`
  margin-top: 8px;
`;

const QuarterlyGoalContainer = styled(HomeContainerBorders)`
  padding: 16px;
  padding-top: 0;
  margin-bottom: 16px;
`;

const SubHeaderContainer = styled.div`
  position: relative;
  display: flex;
`;

const TopRowContainer = styled.div`
  display: flex;
`;

const BottomRowContainer = styled.div`
  display: flex;
  margin-top: 10px;
`;

const QuarterlyGoalDescription = styled(Text)`
  margin-top: 0;
  &:hover {
    cursor: pointer;
    font-weight: bold;
    text-decoration: underline;
  }
`;

const QuarterlyGoalOptionContainer = styled.div`
  margin-left: auto;
`;

const QuarterlyGoalOwnerContainer = styled.div`
  margin-left: auto;
`;

const StyledContentEditable = styled(ContentEditable)`
  font-weight: bold;
  font-size: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 4px;
  padding-right: 4px;
  margin-right: -4px;
`;

const CreateGoalContainer = styled.div`
  width: auto;
`;

const StyledNavLink = styled(NavLink)`
  font-weight: bold;
  text-decoration: underline;
  &:visited {
    color: ${props => props.theme.colors.grey80};
  }
`;

const DropdownOptionsContainer = styled.div`
  margin-right: 16px;
  &: hover {
    cursor: pointer;
  }
`;

const StyledOptionIcon = styled(Icon)`
  transform: rotate(90deg);
`;

const DetailsContainer = styled.div`
  display: flex;
  margin-left: 4px;
`;

const YearText = styled(Text)`
  color: ${props => props.theme.colors.greyActive};
  margin-right: 16px;
`;

const FilterOptionsContainer = styled.div`
  display: flex;
  margin: auto;
`;

type FilterOptionType = {
  mr?: string;
};

const FilterOption = styled.p<FilterOptionType>`
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  margin-top: 4px;
  margin-bottom: 0;
`;

type FilterOptionContainerType = {
  underline: boolean;
};
const FilterOptionContainer = styled.div<FilterOptionContainerType>`
  border-bottom: ${props => props.underline && `4px solid ${props.theme.colors.primary100}`};
  padding-left: 4px;
  padding-right: 4px;
  margin-left: 4px;
  margin-right: 4px;
`;

const SubHeaderTextContainer = styled.div`
  position: absolute;
  margin-bottom: 24px;
`;

// TODOIST: color to constant
const ClosedStatusBannerContainer = styled.div`
  background-image: repeating-linear-gradient(
    150deg,
    #feecea,
    #feecea 20px,
    #f2e2e4 20px,
    #f2e2e4 25px
  );
  border-radius: 4px;
  text-align: left;
  font: normal normal bold 16px/16px Lato;
  letter-spacing: 0px;
  color: ${props => props.theme.colors.black};
  opacity: 1;
  padding: 40px 5%;
  justify-content: space-between;
  display: flex;
  height: 20px;
`;

const GoalDropdownContainer = styled.div`
  margin-left: -50px;
`;
