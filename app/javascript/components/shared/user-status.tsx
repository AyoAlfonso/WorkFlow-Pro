import * as React from "react";
import styled from "styled-components";
import { baseTheme } from "~/themes";
import { Text } from "~/components/shared";

interface IUserStatusProps {
  selectedUserStatus: string;
  onStatusUpdate?: any;
}

export const UserStatus = ({
  selectedUserStatus,
  onStatusUpdate,
}: IUserStatusProps): JSX.Element => {
  const updateStatus = status => {
    if (onStatusUpdate) {
      onStatusUpdate(status);
    }
  };

  const renderUserStatus = (): JSX.Element => {
    switch (selectedUserStatus) {
      case "in_office":
        return (
          <StatusContainer onClick={() => updateStatus("work_from_home")}>
            <StatusColorBlock color={baseTheme.colors.finePine} />
            <StatusText type={"small"}> Active </StatusText>
          </StatusContainer>
        );
      case "work_from_home":
        return (
          <StatusContainer onClick={() => updateStatus("half_day")}>
            <StatusColorBlock color={baseTheme.colors.fadedPurple} />
            <StatusText type={"small"}> WFH </StatusText>
          </StatusContainer>
        );
      case "half_day":
        return (
          <StatusContainer onClick={() => updateStatus("day_off")}>
            <StatusColorBlock color={baseTheme.colors.cautionYellow} />
            <StatusText type={"small"}> Half Day </StatusText>
          </StatusContainer>
        );
      case "day_off":
        return (
          <StatusContainer onClick={() => updateStatus("status_not_set")}>
            <StatusColorBlock color={baseTheme.colors.warningRed} />
            <StatusText type={"small"}> Day off </StatusText>
          </StatusContainer>
        );
      default:
        return (
          <StatusContainer onClick={() => updateStatus("in_office")}>
            <StatusColorBlock color={baseTheme.colors.greyInactive} />
            <StatusText type={"small"}> Inactive </StatusText>
          </StatusContainer>
        );
    }
  };

  return renderUserStatus();
};

const StatusContainer = styled.div`
  display: flex;
  &: hover {
    cursor: pointer;
  }
`;

type StatusColorBlockProps = {
  color: string;
};

const StatusColorBlock = styled.div<StatusColorBlockProps>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const StatusText = styled(Text)`
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.greyActive};
  margin-left: 8px;
`;
