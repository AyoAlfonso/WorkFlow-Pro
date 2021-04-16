import * as React from "react";
import styled from "styled-components";
import { ContextTabs } from "../shared/context-tabs";

interface IContextProps {
  itemType: string;
  item: any;
}

export const Context = ({ itemType, item }: IContextProps): JSX.Element => {
  return (
    <Container>
      <ContextSectionContainer>
        <ContextTabs object={item} type={itemType} />
      </ContextSectionContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
`;

const ContextSectionContainer = styled.div`
  width: 100%;
`;
