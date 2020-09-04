import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { Text, TextNoMargin } from "~/components/shared/text";
import * as humps from "humps";

export interface ISummaryDisplayProps {
  summaryData: any;
  variant: string;
  title: string;
}

export const SummaryDisplay = ({
  summaryData,
  title,
  variant,
}: ISummaryDisplayProps): JSX.Element => {
  const rowTextProps = {
    fontSize: "12px",
    color: "text",
  };
  return (
    <Container>
      <Text fontSize={"16px"} fontWeight={600}>
        {title}
      </Text>
      <DataContainer>
        {summaryData[humps.camelize(variant)].map((summaryDataEl, index) => (
          <DataRowContainer key={index}>
            <Bullet />
            <TextNoMargin mr={"10px"} {...rowTextProps}>{`[${summaryDataEl.day}]:`}</TextNoMargin>
            <TextNoMargin {...rowTextProps}>{summaryDataEl.value}</TextNoMargin>
          </DataRowContainer>
        ))}
      </DataContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Bullet = styled.div`
  height: 8px;
  width: 8px;
  margin-right: 8px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary100};
`;

const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const DataRowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 5px;
`;
