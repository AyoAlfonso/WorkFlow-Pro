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

interface ICommentLogsProps {
  comments: any;
  meta?: any;
  getLogs?: any;
  store?: any;
}

export const CommentLogs = observer(
  ({ comments, meta, getLogs, store }: ICommentLogsProps): JSX.Element => {
    const { userStore, sessionStore } = useMst();
    const [page, setPage] = useState<number>(meta?.currentPage);

    const handleChange = (event, value) => {
      setPage(value);
      getLogs(value);
    };

    return (
      <>
        <CommentLogsContainer>
          {!comments ? (
            <LoadingContainer>
              <Loading />
            </LoadingContainer>
          ) : (
            comments
              ?.slice()
              .sort(sortByDate)
              .map(log => {
                const user = userStore.users.find(user => user.id === log.ownedById);
                return (
                  <CommentLogContainer>
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
                    <CommentLogTextContainer>
                      <CommentLogText fontSize={"14px"} mb={8}>
                        <b>
                          {user.firstName} {user.lastName}
                        </b>{" "}
                        posted a comment{" "}
                      </CommentLogText>
                      <CommentLogText mb={4}>
                        <i>{log.note}</i>
                      </CommentLogText>
                      <CommentLogText>
                        <CommentLogDate>
                          {moment(log.createdAt).format("MMM D, YYYY")}
                        </CommentLogDate>
                        <CommentLogDelete
                          onClick={() => {
                            store.deleteCommentLog(log.id);
                          }}
                          disabled={sessionStore.profile.id !== log.ownedById}
                        >
                          {" "}
                          Delete
                        </CommentLogDelete>
                      </CommentLogText>
                    </CommentLogTextContainer>
                  </CommentLogContainer>
                );
              })
          )}
        </CommentLogsContainer>
        {!R.isEmpty(toJS(comments)) ? (
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

const CommentLogsContainer = styled.div`
  width: 100%;
  max-height: 560px;
  margin-top: 24px;
  overflow: auto;
`;

const CommentLogContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const CommentLogTextContainer = styled.div``;

const CommentLogDate = styled.span`
  font-size: 9px;
  color: ${props => props.theme.colors.grey100};
`;

type CommentLogDeleteProps = {
  disabled: boolean;
};

const CommentLogDelete = styled.span<CommentLogDeleteProps>`
  font-size: 9px;
  color: ${props => props.theme.colors.grey100};
  margin-left: 8px;
  pointer-events: ${props => (props.disabled ? "none" : "auto")};
  &:hover {
    color: ${props => (props.disabled ? props.theme.colors.grey100 : props.theme.colors.warningRed)};
    cursor: pointer;
  }
`;

type CommentLogTextProps = {
  mb?: number;
  fontSize?: string;
};

const CommentLogText = styled.p<CommentLogTextProps>`
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
