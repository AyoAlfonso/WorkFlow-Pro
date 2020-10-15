import * as React from "react";
import styled from "styled-components";
import { Text } from "~/components/shared/text";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TeamIssuesBody } from "./shared/team-issues-body";
import { TeamKeyActivitiesBody } from "./shared/team-key-activities-body";
import { KeyActivitiesBody } from "../key-activities/key-activities-body";
import { Notes } from "./components/notes";
import { MeetingAgenda } from "./components/meeting-agenda";

interface IMeetingSideOptionsProps {
  teamId: string | number;
  meeting: any;
}

export const MeetingSideOptions = ({ teamId, meeting }: IMeetingSideOptionsProps): JSX.Element => {
  const { t } = useTranslation();

  const [selectedTab, setSelectedTab] = useState<string>("agenda");

  const renderOption = (value: string): JSX.Element => {
    return (
      <OptionContainer itemSelected={selectedTab == value} onClick={() => setSelectedTab(value)}>
        <OptionText>{t(`meeting.sideOptions.${value}`)}</OptionText>
      </OptionContainer>
    );
  };

  const renderDisplayContent = (): JSX.Element => {
    switch (selectedTab) {
      case "issues":
        return <TeamIssuesBody showOpenIssues={true} teamId={teamId} meetingId={meeting.id} />;
      case "pyns":
        return renderDisplayIssues();
      case "notes":
        return <Notes meeting={meeting} />;
      default:
        return <MeetingAgenda steps={meeting.steps} currentStep={meeting.currentStep} />;
    }
  };

  const renderDisplayIssues = (): JSX.Element => {
    return teamId ? (
      <TeamKeyActivitiesBody />
    ) : (
      <KeyActivitiesBody showAllKeyActivities={false} disableDrag={true} borderLeft={"none"} />
    );
  };

  return (
    <Container>
      <SelectionContainer>
        <SelectionTabsContainer>
          {renderOption("agenda")}
          {renderOption("issues")}
          {renderOption("pyns")}
          {renderOption("notes")}
        </SelectionTabsContainer>
      </SelectionContainer>
      <DisplayContentContainer>{renderDisplayContent()}</DisplayContentContainer>
    </Container>
  );
};

const Container = styled.div``;

const SelectionContainer = styled.div`
  display: flex;
  padding-bottom: 10px;
  border-bottom: ${props => `1px solid ${props.theme.colors.borderGrey}`};
`;

const SelectionTabsContainer = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: auto;
`;

type OptionContainerType = {
  itemSelected: boolean;
};

const OptionContainer = styled.div<OptionContainerType>`
  margin-left: 8px;
  margin-right: 8px;
  border-bottom: ${props => props.itemSelected && `3px solid ${props.theme.colors.primary100}`};
  &:hover {
    cursor: pointer;
  }
`;

const OptionText = styled(Text)`
  font-size: 18px;
  margin-bottom: 5px;
  padding-left: 4px;
  padding-right: 4px;
`;

const DisplayContentContainer = styled.div``;
