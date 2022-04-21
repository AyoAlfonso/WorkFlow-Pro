import React, { useState } from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { Flex, Box } from "rebass";
import { Text } from "~/components/shared/text";
import { Icon } from "~/components/shared/icon";
import { HomeContainerBorders } from "../home/shared-components";
import { EnlargedHomeTitle } from "./shared/enlarged-home-title";
import { baseTheme } from "../../../themes";

const CoreFourValues = observer(
  (): JSX.Element => {
    return (
      <Flex>
        <Box width={1 / 4} sx={boxStyle}>
          <CoreFourHeaderText fontSize={2} color={"primary100"}>
            Why Do We Exist?
          </CoreFourHeaderText>
          <CoreFourBodyTextContainer>
            <div className="trix-content">To help materialize the vision of large construction projects.</div>
          </CoreFourBodyTextContainer>
        </Box>
        <Box width={1 / 4} sx={boxStyle}>
          <CoreFourHeaderText fontSize={2} color={"primary100"}>
            How Do We Behave?
          </CoreFourHeaderText>
          <CoreFourBodyTextContainer>
            <div className="trix-content">
              <ul>
              <li>We are helpers</li>
              <li>We are solvers</li>
              <li>We are dependable</li>
              </ul>
            </div>
          </CoreFourBodyTextContainer>
        </Box>
        <Box width={1 / 4} sx={boxStyle}>
          <CoreFourHeaderText fontSize={2} color={"primary100"}>
            What Do We Do?
          </CoreFourHeaderText>
          <CoreFourBodyTextContainer>
            <div className="trix-content">We solve big, complex problems that are blocking the progress of construction projects.</div>
          </CoreFourBodyTextContainer>
        </Box>
        <Box width={1 / 4} sx={boxStyle}>
          <CoreFourHeaderText fontSize={2} color={"primary100"}>
            How Do We Succeed?
          </CoreFourHeaderText>
          <CoreFourBodyTextContainer>
            <div className="trix-content">
              <ul>
                <li>We are helpers</li>
                <li>We are solvers</li>
                <li>We are dependable</li>
              </ul>
            </div>
          </CoreFourBodyTextContainer>
        </Box>
      </Flex>
    );
  },
);

interface ICoreFourValuesProps {
}

export const DummyGoalsCoreFour = ({
}: ICoreFourValuesProps): JSX.Element => {

  const renderHideButton = () => {
    return (
      <HideButtonContainer>
        <HideText>{"Hide"} </HideText>
        <HideIconContainer>
          {(<HideIcon icon={"Hide_Show_L"} size={"15px"} iconColor={"greyInactive"} />)}
        </HideIconContainer>
      </HideButtonContainer>
    );
  };

  return (
    <Container>
      <CoreFourHeader>
        <CoreFourTitle>Foundational Four</CoreFourTitle>
        {renderHideButton()}
      </CoreFourHeader>
      <CoreFourValues />
    </Container>
  );
};

const boxStyle = {
  padding: 16,
  marginRight: "10px",
  boxShadow: `1px 3px 6px ${baseTheme.colors.grayShadow}`,
  border: `0px solid ${baseTheme.colors.white}`,
  borderRadius: "10px",
};

const Container = styled.div`
  flex-direction: column;
  margin-bottom: 32px;
`;

const TitleContainer = styled.div`
  display: flex;
`;

const CoreFourHeaderText = styled(Text)`
  font-size: 24px;
  font-weight: 800;
  margin: 0px;
  margin-bottom: 15px;
`;

const CoreFourBodyTextContainer = styled.div`
  font-size: 16px;
`;

const CoreFourTitle = styled(EnlargedHomeTitle)`
  margin-top: 32px;
  margin-bottom: 16px;
`;

const CoreFourHeader = styled.div`
  display: flex;
  margin-top: -32px;
`;


const HideButtonContainer = styled.div`
  display: flex;
  margin-left: auto;
  margin-top: 32px;
  margin-bottom: 16px;
  &: hover {
    cursor: pointer;
  }
`;

const HideText = styled(Text)`
  font-size: 14px;
  color: ${props => props.theme.colors.greyInactive};
  margin-top: 0;
  margin-bottom: 0;
  margin-right: 8px;
`;

const HideIconContainer = styled.div``;

const HideIcon = styled(Icon)`
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
`;

const ShowIcon = styled(Icon)`
  -webkit-transform: rotate(-90deg);
  transform: rotate(-90deg);
`;
