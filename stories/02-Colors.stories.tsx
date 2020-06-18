import React from "react";
import styled from "styled-components";
import { baseTheme } from "../app/javascript/themes/base";

export default { title: "Theme" };

const ColorBox = styled.div`
  background-color: ${(props) => props.color};
  height: 60px;
  width: 60px;
  border-radius: 10px;
  margin: 0px 20px 10px 20px;
  border: ${(props) => (props.border ? "1px solid black" : "")};
`;

const ContainerDiv = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0px 25px 0px 25px;
`;

const RowDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  margin: 10px 0 10px 0;
`;

const StyledDiv = styled.div`
  height: 100px;
  width: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: lightgrey;
`;

export const Colors = () => (
  <ContainerDiv>
    <h1>Primary</h1>
    <h3>Blues</h3>
    <RowDiv>
      {Object.entries(baseTheme.colors).map((color, index) => {
        if (index < 6) {
          return (
            <StyledDiv>
              <ColorBox color={color[1]}></ColorBox>
              <div>{color[0]}</div>
            </StyledDiv>
          );
        }
      })}
    </RowDiv>
    <h3>Mid Neutrals</h3>
    <RowDiv>
      {Object.entries(baseTheme.colors).map((color, index) => {
        if (index >= 6 && index < 14) {
          return (
            <StyledDiv>
              <ColorBox color={color[1]}></ColorBox>
              <div>{color[0]}</div>
            </StyledDiv>
          );
        }
      })}
    </RowDiv>
    <Divider />
    <h1>Secondary</h1>
    <h3>Bright</h3>
    <RowDiv>
      {Object.entries(baseTheme.colors).map((color, index) => {
        if (index >= 14 && index < 20) {
          return (
            <StyledDiv>
              <ColorBox color={color[1]}></ColorBox>
              <div>{color[0]}</div>
            </StyledDiv>
          );
        }
      })}
    </RowDiv>
    <h3>Faded</h3>
    <RowDiv>
      {Object.entries(baseTheme.colors).map((color, index) => {
        if (index >= 20 && index < 26) {
          return (
            <StyledDiv>
              <ColorBox color={color[1]}></ColorBox>
              <div>{color[0]}</div>
            </StyledDiv>
          );
        }
      })}
    </RowDiv>
    <Divider />
    <h1>Utility</h1>
    <RowDiv>
      {Object.entries(baseTheme.colors).map((color, index) => {
        if (index >= 26) {
          if (color[0] === "white") {
            return (
              <StyledDiv>
                <ColorBox color={color[1]} border></ColorBox>
                <div>{color[0]}</div>
              </StyledDiv>
            );
          } else {
            return (
              <StyledDiv>
                <ColorBox color={color[1]}></ColorBox>
                <div>{color[0]}</div>
              </StyledDiv>
            );
          }
        }
      })}
    </RowDiv>
  </ContainerDiv>
);
