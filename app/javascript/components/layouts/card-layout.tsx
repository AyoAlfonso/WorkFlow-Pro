import * as React from "react";
import styled from "styled-components";
import { ContainerHeaderWithText } from "~/components/shared/styles/container-header";
import { HomeContainerBorders } from "../domains/home/shared-components";

interface ICardLayoutProps {
  customHeader?: JSX.Element;
  titleText?: string;
  children: JSX.Element;
  width?: string;
  height?: string;
}

// USAGE: The user can either pass in the titleText as the headerText or to pass in a customHeader component if the header is more complicated.
//        e.g. having additional sorting buttons
//        Children will be rendered below the header

export const CardLayout = ({
  customHeader,
  titleText,
  children,
  width = "auto",
  height = "auto",
}: ICardLayoutProps): JSX.Element => {
  return (
    <Container width={width} height={height}>
      {customHeader ? customHeader : <ContainerHeaderWithText text={titleText} />}
      {children}
    </Container>
  );
};

type ContainerProps = {
  width: string;
  height: string;
};

const Container = styled(HomeContainerBorders)<ContainerProps>`
  width: ${props => props.width};
  height: ${props => props.height};
`;
