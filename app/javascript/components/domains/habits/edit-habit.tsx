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
import { HabitScoreLineChart } from "./habit-score-line-chart";
import { HabitFrequencyBarGraph } from "./habit-frequency-bar-graph";

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
    const [showColorPicker, setShowColorPicker] = useState<boolean>(false);

    useEffect(() => {
      habitStore.getHabit(selectedHabitId).then(result => {
        setHabitColor(result.color);
        setHabitFrequency(result.frequency.toString());
      });
    }, [selectedHabitId]);

    const habitNameRef = useRef(null);

    const habit = habitStore.habit;

    const colorArray = [
      baseTheme.colors.mipBlue,
      baseTheme.colors.primary100,
      baseTheme.colors.dimPurple,
      baseTheme.colors.grey100,
      baseTheme.colors.yellowSea,
      baseTheme.colors.warningRed,
      baseTheme.colors.successGreen,
      baseTheme.colors.cavier,
    ];

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
          <ColorDisplayContainer>
            <SectionText> Color </SectionText>
            <ColorBox
              ml
              backgroundColor={habitColor}
              onClick={() => setShowColorPicker(!showColorPicker)}
            />
          </ColorDisplayContainer>
          {showColorPicker ? (
            <ColorPickerContainer
              onBlur={() => {
                setShowColorPicker(false);
              }}
            >
              <HeaderContainer>
                <SectionText>Change Color</SectionText>
                <CloseIconContainer onClick={() => setShowColorPicker(false)}>
                  <Icon icon={"Close"} size={"16px"} iconColor={"grey60"} />
                </CloseIconContainer>
              </HeaderContainer>
              <ColorsContainer>
                {colorArray.map((color, index) => (
                  <ColorOptionContainer key={index} onClick={() => {
                    setHabitColor(color);
                    habitStore.updateHabitField("color", color);
                    habitStore.updateCurrentHabit();
                    setShowColorPicker(false);
                  }}>
                    <ColorBox backgroundColor={color} />
                    {habitColor == color && (
                      <CheckMarkContainer>
                        <Icon icon={"Checkmark"} size={"20px"} iconColor={"white"} />
                      </CheckMarkContainer>
                    )}
                  </ColorOptionContainer>
                ))}
              </ColorsContainer>
            </ColorPickerContainer>
          ) : (
            <></>
          )}
        </ColorContainer>
        <OverviewContainer>
          <SectionText> Overview </SectionText>
          <OverviewDetailsContainer>
            <CircularProgressBarContainer>
              {habit.score == 0 ? (
                <HabitCircularProgressBar color={baseTheme.colors.greyInactive} value={100} />
              ) : (
                <HabitCircularProgressBar color={habit.color} value={habit.score} />
              )}
            </CircularProgressBarContainer>

            <ScoreContainer>
              <PercentageText color={habit.color}>{habit.score.toFixed(0)}%</PercentageText>
              <DescriptionText>Score</DescriptionText>
            </ScoreContainer>
            <ScoreContainer>
              <PercentageText color={habit.color}>
                {habit.monthlyScoreDifference >= 0 ? "+" : ""}
                {habit.monthlyScoreDifference.toFixed(0)}%
              </PercentageText>
              <DescriptionText>Month</DescriptionText>
            </ScoreContainer>
            <ScoreContainer>
              <PercentageText color={habit.color}>
                {habit.weeklyScoreDifference >= 0 ? "+" : ""}
                {habit.weeklyScoreDifference.toFixed(0)}%
              </PercentageText>
              <DescriptionText>Week</DescriptionText>
            </ScoreContainer>
          </OverviewDetailsContainer>
        </OverviewContainer>
        <HabitScoreLineChart
          habitId={habit.id}
          scoreDataForLineGraph={habit.scoreDataForLineGraph}
          color={habit.color}
        />
        <HabitFrequencyBarGraph
          habitId={habit.id}
          frequencyDataForBarGraph={habit.frequencyDataForBarGraph}
          color={habit.color}
        />
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
  overflow-y: auto;
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
  // display: flex;
  margin-top: 16px;
  position: relative;
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

const CircularProgressBarContainer = styled.div`
  margin-right: 5px;
`;

const BoldedDescriptionText = styled(Text)`
  font-weight: bold;
  font-size: 16px;
  margin-top: auto;
  margin-bottom: auto;
`;

type ColorBoxProps = {
  backgroundColor: string;
  ml?: boolean;
};

const ColorBox = styled.div<ColorBoxProps>`
  height: 30px;
  width: 30px;
  display: inline-block;
  border-radius: 4px;
  background-color: ${props => props.backgroundColor && props.backgroundColor};
  margin-left: ${props => (props.ml ? "18px" : "")};
  cursor: pointer;
`;

const ColorPickerContainer = styled.div`
  padding: 10px;
  border-radius: 4px;
  height: 100px;
  width: 145px;
  display: block;
  overflow: break;
  position: absolute;
  border: 1px solid ${props => props.theme.colors.greyActive};
  z-index: 20;
  background-color: ${props => props.theme.colors.white};
  margin-top: 10px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ColorDisplayContainer = styled.div`
  display: flex;
`;

const ColorsContainer = styled.div`
  & :nth-child(4) {
    margin-right: 0;
  }
  & :nth-child(8) {
    margin-right: 0;
  }
`;

const CloseIconContainer = styled.div`
  cursor: pointer;
`;

const CheckMarkContainer = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
`;

const ColorOptionContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-right: 8px;
`;
