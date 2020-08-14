import * as React from "react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { useRef } from "react";
import { useMst } from "~/setup/root";
import { Button } from "~/components/shared/button";
import { IndividualVerticalStatusBlockColorIndicator } from "../shared/individual-vertical-status-block-color-indicator";
import * as moment from "moment";
import ContentEditable from "react-contenteditable";
import { MilestoneType } from "~/types/milestone";

interface IMilestoneCardProps {
  milestone: MilestoneType;
  unstarted: boolean;
  editable: boolean;
}

export const MilestoneCard = ({
  milestone,
  unstarted,
  editable,
}: IMilestoneCardProps): JSX.Element => {
  const { quarterlyGoalStore } = useMst();

  const descriptionRef = useRef(null);

  return (
    <MilestoneContainer>
      <MilestoneDetails unstarted={unstarted}>
        <WeekOfText unstarted={unstarted}>
          Week of <WeekOfTextValue>{moment(milestone.weekOf).format("MMMM D")}</WeekOfTextValue>
        </WeekOfText>
        <MilestoneContentEditable
          innerRef={descriptionRef}
          html={milestone.description}
          disabled={!editable}
          onChange={e => {
            if (!e.target.value.includes("<div>")) {
              quarterlyGoalStore.updateMilestoneDescription(milestone.id, e.target.value);
            }
          }}
          onKeyDown={key => {
            if (key.keyCode == 13) {
              descriptionRef.current.blur();
            }
          }}
          onBlur={() => quarterlyGoalStore.update()}
        />
      </MilestoneDetails>
      <IndividualVerticalStatusBlockColorIndicator
        milestone={milestone}
        milestoneStatus={milestone.status}
        editable={editable}
      />
    </MilestoneContainer>
  );
};

const MilestoneContainer = styled.div`
  display: flex;
`;

type MilestoneDetailsType = {
  unstarted: boolean;
};

const MilestoneDetails = styled(HomeContainerBorders)<MilestoneDetailsType>`
  padding: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
  width: 90%;
  border: ${props => !props.unstarted && `1px solid ${props.theme.colors.primary100}`};
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
`;
