import * as React from "react";
import { text, select, withKnobs } from "@storybook/addon-knobs";
import { Button } from "../app/javascript/components/shared/button";
import { CodeBlockDiv, ContainerDiv, Divider, PropsList, RowDiv } from "./shared";
import { showToast } from "../app/javascript/utils/toast-message";
import { ToastMessageConstants } from "../app/javascript/constants/toaster-types";
import { Toaster as ToasterComponent } from "../app/javascript/components/shared/toaster";
import { toast } from "react-toastify";

export default { title: "Toaster", decorators: [withKnobs] };

export const Toaster = () => (
  <ContainerDiv>
    <ToasterComponent position={toast.POSITION.TOP_CENTER} />
    <Button
      variant={"primary"}
      onClick={() => {
        showToast(
          text("message", "Toast Message"),
          select("type", Object.values(ToastMessageConstants), ToastMessageConstants.SUCCESS),
        );
      }}
      width={"180px"}
      mt={2}
    >
      Show Toast
    </Button>
  </ContainerDiv>
);
