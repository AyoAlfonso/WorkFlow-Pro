import * as React from "react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled from "styled-components";
import { color } from "styled-system";
import { useMst } from "~/setup/root";
import ContentEditable from "react-contenteditable";
import { useRef } from "react";

interface IPersonalVisionProps {
  personalVision: string;
}

export const PersonalVision = ({ personalVision }: IPersonalVisionProps): JSX.Element => {
  const { sessionStore } = useMst();
  const personalVisionRef = useRef(null);

  return (
    <VisionContainer>
      <VisionTitle>Future Self</VisionTitle>
      <StyledContentEditable
        innerRef={personalVisionRef}
        placeholder={"Describe what the ideal, future you will look like, in one statement..."}
        html={personalVision || ""}
        disabled={false}
        onChange={e => {
          if (!e.target.value.includes("<div>")) {
            sessionStore.updateProfileModelField("personalVision", e.target.value);
          }
        }}
        onKeyDown={key => {
          if (key.keyCode == 13) {
            personalVisionRef.current.blur();
          }
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
  font-size: 16px;
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
  padding: 5px;
  text-transform: capitalize;
  font-weight: 700;
`;
