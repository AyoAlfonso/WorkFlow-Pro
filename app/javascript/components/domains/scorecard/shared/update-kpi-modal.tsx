import React, { useState, useRef, useEffect } from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useTranslation } from "react-i18next";
import { useMst } from "~/setup/root";
import { DueDateSelector } from "~/components/shared/scorecards/date-selector";
import { findNextMonday, resetYearOfDateToCurrent } from "~/utils/date-time";
import moment from "moment";

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
  fiscalYearStart?: string;
  currentValue: number | undefined;
  headerText: string;
  setUpdateKPIModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateKPIModalOpen: boolean;
  setKpis: any;
  updateKPI?: any;
  setTargetWeek?: React.Dispatch<React.SetStateAction<number>>;
  setTargetValue?: React.Dispatch<React.SetStateAction<number>>;
  current: boolean;
}

export const MiniUpdateKPIModal = observer(
  ({
    kpiId,
    unitType,
    year,
    week,
    fiscalYearStart,
    currentValue,
    headerText,
    setUpdateKPIModalOpen,
    updateKPIModalOpen,
    setKpis,
    setTargetWeek,
    setTargetValue,
    current,
  }: MiniUpdateKPIModalProps): JSX.Element => {
    const history = useHistory();
    const {
      companyStore: { company },
    } = useMst();

    const weekToDate = (week: number, year: number, weekOffset = 1) =>
      moment(findNextMonday(resetYearOfDateToCurrent(fiscalYearStart, year)))
        .add(week, "w")
        .startOf("week" as moment.unitOfTime.StartOf)
        .toDate();

    const { keyPerformanceIndicatorStore, sessionStore, scorecardStore } = useMst();
    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
    const [value, setValue] = useState<number>(currentValue);
    const [selectedDueDate, setSelectedDueDate] = useState<any>(new Date());
    const [currentWeek, setCurrentWeek] = useState<number>(week);
    const [comment, setComment] = useState("");
    const { owner_type, owner_id } = useParams();
    const optionsRef = useRef(null);
    //TODO: Optimize
    useEffect(() => {
      const handleClickOutside = event => {
        if (optionsRef.current && !optionsRef.current.contains(event.target)) {
          setShowAdvancedSettings(false);
          clearData();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [optionsRef, selectedDueDate]);

    useEffect(() => {
      setSelectedDueDate(new Date());
    }, [showAdvancedSettings]);

    const setDefaultSelectionQuarter = week => {
      return week <= 13 ? 1 : week <= 26 ? 2 : week <= 39 ? 3 : 4;
    };

    const createGoalYearString =
      company.currentFiscalYear == company.yearForCreatingAnnualInitiatives
        ? `FY${company.yearForCreatingAnnualInitiatives.toString().slice(-2)}`
        : `FY${(company.currentFiscalYear - 1)
            .toString()
            .slice(-2)}/${company.currentFiscalYear.toString().slice(-2)}`;
    const handleSave = () => {
      if (value != undefined) {
        const log = {
          keyPerformanceIndicatorId: kpiId,
          userId: sessionStore.profile.id,
          score: value,
          note: null,
          week: currentWeek,
          fiscalYear: year,
          fiscalQuarter:
            setDefaultSelectionQuarter(currentWeek) || Math.round((currentWeek - 1) / 13) + 1,
        };
        if (comment != "") {
          log.note = comment;
        }
        localStorage.setItem(
          "cacheDropdownQuarter",
          setDefaultSelectionQuarter(currentWeek) +
            "_" +
            createGoalYearString +
            "_" +
            company.yearForCreatingAnnualInitiatives.toString(),
        );
        keyPerformanceIndicatorStore.createScorecardLog(log).then(() => {
          setUpdateKPIModalOpen(false);
          clearData();
          setKpis(scorecardStore.kpis);
          history.push(`/scorecard/0/0`);
          setTimeout(history.push(`/scorecard/${owner_type}/${owner_id}`), 1000, 0);
        });
      }
    };

    const handleChange = e => {
      setValue(Number(e.target.value.replace(/[^0-9.-]+/g, "")));
    };

    const closeModal = () => {
      setUpdateKPIModalOpen(false);
      setShowAdvancedSettings(false);
      clearData();
    };
    const clearData = () => {
      typeof setTargetWeek === "function" ? setTargetWeek(undefined) : null;
      typeof setTargetValue === "function" ? setTargetValue(undefined) : null;
    };
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
            <InputHeaderWithComment margin={"4px 0px"} fontSize={"14px"}>
              New values
            </InputHeaderWithComment>
            <InputFromUnitType
              unitType={unitType}
              placeholder={"Add the new value..."}
              onChange={handleChange}
              defaultValue={currentValue}
            />
          </FormElementContainer>
          <FormElementContainer>
            <InputHeaderWithComment
              margin={"4px 0px"}
              comment={"optional"}
              fontSize={"14px"}
              childFontSize={"12px"}
            >
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
              setSelectedDueDate(new Date());
            }}
          >
            Advanced Settings
          </AdvancedSettingsButton>
          {showAdvancedSettings && (
            <RowContainer>
              <FormElementContainer>
                <InputHeaderWithComment margin={"4px 0px"}>Date </InputHeaderWithComment>

                <DueDateSelector
                  selectedDueDate={selectedDueDate}
                  setSelectedDueDate={setSelectedDueDate}
                  setCurrentWeek={setCurrentWeek}
                  maxDate={
                    current || week == company.currentFiscalWeek
                      ? new Date()
                      : weekToDate(week, year)
                  }
                  fiscalYearStart={resetYearOfDateToCurrent(fiscalYearStart, year)}
                />
              </FormElementContainer>
              <FormElementContainer />
            </RowContainer>
          )}
          <FormElementContainer gap={"0"}>
            <SaveButton onClick={handleSave}>Save</SaveButton>
          </FormElementContainer>
        </FormContainer>
      </ModalContainer>
    );
  },
);

const AdvancedSettingsButton = styled.div`
  font-size: 12px;
  margin: 0px;
  font-weight: bold;
  width: max-content;
  color: ${props => props.theme.colors.primary100};

  &:hover {
    cursor: pointer;
  }
`;

const ModalContainer = styled(ModalWithHeader)``;
