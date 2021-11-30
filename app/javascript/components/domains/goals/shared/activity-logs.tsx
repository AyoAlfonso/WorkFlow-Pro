import React from "react";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { useEffect, useState, useRef } from "react";
import { sortByDate } from "~/utils/sorting";
import moment from "moment";
import { observer } from "mobx-react";
import { Avatar, } from "~/components/shared";
import { completionSymbol, determineStatusLabel } from "./key-element";

interface IActivityLogsProps {
  keyElements: any;
  store: any;
}

export const ActivityLogs = observer(
  ({ keyElements, store }: IActivityLogsProps): JSX.Element => {
    return (
      <ActivityLogsContainer>
        {keyElements.sort(sortByDate).map(log => {
          return (
            <ActivityLogContainer key={log.id}>
              <Avatar
                size={32}
                marginLeft={"0px"}
                marginTop={"0px"}
                marginRight={"16px"}
                firstName={log.ownedBy.firstName}
                lastName={log.ownedBy.lastName}
                defaultAvatarColor={log.ownedBy.defaultAvatarColor}
                avatarUrl={log.ownedBy.avatarUrl}
              />
              <ActivityLogTextContainer>
                <ActivityLogText fontSize={"14px"} mb={8}>
                  <b>
                    {log.ownedBy.firstName} {log.ownedBy.lastName}
                  </b>{" "}
                  updated{" "}
                  <b>
                    <u>{store?.keyElementTitle(log.objecteableId)}</u>
                  </b>{" "}
                  to{" "}
                  <b>
                    <u>{`${log.score}${completionSymbol(
                      store?.keyElementCompletionType(log.objecteableId),
                    )}`}</u>
                  </b>
                  <span>{determineStatusLabel(store?.keyElementStatus(log.objecteableId))}</span>
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