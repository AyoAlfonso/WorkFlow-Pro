import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";

export const Source = observer(
  (): JSX.Element => {
    return (
      <StyledSourceModal>
        <StyledSource>
          <StyledHeader>
            <StyledSubHeader>Source</StyledSubHeader>
          </StyledHeader>
          <StyledSelectionBox>
            <StyledOperationBox>
              <StyledOperation>
                Pyns Completed(Perc...
                <StyledOperationClose>x</StyledOperationClose>
              </StyledOperation>

              <StyledSelectedNumber>+3</StyledSelectedNumber>
            </StyledOperationBox>
            <StyledClose>
              <StyledCloseSpan>x</StyledCloseSpan>
            </StyledClose>
          </StyledSelectionBox>
        </StyledSource>

        <StyledSecondLayer>
          <StyledLayerOne>
            <StyledLogoSection>
              <StyledLogo alt="lync" />
              <StyledLogoText>LynchPyn</StyledLogoText>
            </StyledLogoSection>

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
      </StyledSourceModal>
    );
  },
);
const StyledSourceModal = styled.div`
  width: 60%;
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

const StyledSelectedNumber = styled.span`
  background: #1065f6;
  color: #ffffff;
  padding: 0.2rem 0.4rem;
  border-radius: 5px;
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
    gap: 1rem;
    height: 100%;
    align-items: center;
  }
`;

const StyledLogo = styled.img.attrs(props => ({
  alt: props.alt,
}))``;

const StyledLogoText = styled.div`
  @media only screen and (min-width: 280px) and (max-width: 767px) {
    display: flex;
    overflow-x: scroll;
    width: 100%;
    margin: 0 auto;
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

export default Source;
