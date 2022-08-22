import * as React from "react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled from "styled-components";
import { color } from "styled-system";
import { useMst } from "~/setup/root";
import ContentEditable from "react-contenteditable";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

interface IPersonalVisionProps {
  personalVision: string;
}

export const PersonalVision = ({ personalVision }: IPersonalVisionProps): JSX.Element => {
  const { sessionStore } = useMst();
  const { t } = useTranslation();
  const personalVisionRef = useRef(null);

  return (
    <VisionContainer>
      <VisionTitle>Future Self</VisionTitle>
      <ContentEditableContainer>
        <StyledContentEditable
          innerRef={personalVisionRef}
          placeholder={t<string>("personal.placeholder")}
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
          onBlur={() => {
            sessionStore.updateProfileFromModel();
          }}
        />
      </ContentEditableContainer>
    </VisionContainer>
  );
};

const VisionContainer = styled(HomeContainerBorders)`
  min-height: 60px;
  width: 100%;
  display: flex;
  position: relative;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

const VisionTitle = styled.p`
  ${color}
  font-size: 24px;
  font-weight: 800;
  color: ${props => props.theme.colors.primary100};
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 16px;
  display: flex;
  align-items: center;
  height: inherit;
  width: 184px;
  white-space: nowrap;

  @media (max-width: 768px) {
    margin-left: 0;
    width: auto;
    font-size: 20px;
  }
`;

const StyledContentEditable = styled(ContentEditable)`
  display: block;
  font-size: 21px;
  text-transform: capitalize;
  font-weight: 700;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 16px;
    text-align: center;
    white-space: pre-wrap;
  }
`;

const ContentEditableContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
  padding: 5px;
  padding-right: 250px;
  overflow: hidden;

  @media (max-width: 768px) {
    position: static;
    padding-right: 0px;
    width: 95%;
  }
`;
