import * as React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useMst } from "~/setup/root";
import { StatusBlockColorIndicator } from "../shared/status-block-color-indicator";
import { observer } from "mobx-react";
import { Loading, Avatar, Button } from "~/components/shared";
import { RoleCEO, RoleAdministrator } from "~/lib/constants";
import { Context } from "../shared-quarterly-goal-and-sub-initiative/context";
import { MilestoneCreateButton } from "../shared-quarterly-goal-and-sub-initiative/milestone-create-button";
import { WeeklyMilestones } from "../shared-quarterly-goal-and-sub-initiative/weekly-milestones";
import { InitiativeHeader } from "../shared-quarterly-goal-and-sub-initiative/initiative-header";
import { ShowMilestonesButton } from "../shared-quarterly-goal-and-sub-initiative/show-milestones-button";
import * as R from "ramda";
import { Text } from "~/components/shared/text";
import { HomeContainerBorders } from "../../home/shared-components";
import { RecordOptions } from "../shared/record-options";
import { useTranslation } from "react-i18next";
import { toJS } from "mobx";
import { CreateGoalSection } from "../shared/create-goal-section";
import { sortByDate } from "~/utils/sorting";
import ReactQuill from "react-quill";
import { DndItems } from "~/components/shared/dnd-editor";
import { StyledInput, FormElementContainer } from "../../scorecard/shared/modal-elements";
import { ActivityLogs } from "../shared/activity-logs";
import { getWeekOf } from "~/utils/date-time";
import { UpcomingMessage } from "../shared/upcoming-objective-message";

interface IQuarterlyGoalModalContentProps {
  quarterlyGoalId: number;
  setQuarterlyGoalModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  annualInitiativeDescription: string;
  setAnnualInitiativeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAnnualInitiativeId: React.Dispatch<React.SetStateAction<number>>;
  showCreateMilestones: boolean;
  setSubInitiativeId: React.Dispatch<React.SetStateAction<number>>;
  setSubInitiativeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAnnualInitiativeDescription: React.Dispatch<React.SetStateAction<string>>;
}

