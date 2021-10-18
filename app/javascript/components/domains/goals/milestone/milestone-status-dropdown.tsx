import React, { useState } from "react";
import { MilestoneType } from "~/types/milestone";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import * as moment from "moment";
import { observer } from "mobx-react";
import { ChevronDownIcon } from "../../../shared/input";
import { baseTheme } from "../../../../themes";

interface MilestoneDropdownProps {
  milestone: MilestoneType;
  milestoneStatus: string;
  editable: boolean;
  fromMeeting?: boolean;
  itemType: string;
}

export const MilestoneDropdown = observer(
  (props: MilestoneDropdownProps): JSX.Element => {
    const { milestone, milestoneStatus, editable, fromMeeting, itemType } = props;
    const { quarterlyGoalStore, subInitiativeStore, milestoneStore } = useMst();

    const [showList, setShowList] = useState<boolean>(false);

    const statusChangable = moment(milestone.weekOf).isSameOrBefore(moment(), "week");
    const {
      warningRed,
      cautionYellow,
      finePine,
      grey30,
      grey10,
      almostPink,
      lightYellow,
      lightFinePine,
    } = baseTheme.colors;

    const determineStatusLabel = status => {
      switch (status) {
        case "incomplete":
          return (
            <ListSpan color={warningRed} backgroundColor={almostPink}>
              Behind
            </ListSpan>
          );
        case "in_progress":
          return (
            <ListSpan color={cautionYellow} backgroundColor={lightYellow}>
              Needs Attention
            </ListSpan>
          );
        case "completed":
          return (
            <ListSpan color={finePine} backgroundColor={lightFinePine}>
              On Track
            </ListSpan>
          );
        default:
          return (
            <ListSpan color={grey30} backgroundColor={grey10}>
              No Status
            </ListSpan>
          );
      }
    };

    const updateStatus = status => {
      if (fromMeeting) {
        milestoneStore.updateStatusFromPersonalMeeting(milestone.id, status);
      }
      if (!fromMeeting) {
        switch (itemType) {
          case "quarterlyGoal":
            quarterlyGoalStore.updateMilestoneStatus(milestone.id, status);
            break;
          case "subInitiative":
            subInitiativeStore.updateMilestoneStatus(milestone.id, status);
            break;
          default:
            break;
        }
      }
    };

    const statusArray = ["unstarted", "incomplete", "in_progress", "completed"];

    return (
      <Container>
        <DropdownHeader
          disabled={!statusChangable && !editable}
          onClick={() => {
            setShowList(!showList);
          }}
        >
          {determineStatusLabel(milestoneStatus)}
          <ChevronDownIcon />
        </DropdownHeader>
        {showList && (
          <DropdownListContainer>
            <DropdownList>
              {statusArray.map((status, index) => (
                <ListItem
                  onClick={() => {
                    updateStatus(status);
                    setShowList(!showList);
                  }}
                  key={index}
                  value={status}
                >
                  {determineStatusLabel(status)}
                </ListItem>
              ))}
            </DropdownList>
          </DropdownListContainer>
        )}
      </Container>
    );
  },
);

const Container = styled.div`
  position: relative;
`;

type DropdownHeaderProps = {
  disabled: boolean;
  onClick: () => void;
};

const DropdownHeader = styled("div")<DropdownHeaderProps>`
  margin-bottom: 3px;
  border: 2px solid #ededf2;
  width: 145px;
  padding: 3px 0px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  pointer-events: ${props => props.disabled && `none`};
`;

const DropdownListContainer = styled("div")``;

const DropdownList = styled("ul")`
  background-color: ${props => props.theme.colors.white};
  border-radius: 10px;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  z-index: 2;
  padding: 8px 0px;
  position: absolute;
  margin-top: 3px;
  width: 145px;
`;

type ListItemProps = {
  key: number;
  value: string;
  onClick: () => void;
};

const ListItem = styled("li")<ListItemProps>`
  list-style: none;
  padding: 5px 0px;
  cursor: pointer;
  &:hover {
    background-color: #f6f6f6;
  }
`;

type ListSpanProps = {
  backgroundColor: string;
  color: string;
};

const ListSpan = styled("span")<ListSpanProps>`
  display: inline-block;
  font-size: 12px;
  border-radius: 3px;
  padding: 2px;
  margin: 0 16px;
  font-weight: bold;
  background-color: ${props => props.backgroundColor};
  color: ${props => props.color};
`;
