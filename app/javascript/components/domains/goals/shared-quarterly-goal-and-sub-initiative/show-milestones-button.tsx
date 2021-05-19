import * as React from "react";
import styled from "styled-components";
import { SubHeaderText } from "~/components/shared";

interface IShowMilestonesButtonProps {
  setShowInactiveMilestones: React.Dispatch<React.SetStateAction<boolean>>;
  showInactiveMilestones: boolean;
}

export const ShowMilestonesButton = ({
  setShowInactiveMilestones,
  showInactiveMilestones,
}: IShowMilestonesButtonProps): JSX.Element => {
  return (
    <Container>
      <SubHeaderContainer>
        <SubHeaderText text={"Milestones"} noMargin={true} />
      </SubHeaderContainer>
      <ShowPastWeeksContainer>
        <FilterOptionsContainer>
          <FilterOptionContainer underline={!showInactiveMilestones}>
            <FilterOption
              onClick={() => setShowInactiveMilestones(false)}
              color={showInactiveMilestones ? "grey40" : "primary100"}
            >
              Open
            </FilterOption>
          </FilterOptionContainer>
          <FilterOptionContainer underline={showInactiveMilestones}>
            <FilterOption
              onClick={() => setShowInactiveMilestones(true)}
              color={showInactiveMilestones ? "primary100" : "grey40"}
            >
              All
            </FilterOption>
          </FilterOptionContainer>
        </FilterOptionsContainer>
      </ShowPastWeeksContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  position: relative;
`;

const SubHeaderContainer = styled.div`
  display: flex;
  position: absolute;
`;

const ShowPastWeeksContainer = styled.div`
  margin: auto;
`;

const FilterOptionsContainer = styled.div`
  display: flex;
  margin: auto;
`;

type FilterOptionType = {
  mr?: string;
};

const FilterOption = styled.p<FilterOptionType>`
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  margin-top: 4px;
  margin-bottom: 0;
`;

type FilterOptionContainerType = {
  underline: boolean;
};
const FilterOptionContainer = styled.div<FilterOptionContainerType>`
  border-bottom: ${props => props.underline && `4px solid ${props.theme.colors.primary100}`};
  padding-left: 4px;
  padding-right: 4px;
  margin-left: 4px;
  margin-right: 4px;
`;
