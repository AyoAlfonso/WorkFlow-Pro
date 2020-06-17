import React from "react";
import styled from "styled-components";

export default { title: "Button" };

const StyledButton = styled.button`
  height: 40px;
  width: 120px;
`;

export const Styled = () => <StyledButton>Button</StyledButton>;
