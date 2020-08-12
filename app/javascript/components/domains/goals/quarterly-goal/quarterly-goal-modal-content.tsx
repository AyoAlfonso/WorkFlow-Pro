import * as React from "react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { useState, useEffect } from "react";
import { useMst } from "~/setup/root";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/shared/button";
import { StatusBlockColorIndicator } from "../shared/status-block-color-indicator";
import { ContextTabs } from "../shared/context-tabs";
import { OwnedBySection } from "../shared/owned-by-section";
import { IndividualVerticalStatusBlockColorIndicator } from "../shared/individual-vertical-status-block-color-indicator";
import * as moment from "moment";
import ContentEditable from "react-contenteditable";
import { observer } from "mobx-react";
import { SubHeaderText } from "~/components/shared/sub-header-text";
import { UserIconBorder } from "../shared/user-icon-border";

interface IQuarterlyGoalModalContentProps {
  quarterlyGoalId: number;
  setQuarterlyGoalModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  annualInitiativeDescription: string;
  setAnnualInitiativeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAnnualInitiativeId: React.Dispatch<React.SetStateAction<number>>;
  showCreateMilestones: boolean;
}

export const QuarterlyGoalModalContent = observer(
  ({
    quarterlyGoalId,
    setQuarterlyGoalModalOpen,
    annualInitiativeDescription,
    setAnnualInitiativeModalOpen,
    setAnnualInitiativeId,
    showCreateMilestones,
  }: IQuarterlyGoalModalContentProps): JSX.Element => {
    const { quarterlyGoalStore, sessionStore } = useMst();
    const currentUser = sessionStore.profile;
    const [quarterlyGoal, setQuarterlyGoal] = useState<any>(null);
    const [showInactiveMilestones, setShowInactiveMilestones] = useState<boolean>(false);

    useEffect(() => {
      quarterlyGoalStore.getQuarterlyGoal(quarterlyGoalId).then(() => {
        setQuarterlyGoal(quarterlyGoalStore.quarterlyGoal);
      });
    }, []);

    if (quarterlyGoal == null) {
      return <> Loading... </>;
    }

    const editable = currentUser.id == quarterlyGoal.ownedById;

    const allMilestones = quarterlyGoal.milestones;
    const activeMilestones = quarterlyGoal.activeMilestones;

    const renderHeader = (): JSX.Element => {
      return (
        <HeaderContainer>
          <TitleContainer>
            <StyledContentEditable
              html={quarterlyGoal.description}
              disabled={!editable}
              onChange={e => {
                quarterlyGoalStore.updateModelField("description", e.target.value);
              }}
              onBlur={() => quarterlyGoalStore.update()}
            />
            <GoalText>
              driving{" "}
              <UnderlinedGoalText
                onClick={() => {
                  setQuarterlyGoalModalOpen(false);
                  setAnnualInitiativeId(quarterlyGoal.annualInitiativeId);
                  setAnnualInitiativeModalOpen(true);
                }}
              >
                {annualInitiativeDescription}
              </UnderlinedGoalText>
            </GoalText>
          </TitleContainer>
          <AnnualInitiativeActionContainer>
            {/* <EditIconContainer>
              <Icon icon={"Edit-2"} size={"25px"} iconColor={"grey80"} />
            </EditIconContainer> */}
            <CloseIconContainer onClick={() => setQuarterlyGoalModalOpen(false)}>
              <Icon icon={"Close"} size={"25px"} iconColor={"grey80"} />
            </CloseIconContainer>
          </AnnualInitiativeActionContainer>
        </HeaderContainer>
      );
    };

    const renderContext = (): JSX.Element => {
      const startedMilestones = quarterlyGoal.milestones.filter(
        milestone => milestone.status != "unstarted",
      );

      let userIconBorder = "";

      if (startedMilestones.length > 0) {
        const lastStartedMilestone = startedMilestones[startedMilestones.length - 1];
        userIconBorder = UserIconBorder(lastStartedMilestone.status);
      }

      return (
        <InfoSectionContainer>
          <ContextSectionContainer>
            <SubHeaderContainer>
              <SubHeaderText text={"Context"} />
            </SubHeaderContainer>
            <ContextTabs object={quarterlyGoal} type={"quarterlyGoal"} />
          </ContextSectionContainer>
          <OwnedBySection
            userIconBorder={userIconBorder}
            ownedBy={quarterlyGoal.ownedBy}
            type={"quarterlyGoal"}
          />
        </InfoSectionContainer>
      );
    };

    const renderWeeklyMilestones = (): JSX.Element => {
      const milestonesToShow = showInactiveMilestones ? allMilestones : activeMilestones;
      return milestonesToShow.map((milestone, index) => {
        const unstarted = milestone.status == "unstarted";
        return (
          <MilestoneContainer key={index}>
            <MilestoneDetails unstarted={unstarted}>
              <WeekOfText unstarted={unstarted}>
                Week of{" "}
                <WeekOfTextValue>{moment(milestone.weekOf).format("MMMM D")}</WeekOfTextValue>
              </WeekOfText>
              <MilestoneContentEditable
                html={milestone.description}
                disabled={!editable}
                onChange={e => {
                  quarterlyGoalStore.updateMilestoneDescription(milestone.id, e.target.value);
                }}
                onBlur={() => quarterlyGoalStore.update()}
              />
            </MilestoneDetails>
            <IndividualVerticalStatusBlockColorIndicator
              milestone={milestone}
              milestoneStatus={milestone.status}
              editable={editable}
            />
          </MilestoneContainer>
        );
      });
    };

    const renderMilestoneCreateButton = (): JSX.Element => {
      return (
        <StyledButton
          small
          variant={"grey"}
          onClick={() => quarterlyGoalStore.createMilestones(quarterlyGoalId)}
        >
          <Icon icon={"Plus"} size={"20px"} style={{ marginTop: "3px" }} />
          <AddMilestoneText> Add a 13-Week Plan </AddMilestoneText>
        </StyledButton>
      );
    };

    return (
      <Container>
        <StatusBlockColorIndicator
          milestones={quarterlyGoal.milestones}
          indicatorWidth={80}
          marginBottom={16}
        />

        <QuarterlyGoalBodyContainer>
          {renderHeader()}
          <SectionContainer>{renderContext()}</SectionContainer>
          <SectionContainer>
            <MilestonesHeaderContainer>
              <SubHeaderContainer>
                <SubHeaderText text={"Weekly Milestones"} />
              </SubHeaderContainer>
              <ShowPastWeeksContainer>
                <Button
                  small
                  variant={"primaryOutline"}
                  onClick={() => setShowInactiveMilestones(!showInactiveMilestones)}
                >
                  {showInactiveMilestones
                    ? "Show Upcoming"
                    : `Show Past Weeks (${allMilestones.length - activeMilestones.length})`}
                </Button>
              </ShowPastWeeksContainer>
            </MilestonesHeaderContainer>
            {renderWeeklyMilestones()}
            {showCreateMilestones &&
              editable &&
              allMilestones.length == 0 &&
              renderMilestoneCreateButton()}
          </SectionContainer>
          <SectionContainer>
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
          </SectionContainer>
        </QuarterlyGoalBodyContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  min-width: 240px;
  margin-right: ${props => props["margin-right"] || "0px"};
  height: fit-content;
  overflow: auto;
  padding-left: 16px;
  padding-right: 16px;
`;

const QuarterlyGoalBodyContainer = styled.div`
  padding-top: 16px;
  padding-bottom: 36px;
  padding-left: 20px;
  padding-right: 20px;
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
  &: hover {
    cursor: pointer;
  }
`;

const AnnualInitiativeActionContainer = styled.div`
  display: flex;
  margin-left: auto;
`;

const EditIconContainer = styled.div`
  margin-right: 16px;
  &:hover {
    cursor: pointer;
  }
`;

const CloseIconContainer = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const SectionContainer = styled.div`
  margin-top: 24px;
`;

const ContextContainer = styled(HomeContainerBorders)`
  padding-left: 16px;
  padding-right: 16px;
`;

const MilestoneContainer = styled.div`
  display: flex;
`;

type MilestoneDetailsType = {
  unstarted: boolean;
};

const MilestoneDetails = styled(HomeContainerBorders)<MilestoneDetailsType>`
  padding: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
  width: 90%;
  border: ${props => !props.unstarted && `1px solid ${props.theme.colors.primary100}`};
  color: ${props => props.unstarted && props.theme.colors.grey60};
`;

type WeekOfTextType = {
  unstarted: boolean;
};

const WeekOfText = styled(Text)<WeekOfTextType>`
  color: ${props => (props.unstarted ? props.theme.colors.grey60 : props.theme.colors.primary100)};
  margin-top: 8px;
  margin-bottom: 8px;
`;

const WeekOfTextValue = styled.span`
  text-decoration: underline;
  font-weight: bold;
`;

const MilestonesHeaderContainer = styled.div`
  display: flex;
`;

const SubHeaderContainer = styled.div`
  display: flex;
`;

const InfoSectionContainer = styled.div`
  display: flex;
`;

const ContextSectionContainer = styled.div`
  width: 90%;
`;

const ShowPastWeeksContainer = styled.div`
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

const MilestoneContentEditable = styled(ContentEditable)`
  margin-top: 8px;
  margin-bottom: 8px;
  padding-top: 5px;
  padding-bottom: 5px;
`;

const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 280px;
  &: hover {
    color: ${props => props.theme.colors.primary100};
  }
`;

const AddMilestoneText = styled.p`
  margin-left: 16px;
`;
