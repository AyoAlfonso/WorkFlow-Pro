import React, { useState } from "react";
import styled from "styled-components";
import { Icon, Text } from "~/components/shared";
import {
  Avatar,
  AvatarContainer,
  AvatarImage,
  ChevronRightIcon,
  InfoText,
  SectionContainer,
  SideBarHeader,
  StepContainer,
  StepIconContainer,
  StepText,
} from "./checkin-insights";
import InitiativeInsights from "./components/initiatives-insights";
import JournalInsights from "./components/journal-insights";
import { KpiInsights } from "./components/kpi-insights";
import { NumericalStepInsights } from "./components/numerical-step-insights";
import { OpenEndedInsights } from "./components/open-ended-insights";
import ParticipationInsights from "./components/participation-insights";
import { SelectionScaleInsights } from "./components/selection-scale-insights";
import { YesNoInsights } from "./components/yes-no-insights";

const MobileCheckinInsights = (): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Container>
      <HeaderContainer>
        <CheckinName>Weekly Checkin</CheckinName>
        <IconContainer onClick={() => setOpen(true)}>
          <Icon icon="Info-PO" size={"24px"} iconColor="grey100" />
        </IconContainer>
        {open && (
          <SideBar showSideBar={open}>
            <IconContainer onClick={() => setOpen(false)}>
              <Icon ml={"auto"} icon="Close" size={"16px"} iconColor="grey100" />
            </IconContainer>
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
        )}
      </HeaderContainer>
      <ParticipationInsights /> <br />
      <OpenEndedInsights /> <br />
      <NumericalStepInsights /> <br />
      <SelectionScaleInsights type="sentiment" /> <br />
      <SelectionScaleInsights /> <br />
      <YesNoInsights /> <br />
      <InitiativeInsights /> <br />
      <KpiInsights /> <br />
      <JournalInsights />
    </Container>
  );
};

export default MobileCheckinInsights;

const Container = styled.div`
  padding: 1em;
  display: none;
  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
  position: relative;
`;

type SideBarProps = {
  showSideBar: boolean;
};

const SideBar = styled.div<SideBarProps>`
  position: absolute;
  display: none;
  right: 0;
  top: 0;
  width: ${props => (props.showSideBar ? "60vw" : "0px")};
  transition: 0.2s;
  background: ${props => props.theme.colors.backgroundGrey};
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 60px);
  padding: 1em;
  z-index: 1;
  box-sizing: border-box;

  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

const CheckinName = styled(Text)`
  color: ${props => props.theme.colors.black};
  font-size: 20px;
  font-weight: bold;
  margin: 0;
`;

const IconContainer = styled.div`
  display: flex;
`;
