import * as React from "react";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled, { css } from "styled-components";
import { Text } from "../../../shared/text";
import { DummyAnnualInitiativeCardMinimized } from "./dummy-annual-initiative-card-minimized";
import { DummyRecordOptions } from "../shared/dummy-record-options";
import { baseTheme } from "~/themes";
import { DummySubInitiativeCardsExpanded } from "~/components/domains/goals/sub-initiative/dummy-sub-initiative-card-expanded";

interface IAnnualInitiativeCardProps {
}

export const DummyAnnualInitiativeTree = observer(
  ({}: IAnnualInitiativeCardProps): JSX.Element => {
    const { white, grey60 } = baseTheme.colors;
    const marginRight = "8px";
    const marginLeft = "8px";

    return (
      <ColumnContainer onboarding={false} marginRight={marginRight} marginLeft={marginLeft}>
        <Container
          onboarding={false}
        >
          <HeaderContainer>
            <DescriptionContainer onboarding={false}>
              <StyledText
                onboarding={false}
              >
                Annual Initiative Title
              </StyledText>
            </DescriptionContainer>
          </HeaderContainer>
          <DummyAnnualInitiativeCardMinimized/>
        </Container>
        <DummySubInitiativeCardsExpanded/>
      </ColumnContainer>
    );
  },
);

type ContainerProps = {
  onboarding: boolean;
};

const Container = styled(HomeContainerBorders)<ContainerProps>`
  width: 100%;
  min-width: 240px;
  display: flex;
  flex-direction: column;
  height: ${props => (props.onboarding ? "-webkit-fill-available" : "160px")};
  &: hover {
    background: rgba(0, 0, 0, 0.02);
    opacity: 0.85;
  }
`;

type ColumnContainerProps = {
  onboarding: boolean;
  marginRight: string;
  marginLeft: string;
};

const ColumnContainer = styled.div<ColumnContainerProps>`
  ${props => (props.onboarding ? "" : "flex: 0 1 calc(20% - 16px);")}
  width: ${props => (props.onboarding ? "100%" : "calc(20% - 16px)")};
  ${props =>
    props.onboarding
      ? ""
      : `padding-right: 8px;
  padding-left: 8px;`}
  min-width: 240px;
`;

type DescriptionContainerProps = {
  onboarding: boolean;
};

const DescriptionContainer = styled.div<DescriptionContainerProps>`
  width: 100%;
  overflow-wrap: anywhere;
  ${props => (props.onboarding ? "" : "height: 32px;")}
`;

type StyledTextProps = {
  closedInitiative: boolean;
  onboarding: boolean;
};

const StyledText = styled(Text)<StyledTextProps>`
  padding-left: 16px;
  white-space: ${props => (props.onboarding ? "nowrap" : "normal")};
  font-weight: 1000;
  font-size: 16px;
  min-width: 190px;
  width: 95%;
  ${props =>
    !props.onboarding
      ? `
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  `
      : `
  text-overflow: ellipsis;
  `}
  overflow: hidden;
  color: ${props =>
    props.closedInitiative ? props.theme.colors.greyActive : props.theme.colors.black};
  &:hover {
    cursor: pointer;
    color: ${props => props.theme.colors.greyActive};
    font-weight: bold;
    text-decoration: underline;
  }
`;

const IconContainer = styled.div`
  margin-top: 16px;
  margin-left: auto;
  margin-right: 16px;
  display: flex;
  opacity: 1;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-grow: 1;
  ${IconContainer}:hover & {
    fill: rebeccapurple;
  }
`;

type YearContainerProps = {
  color: string;
};

const YearContainer = styled.div<YearContainerProps>`
  background-color: ${props => props.color || props.theme.colors.primary100};
  border-radius: 5px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-left: 8px;
`;

const YearText = styled(Text)`
  color: white;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const YearDisplayContainer = styled.div`
  width: fit-content;
  margin-left: 14px;
  text-align: center;
  margin-bottom: 8px;
`;
