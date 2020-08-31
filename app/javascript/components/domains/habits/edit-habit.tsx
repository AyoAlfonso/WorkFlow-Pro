import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { baseTheme } from "~/themes";
import { useMst } from "~/setup/root";
import { Loading } from "~/components/shared/loading";
import { Icon, Input } from "~/components/shared";
import { Text } from "~/components/shared/text";
import ContentEditable from "react-contenteditable";

interface IHabitsTableCircularProgressBar {
  color: string;
  value: number;
}

const HabitCircularProgressBar = ({ color, value }: IHabitsTableCircularProgressBar) => (
  <CircularProgressbar
    value={value}
    strokeWidth={25}
    styles={{
      root: {
        height: "40px",
        width: "40px",
      },
      path: {
        stroke: color,
        strokeLinecap: "butt",
      },
      trail: {
        stroke: "none",
      },
    }}
  />
);

interface IEditHabitProps {
  selectedHabitId: number;
  setSelectedHabitId: React.Dispatch<React.SetStateAction<number>>;
  setShowIndividualHabit: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EditHabit = observer(
  ({
    selectedHabitId,
    setSelectedHabitId,
    setShowIndividualHabit,
  }: IEditHabitProps): JSX.Element => {
    const { habitStore } = useMst();
    const [habitColor, setHabitColor] = useState<string>("");
    const [habitFrequency, setHabitFrequency] = useState<string>("");

    useEffect(() => {
      habitStore.getHabit(selectedHabitId).then(result => {
        setHabitColor(result.color);
        setHabitFrequency(result.frequency.toString());
      });
    }, [selectedHabitId]);

    const habitNameRef = useRef(null);

    const habit = habitStore.habit;

    if (habit == null) {
      return (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      );
    }

    return (
      <Container>
        <SubHeaderContainer>
          <IconContainer
            onClick={() => {
              setShowIndividualHabit(false);
              setSelectedHabitId(null);
            }}
          >
            <Icon icon={"Chevron-Left"} size={"18px"} iconColor={"grey60"} />
          </IconContainer>
          <HabitNameContainer>
            <StyledContentEditable
              innerRef={habitNameRef}
              html={habit.name}
              color={habit.color}
              onChange={e => {
                if (!e.target.value.includes("<div>")) {
                  habitStore.updateHabitField("name", e.target.value);
                }
              }}
              onKeyDown={key => {
                if (key.keyCode == 13) {
                  habitNameRef.current.blur();
                }
              }}
              onBlur={() => habitStore.updateCurrentHabit()}
            />
          </HabitNameContainer>
          <DeleteIconContainer
            onClick={() => {
              if (confirm(`Are you sure you want to delete this habit?`)) {
                habitStore.deleteHabit().then(() => {
                  setShowIndividualHabit(false);
                  setSelectedHabitId(null);
                });
              }
            }}
          >
            <Icon icon={"Delete"} size={"18px"} iconColor={"grey60"} />
          </DeleteIconContainer>
        </SubHeaderContainer>
        <FrequencyContainer>
          <SectionText>Repeat</SectionText>
          <FrequencyInput
            name="frequency"
            onChange={e => {
              setHabitFrequency(e.target.value);
            }}
            value={habitFrequency}
            onBlur={() => {
              habitStore.updateHabitField("frequency", parseInt(habitFrequency));
              habitStore.updateCurrentHabit();
            }}
          />
          <FrequencyTextTime>times each week</FrequencyTextTime>
        </FrequencyContainer>
        <ColorContainer>
          <SectionText> Color </SectionText>
          <ColorInput
            style={{
              height: 60,
              width: 60,
              marginTop: "auto",
              marginBottom: "auto",
              border: "none",
            }}
            type={"color"}
            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
              setHabitColor(value);
            }}
            onBlur={() => {
              habitStore.updateHabitField("color", habitColor);
              habitStore.updateCurrentHabit();
            }}
            value={habitColor}
          />
        </ColorContainer>
        <OverviewContainer>
          <SectionText> Overview </SectionText>
          <OverviewDetailsContainer>
            {habit.percentageWeeklyLogsCompleted == 0 ? (
              <HabitCircularProgressBar color={baseTheme.colors.greyInactive} value={100} />
            ) : (
              <HabitCircularProgressBar
                color={habit.color}
                value={habit.percentageWeeklyLogsCompleted}
              />
            )}
            <ScoreContainer>
              <PercentageText color={habit.color}>
                {habit.percentageWeeklyLogsCompleted.toFixed(0)}%
              </PercentageText>
              <DescriptionText>Score</DescriptionText>
            </ScoreContainer>
            <ScoreContainer>
              <PercentageText color={habit.color}>
                {habit.weeklyLogsCompletionDifference >= 0 ? "+" : ""}
                {habit.weeklyLogsCompletionDifference.toFixed(0)}%
              </PercentageText>
              <DescriptionText>Week</DescriptionText>
            </ScoreContainer>
          </OverviewDetailsContainer>
        </OverviewContainer>
      </Container>
    );
  },
);

const LoadingContainer = styled.div`
  margin: auto;
`;

const Container = styled.div`
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 16px;
  padding-bottom: 16px;
`;

const SubHeaderContainer = styled.div`
  display: flex;
`;

const IconContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  &: hover {
    cursor: pointer;
  }
`;

const HabitNameContainer = styled.div`
  margin-left: 8px;
`;

const DeleteIconContainer = styled.div`
  margin-left: auto;
  margin-right: 10px;
  margin-top: auto;
  margin-bottom: auto;
  &: hover {
    cursor: pointer;
  }
`;

type StyledContentEditableType = {
  color?: string;
};
const StyledContentEditable = styled(ContentEditable)<StyledContentEditableType>`
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 16px;
  padding-right: 16px;
  color: ${props => props.color};
`;

const FrequencyContainer = styled.div`
  display: flex;
  margin-top: 20px;
`;

const SectionText = styled(Text)`
  margin-top: auto;
  margin-bottom: auto;
  font-weight: bold;
`;

const FrequencyTextTime = styled(Text)`
  margin-top: auto;
  margin-bottom: auto;
`;

const FrequencyInput = styled(Input)`
  width: 50px;
  margin-bottom: 0;
  margin-left: 8px;
  margin-right: 8px;
`;

const ColorContainer = styled.div`
  display: flex;
  margin-top: 16px;
`;

const ColorInput = styled(Input)`
  margin-bottom: 0;
  margin-left: 8px;
`;

const OverviewContainer = styled.div`
  margin-top: 16px;
`;

const OverviewDetailsContainer = styled.div`
  display: flex;
  margin-top: 10px;
`;

const ScoreContainer = styled.div`
  margin-left: 24px;
  margin-top: auto;
  margin-bottom: auto;
`;

type PercentageTextType = {
  color: string;
};

const PercentageText = styled(Text)<PercentageTextType>`
  color: ${props => props.color};
  margin-top: 0;
  margin-bottom: 4px;
`;
const DescriptionText = styled(Text)`
  margin-top: 4px;
  margin-bottom: 0;
`;
