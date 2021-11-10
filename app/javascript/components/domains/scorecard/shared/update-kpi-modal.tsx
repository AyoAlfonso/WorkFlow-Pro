import React, { useState,useRef, useEffect } from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useTranslation } from "react-i18next";
import { useMst } from "~/setup/root";
import { baseTheme } from "~/themes";
import { addDays, getISOWeek } from "date-fns";
import { getWeekOfDate, getMondayofDate } from "~/utils/date-time";
import {
  InputFromUnitType,
  ModalWithHeader,
  InputHeaderWithComment,
  SaveButton,
  StyledInput,
  FormContainer,
  FormElementContainer,
  RowContainer,
} from "./modal-elements";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";

interface MiniUpdateKPIModalProps {
  kpiId: number;
  ownedById: number;
  unitType: string;
  year: number;
  week: number;
  currentValue: number | undefined;
  headerText: string;
  setUpdateKPIModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateKPIModalOpen: boolean;
  setKpis: any;
  updateKPI?: any;
  setTargetWeek?: React.Dispatch<React.SetStateAction<number>>;
  setTargetValue?: React.Dispatch<React.SetStateAction<number>>;
}

export const MiniUpdateKPIModal = observer(
  ({
    kpiId,
    unitType,
    year,
    week,
    currentValue,
    headerText,
    setUpdateKPIModalOpen,
    updateKPIModalOpen,
    setKpis,
    setTargetWeek,
    setTargetValue,
  }: MiniUpdateKPIModalProps): JSX.Element => {
    const history = useHistory();
    const { keyPerformanceIndicatorStore, sessionStore, scorecardStore } = useMst();
    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
    const [value, setValue] = useState<number>(currentValue);
    const [selectedDueDate, setSelectedDueDate] = useState<any>(getMondayofDate(week, year));
    const [currentWeek, setCurrentWeek] = useState<number>(week);
    const [comment, setComment] = useState("");
    const { owner_type, owner_id } = useParams();
    const optionsRef = useRef(null)
//TODO: Optimize
    useEffect(() => {
      const handleClickOutside = event => {
        if (optionsRef.current && !optionsRef.current.contains(event.target)) {
           setShowAdvancedSettings(false);
         
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [optionsRef, selectedDueDate]);

    useEffect(() => {
      setSelectedDueDate(getMondayofDate(week, year))
    }, [showAdvancedSettings])

    const handleSave = () => {
      if (value != undefined) {
        const log = {
          keyPerformanceIndicatorId: kpiId,
          userId: sessionStore.profile.id,
          score: value,
          note: null,
          week: currentWeek,
          fiscalYear: year,
          fiscalQuarter: Math.floor((currentWeek - 1) / 13) + 1,
        };
        if (comment != "") {
          log.note = comment;
        }
        keyPerformanceIndicatorStore.createScorecardLog(log).then(() => {
          setUpdateKPIModalOpen(false);
          setTargetWeek(undefined);
          setTargetValue(undefined);
          setKpis(scorecardStore.kpis);
          history.push(`/scorecard/0/0`);
          setTimeout(history.push(`/scorecard/${owner_type}/${owner_id}`), 1000, 0);
        });
      }
    };

    const handleChange = e => {
      setValue(Number(e.target.value.replace(/[^0-9\.]+/g, "")));
    };
    const closeModal = () => {
        setUpdateKPIModalOpen(false)
        setShowAdvancedSettings(!showAdvancedSettings);
    }
    return (
      <ModalContainer
        header={headerText}
        isOpen={updateKPIModalOpen}
        setIsOpen={closeModal}
        headerFontSize={"21px"}
        ref={optionsRef}
      >
        <FormContainer>
          <FormElementContainer>
            <InputHeaderWithComment fontSize={"14px"}>New value</InputHeaderWithComment>
            <InputFromUnitType
              unitType={unitType}
              placeholder={"Add the new value..."}
              onChange={handleChange}
              defaultValue={currentValue}
            />
          </FormElementContainer>
          <FormElementContainer>
            <InputHeaderWithComment comment={"optional"} fontSize={"14px"} childFontSize={"12px"}>
              Comment
            </InputHeaderWithComment>
            <StyledInput
              placeholder={"Add a comment..."}
              onChange={e => {
                setComment(e.target.value);
              }}
            />
          </FormElementContainer>

          <AdvancedSettingsButton
            onClick={() => {
              setShowAdvancedSettings(!showAdvancedSettings);
              setSelectedDueDate(getMondayofDate(week, year))
            }}
          >
            Advanced Settings
          </AdvancedSettingsButton>
          {showAdvancedSettings && (
            
            <RowContainer>
              <FormElementContainer>
                <InputHeaderWithComment>Date </InputHeaderWithComment>
                <Calendar
                  showDateDisplay={true}
                  showMonthAndYearPickers={false}
                  showSelectionPreview={true}
                  direction={"vertical"}
                  calendarFocus={"backwards"}
                  minDate={addDays(selectedDueDate, -90)}
                  maxDate={selectedDueDate}
                  scroll={{
                    enabled: true,
                    calendarWidth: 320,
                    monthWidth: 320,
                  }}
                  color={baseTheme.colors.primary100}
                  rangeColors={[baseTheme.colors.primary100]}
                  date={selectedDueDate}
                  shownDate={selectedDueDate}
                  onChange={date => {
                    setSelectedDueDate(date);
                    setCurrentWeek(getWeekOfDate(date));
                  }}
                />
              </FormElementContainer>
              <FormElementContainer />
            </RowContainer>
          )}
          <FormElementContainer>
            <SaveButton onClick={handleSave}>Save</SaveButton>
          </FormElementContainer>
        </FormContainer>
     </ModalContainer>
    );
  },
);

const AdvancedSettingsButton = styled.div`
  font-size: 12px;
  margin-top: 16px;
  font-weight: bold;
  width: max-content;
  color: ${props => props.theme.colors.primary100};

  &:hover {
    cursor: pointer;
  }
`;

const ModalContainer = styled(ModalWithHeader)`
`;
