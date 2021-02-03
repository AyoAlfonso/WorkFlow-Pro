import * as React from "react";
import * as R from "ramda";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import ChatBot from "react-simple-chatbot";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import styled from "styled-components";
import { Text } from "~/components/shared/text";
import { Loading } from "~/components/shared/loading";
import { SummaryDisplay } from "./summary-display";
import { Card, CardBody, CardHeaderText } from "~/components/shared/card";
import { useTranslation } from "react-i18next";

export interface IQuestionnaireProps {
  variant: string;
  endFn?: Dispatch<SetStateAction<string>>;
}

export const Questionnaire = observer(
  (props: IQuestionnaireProps): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(true);

    const { t } = useTranslation();
    const { meetingStore, questionnaireStore, sessionStore } = useMst();

    useEffect(() => {
      questionnaireStore.load().then(() => {
        setLoading(false);
      });
    }, []);

    const questionnaireVariant = questionnaireStore.getQuestionnaireByVariant(props.variant);

    if (
      loading ||
      R.isNil(questionnaireStore.questionnaires) ||
      R.isNil(questionnaireVariant) ||
      R.isNil(sessionStore.profile)
    ) {
      return (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      );
    }

    const summaryData = meetingStore.personalPlanningSummary;
    const userFirstName = sessionStore.profile.firstName;
    const currentPersonalPlanning = meetingStore.currentPersonalPlanning;

    const steps = R.map(step => {
      if (R.path(["metadata", "summary"], step) === "gratitudes") {
        return R.pipe(
          R.assoc(
            "component",
            <>
              <SummaryDisplay
                summaryData={summaryData}
                variant={`${R.path(["metadata", "summary"], step)}Am`}
                title={R.path(["metadata", "message", "am"], step)}
              />
              <SummaryDisplay
                summaryData={summaryData}
                variant={`${R.path(["metadata", "summary"], step)}Pm`}
                title={R.path(["metadata", "message", "pm"], step)}
              />
            </>,
          ),
          R.dissoc("options"),
        )(step);
      } else if (R.hasPath(["metadata", "summary"], step)) {
        return R.pipe(
          R.assoc(
            "component",
            <SummaryDisplay
              summaryData={summaryData}
              variant={R.path(["metadata", "summary"], step)}
              title={R.path(["metadata", "message"], step)}
            />,
          ),
          R.dissoc("options"),
        )(step);
      } else {
        return step;
      }
    }, R.clone(questionnaireVariant.steps));

    return R.path(["profile", "currentDailyLog", "weeklyReflection"], sessionStore) ? (
      <Container>
        <Card
          width={"100%"}
          alignment={"left"}
          headerComponent={
            <CardHeaderText fontSize={"16px"}>{t("journals.weeklyReflectionTitle")}</CardHeaderText>
          }
        >
          <CardBody>
            <Text fontFamily={"Lato"} fontSize={"14px"} mt={"15px"} textAlign={"center"}>
              {R.replace("{userName}", userFirstName, t("journals.weeklyReflectionCompleted"))}
            </Text>
          </CardBody>
        </Card>
      </Container>
    ) : (
      <Container>
        <ChatBot
          hideBotAvatar={true}
          hideUserAvatar={true}
          botDelay={1000}
          headerComponent={<SurveyHeader title={t("journals.weeklyReflectionTitle")} />}
          steps={steps}
          width={"100%"}
          contentStyle={{ height: "400px" }}
          // header and footer are 120px total
          style={{ height: "520px" }}
          enableSmoothScroll={true}
          userDelay={200}
          handleEnd={async ({ renderedSteps, steps, values: answers }) => {
            await questionnaireStore.createQuestionnaireAttempt(
              questionnaireVariant.id,
              {
                renderedSteps,
                steps,
                answers,
              },
              questionnaireVariant.title,
              {
                questionnaireAttemptableId: currentPersonalPlanning.id,
                questionnaireAttemptableType: "Meeting",
              },
            );
          }}
        />
      </Container>
    );
  },
);

const LoadingContainer = styled.div`
  display: flex;
  width: 100%;
  height: 346px;
  justify-content: center;
  align-items: center;
`;

const HeaderDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
`;

const Container = styled.div`
  width: 67%;
  min-width: 670px;
`;

export const SurveyHeader = ({ title }) => {
  return (
    <HeaderDiv>
      <Text color={"grey100"} fontSize={2}>
        {title}
      </Text>
    </HeaderDiv>
  );
};
