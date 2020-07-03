import * as React from "react";
import styled from "styled-components";
import { color, layout, space } from "styled-system";
import { baseTheme } from "../../app/javascript/themes/base";

export const ContainerDiv = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 40px;
  ${space}
  ${layout}
`;

export const RowDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  ${space}
  ${layout}
`;

export const CenteredColumnDiv = styled.div`
  height: 100px;
  width: 110px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  align-content: space-between;
  ${space}
  ${layout}
`;

export const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: lightgrey;
`;

export const ColorText = styled.span`
  ${color}
  color: ${props => props.color};
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

interface IPropListProps {
  name: string;
  type: string;
  required: boolean;
  description: string;
}
interface IPropsListProps {
  propsList?: Array<IPropListProps>;
  styledSystemProps?: Array<string>;
}

export const PropsList = ({ propsList, styledSystemProps }: IPropsListProps) => {
  // propsList is an array of objects with keys:
  // { name: <string>, type: <string>, required: <boolean>, description: <string>}

  // styledSystemProps is an array of strings of the injectable props from styled-system (ie. "color", "space", "layout" etc)
  return (
    <PropsContainer>
      <h3>Props</h3>
      {propsList
        ? propsList.map((prop, index) => (
            <RowDiv key={index} m={3}>
              <ColorText color={baseTheme.colors.primary100}>{`${prop.name}`}&nbsp;</ColorText>
              <ColorText color={baseTheme.colors.poppySunrise}>{`<${prop.type}>`}&nbsp;</ColorText>
              <ColorText color={baseTheme.colors.finePine}>
                {`(${prop.required ? "required" : "optional"})`}&nbsp;
              </ColorText>
              <ColorText color="darkgrey">&nbsp;:&nbsp;{`${prop.description}`}</ColorText>
            </RowDiv>
          ))
        : null}
      <br />
      {styledSystemProps ? (
        <>
          <RowDiv mb={1}>
            <ColorText color="darkgrey">
              All of the injected props from the following styled-system props types:
            </ColorText>
          </RowDiv>
          <RowDiv mb={3}>
            {styledSystemProps.map((prop, index) => (
              <ColorText color={baseTheme.colors.bali} key={index}>
                {prop}&nbsp; {index !== styledSystemProps.length - 1 && `|`} &nbsp;
              </ColorText>
            ))}
          </RowDiv>
        </>
      ) : null}
    </PropsContainer>
  );
};

export const CodeBlockDiv = styled.div`
  ${layout}
  ${space}
  width: 60%;
  height: 100%;
`;
