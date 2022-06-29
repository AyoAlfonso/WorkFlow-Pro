import React from "react";
import { useMst } from "~/setup/root";
import {
  AvatarContainer,
  EntryBodyCard,
  EntryContainer,
  EntryCardHeaderContainer,
  EntryHeadingContainer,
  NoSelectedItems,
} from "~/components/shared/journals-and-notes";
import * as R from "ramda";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Card } from "~/components/shared/card";
import { Text } from "~/components/shared/text";
import { Icon } from "~/components/shared/icon";
import { Avatar } from "~/components/shared/avatar";
import moment from "moment";

const JournalInsights = (): JSX.Element => {
  const { journalStore, sessionStore } = useMst();
  const { t } = useTranslation();

  const data = {
    id: 1,
    userId: 3,
    body:
      "<p><strong>Gratitude:</strong></p><p>waking up</p><p><strong>How I need to feel today:</strong></p><p>great</p><p><strong>How I will lean in today:</strong></p><p>hmm</p>",
    title: "Create My Day",
    preview: "Gratitude:waking upHow I need to feel today:greatHow I will lean in today:hmm",
    createdAt: "2022-06-20T16:07:58.574Z",
    loggedAt: "2022-06-20T16:07:58.281Z",
  };

  const renderSelectedEntryHeading = selectedEntry => {
    const { avatarUrl, defaultAvatarColor, firstName, lastName } = sessionStore.profile;
    return (
      <>
        <Text fontSize={"16px"} fontWeight={600}>
          {selectedEntry.title}
        </Text>
        <Text fontSize={"12px"} fontWeight={400} color={"grey100"}>
          {moment(selectedEntry.loggedAt).format("dddd, MMMM Do, h:mm a")}
        </Text>
        <AvatarContainer>
          <Avatar
            avatarUrl={avatarUrl}
            firstName={firstName}
            lastName={lastName}
            size={24}
            marginLeft={"0"}
            marginRight={"10px"}
            defaultAvatarColor={defaultAvatarColor}
          />
          <Text fontSize={"12px"} fontWeight={400} color={"grey100"} marginRight={"3px"}>
            {firstName}
          </Text>
          <Text fontSize={"12px"} fontWeight={400} color={"grey100"}>
            {lastName}
          </Text>
        </AvatarContainer>
      </>
    );
  };

  const renderSelectedEntry = () => {
    return R.isNil(data) ? (
      <NoSelectedItems text={t("journals.startAdding")} />
    ) : (
      <>
        <EntryHeadingContainer>{renderSelectedEntryHeading(data)}</EntryHeadingContainer>
        <Card
          width={"100%"}
          alignment={"left"}
          noHeaderBorder={true}
          headerComponent={
            <EntryCardHeaderContainer>
              <Text fontSize={"12px"} fontWeight={600}>
                {t("journals.journalEntry")}
              </Text>
            </EntryCardHeaderContainer>
          }
        >
          <EntryBodyCard>
            <Text fontSize={"12px"} mb={"20px"} dangerouslySetInnerHTML={{ __html: data.body }} />
          </EntryBodyCard>
        </Card>
      </>
    );
  };

  return (
    <Container>
      <EntryContainer>{renderSelectedEntry()}</EntryContainer>
    </Container>
  );
};

export default JournalInsights;

const Container = styled.div``;
