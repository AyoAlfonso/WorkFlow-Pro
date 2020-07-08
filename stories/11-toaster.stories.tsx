import * as React from "react";
import { text, select, withKnobs } from "@storybook/addon-knobs";
import { Button } from "../app/javascript/components/shared/button";
import styled from "styled-components";
import { CodeBlockDiv, ContainerDiv, PropsList } from "./shared";
import { atomOneLight, CopyBlock } from "react-code-blocks";
import { showToast } from "../app/javascript/utils/toast-message";
import { ToastMessageConstants } from "../app/javascript/constants/toast-types";
import { Toaster, ToastMessage, CloseButton } from "../app/javascript/components/shared/toaster";
import { toast } from "react-toastify";
import { baseTheme } from "../app/javascript/themes/base";

export default { title: "Toast Messages", decorators: [withKnobs] };

const propsList = [
  {
    name: "message",
    type: "string",
    required: true,
    description: "The message you want to display",
  },
  {
    name: "type",
    type: "string",
    required: true,
    description: "The variant of the toaster.  Use the provided constants",
  },
];

const ToastBox = styled.div`
  border-radius: 13px;
  height: 60px;
  width: 350px;
  padding: 0;
  margin-bottom: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 1px solid lightgrey;
  overflow: hidden;
`;

export const ToastMessages = () => (
  <ContainerDiv>
    <h1>Toast Messages</h1>
    <CodeBlockDiv mb={"20px"}>
      <CopyBlock
        text={`
      import * as React from "react";
      import { Button } from "../components/shared/button"
      import { showToast } from "../utils/toast-message";
      import { ToastMessageConstants } from "../constants/toast-types";

      const onClickAction = () => {
        showToast("toast message", ToastMessageConstants.SUCCESS)
      }

      const MyButtonComponent = () => (
        <Button variant={"primary"} onClick={onClickAction}>
          Show Toast!
        </Button>    
      )
      `}
        language={"tsx"}
        theme={atomOneLight}
      />
    </CodeBlockDiv>
    <PropsList propsList={propsList} />
    <Toaster
      position={select(
        "toaster position",
        Object.values(toast.POSITION),
        toast.POSITION.BOTTOM_CENTER,
      )}
    />
    <Button
      variant={"primaryOutline"}
      onClick={() => {
        showToast(
          text("message", "Toast Message"),
          select("type", Object.values(ToastMessageConstants), ToastMessageConstants.SUCCESS),
        );
      }}
      width={"180px"}
      mt={2}
      mb={3}
    >
      Show Toast
    </Button>
    <h2>Variants</h2>
    <ToastBox>
      <ToastMessage
        heading={"Notification"}
        message={"You are being notified!"}
        color={baseTheme.colors.primary100}
        iconName={"Star"}
      />
      <CloseButton closeToast={() => {}} />
    </ToastBox>
    <ToastBox>
      <ToastMessage
        heading={"Success"}
        message={"You did it!"}
        color={baseTheme.colors.finePine}
        iconName={"Tasks"}
      />
      <CloseButton closeToast={() => {}} />
    </ToastBox>
    <ToastBox>
      <ToastMessage
        heading={"Warning"}
        message={"You've been warned!"}
        color={baseTheme.colors.cautionYellow}
        iconName={"Alert"}
      />
      <CloseButton closeToast={() => {}} />
    </ToastBox>
    <ToastBox>
      <ToastMessage
        heading={"Error"}
        message={"Something went wrong..."}
        color={baseTheme.colors.warningRed}
        iconName={"Close"}
      />
      <CloseButton closeToast={() => {}} />
    </ToastBox>
    <ToastBox>
      <ToastMessage
        heading={"Info"}
        message={"For your information..."}
        color={baseTheme.colors.fuschiaBlue}
        iconName={"Search"}
      />
      <CloseButton closeToast={() => {}} />
    </ToastBox>
  </ContainerDiv>
);
