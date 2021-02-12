import * as React from "react";
import styled from "styled-components";
import { Heading } from "../shared";
import { Text } from "~/components/shared/text";
import { Button } from "~/components/shared/button";
import { SignUpWizardProgressBar } from "../shared/sign-up-wizard/sign-up-wizard-progress-bar";

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
}: IWizardLayoutProps): JSX.Element => {
  const renderActionButtons = (): JSX.Element => {
    if (customActionButton) {
      return customActionButton;
    } else {
      return (
        <>
          {showSkipButton && (
            <SkipButton small variant={"primaryOutline"} onClick={() => console.log("hello world")}>
              Skip
            </SkipButton>
          )}
          <NextButton small variant={"primary"} onClick={() => console.log("hello world")}>
            Next
          </NextButton>
        </>
      );
    }
  };

  const renderStepsComponent = (): JSX.Element => {
    if (customStepsComponent) {
      return customStepsComponent;
    } else {
      return (
        steps && (
          <StepComponentContainer>
            <SignUpWizardProgressBar stepNames={steps} currentStep={currentStep} />
          </StepComponentContainer>
        )
      );
    }
  };

  const renderBodyComponents = (): JSX.Element => {
    if (singleComponent) {
      return singleComponent;
    } else {
      return (
        <>
          <LeftBodyContainer> {leftBodyComponents}</LeftBodyContainer>
          <RightBodyContainer> {rightBodyComponents}</RightBodyContainer>
        </>
      );
    }
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
      </DescriptionContainer>
      <BodyContainer>
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
