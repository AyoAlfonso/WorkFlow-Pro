import React from "react";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { useEffect, useState, useRef } from "react";
import { sortByDate } from "~/utils/sorting";
import moment from "moment";
import { observer } from "mobx-react";
import { Avatar } from "~/components/shared";
import { completionSymbol, determineStatusLabel } from "./key-element";

interface IActivityLogsProps {
  keyElements: any;
  store: any;
}

export const ActivityLogs = observer(
  ({ keyElements, store }: IActivityLogsProps): JSX.Element => {
    const { userStore } = useMst()
    return (
      <ActivityLogsContainer>
        {keyElements.sort(sortByDate).map(log => {
          const user = userStore.users.find(user => user.id === log.ownedById)
          return (
            <ActivityLogContainer key={log.id}>
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
                  updated{" "}
                  <b>
                    <u>{log.childType === "keyElement" && store?.keyElementTitle(log.childId)}</u>
                  </b>{" "}
                  to{" "}
                  <b>
                    <u>{`${log.score}${log.childType === "keyElement" &&
                      completionSymbol(store?.keyElementCompletionType(log.childId))}`}</u>
                  </b>
                  <span>
                    {log.childType === "keyElement" &&
                      determineStatusLabel(store?.keyElementStatus(log.childId))}
                  </span>
                </ActivityLogText>
                {/* <ActivityLogText mb={4}>
                        <i>{log.note}</i>
                      </ActivityLogText> */}
                <ActivityLogText>
                  <ActivityLogDate>{moment(log.createdAt).format("MMM D, YYYY")}</ActivityLogDate>
                  <ActivityLogDelete
                  // onClick={() => {
                  //   keyPerformanceIndicatorStore.deleteScorecardLog(log.id).then(() => {
                  //     setCurrentLog();
                  //     setCurrentLog();
                  //   });
                  // }}
                  >
                    {" "}
                    Delete
                  </ActivityLogDelete>
                </ActivityLogText>
              </ActivityLogTextContainer>
            </ActivityLogContainer>
          );
        })}
      </ActivityLogsContainer>
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
