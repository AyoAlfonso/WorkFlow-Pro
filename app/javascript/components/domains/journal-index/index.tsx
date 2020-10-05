import { observer } from "mobx-react";
import * as R from "ramda";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMst } from "~/setup/root";
import moment from "moment";

import {
  ActionButtonsContainer,
  AvatarContainer,
  BodyContainer,
  EntryBodyCard,
  EntryContainer,
  EntryCardHeaderContainer,
  EntryHeadingContainer,
  FilterContainer,
  HeadingContainer,
  IconButtonContainer,
  ItemListContainer,
  ItemCard,
  MainContainer,
} from "~/components/shared/journals-and-notes";
import { Card, CardHeaderText } from "~/components/shared/card";
import { Heading } from "~/components/shared/heading";
import { Text } from "~/components/shared/text";
import { Icon } from "~/components/shared/icon";
import { Avatar } from "~/components/shared/avatar";
import { Loading } from "~/components/shared";

export interface IJournalIndexProps {}

export const JournalIndex = observer(
  (props: IJournalIndexProps): JSX.Element => {
    const [selected, setSelected] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const { questionnaireStore, sessionStore } = useMst();
    const { t } = useTranslation();

    useEffect(() => {
      questionnaireStore.getQuestionnaireAttempts().then(() => setLoading(false));
    }, []);

    const questionnaireAttemptsData = questionnaireStore.questionnaireAttemptsData;

    if (loading || R.isNil(questionnaireAttemptsData)) {
      return <Loading />;
    }

    const renderItems = () =>
      questionnaireAttemptsData.map((item, index) => (
        <>
          <Text key={index} fontSize={"12px"} fontWeight={600}>
            {item.date}
          </Text>
          {item.items.map((qa, qaIndex) => (
            <ItemCard
              key={qaIndex}
              titleText={moment(qa.completedAt).format("LT")}
              bodyText={qa.questionnaireType}
              onClick={() => setSelected(`${qa.id}`)}
              selected={selected === `${qa.id}`}
            />
          ))}
        </>
      ));

    const renderSelectedEntryHeading = () => (
      <>
        <Text fontSize={"12px"} fontWeight={600}>
          Evening Reflection
        </Text>
        <Text fontSize={"12px"} fontWeight={400} color={"greyActive"}>
          Friday, September 26, 4:30 pm
        </Text>
        <AvatarContainer>
          <Avatar
            firstName={"Steven"}
            lastName={"Alves"}
            size={24}
            marginLeft={"0"}
            marginRight={"10px"}
            defaultAvatarColor={"primary100"}
          />
          <Text fontSize={"9px"} fontWeight={400} color={"greyActive"} marginRight={"3px"}>
            Steven
          </Text>
          <Text fontSize={"9px"} fontWeight={400} color={"greyActive"}>
            Alves
          </Text>
        </AvatarContainer>
      </>
    );

    const renderSelectedEntry = () => (
      <Card
        width={"100%"}
        alignment={"left"}
        noHeaderBorder={true}
        headerComponent={
          <EntryCardHeaderContainer>
            <Text fontSize={"12px"} fontWeight={600}>
              Journal Entry
            </Text>
            <ActionButtonsContainer>
              <IconButtonContainer onClick={() => {}}>
                <Icon icon={"Edit-2"} size={"16px"} mr={"16px"} />
              </IconButtonContainer>
              <IconButtonContainer onClick={() => {}}>
                <Icon icon={"Delete"} size={"16px"} />
              </IconButtonContainer>
            </ActionButtonsContainer>
          </EntryCardHeaderContainer>
        }
      >
        <EntryBodyCard>
          {entryData.renderedSteps.map((step, index) => (
            <div key={index}>
              <Text fontSize={"12px"} fontWeight={600}>
                {step.question}
              </Text>
              <Text fontSize={"12px"} fontWeight={400}>
                {step.answer}
              </Text>
            </div>
          ))}
        </EntryBodyCard>
      </Card>
    );

    return (
      <MainContainer>
        <HeadingContainer>
          <Heading type={"h1"} fontSize={"24px"}>
            Journal Entries
          </Heading>
        </HeadingContainer>
        <BodyContainer>
          <FilterContainer>
            <Card headerComponent={<CardHeaderText>Filter</CardHeaderText>}>some other stuff</Card>
          </FilterContainer>
          <ItemListContainer>{renderItems()}</ItemListContainer>
          <EntryContainer>
            <EntryHeadingContainer>{renderSelectedEntryHeading()}</EntryHeadingContainer>
            {renderSelectedEntry()}
          </EntryContainer>
        </BodyContainer>
      </MainContainer>
    );
  },
);

const itemData = [
  { id: "1", time: "8:52 AM", body: "Create My Day" },
  { id: "2", time: "6:45 PM", body: "Evening Reflection" },
];

const itemDates = ["Sun, Sep 27", "Mon, Sep 28"];

const entryData = {
  renderedSteps: [
    {
      question: "What happened today?",
      answer: "Lorem ipsum dolor sit amet",
    },
    {
      question: "How would you rate your day?",
      answer: "Lorem ipsum dolor sit amet",
    },
    {
      question: "What were your top 3 wins today?",
      answer: "Lorem ipsum dolor sit amet",
    },
  ],
};
