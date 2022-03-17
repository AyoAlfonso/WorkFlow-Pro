import React, { useRef, useState } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { baseTheme } from "~/themes/base";

import ContentEditable from "react-contenteditable";
import { Checkbox, Label } from "@rebass/forms";
import { TextDiv } from "~/components/shared";

interface IPyn {
  pynDataKey: string;
  pyn: {
    description: string;
    position: number;
  };
  onEditPyn: (keys: Array<string>, value: any) => void;
}

export const Pyn = ({ pynDataKey, pyn, onEditPyn }: IPyn): JSX.Element => {
  const pynRef = useRef(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  return (
    <PynContainer>
      <Label
        sx={{
          width: "auto",
          marginTop: "auto",
          marginBottom: "auto",
        }}
      >
        <Checkbox
          checked={isChecked}
          onChange={e => {
            setIsChecked(c => !c);
          }}
          sx={{
            color: baseTheme.colors.primary100,
          }}
        />
      </Label>
      <StyledContentEditable
        innerRef={pynRef}
        html={pyn.description}
        onChange={e => {
          if (!e.target.value.includes("<div>")) {
            onEditPyn([pynDataKey, "description"], e.target.value);
          }
        }}
        style={{ cursor: "text" }}
        onKeyDown={key => {
          if (key.keyCode == 13) {
            pynRef.current.blur();
          }
        }}
        placeholder={"New todo..."}
      />
    </PynContainer>
  );
};

const PynContainer = styled.div`
  height: 58px;
  width: 95%;
  border-radius: 10px;
  box-shadow: 0px 3px 6px ${baseTheme.colors.grayShadow};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 8px;
  margin-top: 16px;
`;

const StyledContentEditable = styled(ContentEditable)`
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  margin-left: 10px;
  min-width: 105px;
  width: 100%;
  margin-top: auto;
  margin-bottom: auto;
  word-break: break-word;
`;
