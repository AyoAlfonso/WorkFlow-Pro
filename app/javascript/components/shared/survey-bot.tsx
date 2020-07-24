import * as React from "react";
import { Dispatch, SetStateAction } from "react";
import ChatBot from "react-simple-chatbot";
import { observer } from "mobx-react";
import { useMst } from "../../setup/root";
import styled from "styled-components";
import { Text } from "../shared/text";

const variants = {
  createMyDay: {
    title: "Create My Day",
    steps: [
      {
        id: "1",
        message: "What are you grateful for?",
        trigger: "2",
      },
      {
        id: "2",
        user: true,
        trigger: "3",
      },
      {
        id: "3",
        message:
          "How do you want to feel today? What does your life look like when you are feeling that way?",
        trigger: "4",
      },
      {
        id: "4",
        user: true,
        trigger: "5",
      },
      {
        id: "5",
        message: "What frog will you eat today?",
        trigger: "6",
      },
      {
        id: "6",
        options: [
          { value: "1", label: "SEO Optimization", trigger: "7" },
          { value: "2", label: "Setup WebMaster", trigger: "7" },
          { value: "3", label: "Have a Follow-Up with Patrick", trigger: "7" },
        ],
      },
      {
        id: "7",
        message: "What is your daily affirmation today?",
        trigger: "8",
      },
      {
        id: "8",
        user: true,
        trigger: "9",
      },
      {
        id: "9",
        message: "What are your thoughts and reflections for today?",
        trigger: "10",
      },
      {
        id: "10",
        user: true,
        end: true,
      },
    ],
  },
  thoughtChallenge: {
    title: "Thought Challenge",
    steps: [
      {
        id: 1,
        message: "What negative thoughts do you have?",
        trigger: "2",
      },
      {
        id: 2,
        user: true,
        trigger: "3",
      },
      {
        id: 3,
        message: "Which cognitive distortions apply to you?",
        trigger: "4",
      },
      {
        id: 4,
        options: [
          { value: "1", label: "All-or-Nothing Thinking", trigger: "5" },
          { value: "2", label: "Overgeneralization", trigger: "5" },
          { value: "3", label: "Filtering Out Positives", trigger: "5" },
          { value: "4", label: "Jumping to Conclusions", trigger: "5" },
        ],
      },
      {
        id: 5,
        message: "How can you challenge your negative thoughts?",
        trigger: "6",
      },
      {
        id: 6,
        user: true,
        trigger: "7",
      },
      {
        id: 7,
        message: "What is another way of interpreting the situation?",
        trigger: "8",
      },
      {
        id: 8,
        user: true,
        trigger: "9",
      },
      {
        id: 9,
        message: "How are you feeling now?",
        trigger: 10,
      },
      {
        id: 10,
        options: [
          { value: "Worse", label: "Worse than before!", trigger: "11" },
          { value: "Same", label: "About the Same", trigger: "12" },
          { value: "Better", label: "Better than before!", trigger: "12" },
        ],
      },
      {
        id: 11,
        message: "Sorry to hear that...",
        end: true,
      },
      {
        id: 12,
        message: "Got it. You can always try something relaxing and come back to this later.",
        end: true,
      },
      {
        id: 13,
        message: "Glad to hear that!",
        end: true,
      },
    ],
  },
  eveningReflection: {
    title: "Evening Reflection",
    steps: [
      {
        id: 1,
        message: "How are you feeling?",
        trigger: "2",
      },
      {
        id: 2,
        options: [
          { value: "Terrible", label: "Terrible", trigger: "3" },
          { value: "Bad", label: "Bad", trigger: "3" },
          { value: "Okay", label: "Okay", trigger: "3" },
          { value: "Good", label: "Good!", trigger: "3" },
          { value: "Great!", label: "Great!", trigger: "3" },
        ],
      },
      {
        id: 3,
        message: "What did you feel?",
        trigger: "4",
      },
      {
        id: 4,
        user: true,
        trigger: "5",
      },
      {
        id: 5,
        message: "Reflect and celebrate",
        trigger: "6",
      },
      {
        id: 6,
        user: true,
        trigger: "7",
      },
      {
        id: 7,
        message: "Daily affirmations",
        trigger: "8",
      },
      {
        id: 8,
        user: true,
        trigger: "9",
      },
      {
        id: 9,
        message: "Thoughts and reflections",
        trigger: "10",
      },
      {
        id: 10,
        user: true,
        end: true,
      },
    ],
  },
};

export interface ISurveyBotProps {
  variant: string;
  endFn?: Dispatch<SetStateAction<string>>;
}

export const SurveyBot = observer(
  (props: ISurveyBotProps): JSX.Element => {
    const { sessionStore } = useMst();
    return (
      <ChatBot
        botAvatar={require("../../assets/images/LynchPyn-Logo-Blue_300x300.png")}
        botDelay={1000}
        headerComponent={<SurveyHeader title={variants[props.variant].title} />}
        steps={variants[props.variant].steps}
        width={"100%"}
        userAvatar={sessionStore.profile.avatarUrl || undefined}
        contentStyle={{ height: "206px" }}
        // header and footer are 120px total
        style={{ height: "326px" }}
        enableSmoothScroll={true}
        userDelay={200}
        handleEnd={data => {
          // console.log("RENDERED STEPS: ", renderedSteps);
          // console.log("STEPS: ", steps);
          if (typeof props.endFn === "function") {
            setTimeout(() => {
              props.endFn("");
            }, 2000);
          }
        }}
      />
    );
  },
);

export const SurveyBotNoMst = (props: ISurveyBotProps): JSX.Element => {
  return (
    <ChatBot
      botAvatar={require("../../assets/images/LynchPyn-Logo-Blue_300x300.png")}
      userAvatar={
        "https://image.freepik.com/free-vector/woman-avatar-profile-round-icon_24640-14042.jpg"
      }
      botDelay={1000}
      headerComponent={<SurveyHeader title={variants[props.variant].title} />}
      steps={variants[props.variant].steps}
      width={"100%"}
      contentStyle={{ height: "300px" }}
      // header and footer are 120px total
      style={{ height: "420px" }}
      enableSmoothScroll={true}
      userDelay={200}
    />
  );
};

const HeaderDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
`;

const SurveyHeader = ({ title }) => {
  return (
    <HeaderDiv>
      <Text color={"grey100"} fontSize={2}>
        {title}
      </Text>
    </HeaderDiv>
  );
};
