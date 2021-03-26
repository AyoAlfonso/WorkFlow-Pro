import { observer } from "mobx-react";
import * as R from "ramda";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Input } from "~/components/shared/input";
import { useMst } from "~/setup/root";
import { Heading, Button, Text } from "~/components/shared";
import {
  emotionA,
  emotionB,
  emotionC,
  emotionD,
  emotionE,
} from "~/components/shared/pulse/pulse-icon";
import * as moment from "moment";

interface IPulseSelectorProps {}

export const PulseSelector = observer(
  ({}: IPulseSelectorProps): JSX.Element => {
    const { sessionStore, staticDataStore } = useMst();

    const { t } = useTranslation();
    const userPulse = R.path(["profile", "userPulseForDisplay"], sessionStore);

    console.log("user pulse", userPulse);

    const [pulseSelectorOpen, setPulseSelectorOpen] = useState<boolean>(false);
    const [selectedEmotion, setSelectedEmotion] = useState<number>(0);
    const [selectedAdjective, setSelectedAdjective] = useState<string>("");
    const [typedAdjective, setTypedAdjective] = useState<string>("");
    const [selectedDateFilter, setSelectedDateFilter] = useState<string>("Today"); //Today, Yesterday, CalendarDate

    const selectorRef = useRef(null);

    useEffect(() => {
      console.log("hits the ue");

      if (userPulse) {
        setSelectedEmotion(userPulse.score);
        staticDataStore
          .filteredEmotionAdjectives(userPulse.score)
          .find(option => option == userPulse.feeling)
          ? setSelectedAdjective(userPulse.feeling)
          : setTypedAdjective(userPulse.feeling);
      }

      const handleClickOutside = event => {
        if (selectorRef.current && !selectorRef.current.contains(event.target)) {
          getPulseByDate("Today");
          setSelectedDateFilter("Today");
          setPulseSelectorOpen(false);
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

    const renderSelectedEmotion = () => {
      switch (selectedEmotion) {
        case 1:
          return emotionE(true);
        case 2:
          return emotionD(true);
        case 3:
          return emotionC(true);
        case 4:
          return emotionB(true);
        case 5:
          return emotionA(true);
        default:
          return emotionC(true);
      }
    };

    const onPulseSave = () => {
      sessionStore
        .updateUserPulse({
          id: userPulse ? userPulse.id : "",
          score: selectedEmotion,
          feeling: selectedAdjective || typedAdjective,
          completedAt: selectedDateFilter == "Today" && moment(),
        })
        .then(() => {
          setSelectedDateFilter("Today");
          setPulseSelectorOpen(false);
        });
    };

    const getPulseByDate = filter => {
      setSelectedDateFilter(filter);
      sessionStore.getUserPulseByDate(filter);
    };

    return (
      <Container>
        <SelectedEmotionContainer onClick={() => setPulseSelectorOpen(!pulseSelectorOpen)}>
          {renderSelectedEmotion()}
        </SelectedEmotionContainer>
        {pulseSelectorOpen && (
          <PulseSelectorContainer ref={selectorRef}>
            <ContentsContainer>
              <FilterContainer>
                <FilterWrapper>
                  <FilterText
                    onClick={() => getPulseByDate("Today")}
                    selected={selectedDateFilter == "Today"}
                  >
                    Today
                  </FilterText>
                  <FilterText
                    onClick={() => getPulseByDate("Yesterday")}
                    selected={selectedDateFilter == "Yesterday"}
                  >
                    Yesterday
                  </FilterText>
                </FilterWrapper>
              </FilterContainer>
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
`;

const FilterContainer = styled.div`
  display: flex;
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
    props.selected ? props.theme.colors.mipBlue : props.theme.colors.greyInactive};
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

type FilterTextProps = {
  selected: boolean;
};

const FilterWrapper = styled.div`
  margin-left: auto;
  display: flex;
`;

const FilterText = styled(Text)<FilterTextProps>`
  font-size: 11px;
  color: ${props => props.selected && props.theme.colors.primary100};
  margin-left: 8px;
  margin-top: 0;
  margin-bottom: 0;
  &:hover {
    cursor: pointer;
  }
`;
