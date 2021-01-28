import * as React from "react";
import styled from "styled-components";
import { HeaderText } from "~/components/shared/styles/container-header"
import { useTranslation } from "react-i18next";

export const NoUpcomingMeeting = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Container>
      <HeaderText>
        {t("meetingForum.noUpcomingMeetingScheduled")}
      </HeaderText>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;