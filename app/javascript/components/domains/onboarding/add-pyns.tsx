import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import moment from "moment";
import { baseTheme } from "~/themes/base";

import { IconButton, TextDiv } from "~/components/shared";
import { Pyn } from "./pyn";

interface IAddPyns {
  formData: any;
  goalData: any;
  setPynsDataState: (keys: Array<string>, value: any) => void;
}

export const AddPyns = ({ formData, goalData, setPynsDataState }: IAddPyns): JSX.Element => {
  const addPyn = () => {
    const newPynKey = R.pipe(
      R.keys,
      R.sort((a, b) => a - b),
      R.last,
      R.ifElse(R.isNil, () => 0, R.inc),
    )(formData);
    setPynsDataState([`${newPynKey}`, "description"], "");
  };

  interface IPyn {
    description: string;
    position: number;
  }

  const renderPyns = () => {
    return Object.entries(formData).map(([key, pyn]: [string, IPyn]) => {
      return <Pyn key={key} pynDataKey={key} pyn={pyn} onEditPyn={setPynsDataState} />;
    });
  };

  return (
    <Container>
      <TextDiv fontFamily={"Exo"} fontSize={"20px"} fontWeight={600}>
        Today
      </TextDiv>
      <TextDiv fontSize={"12px"} color={"greyInactive"} my={"16px"}>
        {moment().format("MMMM D")}
      </TextDiv>
      <IconButton
        iconName={"Plus"}
        iconSize={"20px"}
        iconColor={"greyInactive"}
        onClick={() => addPyn()}
        text={"Add a Pyn"}
        textColor={"greyInactive"}
        shadow
        height={36}
        width={"50%"}
        px={"8px"}
      />
      <PynsContainer>{renderPyns()}</PynsContainer>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const PynsContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  margin-right: 16px;
`;
