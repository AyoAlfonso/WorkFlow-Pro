import React from "react";
import styled from "styled-components";

export default { title: "Other Component" };

const StyledDiv = styled.div`
  height: 40px;
  width: 120px;
`;

export const OtherComponent = () => <StyledDiv>Other Component</StyledDiv>;
