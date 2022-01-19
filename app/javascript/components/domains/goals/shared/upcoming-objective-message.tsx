import React from 'react';
import styled from "styled-components";
import { Icon, Text } from '~/components/shared';

interface IUpcomingMessageProps {
  fiscalYear: string;
  goalType: string;
}

export const UpcomingMessage = (): JSX.Element => {
  return (
    <Container shadow={true}>
      <HeadingSection>
        <Icon icon={"Deadline-Calendar"} iconColor={"grey100"} size={"24px"} mr={"8px"} />
      </HeadingSection>
    </Container>
  );
}

type MissingParentsErrorContainerProps = {
  shadow: boolean;
};

const Container = styled.div<MissingParentsErrorContainerProps>`
  width: 95%;
  display: inline-flex;
  background: ${props => props.theme.colors.grey10};
  height: 75px;
  padding: 20px;
  margin: 0px 0px 15px;
  border-radius: 8px;
  box-shadow: ${props => (props.shadow ? "1px 3px 4px 2px rgba(0, 0, 0, .1)" : "0")};
`;

const HeadingSection = styled.div`
  display: flex;
`

const HeaderText = styled(Text)`
  color: ${props => props.theme.colors.grey100};
  font-size: 16px;
`;