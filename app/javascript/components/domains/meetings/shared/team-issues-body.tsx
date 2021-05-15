import * as React from "react";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { color } from "styled-system";
import { observer } from "mobx-react";
import { CreateIssueModal } from "../../issues/create-issue-modal";
import { WidgetHeaderSortButtonMenu } from "~/components/shared/widget-header-sort-button-menu";
import { Icon, Loading } from "~/components/shared";
import { IssueEntry } from "../../issues/issue-entry";
import {
  FilterContainer,
  FilterOptions,
  IssuesBodyContainer,
} from "~/components/domains/issues/issues-body";
import { useMst } from "~/setup/root";
import * as R from "ramda";
import { List } from "@material-ui/core";

interface ITeamIssuesBodyProps {
  showOpenIssues: boolean;
  setShowOpenIssues?: React.Dispatch<React.SetStateAction<boolean>>;
  teamId: number | string;
  meetingId?: number | string;
  showFilters: boolean;
}

export const TeamIssuesBody = observer(
  (props: ITeamIssuesBodyProps): JSX.Element => {
    const {
      issueStore,
      companyStore: { company },
    } = useMst();
    const { showOpenIssues, setShowOpenIssues, teamId, meetingId, showFilters } = props;
    const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);
    const [sortOptionsOpen, setSortOptionsOpen] = useState<boolean>(false);

    const openIssues = issueStore.openIssues;
    const closedIssues = issueStore.closedIssues;

    if (R.isNil(company)) {
      return <Loading />;
    }

    useEffect(() => {
      if (teamId) {
        issueStore.fetchIssuesForTeam(teamId);
      } else {
        issueStore.fetchIssues();
      }
    }, []);

    const sortMenuOptions = [
      {
        label: "Sort by Priority",
        value: "by_priority",
      },
    ];

    if (issueStore.loading) {
      return <Loading />;
    }

    const handleSortMenuItemClick = value => {
      setSortOptionsOpen(false);
      issueStore.sortIssuesByPriority({ sort: value, teamId: teamId, meetingId: meetingId });
    };

    const renderIssuesList = (): Array<JSX.Element> => {
      const issues = showOpenIssues ? openIssues : closedIssues;
      return issues.map((issue, index) => (
        <IssueContainer key={issue["id"]}>
          <IssueEntry issue={issue} pageEnd={true} meetingId={meetingId} teamId={teamId} />
        </IssueContainer>
      ));
    };

    return (
      <Container meeting={meetingId ? true : false}>
        <CreateIssueModal
          createIssueModalOpen={createIssueModalOpen}
          setCreateIssueModalOpen={setCreateIssueModalOpen}
          teamId={teamId}
        />
        {showFilters && (
          <FilterContainer>
            <FilterOptions
              onClick={() => setShowOpenIssues(true)}
              mr={"15px"}
              color={showOpenIssues ? "primary100" : "grey40"}
            >
              Open
            </FilterOptions>
            <FilterOptions
              onClick={() => setShowOpenIssues(false)}
              color={!showOpenIssues ? "primary100" : "grey40"}
            >
              Closed
            </FilterOptions>
            <WidgetHeaderSortButtonMenu
              onButtonClick={setSortOptionsOpen}
              onMenuItemClick={handleSortMenuItemClick}
              menuOpen={sortOptionsOpen}
              menuOptions={sortMenuOptions}
              ml={"15px"}
            />
          </FilterContainer>
        )}
        <IssuesBodyContainer meeting={meetingId}>
          <AddNewIssueContainer onClick={() => setCreateIssueModalOpen(true)}>
            <AddNewIssuePlus>
              <Icon icon={"Plus"} size={16} />
            </AddNewIssuePlus>
            <AddNewIssueText>
              {`Add a ${company.displayFormat == "Forum" ? "Topic" : "Issue"}`}
            </AddNewIssueText>
          </AddNewIssueContainer>
          <IssuesContainer meeting={meetingId ? true : false}>
            <List>{renderIssuesList()}</List>
          </IssuesContainer>
        </IssuesBodyContainer>
      </Container>
    );
  },
);

type ContainerProps = {
  meeting: boolean;
};

const Container = styled.div<ContainerProps>`
  padding: 0px 0px 15px 0px;
  height: ${props => props.meeting && "inherit"};
`;

const AddNewIssuePlus = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.grey80};
`;

const AddNewIssueText = styled.p`
  ${color}
  font-size: 16px;
  margin-left: 21px;
  color: ${props => props.theme.colors.grey80};
  line-height: 20pt;
`;

const AddNewIssueContainer = styled.div`
  display: flex;
  cursor: pointer;
  margin-left: 8px;
  margin-bottom: -5px;
  padding-left: 4px;
  &:hover ${AddNewIssueText} {
    color: ${props => props.theme.colors.black};
    font-weight: bold;
  }
  &:hover ${AddNewIssuePlus} {
    color: ${props => props.theme.colors.primary100};
  }
`;

type IssuesContainerProps = {
  meeting: boolean;
};

const IssuesContainer = styled.div<IssuesContainerProps>`
  overflow-y: auto;
  height: ${props => (props.meeting ? "inherit" : "260px")};
  overflow-x: hidden;
  padding-right: 8px;
`;

const IssueContainer = styled.div``;
