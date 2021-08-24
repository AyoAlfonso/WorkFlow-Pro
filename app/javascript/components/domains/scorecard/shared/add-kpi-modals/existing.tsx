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
  StyledLabel,
  StyledCheckboxInput,
  StyledInput,
} from "./styled-components";

interface IExistingProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  KPIs: any[];
  kpiModalType: string;
}

export const Existing = observer(
  ({ KPIs, setModalOpen, kpiModalType }: IExistingProps): JSX.Element => {
    const [selectedKPIs, setSelectedKPIs] = useState([]);
    const [filteredKPIs, setfilteredKPIs] = useState(KPIs);
    function groupBy(objectArray, property) {
      return objectArray.reduce(function(acc, obj) {
        let key = obj[property];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
    }
    const onSearchKeyword = e => {
      const keyword = e.target.value.toLowerCase();
      setfilteredKPIs(
        KPIs.filter(
          kpi =>
            kpi.description?.toLowerCase().includes(keyword) ||
            kpi.title?.toLowerCase().includes(keyword),
        ),
      );
    };
    const selectKPI = kpi => {
      const duplicate = selectedKPIs.find(selectedKPI => selectedKPI.id == kpi.id);
      if (!duplicate) setSelectedKPIs([...selectedKPIs, kpi]);
    };
    const removeTagInput = id => {
      setSelectedKPIs(selectedKPIs.filter(kpi => kpi.id != id));
    };

    const renderKPIListContent = (filteredKPIs): Array<JSX.Element> => {
      const groupedKPIs = groupBy(filteredKPIs, "unitType");
      return Object.keys(groupedKPIs).map(function(unitTypeKey, key) {
        return (
          <UserKPIList key={key}>
            <StyledCheckTitle>{unitTypeKey}</StyledCheckTitle>
            {groupedKPIs[unitTypeKey].map((kpi, key) => {
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
                    <StlyedCheckMark></StlyedCheckMark>
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
      <StyledExistingModal>
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
                Add an existing KPI to this scorecard. Start by selecting the unit and then the
                specific KPI on the right hand side. You can only select one.
              </StyledLayerPara>
              <StyledOptionToggle>
                <StyledNumerical>
                  <StyledCurrencyIcon>#</StyledCurrencyIcon>
                  <StyledNum>Numerical</StyledNum>
                </StyledNumerical>

                <StyledNumerical>
                  <StyledCurrencyIcon>$</StyledCurrencyIcon>
                  <StyledNum>Currency</StyledNum>
                </StyledNumerical>

                <StyledNumerical>
                  <StyledCurrencyIcon>%</StyledCurrencyIcon>
                  <StyledNum>Currency</StyledNum>
                </StyledNumerical>
              </StyledOptionToggle>
            </StyledLayerText>

            <StyledNextButton>
              <StyledNext>Next</StyledNext>
            </StyledNextButton>
          </StyledLayerOne>

          <StyledLayerTwo>
            <StyledLayerDiv>
              <StyledInput type="text" placeholder="Search KPIs" onChange={onSearchKeyword} />
            </StyledLayerDiv>
            {renderKPIListContent(filteredKPIs)}
          </StyledLayerTwo>
        </StyledSecondLayer>
      </StyledExistingModal>
    );
  },
);

const StyledExistingModal = styled.div`
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

const StyledSource = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  border-bottom: 1px solid #ccc;

  @media only screen and (min-width: 280px) and (max-width: 767px) {
    width: 100%;
    display: flex;
    align-items: center;
  }
`;

const StyledHeader = styled.div`
  background-color: #f8f8f9;
  padding: 0rem 1rem;
  border-top-left-radius: 10px;
`;

const StyledSelectionBox = styled.div`
  background-color: #ffffff;
  display: grid;
  grid-template-columns: 11fr 1fr;
  height: 100%;
  align-items: center;
  padding: 0rem 1.2rem;
  border-top-right-radius: 10px;

  @media only screen and (min-width: 280px) and (max-width: 767px) {
    padding: 0.7em 0.3rem;
    width: 100%;
  }
`;

const StyledSubHeader = styled.h3`
  color: #000;
`;
const StyledOperationBox = styled.div`
  display: flex;
  gap: 0.5rem;
  height: 100%;
  align-items: center;
`;

const StyledOperation = styled.span`
  border: 1px solid #1065f6;
  color: #1065f6;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  font-size: 0.8rem;
  display: flex;
  height: 1.5rem;
  align-items: center;
`;

const StyledOperationClose = styled.span`
  font-size: 1rem;
  color: #cdd1dd;
  font-weight: 600;
  margin-left: 0.2rem;
  display: flex;
  height: 1.5rem;
  align-items: center;
`;

const StyledClose = styled.div`
  justify-self: right;
`;

const StyledCloseSpan = styled.span`
  font-size: 2rem;
  color: #cdd1dd;
  font-weight: 600;

  @media only screen and (min-width: 280px) and (max-width: 767px) {
    padding: 0 0.5rem;
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
    padding: 1rem 2rem;
    margin: 0.8rem auto;
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

const StyledNumerical = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.3rem;
  padding: 0.5rem 1rem;
  align-items: center;
  font-size: 0.8rem;

  :hover {
    background-color: #dbdbdf;
  }
  :active {
    background-color: #dbdbdf;
  }
`;

const StyledNum = styled.div`
  font-size: 0.8rem;
`;

const StyledCurrencyIcon = styled.div`
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  background-color: #075df6;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledNextButton = styled.div`
  align-self: flex-end;
  padding: 1rem 1rem;
  @media only screen and (min-width: 280px) and (max-width: 767px) {
    align-self: flex-start;
    padding: 1rem 1rem;
  }
`;

const StyledNext = styled.button`
  border: none;
  background-color: #075df6;
  color: #ffffff;
  padding: 0.4rem 1rem;
  border-radius: 5px;
`;

const StyledList = styled.div`
  color: #000;
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

export default Existing;
