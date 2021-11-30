import * as React from "react";
import styled from "styled-components";
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
import { TrixEditor } from "react-trix";
import { ActivityLogs } from "../shared/activity-logs";

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
      descriptionTemplateStore: { descriptionTemplates },
    } = useMst();
    const currentUser = sessionStore.profile;
    const [subInitiative, setSubInitiative] = useState<any>(null);
    const [showInactiveMilestones, setShowInactiveMilestones] = useState<boolean>(false);
    const [showDropdownOptionsContainer, setShowDropdownOptionsContainer] = useState<boolean>(
      false,
    );
    const [showInitiatives, setShowInitiatives] = useState<boolean>(true);
    const [description, setDescription] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const descriptionTemplatesFormatted = toJS(descriptionTemplates);
    const [keyLogs, setKeyLogs] = useState([]);

    const descriptionTemplateForInitiatives = descriptionTemplatesFormatted.find(
      t => t.templateType == "initiatives",
    )?.body.body;

    useEffect(() => {
      subInitiativeStore.getSubInitiative(subInitiativeId).then(() => {
        const subInitiative = subInitiativeStore.subInitiative;
        if (subInitiative) {
          subInitiative.keyElements.forEach(keyelement => {
            setKeyLogs(prev => [...prev, ...keyelement.objectiveLogs]);
          });
          setDescription(subInitiative.contextDescription || descriptionTemplateForInitiatives);
          setSubInitiative(subInitiative);
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

    const handleChange = (html, text) => {
      setDescription(text);
    };

    const editable =
      currentUser.id == subInitiative.ownedById ||
      currentUser.role == RoleCEO ||
      currentUser.role == RoleAdministrator;

    const allMilestones = subInitiative.milestones;
    const activeMilestones = subInitiative.activeMilestones;

    const goalYearString = `FY${subInitiative.fiscalYear.toString().slice(-2)}/${(
      subInitiative.fiscalYear + 1
    )
      .toString()
      .slice(-2)}`;

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
              />
            </SectionContainer>
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
          <TrixEditorContainer
            onBlur={() => {
              subInitiativeStore.updateModelField("contextDescription", description);
              subInitiativeStore.update();
            }}
          >
            <TrixEditor
              className={"trix-initiative-modal"}
              autoFocus={true}
              placeholder={"Add a description..."}
              onChange={handleChange}
              value={description}
              mergeTags={[]}
              onEditorReady={editor => {
                editor.element.addEventListener("trix-file-accept", event => {
                  event.preventDefault();
                });
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
                // onBlur={() => {
                //   if (!value) {
                //     valueForComment = kpi.scorecardLogs[kpi.scorecardLogs?.length - 1]?.score;
                //   }
                //   handleBlur(kpi.id);
                // }}
              />
            </FormElementContainer>
            <ActivityLogs keyElements={keyLogs} store={subInitiativeStore} />
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
  align-items: center;
`;