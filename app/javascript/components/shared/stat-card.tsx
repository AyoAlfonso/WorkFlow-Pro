import * as React from "react";
import styled from "styled-components";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";
import { Text } from "~/components/shared/text";
import { PercentChange } from "./percent-change";

export interface IPercentChangeProps {
  statisticName: string;
  statisticNumber: number;
  statisticChange: number;
}

export const StatCard = ({
  statisticName,
  statisticNumber,
  statisticChange,
}: IPercentChangeProps): JSX.Element => {
  return (
    <Container>
      <Text>{statisticName}</Text>
      <Text fontSize={3}>{statisticNumber}</Text>
      <PercentChange percentChange={statisticChange} />
    </Container>
  );
};

const Container = styled(HomeContainerBorders)`
  padding: 5px;
`;
