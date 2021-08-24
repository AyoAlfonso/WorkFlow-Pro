import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { KPIModalHeader } from "./header";

//repeated ofteen TODO:
interface IAverage {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  KPIs: any[];
  kpiModalType: string;
}

export const Average = observer(
  ({ KPIs, kpiModalType, setModalOpen }: IAverage): JSX.Element => {
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
      <StyledAverage>
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
                Average two or more relevant KPIs to create a new KPI. Start by selecting a unit.
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
              <StyledInput type="text" placeholder="Search KPIs" />
            </StyledLayerDiv>
            <StyledList>
              <StyledCheckTitle>OPERATIONS</StyledCheckTitle>

              <StyledCheckboxWrapper>
                <StyledLabel htmlFor="operation-01">
                  <StyledCheckboxInput type="checkbox" id="operation-01" name="operation-01" />
                  <StlyedCheckMark></StlyedCheckMark>
                  <StyledItemSpan>Pyns Completed (Total)</StyledItemSpan>
                </StyledLabel>

                <StyledLabel htmlFor="operation-02">
                  <StyledCheckboxInput type="checkbox" id="operation-02" name="operation-02" />
                  <StlyedCheckMark></StlyedCheckMark>
                  <StyledItemSpan>Pyns Completed (Percentage)</StyledItemSpan>
                </StyledLabel>
              </StyledCheckboxWrapper>
            </StyledList>

            <StyledList>
              <StyledCheckTitle>DOUG BEGINNER</StyledCheckTitle>

              <StyledCheckboxWrapper>
                <StyledLabel htmlFor="operation-04">
                  <StyledCheckboxInput type="checkbox" id="operation-01" name="operation-01" />
                  <StlyedCheckMark></StlyedCheckMark>
                  <StyledItemSpan>Clickthrough rate</StyledItemSpan>
                </StyledLabel>

                <StyledLabel htmlFor="operation-05">
                  <StyledCheckboxInput type="checkbox" id="operation-02" name="operation-02" />
                  <StlyedCheckMark></StlyedCheckMark>
                  <StyledItemSpan>Cost per Lead</StyledItemSpan>
                </StyledLabel>

                <StyledLabel htmlFor="operation-06">
                  <StyledCheckboxInput type="checkbox" id="operation-02" name="operation-02" />
                  <StlyedCheckMark></StlyedCheckMark>
                  <StyledItemSpan>Deals Closed</StyledItemSpan>
                </StyledLabel>
              </StyledCheckboxWrapper>
            </StyledList>

            <StyledList>
              <StyledCheckTitle>SALES TEAM</StyledCheckTitle>

              <StyledCheckboxWrapper>
                <StyledLabel htmlFor="operation-14">
                  <StyledCheckboxInput type="checkbox" id="operation-01" name="operation-01" />
                  <StlyedCheckMark></StlyedCheckMark>
                  <StyledItemSpan>Deals closed</StyledItemSpan>
                </StyledLabel>

                <StyledLabel htmlFor="operation-15">
                  <StyledCheckboxInput type="checkbox" id="operation-02" name="operation-02" />
                  <StlyedCheckMark></StlyedCheckMark>
                  <StyledItemSpan>SQLs</StyledItemSpan>
                </StyledLabel>

                <StyledLabel htmlFor="operation-16">
                  <StyledCheckboxInput type="checkbox" id="operation-02" name="operation-02" />
                  <StlyedCheckMark></StlyedCheckMark>
                  <StyledItemSpan>Average time to close</StyledItemSpan>
                </StyledLabel>
              </StyledCheckboxWrapper>
            </StyledList>

            <StyledList>
              <StyledCheckTitle>DOUG BEGINNER</StyledCheckTitle>

              <StyledCheckboxWrapper>
                <StyledLabel htmlFor="operation-08">
                  <StyledCheckboxInput type="checkbox" id="operation-01" name="operation-01" />
                  <StlyedCheckMark></StlyedCheckMark>
                  <StyledItemSpan>Clickthrough rate</StyledItemSpan>
                </StyledLabel>

                <StyledLabel htmlFor="operation-09">
                  <StyledCheckboxInput type="checkbox" id="operation-02" name="operation-02" />
                  <StlyedCheckMark></StlyedCheckMark>
                  <StyledItemSpan>Cost per Lead</StyledItemSpan>
                </StyledLabel>

                <StyledLabel htmlFor="operation-10">
                  <StyledCheckboxInput type="checkbox" id="operation-02" name="operation-02" />
                  <StlyedCheckMark></StlyedCheckMark>
                  <StyledItemSpan>Deals Closed</StyledItemSpan>
                </StyledLabel>
              </StyledCheckboxWrapper>
            </StyledList>

            <StyledList>
              <StyledCheckTitle>STRATEGY EXECUTION</StyledCheckTitle>

              <StyledCheckboxWrapper>
                <StyledLabel htmlFor="strategy-01">
                  <StyledCheckboxInput type="checkbox" id="strategy-01" name="strategy-01" />
                  <StlyedCheckMark></StlyedCheckMark>
                  <StyledItemSpan>Initiatives on Track (Percentage)</StyledItemSpan>
                </StyledLabel>
              </StyledCheckboxWrapper>
            </StyledList>
          </StyledLayerTwo>
        </StyledSecondLayer>
      </StyledAverage>
    );
  },
);

