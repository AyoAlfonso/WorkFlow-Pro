import React, { useEffect } from "react";
import styled from "styled-components";
import { color } from "styled-system";
import { baseTheme } from "../../../../themes";
import { Icon } from "../../../shared/icon";
import moment from "moment";
import { observer } from "mobx-react";
import { OwnedBySection } from "../shared/owned-by-section";
import { useMst } from "~/setup/root";
import { Loading } from "~/components/shared";

interface IAnnualInitiativeCardMinimizedProps {
  annualInitiative: any;
  setShowMinimizedCard: React.Dispatch<React.SetStateAction<boolean>>;
  disableOpen?: boolean;
  showMinimizedCard?: boolean;
}

export const AnnualInitiativeCardMinimized = observer(
  ({
    annualInitiative,
    disableOpen,
    setShowMinimizedCard,
    showMinimizedCard,
  }: IAnnualInitiativeCardMinimizedProps): JSX.Element => {
    const { companyStore, sessionStore } = useMst();
    const { yearForCreatingAnnualInitiatives } = companyStore.company;
    const {
      warningRed,
      cautionYellow,
      finePine,
      grey40,
      grey100,
      white,
      primary100,
    } = baseTheme.colors;
    const milestoneCounts = [];
    const statusBadge = {
      description: "",
      colors: {
        backgroundColor: "",
        color: "",
      },
    };

    if (annualInitiative == null) {
      return <Loading />;
    }

    const today = moment();
    const year = companyStore.company.yearForCreatingAnnualInitiatives;
    const month = 1 + moment(companyStore.company.fiscalYearStart).month();
    const day = moment(companyStore.company.fiscalYearStart).date();

    const nextFiscalYearStart = moment(`${year + 1}/${month}/${day}`, "YYYY-MM-DD");

    const weeksToNextFiscalYear = nextFiscalYearStart.diff(today, "week");

    const singleYearString =
      weeksToNextFiscalYear < 4
        ? `FY${(companyStore.company.yearForCreatingAnnualInitiatives + 1).toString().slice(-2)}`
        : `FY${companyStore.company.yearForCreatingAnnualInitiatives.toString().slice(-2)}`;

    const doubleYearString =
      weeksToNextFiscalYear < 4
        ? `FY${(companyStore.company.yearForCreatingAnnualInitiatives + 1).toString().slice(-2)}/${(
            companyStore.company.yearForCreatingAnnualInitiatives + 2
          )
            .toString()
            .slice(-2)}`
        : `FY${companyStore.company.yearForCreatingAnnualInitiatives.toString().slice(-2)}/${(
            companyStore.company.yearForCreatingAnnualInitiatives + 1
          )
            .toString()
            .slice(-2)}`;

    const upcomingYearString =
      month > 1 ? doubleYearString : month == 1 && day > 1 ? doubleYearString : singleYearString;

    if (annualInitiative.closedAt != null) {
      statusBadge.description = `Closed - FY${annualInitiative.fiscalYear %
        100}/${(annualInitiative.fiscalYear + 1) % 100}`;
      statusBadge.colors = { color: white, backgroundColor: grey100 };
    } else if (yearForCreatingAnnualInitiatives < annualInitiative.fiscalYear) {
      statusBadge.description = `Upcoming -${upcomingYearString}`;
      statusBadge.colors = { color: white, backgroundColor: primary100 };
    }
    const milestones = [
      {
        color: finePine,
        count: 0,
      },
      {
        color: cautionYellow,
        count: 0,
      },
      {
        color: warningRed,
        count: 0,
      },
      {
        color: grey40,
        count: 0,
      },
    ];

    const milestoneProgressCounter = goal => {
      let currentMilestone = goal.milestones.find((milestone: { weekOf: moment.MomentInput }) =>
        moment(milestone.weekOf).isSame(moment(), "week"),
      );
      if (!currentMilestone) {
        currentMilestone = goal.milestones[goal.milestones.length - 1];
      }

      if (currentMilestone && currentMilestone.status) {
        switch (currentMilestone.status) {
          case "completed":
            milestones[0].count++;
            break;
          case "in_progress":
            milestones[1].count++;
            break;
          case "incomplete":
            milestones[2].count++;
            break;
          case "unstarted":
            milestones[3].count++;
            break;
        }
      } else {
        milestones[3].count++;
      }
    };
    annualInitiative.quarterlyGoals.map(quarterlyGoal => {
      milestoneProgressCounter(quarterlyGoal);
      if (quarterlyGoal.subInitiatives) {
        quarterlyGoal.subInitiatives.map(milestoneProgressCounter);
      }
    });

    let gradient = "";
    const annualQtrGoalsLength =
      annualInitiative.quarterlyGoals.length +
      annualInitiative.quarterlyGoals.reduce(
        (acc: number, quarterlyGoal) =>
          acc + (quarterlyGoal.subInitiatives ? quarterlyGoal.subInitiatives.length : 0),
        0,
      );
    milestones.forEach((obj, index) => {
      let margin = 0;
      if (index > 0) {
        let lastPercentage = 0;
        let intialPercentage = 0;
        Array.from({ length: index + 1 }).map((_, i) => {
          lastPercentage += (milestones[i].count / annualQtrGoalsLength) * 100;
        });
        Array.from({ length: index }).map(
          (_, i) => (intialPercentage += (milestones[i].count / annualQtrGoalsLength) * 100),
        );
        gradient += `, ${obj.color} ${intialPercentage}% ${lastPercentage}` + `% `;
        margin = lastPercentage - intialPercentage;
      } else {
        gradient += `, ${obj.color} ${(obj.count / annualQtrGoalsLength) * 100}% `;
        margin = (obj.count / annualQtrGoalsLength) * 100;
      }
      if (obj.count > 0) {
        milestoneCounts.push(
          <MilestoneCountContainer color={obj.color} margin={`${Math.floor(margin) / 2}%`}>
            {obj.count}
          </MilestoneCountContainer>,
        );
      }
    });

    const renderStatusSquares = () => {
      gradient =
        milestoneCounts.length == 0
          ? `, ${finePine} 0% ,${cautionYellow} 0% 0% ,${warningRed} 0% 0% ,${grey40} 0% 100%`
          : gradient;
      return <GradientContainer gradient={gradient} />;
    };

    const renderCounts = () => {
      if (milestoneCounts.length) return milestoneCounts;
      return (
        <MilestoneCountContainer color={grey40} margin={`auto`}>
          {" "}
          0{" "}
        </MilestoneCountContainer>
      );
    };

    return (
      <div
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <RowContainer mt={0} mb={0}>
          {(annualInitiative.ownedBy || sessionStore.profile) && (
            <OwnedBySection
              ownedBy={annualInitiative.ownedBy || sessionStore.profile}
              type={"annualInitiative"}
              disabled={true}
              size={16}
              nameWidth={"76px"}
              fontSize={"12px"}
              marginLeft={"16px"}
              marginRight={"0px"}
              marginTop={"auto"}
              marginBottom={"auto"}
            />
          )}
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
        {disableOpen || (
          <>
            <InitiativeCountContainer>{renderCounts()}</InitiativeCountContainer>

            <StatusSquareContainer>{renderStatusSquares()}</StatusSquareContainer>
          </>
        )}

        <Container
          onClick={e => {
            if (!disableOpen) {
              setShowMinimizedCard(!showMinimizedCard);
            }
          }}
        >
          {disableOpen ? (
            <StyledIcon
              icon={"Chevron-Down"}
              size={"12px"}
              iconColor={grey100}
              style={{ padding: "0px 5px" }}
            />
          ) : (
            <MaximizeIconContainer>
              <ShowInitiativeBar>
                {" "}
                {showMinimizedCard ? "Show" : "Hide"} Initiatives{" "}
              </ShowInitiativeBar>
              <StyledIcon
                icon={showMinimizedCard ? "Chevron-Down" : "Chevron-Up"}
                size={"12px"}
                iconColor={primary100} // TODOIT: ADD TO CONSTANT VARIABLES
                style={{ padding: "0px 5px" }}
              />
            </MaximizeIconContainer>
          )}
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
