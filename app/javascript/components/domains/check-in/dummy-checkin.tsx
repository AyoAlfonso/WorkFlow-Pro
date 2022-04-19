import * as React from "react";
import * as R from "ramda";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { toJS } from "mobx";
import { CheckInWizardLayout } from "./checkin-wizard-layout";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useParams, useHistory } from "react-router-dom";
import { Loading } from "~/components/shared/loading";
import { Button } from "~/components/shared/button";
import moment from "moment";
import { HeaderBar } from "../nav";
import { validateWeekOf } from "~/utils/date-time";
import { Heading } from "../../shared";
import { Text } from "~/components/shared/text";
import { SignUpWizardProgressBar } from "../../shared/sign-up-wizard/sign-up-wizard-progress-bar";
import { Icon } from "~/components/shared/icon";
import { Onboarding } from "../onboarding";
import { Avatar } from "~/components/shared";
import {
  StyledInput,
  InputHeaderWithComment,
  FormElementContainer,
  InputFromUnitType,
} from "../scorecard/shared/modal-elements";

interface CheckInProps {}

export const DummyCheckin = observer(
  (props: CheckInProps): JSX.Element => {
    const { checkInTemplateStore, sessionStore, companyStore } = useMst();
    const StopMeetingButton = () => {
      return (
        <StopButton
          variant={"primary"}
          onClick={() => {}}
          small
          disabled={false}
        >
          Publish Check-in
        </StopButton>
      );
    };

    return (
      <>
          <Overlay>
       <Wrapper>
      <Upgradetextcontainer>
        <IconWrapper>
        <Icon icon={"Check-in-page"} size={160} iconColor={"#005FFE"} />
        </IconWrapper>
        <Boldtext>
          Get the information you need to drive success in your business
        </Boldtext>
        <Subtext>
          Upgrade to a higher tier to get access to Scorecard
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
      <BigContainer>
    <Container>
      <DescriptionContainer>
        <DescriptionBody>
          <DescriptionTitleContainer>
            <Heading type={"h2"} mb={0}>
              title
            </Heading>
          </DescriptionTitleContainer>
          <DescriptionText>description</DescriptionText>
          <ButtonsContainer>{StopMeetingButton()}</ButtonsContainer>
          <ChildrenContainer>
            <StepText type={"small"}>
              <Icon icon={"Visibility"} size={"15px"} iconColor={"grey80"} />
              {"Everyone in your company will see your response"}
            </StepText>
            <SideopContainer>
              <SelectionContainer>
                <SelectionTabsContainer>
                  <OptionContainer itemSelected={true}>
                    <OptionText selected={true}>Agenda</OptionText>
                  </OptionContainer>
                  <OptionContainer itemSelected={false}>
                    <OptionText selected={false}>Issues</OptionText>
                  </OptionContainer>
                  <OptionContainer itemSelected={false}>
                    <OptionText selected={false}>Pyns</OptionText>
                  </OptionContainer>
                </SelectionTabsContainer>
              </SelectionContainer>
            </SideopContainer>
          </ChildrenContainer>
        </DescriptionBody>
      </DescriptionContainer>
      <BodyContainer hasStepsForMobile={false}>
        <MobileContainer>
          {true && (
            <CloseButtonContainer>
              <CloseText> Close </CloseText>
              <Icon icon={"Close"} size={"16px"} iconColor={"greyInactive"} />
            </CloseButtonContainer>
          )}
        </MobileContainer>
        <BodyContentContainer hasStepsForMobile={false}>
          <CheckBodyContainer>
            <CheckStepComponentContainer>
              <KContainer>
                <SubHeaderText>
                  {"KPIKPIkpikpiKPI>100"}
                </SubHeaderText>
                <ValueInputContainer>
                  <FormElementContainer>
                    <InputFromUnitType
                      unitType={"numerical"}
                      placeholder={"Add the new value..."}
                      onChange={() => {}}
                      defaultValue={0}
                      onBlur={() => {}}
                    />
                  </FormElementContainer>
                  <ValueSpan>{`${100}${""}`}</ValueSpan>
                </ValueInputContainer>
                <CommentContainer>
                  <FormElementContainer>
                    <InputHeaderWithComment
                      comment={"optional"}
                      fontSize={"14px"}
                      childFontSize={"12px"}
                    />
                    <StyledInput
                      placeholder={"Add a comment..."}
                      onChange={e => {}}
                      onBlur={() => {}}
                    />
                  </FormElementContainer>
                </CommentContainer>
              </KContainer>
            </CheckStepComponentContainer>
          </CheckBodyContainer>
          <CheckBodyContainer>
          <CheckStepComponentContainer>
              <KContainer>
                <SubHeaderText>
                  {"KPIKPIkpikpiKPI>100"}
                </SubHeaderText>
                <ValueInputContainer>
                  <FormElementContainer>
                    <InputFromUnitType
                      unitType={"numerical"}
                      placeholder={"Add the new value..."}
                      onChange={() => {}}
                      defaultValue={0}
                      onBlur={() => {}}
                    />
                  </FormElementContainer>
                  <ValueSpan>{`${100}${""}`}</ValueSpan>
                </ValueInputContainer>
                <CommentContainer>
                  <FormElementContainer>
                    <InputHeaderWithComment
                      comment={"optional"}
                      fontSize={"14px"}
                      childFontSize={"12px"}
                    />
                    <StyledInput
                      placeholder={"Add a comment..."}
                      onChange={e => {}}
                      onBlur={() => {}}
                    />
                  </FormElementContainer>
                </CommentContainer>
              </KContainer>
            </CheckStepComponentContainer>
          </CheckBodyContainer>
          <CheckBodyContainer>
          <CheckStepComponentContainer>
              <KContainer>
                <SubHeaderText>
                  {"KPIKPIkpikpiKPI>100"}
                </SubHeaderText>
                <ValueInputContainer>
                  <FormElementContainer>
                    <InputFromUnitType
                      unitType={"numerical"}
                      placeholder={"Add the new value..."}
                      onChange={() => {}}
                      defaultValue={0}
                      onBlur={() => {}}
                    />
                  </FormElementContainer>
                  <ValueSpan>{`${100}${""}`}</ValueSpan>
                </ValueInputContainer>
                <CommentContainer>
                  <FormElementContainer>
                    <InputHeaderWithComment
                      comment={"optional"}
                      fontSize={"14px"}
                      childFontSize={"12px"}
                    />
                    <StyledInput
                      placeholder={"Add a comment..."}
                      onChange={e => {}}
                      onBlur={() => {}}
                    />
                  </FormElementContainer>
                </CommentContainer>
              </KContainer>
            </CheckStepComponentContainer>
          </CheckBodyContainer>
          <CheckBodyContainer>
          <CheckStepComponentContainer>
              <KContainer>
                <SubHeaderText>
                  {"KPIKPIkpikpiKPI>100"}
                </SubHeaderText>
                <ValueInputContainer>
                  <FormElementContainer>
                    <InputFromUnitType
                      unitType={"numerical"}
                      placeholder={"Add the new value..."}
                      onChange={() => {}}
                      defaultValue={0}
                      onBlur={() => {}}
                    />
                  </FormElementContainer>
                  <ValueSpan>{`${100}${""}`}</ValueSpan>
                </ValueInputContainer>
                <CommentContainer>
                  <FormElementContainer>
                    <InputHeaderWithComment
                      comment={"optional"}
                      fontSize={"14px"}
                      childFontSize={"12px"}
                    />
                    <StyledInput
                      placeholder={"Add a comment..."}
                      onChange={e => {}}
                      onBlur={() => {}}
                    />
                  </FormElementContainer>
                </CommentContainer>
              </KContainer>
            </CheckStepComponentContainer>
          </CheckBodyContainer>
        </BodyContentContainer>
      </BodyContainer>
    </Container>
    </BigContainer>
    </Overlay>
      </>
    );
  },
);


const LoadBodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

type IStopMeetingButton = {
  variant: string;
  onClick: () => void;
  small: boolean;
  disabled: boolean;
};

const StopButton = styled(Button)<IStopMeetingButton>`
  width: 100%;
  margin: 0;
  font-size: 16px;
`;

const HeaderContainer = styled.div`
  display: none;
  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

const CheckInWizardContainer = styled.div`
  @media only screen and (max-width: 768px) {
    padding-top: 64px;
  }
`;

const Overlay = styled.div`
  position: relative;

`;

const Wrapper = styled.div`
  height: 0;
  width: 100%;
  postion: absolute;
  z-index: 10000;
`;

const Upgradetextcontainer = styled.div`
  width:100%;
  text-align: center;
  border-top: 1px solid white;
  z-index: 1000;
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

const BigContainer = styled.div`
  filter: blur(10px);
  position: absolute;
  opacity: 0.35;
  z-index: 0;
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

const DesktopCloseButtonContainer = styled.div`
  display: none;
  @media only screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    padding: 6px 16px;
    border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
    background: ${props => props.theme.colors.backgroundGrey};
  }
`;

const MobileContainer = styled.div`
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileButtonContainer = styled.div`
  display: none;
  @media only screen and (max-width: 768px) {
    display: block;
    margin-left: 16px;
    margin-bottom: 16px;
  }
`;

const DescriptionContainer = styled.div`
  min-width: 320px;
  width: 25%;
  background-color: ${props => props.theme.colors.backgroundGrey};
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const DescriptionBody = styled.div`
  padding-left: 10%;
  padding-right: 10%;
  margin-top: 32px;
  height: 85%;
`;

type BodyContainerProps = {
  hasStepsForMobile: boolean;
};

const BodyContainer = styled.div<BodyContainerProps>`
  padding-left: ${props => (props.hasStepsForMobile ? "0px" : "16px")};
  padding-right: ${props => (props.hasStepsForMobile ? "0px" : "16px")};
  padding-top: 32px;
  width: 75%;
  position: relative;
  display: flex;
  // height: 100%;
  flex-direction: column;
  // overflow-x: auto;
  @media only screen and (max-width: 768px) {
    width: 100%;
    padding: 0;
  }
