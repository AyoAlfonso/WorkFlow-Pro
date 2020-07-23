import * as React from "react";
import styled from "styled-components";

import { Input as RebassInput, Label as RebassLabel } from "@rebass/forms";

export const Input = props => <StyledInput {...props}>{props.children}</StyledInput>;

export const Label = props => <StyledLabel {...props}>{props.children}</StyledLabel>;

// const StyledLabel = styled(RebassLabel)`
const StyledLabel = styled.label`
  display: block;
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  font-family: Lato;
  font-weight: bold;
`;

const StyledInput = styled.input`
  display: block;
  width: 100%;
  font-size: 16px;
  border-radius: 5px;
  margin-bottom: 15px;
  font-family: Lato;
  border: 1px solid ${props => props.theme.colors.grey40};
  background-color: transparent;
  padding: 8px;
  box-sizing: border-box;
  appearance: none;
`;
