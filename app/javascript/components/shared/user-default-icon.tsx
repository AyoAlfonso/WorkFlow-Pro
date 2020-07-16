import * as React from "react";
import { color, space, typography } from "styled-system";
import styled from "styled-components";
import { baseTheme } from "../../themes";
import { Text } from "./text";

interface IUserDefaultIconProps {
  firstName: string;
  lastName: string;
  size?: number;
  marginLeft?: string;
}

export const UserDefaultIcon = (props: IUserDefaultIconProps) => {
  const { firstName, lastName, size, marginLeft } = props;

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

  return (
    <Container size={size} marginLeft={marginLeft}>
      <StyledText> {initials.toUpperCase()} </StyledText>
    </Container>
  );
};

type ContainerProps = {
  size?: number;
  marginLeft?: string;
};

const Container = styled.div<ContainerProps>`
  background-color: ${baseTheme.colors.bali};
  margin-left: ${props => props.marginLeft || "auto"};
  border-radius: 9999px;
  height: ${props => props.size || 55}px;
  width: ${props => props.size || 55}px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const StyledText = styled(Text)`
  text-align: center;
  font-size: 16pt;
  color: ${baseTheme.colors.white};
`;
