import * as React from "react";
import styled from "styled-components";
import { Text } from "~/components/shared/text";
import { PercentChange } from "./percent-change";
import { HeaderText, HeaderContainerNoBorder } from "~/components/shared/styles/container-header";

export interface IPercentChangeProps {
  statisticName: string;
  statisticNumber: number;
  statisticChange: number;
  periodDesc?: string;
}

export const StatCard = ({
  statisticName,
  statisticNumber,
  statisticChange,
  periodDesc,
}: IPercentChangeProps): JSX.Element => {
  return (
    <Container>
      <HeaderContainerNoBorder>
        <HeaderText>{statisticName}</HeaderText>
      </HeaderContainerNoBorder>

      <RatingText fontSize={3}>{statisticNumber}</RatingText>
      <PercentChange
        percentChange={statisticChange}
        showLineIfZeroOrLess={statisticNumber == 0}
        periodDesc={periodDesc || ""}
      />
    </Container>
  );
};

const Container = styled.div`
  padding: 5px;
  min-width: 60px;
  width: 33.33%;
`;

type RatingTextType = {
  fontSize?: number;
};

const RatingText = styled.div<RatingTextType>`
  font-size: 40px;
  padding-left: 10px;
  padding-right: 10px;
  font-weight: bold;
`;
