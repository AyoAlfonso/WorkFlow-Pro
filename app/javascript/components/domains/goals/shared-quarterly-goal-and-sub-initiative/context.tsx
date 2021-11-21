import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { ContextTabs } from "../shared/context-tabs";

interface IContextProps {
  itemType: string;
  item: any;
  setShowInitiatives?: Dispatch<SetStateAction<boolean>>;
  setShowMilestones?: Dispatch<SetStateAction<boolean>>;
  activeInitiatives?: number;
}

export const Context = ({
  itemType,
  item,
  setShowInitiatives,
  setShowMilestones,
  activeInitiatives,
}: IContextProps): JSX.Element => {
  return (
    <Container>
      <ContextSectionContainer>
        <ContextTabs
          activeInitiatives={activeInitiatives}
          setShowInitiatives={setShowInitiatives}
          setShowMilestones={setShowMilestones}
          object={item}
          type={itemType}
        />
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
