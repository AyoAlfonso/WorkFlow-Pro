import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { Avatar, Loading } from "~/components/shared";
import Pagination from "@material-ui/lab/Pagination";
import { atomOneLight, CopyBlock } from "react-code-blocks";
import { meta, objectiveLogs, user } from "./shared/activity-logs-stories-data";
import moment from "moment";
import {
  completionSymbol,
  determineStatusLabel,
} from "~/components/domains/goals/shared/key-element";
import { sortByDate } from "~/utils/sorting";
import { CodeBlockDiv } from "./shared";

export default { title: "Activity Logs" };

export const ActivityLogs = () => {
  const [page, setPage] = React.useState<number>(meta?.currentPage);

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container>
      <h1>Activity Logs</h1>
      <CodeBlockDiv mb={"20px"}>
        <CopyBlock
          text={`
              import * as React from "react";
              import { ActivityLogs } from "~components/domains/goals/shared/activity-logs";
              
              <ActivityLogs
                keyElements={objectiveLogs}
                store={annualInitiativeStore}
                meta={objectiveMeta}
                getLogs={getLogs}
              />
              )
            `}
          language={"tsx"}
          theme={atomOneLight}
        />
      </CodeBlockDiv>
      <ActivityLogsContainer>
        {!objectiveLogs ? (
          <LoadingContainer>
            <Loading />
          </LoadingContainer>
        ) : (
          objectiveLogs
            ?.slice()
            .sort(sortByDate)
            .map(log => {
              return (
                <ActivityLogContainer>
                  {!log.note ? (
                    <>
                      <Avatar
                        size={32}
                        marginLeft={"0px"}
                        marginTop={"0px"}
                        marginRight={"16px"}
                        firstName={user?.firstName}
                        lastName={user?.lastName}
                        defaultAvatarColor={user?.defaultAvatarColor}
                        avatarUrl={user?.avatarUrl}
                      />
                      <ActivityLogTextContainer>
                        <ActivityLogText fontSize={"14px"} mb={8}>
                          <b>
                            {user?.firstName} {user?.lastName}
                          </b>{" "}
                          updated{" "}
                          <b>
                            <u>{200}</u>
                          </b>{" "}
                          to{" "}
                          <b>
                            <u>{`${log.score}${completionSymbol("percentage")}`}</u>
                          </b>
                          <span>{determineStatusLabel(log.status)}</span>
                        </ActivityLogText>
                        <ActivityLogText>
                          <ActivityLogDate>
                            {moment(log.createdAt).format("MMM D, YYYY")}
                          </ActivityLogDate>
                          <ActivityLogDelete
                            onClick={() => {
                              // store.deleteActivityLog(log.id);
                            }}
                          >
                            {" "}
                            Delete
                          </ActivityLogDelete>
                        </ActivityLogText>
                      </ActivityLogTextContainer>
                    </>
                  ) : (
                    <>
                      <Avatar
                        size={32}
                        marginLeft={"0px"}
                        marginTop={"0px"}
                        marginRight={"16px"}
                        firstName={user.firstName}
                        lastName={user.lastName}
                        defaultAvatarColor={user.defaultAvatarColor}
                        avatarUrl={user.avatarUrl}
                      />
                      <ActivityLogTextContainer>
                        <ActivityLogText fontSize={"14px"} mb={8}>
                          <b>
                            {user.firstName} {user.lastName}
                          </b>{" "}
                          posted a comment{" "}
                        </ActivityLogText>
                        <ActivityLogText mb={4}>
                          <i>{log.note}</i>
                        </ActivityLogText>
                        <ActivityLogText>
                          <ActivityLogDate>
                            {moment(log.createdAt).format("MMM D, YYYY")}
                          </ActivityLogDate>
                          <ActivityLogDelete
                            onClick={() => {
                              // store.deleteActivityLog(log.id);
                            }}
                          >
                            {" "}
                            Delete
                          </ActivityLogDelete>
                        </ActivityLogText>
                      </ActivityLogTextContainer>
                    </>
                  )}
                </ActivityLogContainer>
              );
            })
        )}
      </ActivityLogsContainer>
      {!R.isEmpty(objectiveLogs) ? (
        <PaginationContainer>
          <Pagination count={meta?.totalPages} page={page} size="small" onChange={handleChange} />
        </PaginationContainer>
      ) : (
        <></>
      )}
    </Container>
  );
};

const ActivityLogsContainer = styled.div`
  width: 100%;
  max-height: 500px;
  margin-top: 24px;
  overflow: auto;
`;

const Container = styled.div`
  padding: 0 10px;
`;

const ActivityLogContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const ActivityLogTextContainer = styled.div``;

const ActivityLogDate = styled.span`
  font-size: 9px;
  color: ${props => props.theme.colors.grey100};
`;

const ActivityLogDelete = styled.span`
  font-size: 9px;
  color: ${props => props.theme.colors.grey100};
  margin-left: 8px;
  &:hover {
    color: ${props => props.theme.colors.warningRed};
    cursor: pointer;
  }
`;

type ActivityLogTextProps = {
  mb?: number;
  fontSize?: string;
};

const ActivityLogText = styled.p<ActivityLogTextProps>`
  font-size: ${props => props.fontSize || "12px"};
  margin-top: 0px;
  margin-bottom: ${props => props.mb || 0}px;
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PaginationContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