export const QuarterlyGoalModalContent = observer(
  ({
    quarterlyGoalId,
    setQuarterlyGoalModalOpen,
    annualInitiativeDescription,
    setAnnualInitiativeModalOpen,
    setAnnualInitiativeId,
    showCreateMilestones,
    setSubInitiativeId,
    setSubInitiativeModalOpen,
    setSelectedAnnualInitiativeDescription,
  }: IQuarterlyGoalModalContentProps): JSX.Element => {
    const {
      quarterlyGoalStore,
      sessionStore,
      subInitiativeStore,
      companyStore,
      descriptionTemplateStore: { descriptionTemplates },
    } = useMst();

    const { currentFiscalYear, currentFiscalQuarter } = companyStore.company;

    const { objectiveLogs } = quarterlyGoalStore;

    const currentUser = sessionStore.profile;
    const [showInactiveMilestones, setShowInactiveMilestones] = useState<boolean>(false);
    const [showCreateSubInitiative, setShowCreateSubInitiative] = useState<boolean>(false);
    const [showDropdownOptionsContainer, setShowDropdownOptionsContainer] = useState<boolean>(
      false,
    );
    const [quarterlyGoal, setQuarterlyGoal] = useState(null);
    const [objectiveMeta, setObjectiveMeta] = useState(null);
    const [showInitiatives, setShowInitiatives] = useState<boolean>(false);
    const [showMilestones, setShowMilestones] = useState<boolean>(true);
    const [description, setDescription] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const descriptionTemplatesFormatted = toJS(descriptionTemplates);

    const descriptionTemplateForInitiatives = descriptionTemplatesFormatted.find(
      t => t.templateType == "initiatives",
    )?.body.body;
    const itemType = "quarterlyGoal";

    const { t } = useTranslation();

    useEffect(() => {
      quarterlyGoalStore.getActivityLogs(1, "QuarterlyInitiative", quarterlyGoalId).then(meta => {
        setObjectiveMeta(meta);
      });
      quarterlyGoalStore.getQuarterlyGoal(quarterlyGoalId).then(() => {
        const quarterlyGoal = quarterlyGoalStore?.quarterlyGoal;
        if (quarterlyGoal) {
          setDescription(
            quarterlyGoal.contextDescription || descriptionTemplateForInitiatives || "",
          );
          setQuarterlyGoal(quarterlyGoal);
        } else {
          setQuarterlyGoalModalOpen(false);
        }
      });
    }, []);

    if (quarterlyGoal == null) {
      return (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      );
    }

    const handleChange = text => {
      setDescription(text);
    };

    const editable =
      currentUser.id == quarterlyGoal.ownedById ||
      currentUser.role == RoleCEO ||
      currentUser.role == RoleAdministrator;

    const allMilestones = quarterlyGoal.milestones;
    const activeMilestones = quarterlyGoal.activeMilestones;

    const subInitiativeTitle = sessionStore.subInitiativeTitle;

    const renderSubInitiative = () => {
      return quarterlyGoal.subInitiatives.sort(sortByDate).map((subInitiative, index) => {
        return (
          <SubInitiativeContainer key={index}>
            <StatusBlockColorIndicator
              milestones={subInitiative.milestones || []}
              indicatorWidth={"80px"}
              indicatorHeight={4}
              marginBottom={16}
            />
            <TopRowContainer>
              <SubInitiativeDescription
                onClick={() => {
                  setQuarterlyGoalModalOpen(false);
                  setSubInitiativeId(subInitiative.id);
                  //Look into this.
                  setSelectedAnnualInitiativeDescription(annualInitiativeDescription);
                  setSubInitiativeModalOpen(true);
                }}
              >
                {subInitiative.description}
              </SubInitiativeDescription>
              <SubInitiativeOptionContainer>
                <RecordOptions type={"subInitiative"} id={subInitiative.id} marginLeft={"-70px"} />
              </SubInitiativeOptionContainer>
            </TopRowContainer>
            <BottomRowContainer>
              {subInitiative.ownedBy && (
                <SubInitiativeOwnerContainer>
                  <Avatar
                    firstName={R.path(["ownedBy", "firstName"], quarterlyGoal)}
                    lastName={R.path(["ownedBy", "lastName"], quarterlyGoal)}
                    defaultAvatarColor={R.path(["ownedBy", "defaultAvatarColor"], quarterlyGoal)}
                    avatarUrl={R.path(["ownedBy", "avatarUrl"], quarterlyGoal)}
                    size={40}
                  />
                </SubInitiativeOwnerContainer>
              )}
            </BottomRowContainer>
          </SubInitiativeContainer>
        );
      });
    };

    const goalYearString =
      companyStore.company.currentFiscalYear ==
      companyStore.company.yearForCreatingAnnualInitiatives
        ? `FY${companyStore.company.yearForCreatingAnnualInitiatives.toString().slice(-2)}`
        : `FY${(companyStore.company.currentFiscalYear - 1)
            .toString()
            .slice(-2)}/${companyStore.company.currentFiscalYear.toString().slice(-2)}`;

    const createLog = () => {
      const objectiveLog = {
        ownedById: sessionStore.profile.id,
        score: 0,
        note: comment,
        objecteableId: quarterlyGoalId,
        objecteableType: "QuarterlyInitiative",
        fiscalQuarter: companyStore.company.currentFiscalQuarter,
        fiscalYear: companyStore.company.currentFiscalYear,
        week: companyStore.company.currentFiscalWeek,
      };

      quarterlyGoalStore.createActivityLog(objectiveLog);
    };

    const getLogs = pageNumber => {
      return quarterlyGoalStore
        .getActivityLogs(pageNumber, "QuarterlyInitiative", quarterlyGoalId)
        .then(meta => {
          setObjectiveMeta(meta);
        });
    };

    const getCurrentWeekStatus = () => {
      const currentWeekOf = getWeekOf();
      const milestone = quarterlyGoal.milestones.find(
        milestone => milestone.weekOf === currentWeekOf,
      );
      return milestone?.status;
    };

    return (
      <>
        <StatusBlockColorIndicator
          milestones={quarterlyGoal.milestones || []}
          indicatorWidth={"80px"}
          indicatorHeight={4}
          marginBottom={0}
        />
        <Container>
          <QuarterlyGoalBodyContainer>
            <SectionContainer>
              <InitiativeHeader
                itemType={itemType}
                item={quarterlyGoal}
                editable={editable}
                setAnnualInitiativeId={setAnnualInitiativeId}
                setModalOpen={setQuarterlyGoalModalOpen}
                setAnnualInitiativeModalOpen={setAnnualInitiativeModalOpen}
                annualInitiativeId={quarterlyGoal.annualInitiativeId}
                annualInitiativeDescription={annualInitiativeDescription}
                showDropdownOptionsContainer={showDropdownOptionsContainer}
                setShowDropdownOptionsContainer={setShowDropdownOptionsContainer}
                goalYearString={goalYearString}
                derivedStatus={getCurrentWeekStatus()}
              />
            </SectionContainer>
            {currentFiscalYear <= quarterlyGoal.fiscalYear &&
              currentFiscalQuarter < quarterlyGoal.quarter && (
                <UpcomingMessage goalType="Objective" fiscalTime={`Q${quarterlyGoal.quarter}`} />
              )}
            <SectionContainer>
              <Context
                activeInitiatives={quarterlyGoal.subInitiatives.length}
                setShowInitiatives={setShowInitiatives}
                setShowMilestones={setShowMilestones}
                itemType={itemType}
                item={quarterlyGoal}
              />
            </SectionContainer>
            {showMilestones ? (
              <>
                <SectionContainer>
                  {!R.isEmpty(allMilestones) && (
                    <MilestonesHeaderContainer>
                      <ShowMilestonesButton
                        setShowInactiveMilestones={setShowInactiveMilestones}
                        showInactiveMilestones={showInactiveMilestones}
                      />
                    </MilestonesHeaderContainer>
                  )}

                  <WeeklyMilestones
                    editable={editable}
                    allMilestones={allMilestones}
                    activeMilestones={activeMilestones}
                    showInactiveMilestones={showInactiveMilestones}
                    itemType={itemType}
                  />
                  {showCreateMilestones && editable && allMilestones.length == 0 && (
                    <MilestoneCreateButton itemType={itemType} item={quarterlyGoal} />
                  )}
                </SectionContainer>{" "}
              </>
            ) : (
              <></>
            )}
            {showInitiatives ? (
              <>
                <SectionContainer>
                  {renderSubInitiative()}
                  {editable && (
                    <CreateGoalContainer>
                      <CreateGoalSection
                        placeholder={t<string>("subInitiative.enterTitle", {
                          title: subInitiativeTitle,
                        })}
                        addButtonText={`${t<string>("subInitiative.add", {
                          title: subInitiativeTitle,
                        })}`}
                        createButtonText={t<string>("subInitiative.addGoal", {
                          title: subInitiativeTitle,
                        })}
                        showCreateGoal={showCreateSubInitiative}
                        setShowCreateGoal={setShowCreateSubInitiative}
                        createAction={subInitiativeStore.create}
                        quarterlyGoalId={quarterlyGoal.id}
                        // inAnnualInitiative={true}
                      />
                    </CreateGoalContainer>
                  )}
                </SectionContainer>
              </>
            ) : (
              <></>
            )}
          </QuarterlyGoalBodyContainer>
          <SubHeader>Description</SubHeader>
          <TrixEditorContainer>
            <ReactQuill
              onBlur={() => {
                quarterlyGoalStore.updateModelField("contextDescription", description);
                quarterlyGoalStore.update();
              }}
              className="trix-initiative-modal"
              theme="snow"
              modules={{
                toolbar: DndItems,
              }}
              placeholder={"Add a description..."}
              value={description}
              onChange={(content, delta, source, editor) => {
                handleChange(editor.getHTML());
              }}
            />
          </TrixEditorContainer>
          <SubHeader>Activity</SubHeader>
          <SectionContainer>
            <FormElementContainer>
              <StyledInput
                placeholder={"Add a comment..."}
                onChange={e => {
                  setComment(e.target.value);
                }}
                value={comment}
              />
              {comment && (
                <PostButton
                  small
                  variant="primary"
                  onClick={() => {
                    createLog();
                    setComment("");
                  }}
                >
                  Comment
                </PostButton>
              )}
            </FormElementContainer>
            <ActivityLogs
              keyElements={objectiveLogs}
              store={quarterlyGoalStore}
              meta={objectiveMeta}
              getLogs={getLogs}
            />
          </SectionContainer>
        </Container>
      </>
    );
  },
);