const StyledAverage = styled.div`
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

const StyledCloseSpan = styled.span`
  font-size: 2rem;
  color: #cdd1dd;
  font-weight: 600;

  @media only screen and (min-width: 280px) and (max-width: 767px) {
    padding: 0 0.5rem;
  }
`;

const StyledSecondLayer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;

  @media only screen and (min-width: 280px) and (max-width: 767px) {
    display: flex;
    flex-direction: column;
  }
`;

const StyledLayerOne = styled.div`
  background-color: #f8f8f9;
  display: grid;
  grid-template-rows: 1fr 1fr;
  border-bottom-left-radius: 10px;

  @media only screen and (min-width: 280px) and (max-width: 767px) {
    background-color: #f8f8f9;
    display: flex;
    flex-direction: column;
    border-bottom-left-radius: 10px;
  }
`;

const StyledLayerTwo = styled.div`
  padding: 1rem 1.2rem;
  background-color: #ffffff;
  height: 600px;
  overflow: scroll;
  border-bottom-right-radius: 10px;

  @media only screen and (min-width: 280px) and (max-width: 767px) {
    padding: 1rem 1.2rem;
    background-color: #ffffff;
    height: 200px;
    overflow: scroll;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
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

const StyledInput = styled.input.attrs(props => ({
  type: props.type,
  placeholder: props.placeholder,
}))`
  position: fixed;
  height: 2.5rem;
  width: 60%;
  color: #a5aac0;
  border: 1px solid #e9e9ec;
  border-radius: 3px;
  ::placeholder {
    color: #a5aac0;
    padding-left: 0.5rem;
  }
  @media only screen and (min-width: 280px) and (max-width: 767px) {
    width: 85%;
  }
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
const StyledCheckboxWrapper = styled.div``;

const StyledCheckboxInput = styled.input.attrs(props => ({
  type: props.type,
  id: props.id,
  name: props.name,
}))`
  -webkit-appearance: button;
  margin-right: 1.5rem;
  display: none;
`;

const StlyedCheckMark = styled.span`
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid #095df6;
  display: inline-block;
  border-radius: 5px;
  margin-right: 1rem;
  background: #095df6
    url("https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/White_check.svg/1200px-White_check.svg.png")
    center/1250% no-repeat;
  transition: background-size 0.2s cubic-bezier(0.7, 0, 0.18, 1.24);
`;

const StyledLabel = styled.label.attrs(props => ({
  htmlFor: props.htmlFor,
}))`
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-top: 1rem;

  ${StyledCheckboxInput}:checked + ${StlyedCheckMark} {
    background-size: 60%;
    transition: background-size 0.25s cubic-bezier(0.7, 0, 0.18, 1.24);
  }
`;

const StyledItemSpan = styled.span`
  font-size: 1rem;
  font-weight: 400;
`;

export default Average;
