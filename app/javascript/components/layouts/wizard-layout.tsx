import * as React from "react";
import styled from "styled-components";
import { Heading } from "../shared";
import { Text } from "~/components/shared/text";
import { Button } from "~/components/shared/button";
import { SignUpWizardProgressBar } from "../shared/sign-up-wizard/sign-up-wizard-progress-bar";
import { Icon } from "~/components/shared/icon";
interface IWizardLayoutProps {
  title: string;
  description: string;
  customActionButton?: JSX.Element;
  showSkipButton?: boolean;
  singleComponent?: JSX.Element;
  leftBodyComponents?: JSX.Element;
  rightBodyComponents?: JSX.Element;
  steps?: Array<string>;
  currentStep?: number;
  customStepsComponent?: JSX.Element;
  childrenUnderDescription?: JSX.Element;
  showLynchpynLogo?: boolean;
  showCloseButton?: boolean;
  onCloseButtonClick?: any;
  onSkipButtonClick?: any;
  onNextButtonClick?: any;
}

export const WizardLayout = ({
  title,
  description,
  customActionButton,
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
  onSkipButtonClick,
  onNextButtonClick,
}: IWizardLayoutProps): JSX.Element => {
  const renderActionButtons = (): JSX.Element => {
    return (
      customActionButton || (
        <>
          {showSkipButton && (
            <SkipButton small variant={"primaryOutline"} onClick={onSkipButtonClick}>
              Skip
            </SkipButton>
          )}
          <NextButton small variant={"primary"} onClick={onNextButtonClick}>
            Next
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
          <SignUpWizardProgressBar stepNames={steps} currentStep={currentStep} />
        </StepComponentContainer>
      ))
    );
  };

  const renderBodyComponents = (): JSX.Element => {
    return (
      singleComponent || (
        <>
          <LeftBodyContainer> {leftBodyComponents}</LeftBodyContainer>
          <RightBodyContainer> {rightBodyComponents}</RightBodyContainer>
        </>
      )
    );
  };

  return (
    <Container>
      <DescriptionContainer>
        <DescrptionBody>
          <DescriptionTitleContainer>
            <Heading type={"h2"} fontSize={"20px"} fontWeight={600}>
              {title}
            </Heading>
          </DescriptionTitleContainer>
          <DescriptionText>{description}</DescriptionText>
          <ButtonsContainer>{renderActionButtons()}</ButtonsContainer>
          {childrenUnderDescription}
        </DescrptionBody>
        {showLynchpynLogo && (
          <LynchpynLogoContainer>
            <img src={"/assets/LynchPyn-Logo_Horizontal-Blue"} width="200"></img>
          </LynchpynLogoContainer>
        )}
      </DescriptionContainer>
      <BodyContainer>
        {showCloseButton && (
          <CloseButtonContainer onClick={onCloseButtonClick}>
            <CloseText> Close </CloseText>
            <Icon icon={"Close"} size={"16px"} iconColor={"greyInactive"} />
          </CloseButtonContainer>
        )}
        <BodyContentContainer>{renderBodyComponents()}</BodyContentContainer>
        {renderStepsComponent()}
      </BodyContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const DescriptionContainer = styled.div`
  min-width: 320px;
  width: 25%;
  background-color: ${props => props.theme.colors.backgroundGrey};
`;

const DescrptionBody = styled.div`
  padding-left: 10%;
  padding-right: 10%;
  margin-top: 32px;
  height: 85%;
`;

const BodyContainer = styled.div`
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 32px;
  width: 75%;
  height: 90%;
`;

const BodyContentContainer = styled.div`
  display: flex;
  height: 95%;
`;

const DescriptionTitleContainer = styled.div``;

const DescriptionText = styled(Text)`
  color: ${props => props.theme.colors.greyActive};
  font-size: 12px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-top: 16px;
  margin-bottom: 30px;
`;

const NextButton = styled(Button)`
  width: 100%;
`;

const SkipButton = styled(Button)`
  width: 100%;
  margin-right: 10px;
`;

const LeftBodyContainer = styled.div`
  width: 50%;
  margin-right: 16px;
`;

const RightBodyContainer = styled.div`
  width: 50%;
`;

const StepComponentContainer = styled.div`
  margin-top: auto;
  margin-bottom: 32px;
  margin-left: auto;
  margin-right: auto;
  width: 75%;
`;

const LynchpynLogoContainer = styled.div`
  height: 15%;
  text-align: center;
`;

const CloseButtonContainer = styled.div`
  display: flex;
  margin-right: 20px;
  &: hover {
    cursor: pointer;
  }
`;

const CloseText = styled(Text)`
  color: ${props => props.theme.colors.greyInactive};
  font-size: 12px;
  margin-left: auto;
  margin-right: 10px;
`;
