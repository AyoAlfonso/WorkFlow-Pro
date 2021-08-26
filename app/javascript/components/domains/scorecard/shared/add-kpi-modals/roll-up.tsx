import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { KPIModalHeader } from "./header";
import {
  StyledLayerTwo,
  UserKPIList,
  StyledCheckboxWrapper,
  StyledSecondLayer,
  StyledLayerOne,
  StyledItemSpan,
  StlyedCheckMark,
  StyledCheckboxInput,
  StyledLabel,
  StyledInput,
} from "./styled-components";
import { SaveButton } from "../modal-elements";

interface IRollUpProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  KPIs: any[];
  kpiModalType: string;
  setExternalManualKPIData: React.Dispatch<React.SetStateAction<any>>;
}
export const RollUp = observer(
  ({ KPIs, setModalOpen, kpiModalType, setExternalManualKPIData }: IRollUpProps): JSX.Element => {
    const [selectedKPIs, setSelectedKPIs] = useState([]);
    const [filteredKPIs, setfilteredKPIs] = useState(KPIs);
    const [unitType, setUnitType] = useState("numerical");

    useEffect(() => {
      setfilteredKPIs(filterBasedOnUnitType(KPIs));
    }, [unitType]);

    const groupBy = objectArray => {
      return objectArray.reduce(function(acc, obj) {
        const key = `${obj["ownedBy"]["firstName"]} ` + ` ${obj["ownedBy"]["lastName"]}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
    };
    const onSearchKeyword = e => {
      const keyword = e.target.value.toLowerCase();
      setfilteredKPIs(
        filterBasedOnUnitType(
          KPIs.filter(
            kpi =>
              kpi.description?.toLowerCase().includes(keyword) ||
              kpi.title?.toLowerCase().includes(keyword),
          ),
        ),
      );
    };
    const filterBasedOnUnitType = array => {
      return array.filter(kpi => kpi.unitType == unitType);
    };

    const selectKPI = kpi => {
      const duplicateIndex = selectedKPIs.findIndex(selectedKPI => selectedKPI.id == kpi.id);
      if (duplicateIndex > -1) {
        const slicedArray = selectedKPIs.slice();
        slicedArray.splice(duplicateIndex, 1);
        setSelectedKPIs(slicedArray);
      } else {
        setSelectedKPIs([...selectedKPIs, kpi]);
      }
    };
    const removeTagInput = id => {
      setSelectedKPIs(selectedKPIs.filter(kpi => kpi.id != id));
    };

    const handleSaveToManual = () => {
      setExternalManualKPIData({
        selectedKPIs,
        unitType,
        targetValue: selectedKPIs.reduce((a, b) => a + (b["targetValue"] || 0), 0),
        kpiModalType,
      });
    };
    const toggleUnitType = type => {
      setSelectedKPIs([]);
      setUnitType(type);
    };
    const renderKPIListContent = (filteredKPIs): Array<JSX.Element> => {
      const groupedKPIs = groupBy(filteredKPIs);
      return Object.keys(groupedKPIs).map(function(ownerKey, key) {
        return (
          <UserKPIList key={key}>
            <StyledCheckTitle>{ownerKey}</StyledCheckTitle>
            {groupedKPIs[ownerKey].map((kpi, key) => {
              return (
                <StyledCheckboxWrapper>
                  <StyledLabel>
                    <StyledCheckboxInput
                      type="checkbox"
                      id={key}
                      key={key}
                      onClick={() => {
                        selectKPI(kpi);
                      }}
                    ></StyledCheckboxInput>
                    <StlyedCheckMark
                      selected={!!selectedKPIs.find(selectedKPI => selectedKPI.id == kpi.id)}
                    ></StlyedCheckMark>
                    <StyledItemSpan>{kpi.title}</StyledItemSpan>
                  </StyledLabel>
                </StyledCheckboxWrapper>
              );
            })}
          </UserKPIList>
        );
      });
    };
    return (
      <StyledRollUpModal>
        <KPIModalHeader
          setModalOpen={setModalOpen}
          selectedKPIs={selectedKPIs}
          kpiModalType={kpiModalType}
          removeTagInput={removeTagInput}
        />

        <StyledSecondLayer>
          <StyledLayerOne>
            <StyledLayerText>
              <StyledLayerPara>
                Rollup two or more relevant KPI's to create a new KPI. The new KPI will sum the
                values of selcted KPIs to calculate the new value. Start by selecting a unit.
              </StyledLayerPara>
              <StyledOptionToggle>
                <StyledDataTypeContainer
                  selected={unitType == "numerical"}
                  onClick={() => {
                    toggleUnitType("numerical");
                  }}
                >
                  <StyledDataTypeIcon>#</StyledDataTypeIcon>
                  <StyledDataTypeContent>Numerical</StyledDataTypeContent>
                </StyledDataTypeContainer>

                <StyledDataTypeContainer
                  selected={unitType == "currency"}
                  onClick={() => {
                    toggleUnitType("currency");
                  }}
                >
                  <StyledDataTypeIcon>$</StyledDataTypeIcon>
                  <StyledDataTypeContent>Currency</StyledDataTypeContent>
                </StyledDataTypeContainer>
              </StyledOptionToggle>
            </StyledLayerText>

            <StyledNextButton>
              <SaveButton onClick={handleSaveToManual}>Next</SaveButton>
            </StyledNextButton>
          </StyledLayerOne>
          <StyledLayerTwo>
            <StyledLayerDiv>
              <StyledInput type="text" placeholder="Search KPIs" onChange={onSearchKeyword} />
            </StyledLayerDiv>
            {renderKPIListContent(filteredKPIs)}
          </StyledLayerTwo>
        </StyledSecondLayer>
      </StyledRollUpModal>
    );
  },
);

const StyledDataTypeContent = styled.div`
  font-size: 0.8rem;
`;

const StyledDataTypeIcon = styled.div`
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  background-color: #075df6;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type StyledDataTypeContainerProps = {
  selected: boolean;
  onClick: any;
};

const StyledDataTypeContainer = styled.div<StyledDataTypeContainerProps>`
  display: flex;
  gap: 1rem;
  margin-top: 0.3rem;
  padding: 0.5rem 1rem;
  align-items: center;
  font-size: 0.8rem;
  background-color: ${props => (props.selected ? "#dbdbdf" : "")};

  :hover {
    background-color: #dbdbdf;
  }
  :active {
    background-color: #dbdbdf;
  }
`;

const StyledRollUpModal = styled.div`
  width: 60%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #ccc;
  max-height: 700px;
  border-radius: 10px;

  @media only screen and (min-width: 280px) and (max-width: 767px) {
    width: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    border: 1px solid #ccc;
    transform: translate(-50%, -50%);
  }
`;

const StyledLayerText = styled.div`
  color: #000;
`;

const StyledLayerPara = styled.p`
  font-size: 0.8rem;
  margin: 0;
  padding: 1rem 1rem;

  @media only screen and (min-width: 280px) and (max-width: 767px) {
    text-align: center;
    font-size: 1rem;
  }
`;

const StyledOptionToggle = styled.div`
  @media only screen and (min-width: 280px) and (max-width: 767px) {
    display: flex;
    overflow-x: scroll;
    width: 100%;
    margin: 0 auto;
  }
`;

const StyledNextButton = styled.div`
  align-self: flex-end;
  padding: 1rem 1rem;
  @media only screen and (min-width: 280px) and (max-width: 767px) {
    align-self: flex-start;
    padding: 1rem 1rem;
  }
`;

const StyledCheckTitle = styled.p`
  font-size: 0.9rem;
  color: #a5a9c0;
  font-weight: 400;
  margin: 1.7rem 0rem;
`;

const StyledLayerDiv = styled.div`
  color: #000;
`;

export default RollUp;
