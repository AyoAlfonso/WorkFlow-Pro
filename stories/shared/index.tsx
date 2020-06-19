import * as React from "react";
import styled from "styled-components";
import { baseTheme } from "../../app/javascript/themes/base";

export const ContainerDiv = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0px 25px 0px 25px;
`;

export const RowDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  margin: 10px 0 10px 0;
`;

export const CenteredColumnDiv = styled.div`
  height: 100px;
  width: 110px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  align-content: space-between;
`;

export const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: lightgrey;
`;

export const ColorText = styled.span`
  color: ${(props) => props.color};
`;

export const PropsContainer = styled.div`
  height: 100%;
  width: 55%;
  display: flex;
  flex-direction: column;
  padding: 0px 25px 0px 25px;
  border: 1px solid lightgrey;
  border-radius: 5px;
  margin-bottom: 15px;
`;

export const PropsList = ({ propsList }) => {
  return (
    <PropsContainer>
      <h3>Props</h3>
      {propsList.map((prop, index) => (
        <RowDiv key={index}>
          <ColorText color={baseTheme.colors.primary100}>
            {`${prop.name}`}&nbsp;
          </ColorText>
          <ColorText color={baseTheme.colors.poppySunrise}>
            {`<${prop.type}>`}&nbsp;
          </ColorText>
          <ColorText color="darkgrey">
            &nbsp;:&nbsp;{`${prop.description}`}
          </ColorText>
        </RowDiv>
      ))}
    </PropsContainer>
  );
};