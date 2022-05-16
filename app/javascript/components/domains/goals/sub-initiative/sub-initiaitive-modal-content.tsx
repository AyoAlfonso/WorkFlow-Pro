import * as React from "react";
import styled, { keyframes } from "styled-components";
import { useState, useEffect } from "react";
import { useMst } from "~/setup/root";
import { Button } from "~/components/shared/button";
import { StatusBlockColorIndicator } from "../shared/status-block-color-indicator";
import { observer } from "mobx-react";
import { SubHeaderText } from "~/components/shared/sub-header-text";
import { Loading } from "~/components/shared";
import { RoleCEO, RoleAdministrator } from "~/lib/constants";
import { Context } from "../shared-quarterly-goal-and-sub-initiative/context";
import { MilestoneCreateButton } from "../shared-quarterly-goal-and-sub-initiative/milestone-create-button";
import { WeeklyMilestones } from "../shared-quarterly-goal-and-sub-initiative/weekly-milestones";
import { InitiativeHeader } from "../shared-quarterly-goal-and-sub-initiative/initiative-header";
import { ShowMilestonesButton } from "../shared-quarterly-goal-and-sub-initiative/show-milestones-button";
import { StyledInput, FormElementContainer } from "../../scorecard/shared/modal-elements";
import { toJS } from "mobx";
import ReactQuill from "react-quill";
import { DndItems } from "~/components/shared/dnd-editor";
import { ActivityLogs } from "../shared/activity-logs";
import { sortByDate } from "~/utils/sorting";
import { getWeekOf } from "~/utils/date-time";
import { UpcomingMessage } from "../shared/upcoming-objective-message";

interface ISubInitiativeModalContentProps {
  subInitiativeId: number;
  setSubInitiativeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  annualInitiativeDescription: string;
  setAnnualInitiativeId: React.Dispatch<React.SetStateAction<number>>;
  showCreateMilestones: boolean;
}

