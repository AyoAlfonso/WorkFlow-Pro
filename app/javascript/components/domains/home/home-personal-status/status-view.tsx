import * as React from "react";
import styled from "styled-components";
import { Text } from "~/components/shared";

interface IStatusViewProps {
  status: string;
}

export const StatusView = ({ status }: IStatusViewProps): JSX.Element => {
  return (
    <StatusContainer>
      <StatusColorBlock />
      <StatusText type={"small"}> {status || "Active"} </StatusText>
    </StatusContainer>
  );
};

const StatusContainer = styled.div`
  display: flex;
`;

export const StatusText = styled(Text)`
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.greyActive};
  margin-left: 8px;
`;

export const StatusColorBlock = styled.div`
  width: 16px;
  height: 16px;
  margin-top: auto;
  margin-bottom: auto;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.finePine};
`;