`;

type BodyContentContainerProps = {
  hasStepsForMobile: boolean;
};

const BodyContentContainer = styled.div<BodyContentContainerProps>`
  height: 100%;
  overflow-y: auto;
  //display: ${props => (props.hasStepsForMobile ? "block" : "flex")};
  //display: flex;
`;

const DescriptionTitleContainer = styled.div``;

const DescriptionText = styled(Text)`
  color: ${props => props.theme.colors.greyActive};
  font-size: 16px;
  margin-top: 8px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-top: 24px;
  margin-bottom: 24px;
  @media only screen and (max-width: 768px) {
    display: inline-flex;
  }
`;

const NextButton = styled(Button)`
  width: 100%;
  margin-left: 0;
`;

const SkipButton = styled(Button)`
  width: 100%;
  margin-right: 10px;
`;

type LeftBodyContainerProps = {
  fullWidth: boolean;
  LongerWidth?: boolean;
};

const LeftBodyContainer = styled.div<LeftBodyContainerProps>`
  width: ${props => (props.fullWidth ? "100%" : props.LongerWidth ? "70%" : "50%")};
  margin-right: 16px;
`;

const RightBodyContainer = styled.div`
  width: 50%;
`;

const StepComponentContainer = styled.div`
  margin-top: 32px;
  margin-bottom: 32px;
  margin-left: 15%;
  margin-right: 15%;
`;

const LynchpynLogoContainer = styled.div`
  text-align: center;
  margin-top: auto;
  margin-bottom: 16px;
`;

const CloseButtonContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  margin-right: 20px;
  &:hover {
    cursor: pointer;
  }
  @media only screen and (max-width: 768px) {
    top: auto;
    right: auto;
    margin-right: 0;
    right: 16px;
    align-items: center;
  }
`;

const CloseText = styled(Text)`
  color: ${props => props.theme.colors.greyInactive};
  font-size: 12px;
  margin-left: auto;
  margin-right: 10px;
  @media only screen and (max-width: 768px) {
    color: ${props => props.theme.colors.grey100};
  }
`;

const BackButton = styled(Button)`
  width: 32px;
  padding-left: 0;
  padding-right: 0;
`;

const StyledBackIcon = styled(Icon)`
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
`;

const ChildrenContainer = styled.div``;

const StepText = styled(Text)`
  color: ${props => props.theme.colors.greyActive};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -15px;
  margin-bottom: 30px;
  > * {
    &:first-child {
      margin-right: 8px;
    }
  }
  @media only screen and (max-width: 768px) {
    margin-top: -8px;
    margin-bottom: 0;
    justify-content: flex-start;
  }
`;

const SideopContainer = styled.div`
  height: inherit;
`;

const SelectionContainer = styled.div`
  margin-bottom: 32px;
`;

const SelectionTabsContainer = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  justify-content: space-between;
  width: 100%;
`;

const DisplayContentContainer = styled.div`
  height: inherit;
`;

type OptionContainerType = {
  itemSelected: boolean;
};

const OptionContainer = styled.div<OptionContainerType>`
  margin-left: 8px;
  margin-right: 8px;
  border-bottom: ${props => props.itemSelected && `4px solid ${props.theme.colors.primary100}`};
  border-radius: 1.5px;
  &:hover {
    cursor: pointer;
  }
`;

type OptionTextProps = {
  selected: boolean;
};

const OptionText = styled(Text)<OptionTextProps>`
  font-size: 18px;
  margin-bottom: 4px;
  margin-top: 0;
  padding-left: 4px;
  padding-right: 4px;
  font-weight: bold;
  color: ${props =>
    props.selected ? `${props.theme.colors.black}` : `${props.theme.colors.greyInactive}`};
`;

const CheckBodyContainer = styled.div`
  display: flex;
  width: -webkit-fill-available;
`;

const CheckStepComponentContainer = styled.div`
  width: inherit;
  min-width: 320px;
  // margin-left: 8px;
  @media only screen and (max-width: 768px) {
    margin-left: 0;
  }
`;

const KContainer = styled.div`
border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
padding-left: 16px;
padding-right: 16px;
@media only screen and (max-width: 768px) {
  padding: 0 16px;
}
`;

const SubHeaderText = styled.span`
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 25px;
`;

const ValueInputContainer = styled.div`
  width: 30%;
  align-items: center;
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;
  @media only screen and (max-width: 768px) {
    width: 70%;
  }
`;

const ValueSpan = styled.span`
  font-weight: bold;
  display: inline-block;
  margin-left: 50px;
  @media only screen and (max-width: 768px) {
    margin-left: 30px;
  }
`;

const CommentContainer = styled.div`
  width: 70%;
  margin-bottom: 15px;
  @media only screen and (max-width: 768px) {
    width: 80%;
  }
`;