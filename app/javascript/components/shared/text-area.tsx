import * as React from "react";
import styled from "styled-components";
import { Textarea } from "@rebass/forms";
import { baseTheme } from "../../themes";

interface ITextAreaProps {
  textValue: string;
  onChange: (e) => void;
  height?: string;
  width?: string;
  placeholder?: string;
  style?: any;
}

export const TextArea = (props: ITextAreaProps) => {
  const { onChange, height, width, placeholder, style, textValue } = props;

  return (
    <StyledTextarea
      placeholder={placeholder || "Type here..."}
      value={textValue}
      sx={{
        border: `1px solid ${baseTheme.colors.grey40}`,
        height: `${height}`,
        width: `${width}`,
      }}
      onChange={onChange}
      style={style}
    />
  );
};

const StyledTextarea = styled(Textarea)`
  border-radius: 5px;
`;
