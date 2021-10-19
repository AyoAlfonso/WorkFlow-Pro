import React, { useState } from "react";
import { useEffect } from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { StatusBlockColorIndicator } from "../shared/status-block-color-indicator";
import { UserIconBorder } from "../shared/user-icon-border";
import { Avatar } from "~/components/shared/avatar";
import * as R from "ramda";
import { baseTheme } from "../../../../themes";
import { SubInitiativesType } from "~/types/sub-initiatives";
import { RecordOptions } from "../shared/record-options";
import { OwnedBySection } from "../shared/owned-by-section";
import { useMst } from "~/setup/root";
import { Icon } from "~/components/shared/icon";
import * as moment from "moment";

interface ISubInitiativeCardProps {
  subInitiative: SubInitiativesType;
  setSubInitiativeModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAnnualInitiativeDescription?: React.Dispatch<React.SetStateAction<string>>;
  annualInitiativeYear: number;
  setSubInitiativeId: React.Dispatch<React.SetStateAction<number>>;
}

export const SubInitiativeGoalCard = observer(
  (props: ISubInitiativeCardProps): JSX.Element => {
    const {
      subInitiative,
      setSubInitiativeModalOpen,
      setSubInitiativeId,
      setSelectedAnnualInitiativeDescription,
      annualInitiativeYear,
    } = props;

    const { companyStore } = useMst();
    const { currentFiscalYear, currentFiscalQuarter } = companyStore.company;
    const {
      warningRed,
      fadedRed,
      tango,
      fadedYellow,
      finePine,
      fadedGreen,
      grey40,
      grey20,
      grey80,
      grey100,
      white,
      primary100,
      backgroundGrey,
    } = baseTheme.colors;
    const defaultOptionsColor = backgroundGrey;
    const [showOptions, setShowOptions] = useState<string>(defaultOptionsColor);

    let currentMilestone;
    const statusBadge = {
      description: "",
      colors: {
        backgroundColor: "",
        color: "",
      },
    };

    currentMilestone = subInitiative.milestones.find(milestone =>
      moment(milestone.weekOf).isSame(moment(), "week"),
    );

    if (subInitiative.closedAt != null) {
      statusBadge.description = `Closed - Q${subInitiative.quarter}`;
      statusBadge.colors = { color: white, backgroundColor: grey100 };
    } else if (currentFiscalYear < subInitiative.fiscalYear) {
      statusBadge.description = `Upcoming - Q${subInitiative.quarter}`;
      statusBadge.colors = { color: white, backgroundColor: primary100 };
    } else {
      if (!currentMilestone) {
        currentMilestone = subInitiative.milestones[subInitiative.milestones.length - 1];
      }

      if (currentMilestone && currentMilestone.status) {
        switch (currentMilestone.status) {
          case "completed":
            statusBadge.description = "On Track";
            statusBadge.colors = { color: finePine, backgroundColor: fadedGreen };
            break;
          case "in_progress":
            statusBadge.description = "Needs Attention";
            statusBadge.colors = { color: tango, backgroundColor: fadedYellow };
            break;
          case "incomplete":
            statusBadge.description = "Behind";
            statusBadge.colors = { color: warningRed, backgroundColor: fadedRed };
            break;
          case "unstarted":
            statusBadge.description = "No update";
            statusBadge.colors = { color: grey40, backgroundColor: grey20 };
            break;
        }
      }
    }

    const startedMilestones = subInitiative.milestones
      ? subInitiative.milestones.filter(milestone => milestone.status != "unstarted")
      : [];

    let userIconBorder = "";

    const openSubInitiativeGoalModal = () => {
      setSubInitiativeModalOpen(true);
      setSubInitiativeId(subInitiative.id);
      setSelectedAnnualInitiativeDescription(subInitiative.description);
    };

    return (
      <>
        <Container
          onClick={e => {
            e.stopPropagation();
            openSubInitiativeGoalModal();
          }}
          onMouseEnter={e => {
            setShowOptions(grey80);
          }}
          onMouseLeave={e => {
            setShowOptions(defaultOptionsColor);
          }}
        >
          <StatusBlockColorIndicator
            milestones={subInitiative.milestones || []}
            indicatorWidth={"100%"}
            indicatorHeight={2}
            marginTop={4}
          />

          <RowContainer mt={0} mb={0}>
            <DescriptionContainer>
              <StyledSubInitiativeIcon
                icon={"Sub_initiative"}
                size={"16px"}
                iconColor={"#868DAA"}
              />
              <StyledText>{subInitiative.description}</StyledText>
            </DescriptionContainer>

            <IconContainer>
              <RecordOptions type={"subInitiative"} id={subInitiative.id} iconColor={showOptions} />
            </IconContainer>
          </RowContainer>
          <RowContainer mt={0} mb={0}>
            {/* // TODOIST: refactor the values of this component to get only */}
            {subInitiative.ownedBy && (
              <OwnedBySection
                ownedBy={subInitiative.ownedBy}
                type={"subInitiative"}
                disabled={true}
                size={16}
                nameWidth={"76px"}
                marginLeft={"16px"}
                marginRight={"0px"}
                marginTop={"auto"}
                fontSize={"12px"}
                marginBottom={"auto"}
              />
            )}
            <BadgeContainer>
              <StatusBadge
                color={statusBadge.colors.color}
                backgroundColor={statusBadge.colors.backgroundColor}
              >
                {" "}
                {statusBadge.description}{" "}
              </StatusBadge>
            </BadgeContainer>
          </RowContainer>
        </Container>
      </>
    );
  },
);

type RowContainerProps = {
  mb?: number;
  mt?: number;
};

const RowContainer = styled.div<RowContainerProps>`
  display: flex;
  margin-top: ${props => `${props.mt}%` || "auto"};
  margin-bottom: ${props => `${props.mb}%` || "auto"};
`;

const StyledText = styled(Text)`
  padding-left: 4px;
  padding-right: 4px;
  white-space: normal;
  font-size: 14px;
  width: 95%;
  min-width: 160px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Container = styled.div`
  background-color: ${props => props.theme.colors.backgroundGrey};
  &:hover {
    cursor: pointer;
  }
`;

const IconContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: 16px;
  display: flex;
`;

const QuarterContainer = styled.div`
  background-color: ${props => props.theme.colors.primary100};
  border-radius: 5px;
  padding-left: 8px;
  padding-right: 8px;
  margin-left: 8px;
`;

const QuarterText = styled(Text)`
  font-weight: 700;
`;

const DescriptionContainer = styled.div`
  overflow-wrap: anywhere;
  display: flex;
  font-size: 12px;
  padding-left: 16px;
`;

const StyledSubInitiativeIcon = styled(Icon)`
  margin-right: 5px;
  font-size: 12px;
`;

type StatusBadgeType = {
  color: string;
  backgroundColor: string;
};

// TODOIST: Update the color constant
const StatusBadge = styled.div<StatusBadgeType>`
  font-size: 12px;
  font-weight: 900;
  background-color: ${props => props.backgroundColor};
  color: ${props => props.color};
  padding: 2px;
  text-align: center;
  border-radius: 2px;
  white-space: nowrap;
`;

const BadgeContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 16px;
  align-items: center;
`;
