import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import Select from "../../shared/select";
import { CheckInCard } from "./components/checkin-card";
import { StepOptionsModal } from "./components/step-options-modal";
import { OpenEndedPreview } from "./components/open-ended-preview";
import { StepPreviewCard } from "./components/step-preview-card";
import { YesNoPreview } from "./components/yes-no-preview";
import { SelectionScale } from "./components/selection-scale";
import { NumericalStep } from "./components/numerical-step";
import { TodoComponentSelectorModal } from "./components/todo-component-selector-modal";

export const CheckIn = observer(
  (): JSX.Element => {
    const [activeTab, setActiveTab] = useState("active");
    const [selection, setSelection] = useState("");
    const [open, setOpen] = useState(true)

    const {checkInTemplateStore, sessionStore} = useMst();

    const userId = sessionStore.profile?.id

    useEffect(() => {
      checkInTemplateStore.getCheckIns(userId);
    }, [userId])
console.log(checkInTemplateStore.checkIns)
    return (
      <Container>
        <TopContainer>
          <OverviewTabsContainer>
            <OverviewTab active={activeTab === "active"} onClick={() => setActiveTab("active")}>
              Active
            </OverviewTab>
            <OverviewTab active={activeTab === "archived"} onClick={() => setActiveTab("archived")}>
              Archived
            </OverviewTab>
          </OverviewTabsContainer>
          <SelectContainer>
            <Select selection={selection} setSelection={e => setSelection(e)}>
              <option value="dueDate">Sort by due date</option>
              <option value="name">Sort by name</option>
              <option value="type">Sort by type</option>
            </Select>
          </SelectContainer>
        </TopContainer>
        <CheckinsContainer>
          <CheckInCard />
        </CheckinsContainer>
        {/* <StepOptionsModal modalOpen={open} setModalOpen={setOpen} />
        <OpenEndedPreview question="What are you working on?" />
        <StepPreviewCard stepType="Open-ended" iconName="Open-Ended" />
        <YesNoPreview question="Are you working on a project?" />
        <SelectionScale type="sentiment" question="How was your day?" />
        <NumericalStep question="How productive were you today?" /> */}
        {/* <TodoComponentSelectorModal modalOpen={open} setModalOpen={setOpen} /> */}
      </Container>
    );
  },
);

const Container = styled.div`
  @media only screen and (max-width: 768px) {
    padding: 1em;
    flex-direction: column;
  }
`;

const SelectContainer = styled.div`
  @media only screen and (max-width: 768px) {
    align-self: flex-end;
  }
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  @media only screen and (max-width: 768px) {
    margin-top: 2em;
  }
`;

const OverviewTabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  // border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
  margin-bottom: 24px;
`;

type IOverviewTab = {
  active: boolean;
};

const OverviewTab = styled("span")<IOverviewTab>`
  margin-bottom: 0;
  padding: 0 15px;
  padding-bottom: 5px;
  color: ${props => (props.active ? props.theme.colors.black : props.theme.colors.greyInactive)};
  font-size: 20px;
  font-weight: bold;
  line-height: 28px;
  text-decoration: none;
  border-bottom-width: ${props => (props.active ? `2px` : `0px`)};
  border-bottom-color: ${props => props.theme.colors.primary100};
  border-bottom-style: solid;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    margin-bottom: 1em;
  }
`;

const CheckinsContainer = styled.div`
  @media only screen and (max-width: 768px) {
    margin-top: 1em;
  }
`;
