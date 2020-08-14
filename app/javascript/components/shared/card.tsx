import * as React from "react";
import styled from "styled-components";
import { layout, LayoutProps, space, SpaceProps, typography, TypographyProps } from "styled-system";

type StyledProps = LayoutProps & SpaceProps;

export interface ICardProps extends StyledProps {
  children?: any;
  alignment?: string;
  headerComponent?: any;
}

export const Card = (props: ICardProps): JSX.Element => {
  const { children, alignment, headerComponent, ...restProps } = props;
  return (
    <CardContainer {...restProps}>
      {headerComponent ? <CardHeader>{headerComponent}</CardHeader> : null}
      {children}
    </CardContainer>
  );
};

export const CardBody = styled.div<LayoutProps>`
  ${layout}
  padding: 15px 15px 15px 15px;
`;

const CardContainer = styled.div<StyledProps>`
  ${layout}
  ${space}
  border: 1px solid ${props => props.theme.colors.borderGrey};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: ${({ alignment }) =>
    (alignment === "left" && "start") ||
    (alignment === "center" && "center") ||
    (alignment === "right" && "end")}
  min-height: 100px;
  box-shadow: 1px 3px 6px 1px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div<TypographyProps>`
  ${typography}
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
  display: flex;
  font-family: Lato;
  align-items: center;
  padding-left: 15px;
  padding-right: 15px;
  height: 40px;
`;
