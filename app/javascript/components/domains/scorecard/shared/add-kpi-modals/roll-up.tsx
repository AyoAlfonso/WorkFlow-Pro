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
  StyledInput,
} from "./styled-components";

interface IRollUpProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  KPIs: any[];
  kpiModalType: string;
}
export const RollUp = observer(
  ({ KPIs, setModalOpen, kpiModalType }: IRollUpProps): JSX.Element => {
    const [selectedKPIs, setSelectedKPIs] = useState([]);
    const [filteredKPIs, setfilteredKPIs] = useState(KPIs);
    function groupBy(objectArray, property) {
      return objectArray.reduce(function(acc, obj) {
        const key = obj[property];
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
      <StyledRollUpModal>
        <StyledSource>
          <KPIModalHeader
            setModalOpen={setModalOpen}
            selectedKPIs={selectedKPIs}
            kpiModalType={kpiModalType}
            removeTagInput={removeTagInput}
          />
        </StyledSource>

        <StyledSecondLayer>
          <StyledLayerOne>
            <StyledLayerText>
              <StyledLayerPara>
                Rollup two or more relevant KPI's to create a new KPI. The new KPI will sum the
                values of selcted KPIs to calculate the new value. Start by selecting a unit.
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
      </StyledRollUpModal>
    );
  },
);

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
const StyledCheckboxInput = styled.input.attrs(props => ({
  type: props.type,
  id: props.id,
  name: props.name,
}))`
  -webkit-appearance: button;
  margin-right: 1.5rem;
  display: none;
`;

export default RollUp;
