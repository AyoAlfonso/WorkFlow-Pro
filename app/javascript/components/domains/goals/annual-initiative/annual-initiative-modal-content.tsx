import * as React from "react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { useEffect, useState, useRef } from "react";
import { useMst } from "~/setup/root";
import { Icon } from "~/components/shared/icon";
import * as R from "ramda";
import { UserDefaultIcon } from "~/components/shared/user-default-icon";
import { Button } from "~/components/shared/button";
import { StatusBlockColorIndicator } from "../shared/status-block-color-indicator";
import { ContextTabs } from "../shared/context-tabs";
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

    const { t } = useTranslation();
    const descriptionRef = useRef(null);

    useEffect(() => {
      annualInitiativeStore.getAnnualInitiative(annualInitiativeId);
    }, []);

    const annualInitiative = annualInitiativeStore.annualInitiative;
    if (annualInitiative == null) {
      return <Loading />;
    }

    const editable =
      currentUser.id == annualInitiative.ownedById ||
      currentUser.role == RoleCEO ||
      currentUser.role == RoleAdministrator;

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
              indicatorWidth={80}
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
          </TitleContainer>
          <AnnualInitiativeActionContainer>
            {editable && (
              <DeleteIconContainer
                onClick={() => {
                  if (
                    confirm(
                      `Are you sure you want to delete this ${t("annualInitiative.messageText")}`,
                    )
                  ) {
                    annualInitiativeStore.delete(annualInitiativeId).then(() => {
                      setAnnualInitiativeModalOpen(false);
                    });
                  }
                }}
              >
                <Icon icon={"Delete"} size={"16px"} iconColor={"grey80"} />
              </DeleteIconContainer>
            )}

            <CloseIconContainer onClick={() => setAnnualInitiativeModalOpen(false)}>
              <Icon icon={"Close"} size={"16px"} iconColor={"grey80"} />
            </CloseIconContainer>
          </AnnualInitiativeActionContainer>
        </HeaderContainer>
      );
    };

    const renderContext = (): JSX.Element => {
      return (
        <InfoSectionContainer>
          <ContextSectionContainer>
            <SubHeaderContainer>
              <SubHeaderText text={"Context"} />
            </SubHeaderContainer>
            <ContextTabs object={annualInitiative} type={"annualInitiative"} />
          </ContextSectionContainer>
          <OwnedBySection ownedBy={annualInitiative.ownedBy} type={"annualInitiative"} />
        </InfoSectionContainer>
      );
    };

    const renderGoals = (): JSX.Element => {
      return (
        <>
          <SubHeaderContainer>
            <SubHeaderText text={t("quarterlyGoal.title")} />
            <ShowPastGoalsContainer>
              <Button
                small
                variant={"primaryOutline"}
                onClick={() => setShowAllQuarterlyGoals(!showAllQuarterlyGoals)}
              >
                {showAllQuarterlyGoals
                  ? `Show Active (${activeQuarterlyGoals.length})`
                  : `Show Past Goals (${allQuarterlyGoals.length - activeQuarterlyGoals.length})`}
              </Button>
            </ShowPastGoalsContainer>
          </SubHeaderContainer>
          <QuarterlyGoalsContainer>
            {renderQuarterlyGoals()}
            {editable && (
              <CreateGoalContainer>
                <CreateGoalSection
                  placeholder={t("quarterlyGoal.enterTitle")}
                  addButtonText={`${t("quarterlyGoal.add")} (Q${
                    companyStore.company.quarterForCreatingQuarterlyGoals
                  })`}
                  createButtonText={t("quarterlyGoal.addGoal")}
                  showCreateGoal={showCreateQuarterlyGoal}
                  setShowCreateGoal={setShowCreateQuarterlyGoal}
                  createAction={quarterlyGoalStore.create}
                  annualInitiativeId={annualInitiative.id}
                  inAnnualInitiative={true}
                />
              </CreateGoalContainer>
            )}
          </QuarterlyGoalsContainer>
        </>
      );
    };

    return (
      <Container>
        {renderHeader()}
        <SectionContainer>{renderContext()}</SectionContainer>
        <SectionContainer>{renderGoals()}</SectionContainer>
        {/* <SectionContainer>
          <SubHeaderContainer>
            <SubHeaderText text={"Comments"} />
          </SubHeaderContainer>
          <ContextContainer>PLACEHOLDER FOR COMMENTS</ContextContainer>
        </SectionContainer>
        <SectionContainer>
          <SubHeaderContainer>
            <SubHeaderText text={"Attachments"} />
          </SubHeaderContainer>
          <ContextContainer>PLACEHOLDER FOR ATTACHMENTS</ContextContainer>
        </SectionContainer> */}
      </Container>
    );
  },
);

const Container = styled.div`
  min-width: 240px;
  margin-right: ${props => props["margin-right"] || "0px"};
  height: fit-content;
  padding: 48px;
  overflow: auto;
`;

const HeaderContainer = styled.div`
  display: flex;
`;

const TitleContainer = styled.div``;

const GoalText = styled(Text)`
  font-size: 15px;
  color: ${props => props.theme.colors.grey80};
`;

const UnderlinedGoalText = styled.span`
  font-weight: bold;
  text-decoration: underline;
`;

const AnnualInitiativeActionContainer = styled.div`
  display: flex;
  margin-left: auto;
`;

const CloseIconContainer = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const DeleteIconContainer = styled(CloseIconContainer)`
  margin-right: 16px;
`;

const SectionContainer = styled.div`
  margin-top: 24px;
`;

const ContextContainer = styled(HomeContainerBorders)`
  padding-left: 16px;
  padding-right: 16px;
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

const InfoSectionContainer = styled.div`
  display: flex;
`;

const ContextSectionContainer = styled.div`
  width: 90%;
`;

const ShowPastGoalsContainer = styled.div`
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
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
  width: 300px;
`;

const StyledNavLink = styled(NavLink)`
  font-weight: bold;
  text-decoration: underline;
  &:visited {
    color: ${props => props.theme.colors.grey80};
  }
`;
