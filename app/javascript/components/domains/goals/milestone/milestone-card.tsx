import React, { useState, useEffect } from "react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { useRef } from "react";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { IndividualVerticalStatusBlockColorIndicator } from "../shared/individual-vertical-status-block-color-indicator";
import moment from "moment";
import ContentEditable from "react-contenteditable";
import { MilestoneType } from "~/types/milestone";
import { MilestoneDropdown } from "./milestone-status-dropdown";
// import { MultiSelect } from "../../../shared/multi-select";

interface IMilestoneCardProps {
  milestone: MilestoneType;
  editable: boolean;
  fromMeeting?: boolean;
  itemType: string;
  fromWeeklyCheckIn?: boolean;
}

export const MilestoneCard = observer(
  ({
    milestone,
    editable,
    fromMeeting,
    fromWeeklyCheckIn,
    itemType,
  }: IMilestoneCardProps): JSX.Element => {
    const { quarterlyGoalStore, subInitiativeStore, milestoneStore } = useMst();

    const mobxStore = itemType == "quarterlyGoal" ? quarterlyGoalStore : subInitiativeStore;

    const descriptionRef = useRef(null);

    const unstarted = milestone.status == "unstarted";
    const currentWeek = moment(milestone.weekOf).isSame(moment(), "week");
    const [descriptionText, setDescriptionText] = useState(milestone.description || "");

    useEffect(() => {
      setDescriptionText(milestone.description);
    }, [milestone]);

    const handleChange = e => {
      if (!e.target.value.includes("<div>")) {
        setDescriptionText(e.target.value);
      }
    };

    const handleBlur = () => {
      if (fromWeeklyCheckIn) {
        milestoneStore.updateDescriptionFromWeeklyCheckIn(
          milestone.id,
          descriptionRef.current.innerHTML,
        );
      }

      if (fromMeeting) {
        milestoneStore.updateDescriptionFromPersonalMeeting(
          milestone.id,
          descriptionRef.current.innerHTML,
        );
      } else {
        mobxStore.updateMilestoneDescription(milestone.id, descriptionRef.current.innerHTML);
      }
    };

    return (
      <MilestoneContainer>
        <MilestoneDetails unstarted={unstarted} currentWeek={currentWeek}>
          <Container right={false} center={false}>
            <WeekOfText unstarted={unstarted}>
              Week {milestone.week}: Week of{" "}
              <WeekOfTextValue>{moment(milestone.weekOf).format("MMMM D")}</WeekOfTextValue>
            </WeekOfText>
            <MilestoneContentEditable
              innerRef={descriptionRef}
              html={descriptionText}
              disabled={!editable}
              placeholder={"Enter Description"}
              onChange={handleChange}
              onKeyDown={key => {
                if (key.keyCode == 13) {
                  descriptionRef.current.blur();
                }
              }}
              onBlur={handleBlur}
            />
          </Container>
          <Container right={true} center={true}>
            <MilestoneDropdown
              milestone={milestone}
              milestoneStatus={milestone.status}
              editable={editable}
              fromMeeting={fromMeeting}
              fromWeeklyCheckIn={fromWeeklyCheckIn}
              itemType={itemType}
            />
          </Container>
        </MilestoneDetails>
      </MilestoneContainer>
    );
  },
);

const MilestoneContainer = styled.div`
  display: flex;
  flex-direction: row;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

type MilestoneDetailsType = {
  unstarted: boolean;
  currentWeek: boolean;
};

type IContainerProps = {
  right: boolean;
  center: boolean;
};

const Container = styled.div<IContainerProps>`
  margin-left: ${props => (props.right ? "auto" : "")};
  align-self: ${props => (props.center ? "center" : "")};
  @media only screen and (max-width: 768px) {
    justify-self: ${props => (props.center ? "center" : "")};
    margin-left: 0;
  }
`;

const MilestoneDetails = styled(HomeContainerBorders)<MilestoneDetailsType>`
  display: flex;
  padding: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
  width: 100%;
  border: ${props =>
    (!props.unstarted || props.currentWeek) && `1px solid ${props.theme.colors.primary100}`};
  color: ${props => props.unstarted && props.theme.colors.grey60};
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    width: auto;
  }
`;

type WeekOfTextType = {
  unstarted: boolean;
};

const WeekOfText = styled(Text)<WeekOfTextType>`
  color: ${props => (props.unstarted ? props.theme.colors.grey60 : props.theme.colors.primary100)};
  margin-top: 8px;
  margin-bottom: 8px;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const WeekOfTextValue = styled.span`
  text-decoration: underline;
  font-weight: bold;
`;

const MilestoneContentEditable = styled(ContentEditable)`
  margin-top: 8px;
  margin-bottom: 8px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 16px;
  padding-right: 16px;
  color: ${props => props.theme.colors.black};
  @media only screen and (max-width: 768px) {
    margin-bottom: 20px;
    font-size: 14px;
  }
`;