export const SubInitiativeModalContent = observer(
  ({
    subInitiativeId,
    setSubInitiativeModalOpen,
    annualInitiativeDescription,
    setAnnualInitiativeId,
    showCreateMilestones,
  }: ISubInitiativeModalContentProps): JSX.Element => {
    const {
      subInitiativeStore,
      sessionStore,
      companyStore,
      descriptionTemplateStore: { descriptionTemplates },
    } = useMst();

    const { currentFiscalYear, currentFiscalQuarter } = companyStore.company;

    const { objectiveLogs } = subInitiativeStore;

    const currentUser = sessionStore.profile;
    const [subInitiative, setSubInitiative] = useState<any>(null);
    const [objectiveMeta, setObjectiveMeta] = useState(null);
    const [showInactiveMilestones, setShowInactiveMilestones] = useState<boolean>(false);
    const [showDropdownOptionsContainer, setShowDropdownOptionsContainer] = useState<boolean>(
      false,
    );
    const [showInitiatives, setShowInitiatives] = useState<boolean>(true);
    const [description, setDescription] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const descriptionTemplatesFormatted = toJS(descriptionTemplates);

    const descriptionTemplateForInitiatives = descriptionTemplatesFormatted.find(
      t => t.templateType == "initiatives",
    )?.body.body;

    useEffect(() => {
      subInitiativeStore.getActivityLogs(1, "SubInitiative", subInitiativeId).then(meta => {
        setObjectiveMeta(meta);
      });
      subInitiativeStore.getSubInitiative(subInitiativeId).then(() => {
        const subInitiative = subInitiativeStore.subInitiative;
        if (subInitiative) {
          setDescription(subInitiative.contextDescription || descriptionTemplateForInitiatives);
          setSubInitiative(subInitiative);
        } else {
          setSubInitiativeModalOpen(false);
        }
      });
    }, []);

    if (subInitiative == null) {
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
      currentUser.id == subInitiative.ownedById ||
      currentUser.role == RoleCEO ||
      currentUser.role == RoleAdministrator;

    const allMilestones = subInitiative.milestones;
    const activeMilestones = subInitiative.activeMilestones;

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
        objecteableId: subInitiative.id,
        objecteableType: "SubInitiative",
        fiscalQuarter: companyStore.company.currentFiscalQuarter,
        fiscalYear: companyStore.company.currentFiscalYear,
        week: companyStore.company.currentFiscalWeek,
      };

      subInitiativeStore.createActivityLog(objectiveLog);
    };

    const getLogs = pageNumber => {
      return subInitiativeStore
        .getActivityLogs(pageNumber, "SubInitiative", subInitiativeId)
        .then(meta => {
          setObjectiveMeta(meta);
        });
    };

    const getCurrentWeekStatus = () => {
      const currentWeekOf = getWeekOf();
      const milestone = subInitiative.milestones.find(
        milestone => milestone.weekOf === currentWeekOf,
      );
      return milestone?.status;
    };

    return (
      <>
        <StatusBlockColorIndicator
          milestones={subInitiative.milestones || []}
          indicatorWidth={"80px"}
          indicatorHeight={4}
          marginBottom={0}
        />
        <Container>
          <SubInitiativeBodyContainer>
            <SectionContainer>
              <InitiativeHeader
                itemType={"subInitiative"}
                item={subInitiative}
                editable={editable}
                setAnnualInitiativeId={setAnnualInitiativeId}
                setModalOpen={setSubInitiativeModalOpen}
                setAnnualInitiativeModalOpen={setSubInitiativeModalOpen}
                annualInitiativeId={subInitiative.annualInitiativeId}
                annualInitiativeDescription={annualInitiativeDescription}
                showDropdownOptionsContainer={showDropdownOptionsContainer}
                setShowDropdownOptionsContainer={setShowDropdownOptionsContainer}
                goalYearString={goalYearString}
                derivedStatus={getCurrentWeekStatus()}
              />
            </SectionContainer>
            {currentFiscalYear <= subInitiative.fiscalYear &&
              currentFiscalQuarter < subInitiative.quarter && (
                <UpcomingMessage goalType="Objective" fiscalTime={`Q${subInitiative.quarter}`} />
              )}
            <SectionContainer>
              <Context
                setShowInitiatives={setShowInitiatives}
                itemType={"subInitiative"}
                item={subInitiative}
              />
            </SectionContainer>
            {showInitiatives ? (
              <SectionContainer>
                <MilestonesHeaderContainer>
                  <ShowMilestonesButton
                    setShowInactiveMilestones={setShowInactiveMilestones}
                    showInactiveMilestones={showInactiveMilestones}
                  />
                </MilestonesHeaderContainer>

                <WeeklyMilestones
                  editable={editable}
                  allMilestones={allMilestones}
                  activeMilestones={activeMilestones}
                  showInactiveMilestones={showInactiveMilestones}
                  itemType={"subInitiative"}
                />
                {showCreateMilestones && editable && allMilestones.length == 0 && (
                  <MilestoneCreateButton itemType={"subInitiative"} item={subInitiative} />
                )}
              </SectionContainer>
            ) : (
              <></>
            )}
          </SubInitiativeBodyContainer>
          <SubHeader>Description</SubHeader>
          <TrixEditorContainer>
            <ReactQuill
              onBlur={() => {
                subInitiativeStore.updateModelField("contextDescription", description);
                subInitiativeStore.update();
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
              store={subInitiativeStore}
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
  padding-left: auto;
  padding-right: auto;
`;

const easeinAnimation = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
`;
const SubInitiativeBodyContainer = styled.div``;

const SectionContainer = styled.div``;

const MilestonesHeaderContainer = styled.div`
  display: flex;
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
  animation: 1s ease-out 0s 1 ${easeinAnimation};
  align-items: center;
`;

const PostButton = styled(Button)`
  margin-top: 10px;
  font-size: 14px;
`;
