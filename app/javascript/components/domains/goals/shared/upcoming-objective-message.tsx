import React from "react";
import styled from "styled-components";
import { Icon, Text } from "~/components/shared";
import { useTranslation } from "react-i18next";

interface IUpcomingMessageProps {
  fiscalTime: string;
  goalType: string;
}

export const UpcomingMessage = ({ fiscalTime, goalType }: IUpcomingMessageProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Container shadow={true}>
      <HeadingSection>
        <Icon icon={"Deadline-Calendar"} iconColor={"grey100"} size={"24px"} mr={"16px"} />
        <HeaderText>{t(`This is an upcoming (${fiscalTime}) ${goalType}`)}.</HeaderText>
      </HeadingSection>
      <BodySection>
        <BodyText>
          {t(`This ${goalType} is set ${fiscalTime}. Any updates made won't be reflected until the
          timeframe has begun. Please note that Objectives or initiatives created in the final four
          weeks of each fiscal timeframe will be automatically set to the following fiscal year or
          quarter`)}
        </BodyText>
      </BodySection>
    </Container>
  );
};

type MissingParentsErrorContainerProps = {
  shadow: boolean;
};

const Container = styled.div<MissingParentsErrorContainerProps>`
  background: ${props => props.theme.colors.grey10};
  min-height: 75px;
  padding: 15px;
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: ${props => (props.shadow ? "1px 3px 4px 2px rgba(0, 0, 0, .1)" : "0")};
`;

const HeadingSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const HeaderText = styled(Text)`
  color: ${props => props.theme.colors.grey100};
  font-size: 16px;
  margin: 0;
`;

const BodySection = styled.div`
  width: 720px;
`;

const BodyText = styled(Text)`
  color: ${props => props.theme.colors.black};
  font-size: 12px;
  margin: 0;
  line-height: 18px;
`;
