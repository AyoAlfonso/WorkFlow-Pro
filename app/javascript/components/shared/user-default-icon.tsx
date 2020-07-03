import * as React from "react";
import { color, space, typography } from "styled-system";
import styled from "styled-components";
import { baseTheme } from "../../themes";
import { Text } from "./text";

interface IUserDefaultIconProps {
  firstName: string;
  lastName: string;
}

export const UserDefaultIcon = (props: IUserDefaultIconProps) => {
  const { firstName, lastName } = props;

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

  return (
    <Container>
      <StyledText> {initials.toUpperCase()} </StyledText>
    </Container>
  );
};

const Container = styled.div`
  background-color: ${baseTheme.colors.bali};
  margin-left: auto;
  border-radius: 50px;
  height: 55px;
  width: 55px;
`;

const StyledText = styled(Text)`
  text-align: center;
  font-size: 16pt;
  margin-top: 17px;
  color: ${baseTheme.colors.white};
`;
