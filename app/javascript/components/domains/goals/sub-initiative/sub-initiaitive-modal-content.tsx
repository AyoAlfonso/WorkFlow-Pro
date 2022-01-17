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
import { toJS } from "mobx";
import ReactQuill from "react-quill";

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
    const currentUser = sessionStore.profile;
    const [subInitiative, setSubInitiative] = useState<any>(null);
    const [showInactiveMilestones, setShowInactiveMilestones] = useState<boolean>(false);
    const [showDropdownOptionsContainer, setShowDropdownOptionsContainer] = useState<boolean>(
      false,
    );
    const [showInitiatives, setShowInitiatives] = useState<boolean>(true);
    const [description, setDescription] = useState<string>("");
    const descriptionTemplatesFormatted = toJS(descriptionTemplates);

    const descriptionTemplateForInitiatives = descriptionTemplatesFormatted.find(
      t => t.templateType == "initiatives",
    )?.body.body;

    useEffect(() => {
      subInitiativeStore.getSubInitiative(subInitiativeId).then(() => {
        const subInitiative = subInitiativeStore.subInitiative;
        if (subInitiative) {
          setDescription(subInitiative.contextDescription || descriptionTemplateForInitiatives);
          setSubInitiative(subInitiative);
        }
      });
    }, []);

    if (subInitiative == null) {
      return <Loading />;
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
          <TrixEditorContainer>
            <ReactQuill
              onBlur={() => {
                subInitiativeStore.updateModelField("contextDescription", description);
                subInitiativeStore.update();
              }}
              className="trix-initiative-modal"
              theme="snow"
              placeholder={"Add a description..."}
              value={description}
              onChange={(content, delta, source, editor) => {
                handleChange(editor.getHTML());
              }}
            />
          </TrixEditorContainer>
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
