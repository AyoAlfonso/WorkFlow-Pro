import * as React from "react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled from "styled-components";
import { color } from "styled-system";
import { useMst } from "~/setup/root";
import ContentEditable from "react-contenteditable";

interface IPersonalVisionProps {
  personalVision: string;
}

export const PersonalVision = ({ personalVision }: IPersonalVisionProps): JSX.Element => {
  const { sessionStore } = useMst();

  return (
    <VisionContainer>
      <VisionTitle>Personal Vision</VisionTitle>
      <StyledContentEditable
        html={personalVision}
        disabled={false}
        onChange={e => {
          sessionStore.updateProfileModelField("personalVision", e.target.value);
        }}
        onBlur={() => sessionStore.updateProfileFromModel()}
      />
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

const StyledContentEditable = styled(ContentEditable)`
  font-size: 15px;
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
  padding: 5px;
`;
