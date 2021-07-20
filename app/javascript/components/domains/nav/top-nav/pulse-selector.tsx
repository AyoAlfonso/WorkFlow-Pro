import { observer } from "mobx-react";
import * as R from "ramda";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import styled, { keyframes } from "styled-components";
import { Input } from "~/components/shared/input";
import { useMst } from "~/setup/root";
import { Heading, Button } from "~/components/shared";
import {
  emotionA,
  emotionB,
  emotionC,
  emotionD,
  emotionE,
} from "~/components/shared/pulse/pulse-icon";
import * as moment from "moment";
import { todaysDateFull } from "~/lib/date-helpers";
import { DailyRecordPicker } from "~/components/shared/daily-record-picker";

interface IPulseSelectorProps {
  onClick?: any;
}
export const PulseSelector = observer(
  ({ onClick }: IPulseSelectorProps): JSX.Element => {
    const { sessionStore, staticDataStore } = useMst();

    const { t } = useTranslation();
    const userPulse = R.path(["profile", "userPulseForDisplay"], sessionStore);

    const [showPulseSelector, setShowPulseSelector] = useState<boolean>(false);
    const [todaysEmotion, setTodaysEmotion] = useState<number>(0);
    const [selectedEmotion, setSelectedEmotion] = useState<number>(0);
    const [selectedAdjective, setSelectedAdjective] = useState<string>("");
    const [typedAdjective, setTypedAdjective] = useState<string>("");
    const [showCalendar, setShowCalendar] = useState<boolean>(false);
    const [selectedDateFilter, setSelectedDateFilter] = useState<string>(todaysDateFull);
    const [attention, setAttention] = useState<boolean>(true);

    const selectorRef = useRef(null);

    useEffect(() => {
      if (userPulse) {
        setSelectedEmotion(userPulse.score);
        setTodaysEmotion(userPulse.score);
        staticDataStore
          .filteredEmotionAdjectives(userPulse.score)
          .find(option => option == userPulse.feeling)
          ? setSelectedAdjective(userPulse.feeling)
          : setTypedAdjective(userPulse.feeling);
      } else {
        setSelectedEmotion(0);
        setSelectedAdjective("");
        setTypedAdjective("");
      }

      const handleClickOutside = event => {
        if (selectorRef.current && !selectorRef.current.contains(event.target)) {
          getPulseByDate(todaysDateFull);
          setSelectedDateFilter(todaysDateFull);
          setShowPulseSelector(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [selectorRef, userPulse]);

    const renderAdjectiveOptions = () => {
      return R.slice(0, 9, staticDataStore.filteredEmotionAdjectives(selectedEmotion)).map(
        (option, index) => {
          return (
            <AdjectiveOption
              key={index}
              selected={option == selectedAdjective}
              onClick={() => {
                setTypedAdjective("");
                setSelectedAdjective(option);
              }}
            >
              {option}
            </AdjectiveOption>
          );
        },
      );
    };

    const renderTodaysEmotion = () => {
      switch (todaysEmotion) {
        case 1:
          return emotionE(true, 32);
        case 2:
          return emotionD(true, 32);
        case 3:
          return emotionC(true, 32);
        case 4:
          return emotionB(true, 32);
        case 5:
          return emotionA(true, 32);
        default:
          return (
            <div style={{ position: "relative" }} onClick={() => setAttention(false)}>
              {emotionC(attention, 32)}
              {attention && <NotificationBadge/>}
            </div>
          );
      }
    };

    const onPulseSave = () => {
      if (selectedDateFilter == todaysDateFull) {
        setTodaysEmotion(selectedEmotion);
      }

      sessionStore
        .updateUserPulse({
          id: userPulse ? userPulse.id : "",
          score: selectedEmotion,
          feeling: selectedAdjective || typedAdjective,
          completedAt: selectedDateFilter == todaysDateFull ? moment() : selectedDateFilter,
        })
        .then(() => {
          setSelectedDateFilter(todaysDateFull);
          setShowPulseSelector(false);
        });
    };

    const getPulseByDate = filter => {
      setSelectedDateFilter(filter);
      sessionStore.getUserPulseByDate(filter);
    };

    return (
      <Container onClick={() => onClick && onClick()}>
        <SelectedEmotionContainer onClick={() => setShowPulseSelector(!showPulseSelector)}>
          {renderTodaysEmotion()}
        </SelectedEmotionContainer>
        {showPulseSelector && (
          <PulseSelectorContainer ref={selectorRef}>
            <DailyRecordPicker
              showCalendar={showCalendar}
              setShowCalendar={setShowCalendar}
              selectedDateFilter={selectedDateFilter}
              setSelectedDateFilter={setSelectedDateFilter}
              retrieveData={getPulseByDate}
            />
            <ContentsContainer>
              <FeelingHeader type={"h4"}>
                How are you feeling, {sessionStore.profile.firstName}?
              </FeelingHeader>
              <EmotionSelectionContainer>
                <EmotionContainer onClick={() => setSelectedEmotion(1)}>
                  {emotionE(selectedEmotion == 1, 32)}
                </EmotionContainer>
                <EmotionContainer onClick={() => setSelectedEmotion(2)}>
                  {emotionD(selectedEmotion == 2, 32)}
                </EmotionContainer>
                <EmotionContainer onClick={() => setSelectedEmotion(4)}>
                  {emotionB(selectedEmotion == 4, 32)}
                </EmotionContainer>
                <EmotionContainer onClick={() => setSelectedEmotion(5)}>
                  {emotionA(selectedEmotion == 5, 32)}
                </EmotionContainer>
              </EmotionSelectionContainer>
              {selectedEmotion != 0 && (
                <>
                  <AdjectiveOptionsContainer>{renderAdjectiveOptions()}</AdjectiveOptionsContainer>
                  <InputAdjectiveContainer>
                    <Input
                      name="adjective"
                      onChange={e => {
                        setSelectedAdjective("");
                        setTypedAdjective(e.target.value);
                      }}
                      value={typedAdjective}
                    />
                  </InputAdjectiveContainer>
                </>
              )}
              <SaveButtonContainer>
                <Button
                  small
                  variant={"primary"}
                  onClick={() => onPulseSave()}
                  disabled={selectedEmotion == 0}
                >
                  {t("general.save")}
                </Button>
              </SaveButtonContainer>
            </ContentsContainer>
          </PulseSelectorContainer>
        )}
      </Container>
    );
  },
);

const Container = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 20px;
  color: ${props => props.theme.colors.grey60};
`;

const ContentsContainer = styled.div`
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 12px;
  padding-bottom: 12px;
`;

const PulseSelectorContainer = styled.div`
  z-index: 2;
  position: absolute;
  width: 274px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  margin-left: -250px;
  margin-top: 20px;
`;

const FeelingHeader = styled(Heading)`
  color: black;
`;

const EmotionSelectionContainer = styled.div`
  display: flex;
  margin-left: -19px;
`;

const SelectedEmotionContainer = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const EmotionContainer = styled.div`
  margin-left: 19px;
  margin-right: 19px;
  &:hover {
    cursor: pointer;
  }
`;

const AdjectiveOptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 24px;
`;

type AdjectiveOptionsProps = {
  selected: boolean;
};

const AdjectiveOption = styled.div<AdjectiveOptionsProps>`
  background-color: ${props =>
    props.selected ? props.theme.colors.mipBlue : props.theme.colors.primary100};
  border-radius: 8px;
  color: white;
  padding: 4px;
  margin-bottom: 12px;
  font-weight: bold;
  font-size: 12px;
  margin-right: 8px;
  &:hover {
    cursor: pointer;
  }
`;

const InputAdjectiveContainer = styled.div``;

const SaveButtonContainer = styled.div`
  margin-top: 16px;
`;

const PulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
  }
  100% {
    box-shadow: 0 0 0 8px rgba(0, 0, 0, 0);
  }
`

const NotificationBadge = styled.span`
  background-color: ${props => props.theme.colors.primary100};
  border-radius: 50%;
  width: 10px;
  height: 10px;
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%,-50%);
  animation: ${PulseAnimation} 2s infinite;
`
