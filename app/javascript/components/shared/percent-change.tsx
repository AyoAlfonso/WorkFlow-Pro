import * as React from "react";
import { baseTheme } from "~/themes";
import styled from "styled-components";
import { Text } from "~/components/shared/text";

export interface IPercentChangeProps {
  percentChange: number;
  showLineIfZeroOrLess?: boolean;
}

export const PercentChange = ({
  percentChange,
  showLineIfZeroOrLess,
}: IPercentChangeProps): JSX.Element => {
  const selectColor = percentChange => {
    if (percentChange >= 0) {
      return baseTheme.colors.successGreen;
    } else if (percentChange < -20) {
      return baseTheme.colors.warningRed;
    } else {
      return baseTheme.colors.cautionYellow;
    }
  };
  return (
    <PercentageChangeContainer>
      {showLineIfZeroOrLess ? (
        <DisabledLine>--</DisabledLine>
      ) : (
        <PercentageChangeText color={selectColor(percentChange)}>
          {percentChange >= 0 ? "+" : ""}
          {Math.round(percentChange)}%
        </PercentageChangeText>
      )}
      <ComparedToLastWeekText>Compared to last week</ComparedToLastWeekText>
    </PercentageChangeContainer>
  );
};

const PercentageChangeContainer = styled.div`
  display: flex;
  margin-bottom: 5px;
  margin-left: 5px;
`;

type PercentageChangeTextProps = {
  color: string;
};

const PercentageChangeText = styled(Text)<PercentageChangeTextProps>`
  color: ${props => props.color};
  font-weight: bold;
  margin-left: 5px;
`;

const ComparedToLastWeekText = styled(Text)`
  font-size: 14px;
  color: ${props => props.theme.colors.grey60};
  margin-left: 10px;
  margin-top: auto;
  margin-bottom: auto;
`;

const DisabledLine = styled(Text)`
  color: ${props => props.theme.colors.grey60};
  font-weight: bold;
  margin-left: 5px;
  margin-top: 14px;
`;
