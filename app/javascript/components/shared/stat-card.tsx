import * as React from "react";
import styled from "styled-components";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";
import { Text } from "~/components/shared/text";
import { PercentChange } from "./percent-change";
import { HeaderText, HeaderContainerNoBorder } from "~/components/shared/styles/container-header";

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
      <HeaderContainerNoBorder>
        <HeaderText>{statisticName}</HeaderText>
      </HeaderContainerNoBorder>

      <RatingText fontSize={3}>{statisticNumber}</RatingText>
      <PercentChange percentChange={statisticChange} />
    </Container>
  );
};

const Container = styled(HomeContainerBorders)`
  padding: 5px;
  min-width: 315px;
  width: 33.33%;
`;

const RatingText = styled.div`
  font-size: 40px;
  padding-left: 10px;
  padding-right: 10px;
  font-weight: bold;
`;
