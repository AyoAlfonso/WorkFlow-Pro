import * as React from "react";
import styled from "styled-components";
import { HeaderText } from "~/components/shared/styles/container-header";
import { useTranslation } from "react-i18next";

export const ExplorationTopic = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Container>
      <HeaderContainer>
        <HeaderTextContent>{t("meetingForum.explorationTopic.whoTitle")}</HeaderTextContent>
        <HeaderTextContent>{t("meetingForum.explorationTopic.topicTitle")}</HeaderTextContent>
      </HeaderContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 24px;
`;

const HeaderTextContent = styled(HeaderText)`
  text-align: left;
  margin-right: auto;
`;
