import * as React from "react";
import styled from "styled-components";
import { Icon } from "../../../shared/icon";
import { AnnualInitiativeType } from "~/types/annual-initiative";
// import { CreateGoalSection } from "../shared/create-goal-section";
import { HomeContainerBorders } from "../../home/shared-components";
import { useState } from "react";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import { DummySubInitiativeGoalCard } from "./dummy-sub-intiative-goal-card";
import { observer } from "mobx-react";
import { ISubInitiativeCardExpandedProps } from "~/types/sub-initiative-cards";

export const DummySubInitiativeCardsExpanded = observer(
  (props: ISubInitiativeCardExpandedProps): JSX.Element => {
    const {
      annualInitiative,
      setSubInitiativeId,
      selectedSubInitiativeCards,
      setSubInitiativeModalOpen,
      setSelectedAnnualInitiativeDescription,
    } = props;

    const { sessionStore } = useMst();

    const renderSubInitiativeQuarterlyGoals = () => {
      return annualInitiative.quarterlyGoals[selectedSubInitiativeCards].subInitiatives.map(
        (subInitiative, index) => {
          return (
            <>
              <LineContainer>
                <svg height="16" width="2">
                  <line x1="1" y1="4" x2="1" y2="16" />
                </svg>
              </LineContainer>
              <InitiativesContainer>
                <DummySubInitiativeGoalCard
                  key={index}
                  subInitiative={subInitiative}
                  setSubInitiativeModalOpen={setSubInitiativeModalOpen}
                  setSelectedAnnualInitiativeDescription={setSelectedAnnualInitiativeDescription}
                  setSubInitiativeId={setSubInitiativeId}
                />
              </InitiativesContainer>
            </>
          );
        },
      );
    };

    return (
      <Container
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {renderSubInitiativeQuarterlyGoals()}
      </Container>
    );
  },
);

const LineContainer = styled.div`
  z-index: -1;
  display: flex;
  justify-content: center;
  line {
    stroke: ${props => props.theme.colors.grey20};
    stroke-width: 2;
  }
  margin: 0 0 0 0;
`;

const Container = styled.div`
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

const QuarterlyGoalsText = styled.p`
  font-size: 15px;
  color: ${props => props.theme.colors.greyActive};
  padding-bottom: 8px;
  margin-left: 5px;
`;

const MinimizeIconContainer = styled.div`
  border-radius: 50px;
  width: 100%;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 10px auto;
  &: hover {
    cursor: pointer;
  }
`;

const InitiativesContainer = styled(HomeContainerBorders)`
  background-color: ${props => props.theme.colors.backgroundGrey};
  display: flex;
  border-radius: 8px;
  flex-direction: column;
  min-height: 88px;
  transition: 0.3s ease-out;
  &:hover {
    transform: scale(1.05);
  }
`;

const ShowInitiativeBar = styled.div`
  margin: 15%;
  color: ${props => props.theme.colors.primary100};
  font-size: 12px;
  font-weight: bold;
`;
