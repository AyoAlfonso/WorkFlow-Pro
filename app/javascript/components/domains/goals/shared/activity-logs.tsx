import React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { useEffect, useState, useRef } from "react";
import { sortByDate } from "~/utils/sorting";
import moment from "moment";
import { observer } from "mobx-react";
import { Avatar, Loading } from "~/components/shared";
import Pagination from "@material-ui/lab/Pagination";
import { toJS } from "mobx";
import { completionSymbol, determineStatusLabel } from "./key-element";

interface IActivityLogsProps {
  keyElements: any;
  store?: any;
  meta?: any;
  getLogs?: any;
}

export const ActivityLogs = observer(
  ({ keyElements, store, meta, getLogs }: IActivityLogsProps): JSX.Element => {
    const { userStore } = useMst();
    const [page, setPage] = useState<number>(meta?.currentPage)

    const handleChange = (event, value) => {
      setPage(value)
      getLogs(value);
    };

    return (
      <>
        <ActivityLogsContainer>
          {!keyElements ? (
            <LoadingContainer>
              <Loading />
            </LoadingContainer>
          ) : (
            keyElements
              ?.slice()
              .sort(sortByDate)
              .map(log => {
                const user = userStore.users.find(user => user.id === log.ownedById);
                const keyElement = store?.findKeyElement(log.childId);
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
                              <u>{keyElement?.value}</u>
                            </b>{" "}
                            to{" "}
                            <b>
                              <u>{`${log.score}${completionSymbol(keyElement?.completionType)}`}</u>
                            </b>
                            <span>{determineStatusLabel(log.status || keyElement?.status)}</span>
                          </ActivityLogText>
                          <ActivityLogText>
                            <ActivityLogDate>
                              {moment(log.adjustedDate || log.createdAt).format("MMM D, YYYY")}
                            </ActivityLogDate>
                            <ActivityLogDelete
                              onClick={() => {
                                store.deleteActivityLog(log.id);
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
                                store.deleteActivityLog(log.id);
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
        {!R.isEmpty(toJS(keyElements))? (
          <PaginationContainer>
            <Pagination count={meta?.totalPages} page={page} size="small" onChange={handleChange} />
          </PaginationContainer>
        ) : (
          <></>
        )}
      </>
    );
  },
);

const ActivityLogsContainer = styled.div`
  width: 100%;
  max-height: 500px;
  margin-top: 24px;
  overflow: auto;
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
