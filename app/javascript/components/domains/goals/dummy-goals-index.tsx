import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { DummyAnnualInitiativeCard } from "./annual-initiative/dummy-annual-initiative-card";
import { DummyAnnualInitiativeTree } from "./annual-initiative/dummy-annual-initiative-tree";
import Modal from "styled-react-modal";
import { observer } from "mobx-react";
import { DummyTitleContainer } from "./shared/dummy-title-container";
import { DummyUserTitleContainer } from "./shared/dummy-title-container";
import { RallyingCry } from "./shared/rallying-cry";
import { PersonalVision } from "./shared/personal-vision";
import { DummyGoalsCoreFour } from "./dummy-goals-core-four";
import { Icon } from "~/components/shared/icon";

export const DummyGoalsIndex = observer(
  (): JSX.Element => {

  return (
    <Overlay>
      <Wrapper>
        <Upgradetextcontainer>
          <IconWrapper>
            <Icon icon={"New-Goals"} size={160} iconColor={"#005FFE"} />
          </IconWrapper>
          <Boldtext>
            Get the information you need to drive success in your business
          </Boldtext>
          <Subtext>
            Upgrade to a higher tier to get access to Objectives
          </Subtext>
          <Talktous
            onClick={(e) => {
              e.preventDefault();
              window.location.href='http://go.lynchpyn.com/upgrade';
            }}>
            Talk to us
          </Talktous>
        </Upgradetextcontainer>
      </Wrapper>
      <Container>
        <DummyGoalsCoreFour/>
        <CompanyInitiativesContainer>
          <DummyTitleContainer/>
            <>
              <RallyingCry rallyingCry="To Accumulate $32M In Construction Project In The Pipeline" />
              <InitiativesContainer>
                <DummyAnnualInitiativeCard/>
                <DummyAnnualInitiativeTree/>
                <DummyAnnualInitiativeTree/>
                <DummyAnnualInitiativeCard/>
              </InitiativesContainer>
            </>
        </CompanyInitiativesContainer>
        <PersonalInitiativesContainer>
          <DummyUserTitleContainer/>
            <>
              <PersonalVision personalVision="To Accumulate $32M In Construction Project In The Pipeline" />
              <InitiativesContainer>
                <DummyAnnualInitiativeCard/>
                <DummyAnnualInitiativeCard/>
                <DummyAnnualInitiativeCard/>
                <DummyAnnualInitiativeCard/>
              </InitiativesContainer>
            </>
        </PersonalInitiativesContainer>
      </Container>
    </Overlay>
    );
  },
);

const Overlay = styled.div`
  position: relative;

`;

const Wrapper = styled.div`
  height: 0;
  width: 100%;
  postion: absolute;
  z-index:1000;
`;

const Upgradetextcontainer = styled.div`
  width:100%;
  text-align: center;
  border-top: 1px solid white;
`;

const IconWrapper = styled.div`
  margin-top: 120px;
`;

const Boldtext = styled.div`
  font-family: exo;
  font-weight: bold;
  font-size: 36px;
  line-spacing: 48;
  text-align: center;
  margin-top: 48px;
  margin-bottom: 32px;
  max-width: 720px;
  display: inline-block;
`;

const Subtext = styled.div`
  font-family: exo;
  font-weight: regular;
  font-size: 20px;
  line-spacing: 27;
  margin-bottom: 24px;
`;

const Talktous = styled.div`
  width: 120px;
  height: 28px;
  background: #005FFE 0% 0% no-repeat padding-box;
  border: 1px solid #005FFE;
  border-radius: 4px;
  opacity: 1;
  font-family: lato;
  font-weight: bold;
  font-size: 12px;
  color: #FFFFFF;
  display: inline-block;
  padding-top: 11px;
  line-spacing: 24;
 `;

const Container = styled.div`
  filter: blur(10px);
  position: absolute;
  opacity: 0.5;
`;

const InitiativesContainer = styled.div`
  display: -webkit-box;
  margin-top: 0px;
  padding-bottom: 0px;
  overflow-x: auto;
`;

const PersonalInitiativesContainer = styled.div`
  margin-top: 0px;
  padding-top: 0px;
`;

const StyledModal = Modal.styled`
  width: 30rem;
  min-height: 100px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.white};
`;

const CreateAnnualInitiativeContainer = styled.div`
  width: calc(20% - 16px);
  min-width: 240px;
  padding-left: 8px;
  padding-right: 8px;
`;

const CompanyInitiativesContainer = styled.div`
`;
