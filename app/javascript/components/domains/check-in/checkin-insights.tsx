import React, { useState } from "react";
import styled from "styled-components";
import { Icon, Text } from "~/components/shared";
import DateSelector from "./components/date-selector";
import InitiativeInsights from "./components/initiatives-insights";
import JournalInsights from "./components/journal-insights";
import { KpiInsights } from "./components/kpi-insights";
import { NumericalStepInsights } from "./components/numerical-step-insights";
import { OpenEndedInsights } from "./components/open-ended-insights";
import ParticipationInsights from "./components/participation-insights";
import { SelectionScaleInsights } from "./components/selection-scale-insights";
import { YesNoInsights } from "./components/yes-no-insights";

export const CheckinInsights = (): JSX.Element => {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <Container>
      <SideBar>
        <SectionContainer>
          <SideBarHeader>participants</SideBarHeader>
          <AvatarContainer>
            <Avatar>
              <AvatarImage src="https://via.placeholder.com/150" />
            </Avatar>
            <Avatar>
              <AvatarImage src="https://via.placeholder.com/150" />
            </Avatar>
            <Avatar>
              <AvatarImage src="https://via.placeholder.com/150" />
            </Avatar>
            <Avatar>
              <AvatarImage src="https://via.placeholder.com/150" />
            </Avatar>
            <Avatar>
              <AvatarImage src="https://via.placeholder.com/150" />
            </Avatar>
          </AvatarContainer>
        </SectionContainer>
        <SectionContainer>
          <SideBarHeader>delivery</SideBarHeader>
          <InfoText>Every weekday at 10:00am in the account time zone</InfoText>
        </SectionContainer>
        <SectionContainer>
          <SideBarHeader>response</SideBarHeader>
          <InfoText>Manager</InfoText>
        </SectionContainer>
        <SectionContainer>
          <SideBarHeader>steps</SideBarHeader>
          <StepContainer>
            <StepIconContainer>
              <ChevronRightIcon icon="Chevron-Left" iconColor="white" size="16px" />
            </StepIconContainer>
            <StepText>What are you working on today?</StepText>
          </StepContainer>
        </SectionContainer>
      </SideBar>
      <InsightsContainer>
        <CheckinName>Weekly Check-in</CheckinName>
        <DateSelector date={date} setDate={setDate} />
        <ContentContainer>
          <LeftContainer>
            <OpenEndedInsights /> <br />
            <NumericalStepInsights /> <br />
            <SelectionScaleInsights /> <br />
            <SelectionScaleInsights type="sentiment" /> <br />
            <YesNoInsights /> <br />
            <KpiInsights /> <br />
            <InitiativeInsights /> <br />
            <JournalInsights />
          </LeftContainer>
          <ParticipationInsights />
        </ContentContainer>
      </InsightsContainer>
    </Container>
  );
};

const LeftContainer = styled.div``;

const Container = styled.div`
  height: 100%;
  margin-left: -40px;
  margin-top: -31px;
  margin-right: -40px;
  height: calc(100vh - 130px);
  display: flex;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;
const SideBar = styled.div`
  width: 18%;
  max-width: 240px;
  background: ${props => props.theme.colors.backgroundGrey};
  height: 100%;
  padding: 32px;

  @media only screen and (min-width: 1600px) {
    position: fixed;
    left: 96px;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 0 2em;
`;

const InsightsContainer = styled.div`
  padding: 32px;
  width: 82%;
  max-width: 1280px;
  // overflow-y: auto;
  height: 100%;
  overscroll-behavior: contain;
  @media only screen and (min-width: 1600px) {
    margin: 0 auto;
    padding-left: 200px;
  }
  @media only screen and (min-width: 1800px) {
    padding-left: 32px;
  }
`;

const CheckinName = styled(Text)`
  color: ${props => props.theme.colors.black};
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  margin-bottom: 1em;
`;

export const SideBarHeader = styled(Text)`
  font-size: 16px;
  color: ${props => props.theme.colors.grey100};
  text-align: left-align;
  font-weight: bold;
  margin: 0;
  margin-bottom: 16px;
  text-transform: uppercase;
`;

export const SectionContainer = styled.div`
  margin-bottom: 1em;
`;

export const InfoText = styled(Text)`
  font-size: 15px;
  color: ${props => props.theme.colors.black};
  margin: 0;
  padding-left: 1em;
`;

export const StepIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary100};
  margin-right: 0.5em;
`;

export const ChevronRightIcon = styled(Icon)`
  transform: rotate(180deg);
`;

export const StepText = styled.div`
  color: ${props => props.theme.colors.black};
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 1;
`;

export const StepContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1em;
`;

export const AvatarContainer = styled.div`
  display: inline-flex;
  padding-left: 1em;
`;

export const Avatar = styled.span`
  position: relative;
  border: 2px solid #fff;
  border-radius: 50%;
  overflow: hidden;
  width: 32px;

  &:not(:first-child) {
    margin-left: -16px;
  }
`;

export const AvatarImage = styled.img`
  width: 100%;
  display: block;
`;
