import React, { useEffect } from "react";
import styled from "styled-components";
import { color } from "styled-system";
import { baseTheme } from "../../../../themes";
import { Icon } from "../../../shared/icon";
import moment from "moment";
import { observer } from "mobx-react";
import { DummyOwnedBySection } from "../shared/dummy-owned-by-section";

interface IAnnualInitiativeCardMinimizedProps {
}

export const DummyAnnualInitiativeCardMinimized = observer(
  ({}: IAnnualInitiativeCardMinimizedProps): JSX.Element => {
    const {
      warningRed,
      cautionYellow,
      finePine,
      grey40,
      grey100,
      white,
      primary100,
    } = baseTheme.colors;
    const statusBadge = {
      description: "",
      colors: {
        backgroundColor: "",
        color: "",
      },
    };

    return (
      <div>
        <RowContainer mt={0} mb={0}>
          <DummyOwnedBySection
            color={"successGreen"}
            firstname={"first"}
            lastname={"last"}
            disabled={true}
            size={16}
            nameWidth={"76px"}
            fontSize={"12px"}
            marginLeft={"16px"}
            marginRight={"0px"}
            marginTop={"auto"}
            marginBottom={"auto"}
          />
          <BadgeContainer>
            <StatusBadge
              color={statusBadge.colors.color}
              backgroundColor={statusBadge.colors.backgroundColor}
            >
              {" "}
              {statusBadge.description}{" "}
            </StatusBadge>
          </BadgeContainer>
        </RowContainer>
        {(
          <>
          </>
        )}

        <Container>
          <MaximizeIconContainer>
            <ShowInitiativeBar>
              {" "}
              {"Hide"} Initiatives{" "}
            </ShowInitiativeBar>
            <StyledIcon
              icon={"Chevron-Up"}
              size={"12px"}
              iconColor={primary100}
              style={{ padding: "0px 5px" }}
            />
          </MaximizeIconContainer>
        </Container>
      </div>
    );
  },
);

type RowContainerProps = {
  mb?: number;
  mt?: number;
};

const RowContainer = styled.div<RowContainerProps>`
  display: flex;
  margin-top: ${props => `${props.mt}%` || "auto"};
  margin-bottom: ${props => `${props.mb}%` || "auto"};
`;

const Container = styled.div`
  ${color}
  background-color: ${props => props.theme.colors.backgroundGrey};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: auto;
  height: 32px;
  cursor: pointer;
`;

type QuarterlyGoalIndicatorType = {
  backgroundColor?: string;
};

const QuarterlyGoalIndicator = styled.div<QuarterlyGoalIndicatorType>`
  height: 16px;
  width: 16px;
  background-color: ${props => props.backgroundColor || props.theme.colors.grey80};
  margin-right: 6px;
  margin-top: auto;
  margin-bottom: auto;
  border-radius: 3px;
`;

const MaximizeIconContainer = styled.div`
  border-radius: 50px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 5% auto;

  &: hover {
    cursor: pointer;
  }
`;

const ShowInitiativeBar = styled.div`
  margin: 15%;
  color: ${props => props.theme.colors.primary100};
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
`;
//TODOIT: add blue color above to constants
const StatusSquareContainer = styled.div`
  position: relative;
  display: flex;
  margin: 2px 0px 0px;
`;

const InitiativeCountContainer = styled.div`
  display: flex;
  width: 100%;
  font-size: small;
`;

type MilestoneCountContainerType = {
  margin: string;
  color: string;
};

const MilestoneCountContainer = styled.div<MilestoneCountContainerType>`
  margin: 0 ${props => props.margin} 0px;
  color: ${props => props.color};
  display: inline-block;
  font-weight: bolder;
  transform: translateX(-50%);
`;
type GradientContainerType = {
  gradient?: string;
};

const GradientContainer = styled.div<GradientContainerType>`
  height: 2px;
  width: 100%;
  background: linear-gradient(to right ${props => props.gradient});
`;

const StyledIcon = styled(Icon)`
  transition: .8s
  -moz-animation-delay: 3.5s;
   -webkit-animation-delay: 3.5s;
   -o-animation-delay: 3.5s;
    animation-delay: 3.5s;
`;

type StatusBadgeType = {
  color: string;
  backgroundColor: string;
};

const StatusBadge = styled.div<StatusBadgeType>`
  font-size: 12px;
  font-weight: 900;
  background-color: ${props => props.backgroundColor};
  color: ${props => props.color};
  padding: 2px;
  text-align: center;
  border-radius: 2px;
  white-space: nowrap;
`;

const BadgeContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 16px;
  align-items: center;
`;
