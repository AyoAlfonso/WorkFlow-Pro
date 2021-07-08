import React, { useState, useCallback } from "react";
import { ModalWithHeader } from "~/components/shared/modal-with-header";
import { useTranslation } from "react-i18next";
import { baseTheme } from "~/themes";
import styled from "styled-components";
import "~/stylesheets/modules/react-easy-crop.css";
import Cropper from "react-easy-crop";
import { Button } from "~/components/shared/button";

export interface IForumGuideModalProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  headerText: string;
}

export const ForumMeetingGuideModal = ({
  modalOpen,
  setModalOpen,
  headerText,
}: IForumGuideModalProps): JSX.Element => {
  const { t } = useTranslation();
  const { grey100, white } = baseTheme.colors;

  return (
    <ModalWithHeader
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      headerText={headerText}
      width="1024px"
      headerMarginBottom={"32px"}
      headerMarginTop={"32px"}
    >
      <GuideModalBody>
        <GuideModalRow>
          <GuideHiddenItem> </GuideHiddenItem>
          <GuideHeader> Steps </GuideHeader>
          <GuideHeader> Duration </GuideHeader>
          <GuideHeader> Instruction </GuideHeader>
        </GuideModalRow>
        <GuideModalRow>
          <GuideItemNumber> 1 </GuideItemNumber>
          <GuideItemStepTitle fontweight="700"> Framing the Exploration </GuideItemStepTitle>
          <GuideItem color={grey100}> 5 - 10 minutes</GuideItem>
          <GuideInstruction>
            <GuideAudience> Presenter: </GuideAudience>
            <GuideInstructionItem> Frames the exploration</GuideInstructionItem>
          </GuideInstruction>
          <StyledDivider />
        </GuideModalRow>

        <GuideModalRow>
          <GuideItemNumber> 2 </GuideItemNumber>
          <GuideItemStepTitle fontweight="700"> Self-Curiosity </GuideItemStepTitle>
          <GuideItem color={grey100}> 5 minutes</GuideItem>
          <GuideInstruction>
            <GuideAudience> Others: (15-30 seconds each): </GuideAudience>
            <GuideInstructionItem>
              {" "}
              "The emotion I am feeling is ________ and the memory that comes up for me is
              ________."
            </GuideInstructionItem>
          </GuideInstruction>
          <StyledDivider />
        </GuideModalRow>

        <GuideModalRow>
          <GuideItemNumber> 3 </GuideItemNumber>
          <GuideItemStepTitle fontweight="700"> Shared Experiences </GuideItemStepTitle>
          <GuideItem color={grey100}> 30 - 40 minutes</GuideItem>
          <GuideInstruction>
            <GuideAudience> Others: </GuideAudience>
            <GuideInstructionItem>
              {" "}
              - Continued self-curiosity <br />- Personal experiences shares
            </GuideInstructionItem>
          </GuideInstruction>
          <StyledDivider />
        </GuideModalRow>

        <GuideModalRow>
          <GuideItemNumber> 4 </GuideItemNumber>
          <GuideItemStepTitle fontweight="700"> Closing </GuideItemStepTitle>
          <GuideItem color={grey100}> 5 - 10 minutes</GuideItem>
          <GuideInstruction>
            <GuideAudience> All: (1 minute each) : </GuideAudience>
            <GuideInstructionItem>
              {" "}
              - Personal learning and take-away (presenter goes last)
            </GuideInstructionItem>
          </GuideInstruction>
          <StyledDivider />
        </GuideModalRow>
      </GuideModalBody>
      <ButtonContainer>
        <StyledButton
          small
          variant={"primary"}
          m={1}
          onClick={() => {
            setModalOpen(!modalOpen);
          }}
        >
          {t("meetingForum.exploration.done")}
        </StyledButton>
      </ButtonContainer>
    </ModalWithHeader>
  );
};

const StyledButton = styled(Button)`
  width: auto;
  display: inline-block;
`;

const ButtonContainer = styled.div`
  margin-left: 8px;
  padding: 8px;
`;

type GuideItemType = {
  color?: string;
  fontweight?: string;
};

const GuideModalBody = styled.div``;

const GuideItem = styled.div<GuideItemType>`
  display: inline-block;
  margin: 0% 10% 0% 0%;
  width: 20%;
  color: ${props => props.color};
  font-weight: ${props => props.fontweight || "auto"};
`;
const GuideItemStepTitle = styled(GuideItem)`
  margin: 0% 5% 0% 0%;
`;

const GuideHeader = styled.div`
  display: inline-block;
  font-weight: 700;
  margin: 0% 10% 0% 0%;
  width: 20%;
`;

const GuideInstruction = styled.div`
  display: inline-block;
  font-size: 14px;
  width: 30%;
`;
const GuideInstructionItem = styled.div`
  display: block;
  float: left;
`;
const GuideAudience = styled.div`
  display: block;
  font-weight: 700;
  margin-bottom: 15px;
`;

type GuideItemNumberType = {
  bgColor?: string;
};

const GuideItemNumber = styled.div<GuideItemNumberType>`
  background: ${props => props.bgColor || props.theme.colors.primary100};
  border-radius: 50%;
  padding: 10px;
  margin: 32px 16px 16px 32px;
  color: white;
  width: 18px;
  display: inline-block;
  text-align: center;
`;

const GuideHiddenItem = styled.div`
   margin: 16px 8px;
  color: white;
  width: 18px;
  display: inline-block;
  text-align: center;
`;

const GuideModalRow = styled.div``;

const StyledDivider = styled.hr`
  margin-top: 8px;
  margin-bottom: 8px;
  border-top: ${props => `1px solid ${props.theme.colors.borderGrey}`};
  border-bottom: 0;
  border-left: 0;
  border-right: 0;
`;
