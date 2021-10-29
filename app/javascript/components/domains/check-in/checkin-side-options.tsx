import React, { useState } from "react";
import styled from "styled-components";
import { Text } from "~/components/shared/text";
import { useTranslation } from "react-i18next";
import { TeamIssuesBody } from "../meetings/shared/team-issues-body";
import { TeamKeyActivitiesBody } from "../meetings/shared/team-key-activities-body";
import { KeyActivitiesBody } from "../key-activities/key-activities-body";
import { Notes } from "../meetings/components/notes";
import { MeetingAgenda } from "../meetings/components/meeting-agenda";
import { IssuesBody } from "../issues/issues-body";

interface ICheckInSideOptionsProps {
  checkIn?: any;
}

export const CheckInSideOptions = ({ checkIn }: ICheckInSideOptionsProps): JSX.Element => {
  const { t } = useTranslation();

  const [selectedTab, setSelectedTab] = useState<string>("Agenda");
  const [showOpenIssues, setShowOpenIssues] = useState<boolean>(true);

  const renderOption = (value: string): JSX.Element => {
    return (
      <OptionContainer itemSelected={selectedTab == value} onClick={() => setSelectedTab(value)}>
        <OptionText selected={value === selectedTab}>{value}</OptionText>
      </OptionContainer>
    );
  };

  const renderDisplayContent = (): JSX.Element => {
    switch (selectedTab) {
      case "Issues":
        return (
          <IssuesBody
            showOpenIssues={showOpenIssues}
            setShowOpenIssues={setShowOpenIssues}
            meetingId={checkIn?.id}
          />
        );
      case "Pyns":
        return renderDisplayKeyActivities();
      case "Notes":
        return <Notes meeting={checkIn} height={"550px"} />;
      default:
        return (
          <MeetingAgenda
            steps={checkIn.checkInTemplatesSteps}
            currentStep={checkIn.currentStep}
            meeting={checkIn}
          />
        );
    }
  };

  const renderDisplayKeyActivities = (): JSX.Element => {
    return (
      <KeyActivitiesBody
        showAllKeyActivities={false}
        disableDrag={true}
        borderLeft={"none"}
        fromMeeting={true}
      />
    );
  };

  return (
    <Container>
      <SelectionContainer>
        <SelectionTabsContainer>
          {renderOption("Agenda")}
          {renderOption("Issues")}
          {renderOption("Pyns")}
          {renderOption("Notes")}
        </SelectionTabsContainer>
      </SelectionContainer>
      <DisplayContentContainer>{renderDisplayContent()}</DisplayContentContainer>
    </Container>
  );
};

const Container = styled.div`
  height: inherit;
`;

const SelectionContainer = styled.div`
  margin-bottom: 32px;
`;

const SelectionTabsContainer = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  justify-content: space-between;
  width: 100%;
`;

type OptionContainerType = {
  itemSelected: boolean;
};

const OptionContainer = styled.div<OptionContainerType>`
  margin-left: 8px;
  margin-right: 8px;
  border-bottom: ${props => props.itemSelected && `4px solid ${props.theme.colors.primary100}`};
  border-radius: 1.5px;
  &:hover {
    cursor: pointer;
  }
`;

type OptionTextProps = {
  selected: boolean;
};

const OptionText = styled(Text)<OptionTextProps>`
  font-size: 18px;
  margin-bottom: 4px;
  margin-top: 0;
  padding-left: 4px;
  padding-right: 4px;
  font-weight: bold;
  color: ${props =>
    props.selected ? `${props.theme.colors.black}` : `${props.theme.colors.greyInactive}`};
`;

const DisplayContentContainer = styled.div`
  height: inherit;
`;
