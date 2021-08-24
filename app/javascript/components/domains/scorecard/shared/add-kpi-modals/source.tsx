import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { Icon } from "~/components/shared/icon";
import { KPIModalHeader } from "./header";
import {
  UserKPIList,
  StyledSecondLayer,
  StyledItemSpan,
  StlyedCheckMark,
  StyledLabel,
  StyledCheckboxInput,
  StyledInput,
} from "./styled-components";

interface ISourceProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  KPIs: any[];
  kpiModalType: string;
}

export const Source = observer(
  ({ KPIs, setModalOpen, kpiModalType }: ISourceProps): JSX.Element => {
    const [selectedKPIs, setSelectedKPIs] = useState([]);
    const [filteredKPIs, setfilteredKPIs] = useState(KPIs);
    //Move this to its own folder in utils TODO:
    const groupBy = (objectArray, property) => {
      return objectArray.reduce(function(acc, obj) {
        let key = obj[property];
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
      <StyledSourceModal>
        <KPIModalHeader
          setModalOpen={setModalOpen}
          selectedKPIs={selectedKPIs}
          kpiModalType={kpiModalType}
          removeTagInput={removeTagInput}
        />
        <StyledSecondLayer>
          <StyledLayerOne>
            <StyledLogoSection>
              <LynchpynLogoContainer>
                <img src={"/assets/LynchPyn-Logo-Blue_300x300"} width="30"></img>
              </LynchpynLogoContainer>
              <StyledLogoText>LynchPyn</StyledLogoText>
            </StyledLogoSection>

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
      </StyledSourceModal>
    );
  },
);
const StyledSourceModal = styled.div`
  width: 640px;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #ccc;
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

// const StyledSource = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 2fr;
//   border-bottom: 1px solid #ccc;

//   @media only screen and (min-width: 280px) and (max-width: 767px) {
//     width: 100%;
//     display: flex;
//     align-items: center;
//   }
// `;

// const StyledHeader = styled.div`
//   background-color: #f8f8f9;
//   padding: 0rem 1rem;
//   border-top-left-radius: 10px;
// `;

// const StyledSelectionBox = styled.div`
//   background-color: #ffffff;
//   display: grid;
//   grid-template-columns: 11fr 1fr;
//   height: 100%;
//   align-items: center;
//   padding: 0rem 1.2rem;
//   border-top-right-radius: 10px;

//   @media only screen and (min-width: 280px) and (max-width: 767px) {
//     padding: 0.7em 0.3rem;
//     width: 100%;
//   }
// `;

// const StyledSubHeader = styled.h3`
//   color: #000;
// `;
// const StyledOperationBox = styled.div`
//   display: flex;
//   gap: 0.5rem;
//   height: 100%;
//   align-items: center;
// `;

// const StyledOperationClose = styled.span`
//   font-size: 1rem;
//   color: #cdd1dd;
//   font-weight: 600;
//   margin-left: 0.2rem;
//   display: flex;
//   height: 1.5rem;
//   align-items: center;
// `;

// const StyledSelectedNumber = styled.span`
//   background: #1065f6;
//   color: #ffffff;
//   padding: 0.2rem 0.4rem;
//   border-radius: 5px;
// `;

const StyledLayerOne = styled.div`
  background-color: #f8f8f9;
  display: grid;
  grid-template-rows: 1fr 1fr;
  border-bottom-left-radius: 10px;
  padding: 1rem 1rem;

  @media only screen and (min-width: 280px) and (max-width: 767px) {
    background-color: #f8f8f9;
    display: grid;
    grid-template-columns: 2fr 1fr;
    height: 100%;
    border-bottom-left-radius: 10px;
    align-items: center;
  }
`;

const StyledLayerTwo = styled.div`
  padding: 1rem 1.2rem;
  background-color: #ffffff;
  height: 400px;
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

const StyledLogoSection = styled.div`
  display: flex;
  gap: 1rem;
  @media only screen and (min-width: 280px) and (max-width: 767px) {
    display: grid;
    grid-template-columns: 1fr 2fr;
    height: 100%;
    gap: 1rem;
    align-items: center;
  }
`;

export const StyledCheckboxWrapper = styled.div`
  margin-left: 5%;
`;

const StyledLogo = styled.img.attrs(props => ({
  alt: props.alt,
}))``;

const LynchpynLogoContainer = styled.div``;

const StyledLogoText = styled.div`
  margin: 5px;
  @media only screen and (min-width: 280px) and (max-width: 767px) {
    display: flex;
    overflow-x: scroll;
    width: 100%;
    margin: auto;
  }
`;

const StyledNextButton = styled.div`
  align-self: flex-end;

  @media only screen and (min-width: 280px) and (max-width: 767px) {
    justify-self: flex-end;
  }
`;

const StyledNext = styled.button`
  border: none;
  background-color: #075df6;
  color: #ffffff;
  padding: 0.4rem 1rem;
  border-radius: 5px;
`;

const StyledCheckTitle = styled.p`
  font-size: 0.9rem;
  color: #a5a9c0;
  font-weight: 400;
  margin: 4em 0rem 2em;
  text-transform: uppercase;
`;

const StyledLayerDiv = styled.div`
  color: #000;
`;

export default Source;
