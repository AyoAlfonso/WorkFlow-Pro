import * as React from "react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled from "styled-components";
import { color } from "styled-system";

interface IPersonalVisionProps {
  personalVision: string;
}

export const PersonalVision = ({ personalVision }: IPersonalVisionProps): JSX.Element => {
  return (
    <VisionContainer>
      <VisionTitle>Personal Vision</VisionTitle>
      <VisionText> {personalVision}</VisionText>
    </VisionContainer>
  );
};

const VisionContainer = styled(HomeContainerBorders)`
  height: 60px;
  display: flex;
`;

const VisionTitle = styled.p`
  ${color}
  font-size: 20px;
  color: ${props => props.theme.colors.primary100};
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 16px;
  display: flex;
  align-items: center;
  height: inherit;
  position: absolute;
`;

const VisionText = styled.p`
  font-size: 15px;
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
`;
