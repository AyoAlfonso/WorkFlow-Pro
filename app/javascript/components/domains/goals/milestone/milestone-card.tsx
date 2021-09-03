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

interface IMilestoneCardProps {
  milestone: MilestoneType;
  editable: boolean;
  fromMeeting?: boolean;
  itemType: string;
}

export const MilestoneCard = observer(
  ({ milestone, editable, fromMeeting, itemType }: IMilestoneCardProps): JSX.Element => {
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
      if (fromMeeting) {
        milestoneStore.updateDescriptionFromPersonalMeeting(milestone.id, descriptionText);
      } else {
        mobxStore.updateMilestoneDescription(milestone.id, descriptionText);
      }
    };

    return (
      <MilestoneContainer>
        <MilestoneDetails unstarted={unstarted} currentWeek={currentWeek}>
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
        </MilestoneDetails>
        <IndividualVerticalStatusBlockColorIndicator
          milestone={milestone}
          milestoneStatus={milestone.status}
          editable={editable}
          fromMeeting={fromMeeting}
          itemType={itemType}
        />
      </MilestoneContainer>
    );
  },
);

const MilestoneContainer = styled.div`
  display: flex;
`;

type MilestoneDetailsType = {
  unstarted: boolean;
  currentWeek: boolean;
};

const MilestoneDetails = styled(HomeContainerBorders)<MilestoneDetailsType>`
  padding: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
  width: 90%;
  border: ${props =>
    (!props.unstarted || props.currentWeek) && `1px solid ${props.theme.colors.primary100}`};
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

const MilestoneContentEditable = styled(ContentEditable)`
  margin-top: 8px;
  margin-bottom: 8px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 16px;
  padding-right: 16px;
  color: ${props => props.theme.colors.black};
`;
