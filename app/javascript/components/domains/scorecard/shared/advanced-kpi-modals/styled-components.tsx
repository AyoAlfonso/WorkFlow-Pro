import React, { useState, useEffect } from "react";
import styled from "styled-components";
// const lynchPynBadgePath = require("~/assets/images/white_check.svg.webp");
const whiteCheck = require("~/assets/images/white_check.png");

export const UserKPIList = styled.div`
  color: #000;
`;

export const StyledCheckboxWrapper = styled.div``;

export const StyledSecondLayer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;

  @media only screen and (min-width: 280px) and (max-width: 767px) {
    display: flex;
    flex-direction: column;
  }
`;

export const StyledLayerOne = styled.div`
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

export const StyledLayerTwo = styled.div`
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

export const StyledItemSpan = styled.span`
  font-size: 14px;
  font-weight: 400;
`;

type StlyedCheckMarkProps = {
  selected: boolean;
};

export const StlyedCheckMark = styled.span<StlyedCheckMarkProps>`
  width: 0.8rem;
  height: 0.8rem;
  border: 2px solid #095df6;
  border-radius: 5px;
  display: inline-block;
  margin-right: 1rem;
  background: ${props =>
    props.selected
      ? `#095df6
    url(${whiteCheck})
    center/1250% no-repeat`
      : "white"};
  transition: background-size 0.2s cubic-bezier(0.7, 0, 0.18, 1.24);
`;

export const StyledCheckboxInput = styled.input.attrs(props => ({
  type: props.type,
  id: props.id,
  name: props.name,
}))`
  -webkit-appearance: button;
  margin-right: 1.5rem;
  display: none;
`;

export const StyledLabel = styled.label.attrs(props => ({
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
export const StyledInput = styled.input.attrs(props => ({
  type: props.type,
  placeholder: props.placeholder,
}))`
  position: sticky;
  height: 2.5rem;
  width: 100%;
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