const Container = styled.div`
  min-width: 240px;
  margin-right: ${props => props["margin-right"] || "0px"};
  height: fit-content;
  padding: 30px;
  overflow: auto;
  padding-left: auto
  padding-right: auto;
  @media (max-width: 768px) {
    padding: 1em;
  }
`;

const QuarterlyGoalBodyContainer = styled.div``;

const SectionContainer = styled.div``;

const MilestonesHeaderContainer = styled.div`
  display: flex;
`;

const TopRowContainer = styled.div`
  display: flex;
`;

const BottomRowContainer = styled.div`
  display: flex;
  margin-top: 10px;
`;

const SubInitiativeContainer = styled(HomeContainerBorders)`
  padding: 16px;
  padding-top: 0;
  margin-bottom: 16px;
`;
const SubInitiativeDescription = styled(Text)`
  margin-top: 0;
  &:hover {
    cursor: pointer;
    font-weight: bold;
    text-decoration: underline;
  }
`;

const SubInitiativeOptionContainer = styled.div`
  margin-left: auto;
`;

const SubInitiativeOwnerContainer = styled.div`
  margin-left: auto;
`;

const CreateGoalContainer = styled.div`
  width: 300px;
`;

const SubHeader = styled.p`
  margin-top: 32px;
  margin-bottom: 16px;
  font-size: 15px;
  font-weight: bold;
`;

const TrixEditorContainer = styled.div`
  margin-top: 4px;
  width: 100%;
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PostButton = styled(Button)`
  margin-top: 10px;
  font-size: 14px;
`;
