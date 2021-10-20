import * as React from "react";
import styled from "styled-components";
import { Text } from "~/components/shared/text";
import { Icon } from "~/components/shared";

interface IEmptyStateProps {
  heading: string;
  infoText: string;
}

export const EmptyState = ({ heading, infoText }: IEmptyStateProps): JSX.Element => {
  return (
    <Container>
      <Icon icon={"Empty-Pockets"} size={"100px"} iconColor={"greyInactive"} />
      <Header>{heading}</Header>
      <InfoText>{infoText}</InfoText>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 80px;
  @media only screen and (max-width: 768px) {
    height: auto;
    padding: 0 30px;
    margin: 30px 0;
  }
`;

const Header = styled.h1`
  font-size: 50px;
  font-weight: bold;
  margin: 0;
  margin: 25px 0;
  @media only screen and (max-width: 768px) {
    font-size: 30px;
  }
`;

const InfoText = styled(Text)`
  font-size: 24px;
  margin: 0;
  @media only screen and (max-width: 768px) {
    font-size: 15px;
  }
`;