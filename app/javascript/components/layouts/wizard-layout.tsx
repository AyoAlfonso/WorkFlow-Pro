import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { Heading } from "../shared";
import { Text } from "~/components/shared/text";
import { Button } from "~/components/shared/button";
import { SignUpWizardProgressBar } from "../shared/sign-up-wizard/sign-up-wizard-progress-bar";
import { Icon } from "~/components/shared/icon";
import { Onboarding } from "../domains/onboarding";
interface IWizardLayoutProps {
  title: string;
  description: string;
  customActionButton?: JSX.Element;
  showBackButton?: boolean;
  showSkipButton?: boolean;
  singleComponent?: JSX.Element;
  leftBodyComponents?: Array<JSX.Element>;
  rightBodyComponents?: Array<JSX.Element>;
  steps?: Array<string>;
  currentStep?: number;
  customStepsComponent?: JSX.Element;
  childrenUnderDescription?: JSX.Element;
  showLynchpynLogo?: boolean;
  showCloseButton?: boolean;
  onCloseButtonClick?: any;
  onBackButtonClick?: any;
  onSkipButtonClick?: any;
  onNextButtonClick?: any;
  nextButtonDisabled?: boolean;
  onStepClick?: (stepIndex: number) => void;
  stepClickDisabled?: boolean;
  completeButtonText?: string;
  finalButtonDisabled?: boolean;
  stepsForMobile?: JSX.Element;
  textUnderMobileButton?: JSX.Element;
}

export const WizardLayout = ({
  title,
  description,
  customActionButton,
  showBackButton = false,
  showSkipButton = true,
  singleComponent,
  leftBodyComponents,
  rightBodyComponents,
  steps,
  currentStep,
  customStepsComponent,
  childrenUnderDescription,
  showLynchpynLogo = false,
  showCloseButton = false,
  onCloseButtonClick,
  onBackButtonClick,
  onSkipButtonClick,
  onNextButtonClick,
  nextButtonDisabled,
  onStepClick,
  stepClickDisabled,
  completeButtonText,
  finalButtonDisabled,
  stepsForMobile,
  textUnderMobileButton,
}: IWizardLayoutProps): JSX.Element => {
  const renderActionButtons = (): JSX.Element => {
    return (
      customActionButton || (
        <>
          {showBackButton && (
            <BackButton small variant={"primaryOutline"} onClick={onBackButtonClick}>
              <StyledBackIcon icon={"Move2"} size={"15px"} iconColor={"primary100"} />
            </BackButton>
          )}
          {showSkipButton && (
            <SkipButton small variant={"primaryOutline"} onClick={onSkipButtonClick}>
              Skip
            </SkipButton>
          )}
          <NextButton
            small
            variant={"primary"}
            onClick={onNextButtonClick}
            disabled={currentStep === steps.length - 1 ? finalButtonDisabled : nextButtonDisabled}
          >
            {currentStep === steps.length - 1 ? completeButtonText || "Complete" : "Next"}
          </NextButton>
        </>
      )
    );
  };

  const renderStepsComponent = (): JSX.Element => {
    return (
      customStepsComponent ||
      (steps && (
        <StepComponentContainer>
          <SignUpWizardProgressBar
            stepNames={steps}
            currentStep={currentStep}
            onStepClick={onStepClick}
            clickDisabled={stepClickDisabled}
          />
        </StepComponentContainer>
      ))
    );
  };
  
  const renderBodyComponents = (): JSX.Element => {
    const hasRightBodyComponent = !R.isNil(R.path([currentStep], rightBodyComponents));
    return (
      singleComponent || (
        <>
          <LeftBodyContainer LongerWidth={Onboarding && currentStep == 1} fullWidth={!hasRightBodyComponent}>
            {leftBodyComponents[currentStep]}
          </LeftBodyContainer>
          {hasRightBodyComponent && (
            <RightBodyContainer> {rightBodyComponents[currentStep]}</RightBodyContainer>
          )}
        </>
      )
    );
  };

  return (
    <Container>
      <DescriptionContainer>
        <DescriptionBody>
          <DescriptionTitleContainer>
            <Heading type={"h2"} mb={0}>
              {title}
            </Heading>
          </DescriptionTitleContainer>
          <DescriptionText>{description}</DescriptionText>
          <ButtonsContainer>{renderActionButtons()}</ButtonsContainer>
          {childrenUnderDescription}
        </DescriptionBody>
        {showLynchpynLogo && (
          <LynchpynLogoContainer>
            <img src={"/assets/LynchPyn-Logo_Horizontal-Blue"} width="200"></img>
          </LynchpynLogoContainer>
        )}
      </DescriptionContainer>
      <BodyContainer hasStepsForMobile={stepsForMobile ? true : false}>
        {stepsForMobile && (
          <DesktopCloseButtonContainer>
            {stepsForMobile}
            {showCloseButton && (
              <CloseButtonContainer onClick={onCloseButtonClick}>
                <CloseText> Close </CloseText>
                <Icon icon={"Close"} size={"16px"} iconColor={"grey100"} />
              </CloseButtonContainer>
            )}
          </DesktopCloseButtonContainer>
        )}
        <MobileContainer>
          {showCloseButton && (
            <CloseButtonContainer onClick={onCloseButtonClick}>
              <CloseText> Close </CloseText>
              <Icon icon={"Close"} size={"16px"} iconColor={"greyInactive"} />
            </CloseButtonContainer>
          )}
        </MobileContainer>
        <BodyContentContainer hasStepsForMobile={stepsForMobile ? true : false}>
          {renderBodyComponents()}
          <MobileButtonContainer>
            <ButtonsContainer>{renderActionButtons()}</ButtonsContainer>
            {textUnderMobileButton && textUnderMobileButton}
          </MobileButtonContainer>
        </BodyContentContainer>
        {renderStepsComponent()}
      </BodyContainer>
    </Container>
  );
};

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
    // background: ${props => props.theme.colors.backgroundGrey};
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
  display: ${props => (props.hasStepsForMobile ? "block" : "flex")};
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
