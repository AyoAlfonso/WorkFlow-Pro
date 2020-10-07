import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useEffect, useState } from "react";
import { Icon } from "../../shared/icon";
import { color } from "styled-system";
import { observer } from "mobx-react";
import { CreateIssueModal } from "./create-issue-modal";
import { IssueEntry } from "./issue-entry";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Loading } from "../../shared";
import { sortByPosition } from "~/utils/sorting";

interface IIssuesBodyProps {
  showOpenIssues: boolean;
}

export const IssuesBody = observer(
  (props: IIssuesBodyProps): JSX.Element => {
    const { issueStore, sessionStore } = useMst();
    const { showOpenIssues } = props;
    const [createIssueModalOpen, setCreateIssueModalOpen] = useState<boolean>(false);

    const openIssues = issueStore.openIssues;
    const closedIssues = issueStore.closedIssues;

    useEffect(() => {
      issueStore.fetchIssues();
    }, []);

    if (R.isNil(issueStore.issues) || R.isNil(sessionStore.profile)) {
      return <Loading />;
    }

    const renderIssuesList = (): Array<JSX.Element> => {
      const issues = showOpenIssues ? openIssues : closedIssues;
      return sortByPosition(issues.filter(issue => issue.user.id === sessionStore.profile.id)).map(
        (issue, index) => (
          <Draggable draggableId={`issue-${issue.id}`} index={index} key={issue.id} type={"issue"}>
            {provided => (
              <IssueContainer ref={provided.innerRef} {...provided.draggableProps}>
                <IssueEntry
                  issue={issue}
                  dragHandleProps={...provided.dragHandleProps}
                  leftShareContainer={true}
                />
              </IssueContainer>
            )}
          </Draggable>
        ),
      );
    };

    return (
      <Container>
        <CreateIssueModal
          createIssueModalOpen={createIssueModalOpen}
          setCreateIssueModalOpen={setCreateIssueModalOpen}
        />
        <AddNewIssueContainer onClick={() => setCreateIssueModalOpen(true)}>
          <AddNewIssuePlus>
            <Icon icon={"Plus"} size={16} />
          </AddNewIssuePlus>
          <AddNewIssueText> Add a New Issue</AddNewIssueText>
        </AddNewIssueContainer>
        <Droppable droppableId={"issues-container"} type={"issue"}>
          {(provided, snapshot) => (
            <IssuesContainer ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
              {renderIssuesList()}
              {provided.placeholder}
            </IssuesContainer>
          )}
        </Droppable>
      </Container>
    );
  },
);

const Container = styled.div`
  padding: 0px 0px 15px 0px;
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
  margin-right: 8px;
  padding-left: 4px;
  margin-bottom: -5px;
  &:hover ${AddNewIssueText} {
    color: ${props => props.theme.colors.black};
    font-weight: bold;
  }
  &:hover ${AddNewIssuePlus} {
    color: ${props => props.theme.colors.primary100};
  }
`;

type TIssuesContainerType = {
  isDraggingOver?: any;
};

const IssuesContainer = styled.div<TIssuesContainerType>`
  overflow-y: auto;
  height: 260px;
  background-color: ${props =>
    props.isDraggingOver ? props.theme.colors.backgroundBlue : "white"};
`;

const IssueContainer = styled.div``;
