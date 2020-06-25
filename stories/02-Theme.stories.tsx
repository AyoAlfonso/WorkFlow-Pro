import React from "react";
import styled from "styled-components";
import { baseTheme } from "../app/javascript/themes/base";
import { ContainerDiv, RowDiv, CenteredColumnDiv, Divider } from "./shared";
import Text from "../app/javascript/components/shared/Text";
import Heading from "../app/javascript/components/shared/Heading";

export default { title: "Theme" };

const ColorBox = styled.div`
  background-color: ${props => props.color};
  height: 60px;
  width: 60px;
  border-radius: 10px;
  margin: 0px 20px 10px 20px;
  border: ${props => (props.border ? "1px solid black" : "")};
`;

export const Colors = () => (
  <ContainerDiv pl={4}>
    <h1>Primary</h1>
    <h3>Blues</h3>
    <RowDiv>
      {Object.entries(baseTheme.colors).map((color, index) => {
        if (index < 6) {
          return (
            <CenteredColumnDiv>
              <ColorBox color={color[1]}></ColorBox>
              <div>{color[0]}</div>
            </CenteredColumnDiv>
          );
        }
      })}
    </RowDiv>
    <h3>Mid Neutrals</h3>
    <RowDiv>
      {Object.entries(baseTheme.colors).map((color, index) => {
        if (index >= 6 && index < 14) {
          return (
            <CenteredColumnDiv>
              <ColorBox color={color[1]}></ColorBox>
              <div>{color[0]}</div>
            </CenteredColumnDiv>
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
            <CenteredColumnDiv>
              <ColorBox color={color[1]}></ColorBox>
              <div>{color[0]}</div>
            </CenteredColumnDiv>
          );
        }
      })}
    </RowDiv>
    <h3>Faded</h3>
    <RowDiv>
      {Object.entries(baseTheme.colors).map((color, index) => {
        if (index >= 20 && index < 26) {
          return (
            <CenteredColumnDiv>
              <ColorBox color={color[1]}></ColorBox>
              <div>{color[0]}</div>
            </CenteredColumnDiv>
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
              <CenteredColumnDiv>
                <ColorBox color={color[1]} border></ColorBox>
                <div>{color[0]}</div>
              </CenteredColumnDiv>
            );
          } else {
            return (
              <CenteredColumnDiv>
                <ColorBox color={color[1]}></ColorBox>
                <div>{color[0]}</div>
              </CenteredColumnDiv>
            );
          }
        }
      })}
    </RowDiv>
  </ContainerDiv>
);

export const Fonts = () => (
  <ContainerDiv pl={4}>
    <h1>Heading Font: Exo</h1>
    <Heading type={"h1"} color={"primary100"}>
      The quick brown fox jumps over the lazy dog
    </Heading>
    <Divider />
    <h1>Body Text Font: Lato</h1>
    <Text fontSize={5} color={"text"}>
      The quick brown fox jumps over the lazy dog
    </Text>
  </ContainerDiv>
);
